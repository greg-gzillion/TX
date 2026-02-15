use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128,
    to_json_binary, Addr, BankMsg, coins,
};
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, AuctionResponse, BidResponse};
use crate::state::{Config, Auction, Bid, AUCTIONS, CONFIG, AUCTION_COUNT};
use cw_storage_plus::{Map, Item};

// Storage keys
const HIGHEST_BIDS: Map<u64, u128> = Map::new("highest_bids");
const AUCTION_STATES: Map<u64, bool> = Map::new("auction_states");
const WINNERS: Map<u64, Addr> = Map::new("winners");
const AUCTION_COUNTER: Item<u64> = Item::new("auction_counter");
const BIDDERS: Map<(u64, Addr), Bid> = Map::new("bidders");

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let config = Config {
        admin: deps.api.addr_validate(&msg.admin)?,
        insurance_pool: deps.api.addr_validate(&msg.insurance_pool)?,
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
        } => execute_create_auction(deps, env, info, starting_bid, duration, description),
        ExecuteMsg::PlaceBid { auction_id, amount } => execute_place_bid(deps, env, info, auction_id, amount),
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
) -> Result<Response, ContractError> {
    // Validate starting bid
    if starting_bid.is_zero() {
        return Err(ContractError::InvalidAmount {});
    }
    
    // Get config for token denom
    let config = CONFIG.load(deps.storage)?;
    
    // Validate funds (optional - could require listing fee)
    for coin in &info.funds {
        if coin.denom != config.token_denom {
            return Err(ContractError::InvalidDenom {});
        }
    }
    
    // Get next auction ID using AUCTION_COUNTER
    let mut auction_count = AUCTION_COUNTER.may_load(deps.storage)?.unwrap_or(0);
    auction_count += 1;
    let auction_id = auction_count;
    
    // Create auction
    let auction = Auction {
        id: auction_id,
        creator: info.sender.clone(),
        starting_bid,
        current_bid: Uint128::zero(),
        highest_bidder: None,
        description,
        created_at: env.block.time.seconds(),
        expires_at: env.block.time.seconds() + duration,
        status: "active".to_string(),
        bids: vec![],
    };
    
    // Save auction
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    // Save the counter
    AUCTION_COUNTER.save(deps.storage, &auction_count)?;
    
    // Initialize auction state
    AUCTION_STATES.save(deps.storage, auction_id, &true)?;
    HIGHEST_BIDS.save(deps.storage, auction_id, &starting_bid.u128())?;
    
    Ok(Response::new()
        .add_attribute("method", "create_auction")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("creator", info.sender)
        .add_attribute("starting_bid", starting_bid))
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
    
    // Check if auction has expired
    if env.block.time.seconds() > auction.expires_at {
        auction.status = "expired".to_string();
        AUCTIONS.save(deps.storage, auction_id, &auction)?;
        AUCTION_STATES.save(deps.storage, auction_id, &false)?;
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
    
    // Check if user has sufficient funds
    let config = CONFIG.load(deps.storage)?;
    let sent_funds = info.funds.iter().find(|c| c.denom == config.token_denom);
    
    match sent_funds {
        Some(coin) if coin.amount < bid_amount_u128 => {
            return Err(ContractError::InsufficientFunds {});
        }
        None => {
            return Err(ContractError::NoFunds {});
        }
        _ => {}
    }
    
    // Create bid record
    let bid = Bid {
        bidder: info.sender.clone(),
        amount: bid_amount_u128,
        timestamp: env.block.time.seconds(),
    };
    
    // Store bid
    let bid_key = (auction_id, info.sender.clone());
    BIDDERS.save(deps.storage, bid_key, &bid)?;
    
    // Update auction
    auction.bids.push(bid);
    auction.current_bid = bid_amount_u128;
    auction.highest_bidder = Some(info.sender.clone());
    
    // Save auction
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    // Update highest bid
    HIGHEST_BIDS.save(deps.storage, auction_id, &bid_amount)?;
    
    Ok(Response::new()
        .add_attribute("method", "place_bid")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("bidder", info.sender)
        .add_attribute("amount", bid_amount.to_string()))
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
    
    if !is_expired && auction.bids.is_empty() {
        // No bids and not expired - just cancel
        auction.status = "cancelled".to_string();
    } else {
        // Auction has bids or expired - determine winner
        auction.status = "closed".to_string();
        
        if let Some(highest_bidder) = &auction.highest_bidder {
            // Store winner
            WINNERS.save(deps.storage, auction_id, highest_bidder)?;
        }
    }
    
    // Save auction
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    AUCTION_STATES.save(deps.storage, auction_id, &false)?;
    
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
    if auction.status != "closed" {
        return Err(ContractError::AuctionNotClosed {});
    }
    
    // Check if caller is winner
    let winner = WINNERS.may_load(deps.storage, auction_id)?;
    
    match winner {
        Some(w) if w == info.sender => {
            // Winner claiming - transfer funds
            let config = CONFIG.load(deps.storage)?;
            
            // Calculate fee (1.1%)
            let total = auction.current_bid.u128();
            let fee = (total * 11) / 1000; // 1.1%
            let payout = total - fee;
            
            // Transfer to winner (seller)
            let send_msg = BankMsg::Send {
                to_address: auction.creator.to_string(),
                amount: coins(payout, config.token_denom.clone()),
            };
            
            // Transfer fee to insurance pool
            let fee_msg = BankMsg::Send {
                to_address: config.insurance_pool.to_string(),
                amount: coins(fee, config.token_denom),
            };
            
            Ok(Response::new()
                .add_message(send_msg)
                .add_message(fee_msg)
                .add_attribute("method", "claim_winnings")
                .add_attribute("auction_id", auction_id.to_string())
                .add_attribute("winner", info.sender)
                .add_attribute("payout", payout.to_string())
                .add_attribute("fee", fee.to_string()))
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
                auction_id: auction.id,
                active: auction.status == "active",
                highest_bidder: auction.highest_bidder.map(|a| a.to_string()).unwrap_or_default(),
                highest_bid: auction.current_bid.to_string(),
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