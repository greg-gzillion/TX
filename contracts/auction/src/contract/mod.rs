use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
    to_json_binary, BankMsg, coins, Uint128,
};
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, AuctionResponse, BidResponse};
use crate::state::{Config, Auction, Bid, AUCTIONS, CONFIG, AUCTION_COUNT, BIDS, BID_COUNT};
// use cw_storage_plus::{Map, Item}; // not needed

// Storage keys

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let config = Config {
        admin: deps.api.addr_validate(&msg.admin)?,
        community_reserve_fund: deps.api.addr_validate(&msg.community_reserve_fund)?,
        token_denom: msg.token_denom,
    };
    
    CONFIG.save(deps.storage, &config)?;
    AUCTION_COUNT.save(deps.storage, &0u64)?;
    
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", config.admin))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreateAuction {
            starting_bid,
            duration,
            description,
            reserve_price,
            buy_it_now_price,
            seller_collateral,
        } => execute_create_auction(
            deps, env, info, 
            starting_bid, duration, description, 
            reserve_price, buy_it_now_price, seller_collateral
        ),
        ExecuteMsg::PlaceBid { auction_id, amount } => execute_place_bid(deps, env, info, auction_id, amount),
        ExecuteMsg::BuyItNow { auction_id } => execute_buy_it_now(deps, env, info, auction_id),
        ExecuteMsg::CloseAuction { auction_id } => execute_close_auction(deps, env, info, auction_id),
        ExecuteMsg::ClaimWinnings { auction_id } => execute_claim_winnings(deps, env, info, auction_id),
    }
}

fn execute_create_auction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    starting_bid: Uint128,
    duration: u64,
    description: String,
    reserve_price: Option<Uint128>,
    buy_it_now_price: Option<Uint128>,
    seller_collateral: Uint128,
) -> Result<Response, ContractError> {
    // Validate starting bid
    if starting_bid.is_zero() {
        return Err(ContractError::InvalidAmount {});
    }
    
    // Validate reserve price if provided
    if let Some(reserve) = reserve_price {
        if reserve < starting_bid {
            return Err(ContractError::InvalidReservePrice {});
        }
    }
    
    // Validate buy it now price if provided
    if let Some(bin) = buy_it_now_price {
        if bin < starting_bid {
            return Err(ContractError::InvalidBuyItNowPrice {});
        }
    }
    
    // Check collateral
    let config = CONFIG.load(deps.storage)?;
    
    // Verify seller collateral is sent
    let collateral_sent = info.funds.iter().find(|c| c.denom == config.token_denom);
    
    match collateral_sent {
        Some(coin) if coin.amount < seller_collateral.into() => {
            return Err(ContractError::InsufficientCollateral {});
        }
        None if !seller_collateral.is_zero() => {
            return Err(ContractError::NoCollateralSent {});
        }
        _ => {}
    }
    
    // Get next auction ID
    let mut auction_count = AUCTION_COUNT.may_load(deps.storage)?.unwrap_or(0);
    auction_count checked_add( 1;
    let auction_id = auction_count;
    
    // Create auction
    let auction = Auction {
        id: auction_id,
        creator: info.sender.clone(),
        starting_bid,
        reserve_price,
        current_bid: Uint128::zero(),
        highest_bidder: None,
        buy_it_now_price,
        description,
        created_at: env.block.time.seconds(),
        expires_at: env.block.time.seconds() + duration,
        status: "active".to_string(),
        seller_collateral,
        buyer_collateral: None,
    };
    
    // Save auction
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    AUCTION_COUNT.save(deps.storage, &auction_count)?;
    
    // Initialize auction state
    
    Ok(Response::new()
        .add_attribute("method", "create_auction")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("creator", info.sender)
        .add_attribute("starting_bid", starting_bid)
        .add_attribute("has_buy_it_now", buy_it_now_price.is_some().to_string()))
}

fn execute_buy_it_now(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    // Load auction
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Check if auction is active
    if auction.status != "active" {
        return Err(ContractError::AuctionNotActive {});
    }
    
    // Check if buy it now is available
    let bin_price = match auction.buy_it_now_price {
        Some(price) => price,
        None => return Err(ContractError::BuyItNowNotAvailable {}),
    };
    
    // Check funds
    let config = CONFIG.load(deps.storage)?;
    let sent_funds = info.funds.iter().find(|c| c.denom == config.token_denom);
    
    match sent_funds {
        Some(coin) if coin.amount < bin_price.into() => {
            return Err(ContractError::InsufficientFunds {});
        }
        None => {
            return Err(ContractError::NoFunds {});
        }
        _ => {}
    }
    
    // Calculate buyer collateral (10% of bid)
    let buyer_collateral = bin_price * Uint128::from(10u128) / Uint128::from(100u128);
    
    // Update auction with buyer info
    auction.current_bid = bin_price;
    auction.highest_bidder = Some(info.sender.clone());
    auction.buyer_collateral = Some(buyer_collateral);
    auction.status = "sold".to_string(); // Buy it now ends auction immediately
    
    // Create bid record
    let bid = Bid {
        bidder: info.sender.clone(),
        amount: bin_price,
        timestamp: env.block.time.seconds(),
    };
	// Store bid in BIDS Map (fixes memory error)
    let bid_key = (auction_id, &bid.bidder);
    BIDS.save(deps.storage, bid_key, &bid)?;
    
    // Update bid count
    let count = BID_COUNT.may_load(deps.storage, auction_id)?.unwrap_or(0);
    BID_COUNT.save(deps.storage, auction_id, &(count + 1))?;    
    // Save auction
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    // Store winner
    
    Ok(Response::new()
        .add_attribute("method", "buy_it_now")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("buyer", info.sender)
        .add_attribute("amount", bin_price)
        .add_attribute("collateral", buyer_collateral))
}

fn execute_place_bid(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
    amount: String,
) -> Result<Response, ContractError> {
    // Load auction
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Check if auction is active
    if auction.status != "active" {
        return Err(ContractError::AuctionNotActive {});
    }
    
    // Check if buy it now exists and would be better
    if let Some(bin_price) = auction.buy_it_now_price {
        let bid_amount: u128 = amount.parse().map_err(|_| ContractError::InvalidAmount {})?;
        let bid_amount_u128 = Uint128::from(bid_amount);
        if bid_amount_u128 >= bin_price {
            return Err(ContractError::UseBuyItNow {});
        }
    }
    
    // Check if auction has expired
    if env.block.time.seconds() > auction.expires_at {
        auction.status = "expired".to_string();
        AUCTIONS.save(deps.storage, auction_id, &auction)?;
        return Err(ContractError::AuctionExpired {});
    }
    
    // Parse bid amount
    let bid_amount: u128 = amount.parse().map_err(|_| ContractError::InvalidAmount {})?;
    let bid_amount_u128 = Uint128::from(bid_amount);
    
    // Validate bid amount
    if bid_amount_u128 < auction.starting_bid {
        return Err(ContractError::BidTooLow {});
    }
    
    if bid_amount_u128 <= auction.current_bid {
        return Err(ContractError::BidTooLow {});
    }
    
    // Check reserve price if set
    if let Some(reserve) = auction.reserve_price {
        if bid_amount_u128 < reserve {
            return Err(ContractError::ReserveNotMet {});
        }
    }
    
    // Check funds (bid + 10% collateral)
    let bid_plus_collateral = bid_amount_u128 * Uint128::from(110u128) / Uint128::from(100u128);
    let config = CONFIG.load(deps.storage)?;
    let sent_funds = info.funds.iter().find(|c| c.denom == config.token_denom);
    
    match sent_funds {
        Some(coin) if coin.amount < bid_plus_collateral.into() => {
            return Err(ContractError::InsufficientFunds {});
        }
        None => {
            return Err(ContractError::NoFunds {});
        }
        _ => {}
    }
    
    // Calculate buyer collateral (10%)
    let buyer_collateral = bid_amount_u128 * Uint128::from(10u128) / Uint128::from(100u128);
    
    // Create bid record
    let bid = Bid {
        bidder: info.sender.clone(),
        amount: bid_amount_u128,
        timestamp: env.block.time.seconds(),
    };
    
    // Store bid
    let _bid_key = (auction_id, info.sender.clone());
    
    // Update auction
    // Store bid in BIDS Map (fixes memory error)
    let bid_key = (auction_id, &bid.bidder);
    BIDS.save(deps.storage, bid_key, &bid)?;
    
    // Update bid count
    let count = BID_COUNT.may_load(deps.storage, auction_id)?.unwrap_or(0);
    BID_COUNT.save(deps.storage, auction_id, &(count + 1))?;	
    auction.current_bid = bid_amount_u128;
    auction.highest_bidder = Some(info.sender.clone());
    auction.buyer_collateral = Some(buyer_collateral);
    
    // Save auction
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    // Update highest bid
    
    Ok(Response::new()
        .add_attribute("method", "place_bid")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("bidder", info.sender)
        .add_attribute("amount", bid_amount.to_string())
        .add_attribute("collateral", buyer_collateral.to_string()))
}

fn execute_close_auction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    // Load auction
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Check if auction exists
    if auction.id == 0 {
        return Err(ContractError::AuctionNotFound {});
    }
    
    // Check if auction is already closed
    if auction.status != "active" && auction.status != "expired" {
        return Err(ContractError::AuctionAlreadyClosed {});
    }
    
    // Check authorization (admin or creator)
    let config = CONFIG.load(deps.storage)?;
    if info.sender != config.admin && info.sender != auction.creator {
        return Err(ContractError::Unauthorized {});
    }
    
    // Determine if auction expired or was closed manually
    let is_expired = env.block.time.seconds() > auction.expires_at;
    let bid_count = BID_COUNT.may_load(deps.storage, auction_id)?.unwrap_or(0);
    if !is_expired && bid_count == 0 {
        // No bids and not expired - just cancel, return seller collateral
        auction.status = "cancelled".to_string();        
        // Return seller collateral
        if !auction.seller_collateral.is_zero() {
            let return_collateral = BankMsg::Send {
                to_address: auction.creator.to_string(),
                amount: coins(auction.seller_collateral.u128(), config.token_denom.clone()),
            };
            
            AUCTIONS.save(deps.storage, auction_id, &auction)?;
            
            return Ok(Response::new()
                .add_message(return_collateral)
                .add_attribute("method", "cancel_auction")
                .add_attribute("auction_id", auction_id.to_string())
                .add_attribute("collateral_returned", auction.seller_collateral.to_string()));
        }
    } else {
        // Auction has bids or expired - determine winner
        auction.status = "closed".to_string();
        
        if let Some(_highest_bidder) = &auction.highest_bidder {
            // Store winner
        }
    }
    
    // Save auction
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("method", "close_auction")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("status", auction.status))
}

fn execute_claim_winnings(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    // Load auction
    let auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Check if auction exists
    if auction.id == 0 {
        return Err(ContractError::AuctionNotFound {});
    }
    
    // Check if auction is closed
    if auction.status != "closed" && auction.status != "sold" {
        return Err(ContractError::AuctionNotClosed {});
    }
    
    // Get winner from auction.highest_bidder
    let winner = auction.highest_bidder.clone();
    
    // Check if caller is winner
    match winner {
        Some(w) if w == info.sender => {
            // Winner claiming
            let config = CONFIG.load(deps.storage)?;
            
            // Calculate fee (1.1%)
            let total = auction.current_bid.u128();
            let fee = (total * 11) / 1000; // 1.1%
            let payout = total - fee;
            
            // Transfer to seller
            let send_msg = BankMsg::Send {
                to_address: auction.creator.to_string(),
                amount: coins(payout, config.token_denom.clone()),
            };
            
            // Transfer fee to community reserve fund
            let fee_msg = BankMsg::Send {
                to_address: config.community_reserve_fund.to_string(),
                amount: coins(fee, config.token_denom.clone()),
            };
            
            // Return seller collateral
            let return_seller_collateral = if !auction.seller_collateral.is_zero() {
                Some(BankMsg::Send {
                    to_address: auction.creator.to_string(),
                    amount: coins(auction.seller_collateral.u128(), config.token_denom.clone()),
                })
            } else {
                None
            };
            
            // Return buyer collateral
            let return_buyer_collateral = if let Some(collateral) = auction.buyer_collateral {
                if !collateral.is_zero() {
                    Some(BankMsg::Send {
                        to_address: info.sender.to_string(),
                        amount: coins(collateral.u128(), config.token_denom),
                    })
                } else {
                    None
                }
            } else {
                None
            };
            
            let mut response = Response::new()
                .add_message(send_msg)
                .add_message(fee_msg)
                .add_attribute("method", "claim_winnings")
                .add_attribute("auction_id", auction_id.to_string())
                .add_attribute("winner", info.sender)
                .add_attribute("payout", payout.to_string())
                .add_attribute("fee", fee.to_string());
            
            if let Some(msg) = return_seller_collateral {
                response = response.add_message(msg);
            }
            
            if let Some(msg) = return_buyer_collateral {
                response = response.add_message(msg);
            }
            
            Ok(response)
        }
        Some(_) => Err(ContractError::Unauthorized {}),
        None => Err(ContractError::NoWinner {}),
    }
}

#[entry_point]
pub fn query(
    deps: Deps,
    _env: Env,
    msg: QueryMsg,
) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetAuction { auction_id } => {
            let auction = AUCTIONS.load(deps.storage, auction_id)?;
            
            let response = AuctionResponse {
    id: auction.id,
    seller: auction.creator,                    // Remove .to_string()
    starting_price: auction.starting_bid,
    reserve_price: auction.reserve_price.unwrap_or(Uint128::zero()),
    current_bid: Some(auction.current_bid),     // Wrap in Some()
    current_bidder: auction.highest_bidder,
    buy_it_now_price: auction.buy_it_now_price,
    has_buy_it_now: auction.buy_it_now_price.is_some(),
    end_time: auction.expires_at,
    status: auction.status.clone(),
    created_at: auction.created_at,
    seller_collateral: auction.seller_collateral,
    buyer_collateral: auction.buyer_collateral,
            };
            to_json_binary(&response)
        }
        QueryMsg::GetHighBid { auction_id } => {
            let auction = AUCTIONS.load(deps.storage, auction_id)?;
            
            let response = BidResponse {
                bidder: auction.highest_bidder,
                amount: auction.current_bid,
            };
            to_json_binary(&response)
        }
    }
}
