use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, 
    Response, StdResult, StdError, Uint128, BankMsg, to_json_binary, coins
};
use cw2::set_contract_version;
use crate::msg::{InstantiateMsg, ExecuteMsg, QueryMsg};
use crate::state::{AUCTION_COUNT, AUCTIONS, Auction, Bid, AuctionStatus, DEVELOPER_WALLET};

// Version info for contract migration
const CONTRACT_NAME: &str = "crates.io:phoenix-escrow";
const CONTRACT_VERSION: &str = "1.0.0";

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    // Set contract version
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    
    // Initialize auction count to 0
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
            item_id, description, starting_price, 
            reserve_price, duration_hours
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

// ==================== EXECUTION FUNCTIONS ====================
fn execute_create_auction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    item_id: String,
    description: String,
    starting_price: Uint128,
    reserve_price: Option<Uint128>,
    duration_hours: u64,
) -> StdResult<Response> {
    // Get next auction ID
    let auction_id = AUCTION_COUNT.load(deps.storage)?;
    
    // Create auction
    let auction = Auction {
        seller: info.sender.to_string(),
        item_id,
        description,
        starting_price,
        reserve_price,
        start_time: env.block.time.seconds(),
        end_time: env.block.time.seconds() + (duration_hours * 3600),
        current_bid: None,
        bids: vec![],
        status: AuctionStatus::Active,
        escrow_released: false,
    };
    
    // Save auction
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    // Increment counter
    AUCTION_COUNT.save(deps.storage, &(auction_id + 1))?;
    
    Ok(Response::new()
        .add_attribute("method", "create_auction")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("seller", info.sender.to_string()))
}

fn execute_place_bid(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> StdResult<Response> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Check if auction is active
    if auction.status != AuctionStatus::Active {
        return Err(StdError::generic_err("Auction is not active"));
    }
    
    // Check if auction has ended
    if env.block.time.seconds() > auction.end_time {
        auction.status = AuctionStatus::Ended;
        AUCTIONS.save(deps.storage, auction_id, &auction)?;
        return Err(StdError::generic_err("Auction has ended"));
    }
    
    // Get bid amount from sent funds
    let funds = info.funds;
    if funds.len() != 1 {
        return Err(StdError::generic_err("Must send exactly one coin type"));
    }
    
    let bid_amount = funds[0].amount;
    let bid_denom = funds[0].denom.clone();
    
    // Validate bid (must be at least starting price for first bid)
    if let Some(current_bid) = &auction.current_bid {
        if bid_amount <= current_bid.amount {
            return Err(StdError::generic_err("Bid must be higher than current bid"));
        }
    } else {
        // First bid must be at least starting price
        if bid_amount < auction.starting_price {
            return Err(StdError::generic_err("Bid must be at least starting price"));
        }
    }
    
    // Create bid
    let bid = Bid {
        bidder: info.sender.to_string(),
        amount: bid_amount,
        timestamp: env.block.time.seconds(),
    };
    
    // Update auction
    let mut messages = vec![];
    
    if let Some(previous_bid) = auction.current_bid.take() {
        // Clone the bidder address before moving
        let bidder_address = previous_bid.bidder.clone();
        let bid_amount_value = previous_bid.amount;
        
        // Return previous bid to previous bidder
        messages.push(BankMsg::Send {
            to_address: bidder_address,
            amount: coins(bid_amount_value.u128(), &bid_denom),
        });
        
        auction.bids.push(previous_bid);
    }
    
    auction.current_bid = Some(bid.clone());
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_messages(messages)
        .add_attribute("method", "place_bid")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("bidder", bid.bidder)
        .add_attribute("amount", bid.amount.to_string()))
}

fn execute_end_auction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> StdResult<Response> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Only seller can end auction early
    if info.sender.to_string() != auction.seller {
        return Err(StdError::generic_err("Only seller can end auction"));
    }
    
    if auction.status != AuctionStatus::Active {
        return Err(StdError::generic_err("Auction is not active"));
    }
    
    // Check if auction has already ended by time
    if env.block.time.seconds() > auction.end_time {
        auction.status = AuctionStatus::Ended;
        AUCTIONS.save(deps.storage, auction_id, &auction)?;
        return Ok(Response::new()
            .add_attribute("method", "end_auction")
            .add_attribute("auction_id", auction_id.to_string())
            .add_attribute("reason", "time_expired"));
    }
    
    auction.status = AuctionStatus::Ended;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("method", "end_auction")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("reason", "seller_ended_early"))
}

fn execute_release_escrow(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> StdResult<Response> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Check if escrow already released
    if auction.escrow_released {
        return Err(StdError::generic_err("Escrow already released"));
    }
    
    // Only seller or admin can release escrow
    if info.sender != auction.seller {
        return Err(StdError::generic_err("Only seller can release escrow"));
    }
    
    // Check if auction has ended
    if auction.status != AuctionStatus::Ended && env.block.time.seconds() <= auction.end_time {
        return Err(StdError::generic_err("Auction hasn'\''t ended yet"));
    }
    
    // Mark auction as ended if not already
    if auction.status == AuctionStatus::Active {
        auction.status = AuctionStatus::Ended;
    }
    
    // Process escrow release
    let mut messages = vec![];
    
    if let Some(winning_bid) = &auction.current_bid {
        // Check if reserve price is met
        if let Some(reserve_price) = auction.reserve_price {
            if winning_bid.amount < reserve_price {
                auction.escrow_released = true;
                AUCTIONS.save(deps.storage, auction_id, &auction)?;
                
                // Return funds to bidder
                messages.push(BankMsg::Send {
                    to_address: winning_bid.bidder.clone(),
                    amount: coins(winning_bid.amount.u128(), "ucore"),
                });
                
                return Ok(Response::new()
                    .add_messages(messages)
                    .add_attribute("method", "release_escrow")
                    .add_attribute("auction_id", auction_id.to_string())
                    .add_attribute("status", "reserve_not_met")
                    .add_attribute("action", "funds_returned_to_bidder"));
            }
        }
        
        // Calculate 1% royalty fee
        let royalty_fee = winning_bid.amount.multiply_ratio(1u128, 100u128);
        let seller_amount = winning_bid.amount.checked_sub(royalty_fee)?;
        
        // Send royalty to developer wallet
        messages.push(BankMsg::Send {
            to_address: DEVELOPER_WALLET.to_string(),
            amount: coins(royalty_fee.u128(), "ucore"),
        });
        
        // Send remaining to seller
        messages.push(BankMsg::Send {
            to_address: auction.seller.clone(),
            amount: coins(seller_amount.u128(), "ucore"),
        });
    } else {
        // No bids, nothing to release
        return Err(StdError::generic_err("No winning bid to release"));
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
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> StdResult<Response> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Only seller can cancel
    if info.sender.to_string() != auction.seller {
        return Err(StdError::generic_err("Only seller can cancel auction"));
    }
    
    if auction.status != AuctionStatus::Active {
        return Err(StdError::generic_err("Auction is not active"));
    }
    
    // Return any current bid
    let mut messages = vec![];
    if let Some(current_bid) = auction.current_bid.take() {
        messages.push(BankMsg::Send {
            to_address: current_bid.bidder,
            amount: coins(current_bid.amount.u128(), "ucore"),
        });
    }
    
    auction.status = AuctionStatus::Cancelled;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_messages(messages)
        .add_attribute("method", "cancel_auction")
        .add_attribute("auction_id", auction_id.to_string()))
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_json};

    #[test]
    fn test_create_auction() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("seller123", &coins(0, "ucore"));
        
        // Instantiate contract
        let msg = InstantiateMsg { admin: "admin123".to_string() };
        let _res = instantiate(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();
        
        // Create auction
        let msg = ExecuteMsg::CreateAuction {
            item_id: "gold_bar_1".to_string(),
            description: "1oz Gold Bar".to_string(),
            starting_price: Uint128::from(1000000u64), // 1 CORE = 1,000,000 ucore
            reserve_price: Some(Uint128::from(1500000u64)),
            duration_hours: 24,
        };
        
        let res = execute(deps.as_mut(), env, info, msg).unwrap();
        
        // Verify response
        assert_eq!(res.attributes[0].value, "create_auction");
        assert_eq!(res.attributes[1].value, "0"); // First auction ID
        
        // Verify auction was saved
        let query_msg = QueryMsg::GetAuction { auction_id: 0 };
        let res = query(deps.as_ref(), mock_env(), query_msg).unwrap();
        let auction: Auction = from_json(res).unwrap();
        
        assert_eq!(auction.seller, "seller123");
        assert_eq!(auction.item_id, "gold_bar_1");
        assert_eq!(auction.status, AuctionStatus::Active);
    }
}
