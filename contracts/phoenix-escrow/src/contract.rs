use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo,
    Response, StdResult, StdError, Uint128, BankMsg, to_json_binary, coins
};
use cw2::set_contract_version;
use crate::msg::{InstantiateMsg, ExecuteMsg, QueryMsg};
use crate::state::{AUCTION_COUNT, AUCTIONS, Auction, Bid, AuctionStatus, DEVELOPER_WALLET, COMMUNITY_RESERVE_FUND};

const CONTRACT_NAME: &str = "crates.io:phoenix-escrow";
const CONTRACT_VERSION: &str = "1.0.0";

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    AUCTION_COUNT.save(deps.storage, &0)?;
    
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", msg.admin)
        .add_attribute("developer_wallet", DEVELOPER_WALLET))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::CreateAuction {
            item_id,
            description,
            starting_price,
            reserve_price,
            duration_hours,
        } => execute_create_auction(
            deps, env, info, 
            item_id, description, starting_price, reserve_price, duration_hours
        ),
        ExecuteMsg::PlaceBid { auction_id } => {
            execute_place_bid(deps, env, info, auction_id)
        },
        ExecuteMsg::EndAuction { auction_id } => {
            execute_end_auction(deps, env, info, auction_id)
        },
        ExecuteMsg::ReleaseEscrow { auction_id } => {
            execute_release_escrow(deps, env, info, auction_id)
        },
        ExecuteMsg::CancelAuction { auction_id } => {
            execute_cancel_auction(deps, env, info, auction_id)
        },
    }
}

fn execute_create_auction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    item_id: String,
    description: String,
    starting_price: Uint128,
    reserve_price: Uint128,
    duration_hours: u64,
) -> StdResult<Response> {
    let auction_id = AUCTION_COUNT.load(deps.storage)?;
    
    // ✅ SELLER POSTS 10% COLLATERAL based on reserve price
    let seller_collateral = reserve_price.multiply_ratio(10u128, 100u128);
    
    // Verify seller sent enough collateral
    let sent_collateral: Uint128 = info.funds.iter()
        .filter(|c| c.denom == "ucore")
        .map(|c| c.amount)
        .sum();
    
    if sent_collateral < seller_collateral {
        return Err(StdError::generic_err(format!(
            "Insufficient collateral: sent {}, required {} (10% of reserve price {})",
            sent_collateral, seller_collateral, reserve_price
        )));
    }
    
    let auction = Auction {
        seller: info.sender.to_string(),
        item_id,
        description,
        starting_price,
        reserve_price,
        start_time: env.block.time.seconds(),
        end_time: env.block.time.plus_seconds(duration_hours * 3600).seconds(),
        current_bid: None,
        bids: vec![],
        status: AuctionStatus::Active,
        escrow_released: false,
        seller_collateral,
        buyer_collateral: Uint128::zero(),
        confirmed: false,
        bid_processed: false,
    };
    
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    AUCTION_COUNT.save(deps.storage, &(auction_id + 1))?;
    
    Ok(Response::new()
        .add_attribute("method", "create_auction")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("reserve_price", reserve_price.to_string())
        .add_attribute("seller_collateral", seller_collateral.to_string()))
}
fn execute_place_bid(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> StdResult<Response> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
        if auction.status != AuctionStatus::Active {
        return Err(StdError::generic_err("Auction is not active"));
    }
    
    if env.block.time.seconds() > auction.end_time {
        auction.status = AuctionStatus::Ended;
        AUCTIONS.save(deps.storage, auction_id, &auction)?;
        return Err(StdError::generic_err("Auction has ended"));
    }
    
        // Get the funds sent
    let funds = &info.funds;
    if funds.is_empty() {
        return Err(StdError::generic_err("Must send funds"));
    }
    
    // Get total sent
    let sent_total: Uint128 = funds.iter()
        .filter(|c| c.denom == "ucore")
        .map(|c| c.amount)
        .sum();
    
    // DEBUG PRINTS
    println!("DEBUG - sent_total: {}, current_bid exists: {}", 
             sent_total, auction.current_bid.is_some());
    
    // Calculate bid amount first (based on sent_total)
    let bid_amount = sent_total.multiply_ratio(1000u128, 1100u128);
    println!("DEBUG - bid_amount: {}, sent_total: {}", bid_amount, sent_total);
    
    // CHECK COLLATERAL
    let expected_collateral = bid_amount.multiply_ratio(10u128, 100u128);
    let required_minimum = bid_amount + expected_collateral;
    println!("DEBUG - expected_collateral: {}, required_minimum: {}", expected_collateral, required_minimum);
    
    if sent_total < required_minimum {
        return Err(StdError::generic_err(format!(
            "Insufficient funds: sent {}, need {} for {} bid + {} collateral",
            sent_total, required_minimum, bid_amount, expected_collateral
        )));
    }
    
    // Calculate bid amount (90.91% of total sent for 10% collateral)
    let bid_amount = sent_total.multiply_ratio(1000u128, 1100u128);
    let buyer_collateral = sent_total.checked_sub(bid_amount)?;
    
    // Validate bid amount
    if let Some(current_bid) = &auction.current_bid {
        if bid_amount <= current_bid.amount {
            return Err(StdError::generic_err(format!(
                "Bid must be higher than current bid: {} vs {}",
                bid_amount, current_bid.amount
            )));
        }
    } else {
        if bid_amount < auction.starting_price {
            return Err(StdError::generic_err(format!(
                "Bid must be at least starting price: {} vs {}",
                bid_amount, auction.starting_price
            )));
        }
    }
    
    // Verify collateral is approximately 10%
    let expected_collateral = bid_amount.multiply_ratio(10u128, 100u128);
    if buyer_collateral < expected_collateral {
        return Err(StdError::generic_err(format!(
            "Insufficient collateral: sent {} total, need {} bid + {} collateral (10%)",
            sent_total, bid_amount, expected_collateral
        )));
    }
    
    let bid = Bid {
        bidder: info.sender.to_string(),
        amount: bid_amount,
        timestamp: env.block.time.seconds(),
    };
    
    let mut messages = vec![];
    
    // Return previous bid + collateral if exists
    if let Some(previous_bid) = auction.current_bid.take() {
        let previous_total = previous_bid.amount + auction.buyer_collateral;
        messages.push(BankMsg::Send {
            to_address: previous_bid.bidder.clone(),
            amount: coins(previous_total.u128(), "ucore"),
        });
        auction.bids.push(previous_bid);
    }
    
    auction.current_bid = Some(bid.clone());
    auction.buyer_collateral = buyer_collateral;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_messages(messages)
        .add_attribute("method", "place_bid")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("bidder", bid.bidder)
        .add_attribute("bid_amount", bid.amount.to_string())
        .add_attribute("collateral", buyer_collateral.to_string()))
}

fn execute_end_auction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> StdResult<Response> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    if info.sender.to_string() != auction.seller {
        return Err(StdError::generic_err("Only seller can end auction"));
    }
    
    if auction.status != AuctionStatus::Active {
        return Err(StdError::generic_err("Auction is not active"));
    }
    
    // Check if auction time has passed
    if env.block.time.seconds() < auction.end_time {
        return Err(StdError::generic_err("Auction time not finished yet"));
    }
    
    // Check if reserve price is met
    let reserve_met = if let Some(bid) = &auction.current_bid {
        bid.amount >= auction.reserve_price
    } else {
        false
    };
    
    let mut messages = vec![];
    
    if !reserve_met {
        // NO SALE - return all funds
        if let Some(bid) = auction.current_bid.take() {
            let total = bid.amount + auction.buyer_collateral;
            messages.push(BankMsg::Send {
                to_address: bid.bidder,
                amount: coins(total.u128(), "ucore"),
            });
        }
        
        // Return seller collateral
        messages.push(BankMsg::Send {
            to_address: auction.seller.clone(),
            amount: coins(auction.seller_collateral.u128(), "ucore"),
        });
        
        auction.status = AuctionStatus::Cancelled;
        AUCTIONS.save(deps.storage, auction_id, &auction)?;
        
        return Ok(Response::new()
            .add_messages(messages)
            .add_attribute("method", "end_auction")
            .add_attribute("auction_id", auction_id.to_string())
            .add_attribute("status", "no_sale")
            .add_attribute("reason", "reserve_not_met"));
    }
    
    auction.status = AuctionStatus::Ended;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("method", "end_auction")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("status", "sale_pending")
        .add_attribute("final_bid", auction.current_bid.as_ref().unwrap().amount.to_string()))
}

fn execute_release_escrow(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> StdResult<Response> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    if auction.escrow_released {
        return Err(StdError::generic_err("Escrow already released"));
    }
    
    if info.sender.to_string() != auction.seller {
        return Err(StdError::generic_err("Only seller can release escrow"));
    }
    
    if auction.status != AuctionStatus::Ended {
        return Err(StdError::generic_err("Auction hasn't ended yet"));
    }
    
    let mut messages = vec![];
    
    if let Some(winning_bid) = &auction.current_bid {
        // ✅ 1.1% FEE to Community Reserve Fund
        let community_fee = winning_bid.amount.multiply_ratio(11u128, 1000u128);
        let seller_amount = winning_bid.amount.checked_sub(community_fee)?;
        
        // Send fee to Community Reserve Fund
        messages.push(BankMsg::Send {
            to_address: COMMUNITY_RESERVE_FUND.to_string(),
            amount: coins(community_fee.u128(), "ucore"),
        });
        
        // Send payment to seller (bid - fee)
        messages.push(BankMsg::Send {
            to_address: auction.seller.clone(),
            amount: coins(seller_amount.u128(), "ucore"),
        });
        
        // Return seller collateral
        messages.push(BankMsg::Send {
            to_address: auction.seller.clone(),
            amount: coins(auction.seller_collateral.u128(), "ucore"),
        });
        
        // Return buyer collateral
        messages.push(BankMsg::Send {
            to_address: winning_bid.bidder.clone(),
            amount: coins(auction.buyer_collateral.u128(), "ucore"),
        });
    }
    
    auction.escrow_released = true;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_messages(messages)
        .add_attribute("method", "release_escrow")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("status", "success"))
}

fn execute_cancel_auction(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> StdResult<Response> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    if info.sender.to_string() != auction.seller {
        return Err(StdError::generic_err("Only seller can cancel auction"));
    }
    
    if auction.status != AuctionStatus::Active {
        return Err(StdError::generic_err("Auction is not active"));
    }
    
    let mut messages = vec![];
    
    // Return any current bid + collateral
    if let Some(current_bid) = auction.current_bid.take() {
        let total = current_bid.amount + auction.buyer_collateral;
        messages.push(BankMsg::Send {
            to_address: current_bid.bidder,
            amount: coins(total.u128(), "ucore"),
        });
    }
    
    // Return seller collateral
    messages.push(BankMsg::Send {
        to_address: auction.seller.clone(),
        amount: coins(auction.seller_collateral.u128(), "ucore"),
    });
    
    auction.status = AuctionStatus::Cancelled;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_messages(messages)
        .add_attribute("method", "cancel_auction")
        .add_attribute("auction_id", auction_id.to_string()))
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetAuction { auction_id } => {
            let auction = AUCTIONS.load(deps.storage, auction_id)?;
            to_json_binary(&auction)
        },
        QueryMsg::GetActiveAuctions {} => {
            let count = AUCTION_COUNT.load(deps.storage)?;
            let mut active_auctions = Vec::new();
            
            for i in 0..count {
                if let Ok(auction) = AUCTIONS.load(deps.storage, i) {
                    if auction.status == AuctionStatus::Active {
                        active_auctions.push(auction);
                    }
                }
            }
            
            to_json_binary(&active_auctions)
        },
        QueryMsg::GetAuctionCount {} => {
            let count = AUCTION_COUNT.load(deps.storage)?;
            to_json_binary(&count)
        },
    }
}