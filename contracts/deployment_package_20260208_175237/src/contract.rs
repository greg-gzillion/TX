use cosmwasm_std::{
    entry_point, to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
    Order, StdError
};
use cw_storage_plus::Bound;
use thiserror::Error;

use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, ConfigResponse, AuctionsResponse};
use crate::state::{Config, CONFIG, AUCTIONS, Auction, AuctionStatus, AUCTION_COUNT};

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},
    
    #[error("Auction not active")]
    AuctionNotActive {},
    
    #[error("Auction already ended")]
    AuctionEnded {},
    
    #[error("Bid too low")]
    BidTooLow {},
    
    #[error("Auction not ended")]
    AuctionNotEnded {},
    
    #[error("No winning bid")]
    NoWinningBid {},
}

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let config = Config {
        admin: deps.api.addr_validate(&msg.admin)?,
    };
    CONFIG.save(deps.storage, &config)?;
    
    AUCTION_COUNT.save(deps.storage, &0u64)?;

    Ok(Response::new()
        .add_attribute("action", "instantiate")
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
            item_id,
            description,
            metal_type,
            product_form,
            weight,
            starting_price,
            reserve_price,
            buy_now_price,
            duration_hours,
        } => execute_create_auction(
            deps,
            env,
            info,
            item_id,
            description,
            metal_type,
            product_form,
            weight,
            starting_price,
            reserve_price,
            buy_now_price,
            duration_hours,
        ),
        ExecuteMsg::PlaceBid { auction_id, amount } => {
            execute_place_bid(deps, env, info, auction_id, amount)
        }
        ExecuteMsg::EndAuction { auction_id } => execute_end_auction(deps, env, info, auction_id),
        ExecuteMsg::ReleaseFunds { auction_id } => execute_release_funds(deps, env, info, auction_id),
        ExecuteMsg::CancelAuction { auction_id } => execute_cancel_auction(deps, env, info, auction_id),
        ExecuteMsg::BuyNow { auction_id } => execute_buy_now(deps, env, info, auction_id),
    }
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetConfig {} => {
            let config = CONFIG.load(deps.storage)?;
            to_json_binary(&ConfigResponse { admin: config.admin })
        }
        QueryMsg::GetAuction { id } => {
            let auction = AUCTIONS.load(deps.storage, id)?;
            to_json_binary(&auction)
        }
        QueryMsg::ListAuctions { start_after, limit } => {
            let auctions = list_auctions(deps, start_after, limit)?;
            to_json_binary(&AuctionsResponse { auctions })
        }
        QueryMsg::GetCompletedAuctions { start_after, limit } => {
            let auctions = query_completed_auctions(deps, start_after, limit)?;
            to_json_binary(&auctions)
        }
    }
}

// Helper function to list auctions
fn list_auctions(
    deps: Deps,
    start_after: Option<u64>,
    limit: Option<u32>,
) -> StdResult<Vec<Auction>> {
    let limit = limit.unwrap_or(50).min(100) as usize;
    let start = start_after.map(Bound::exclusive);

    AUCTIONS
        .range(deps.storage, start, None, Order::Ascending)
        .take(limit)
        .map(|item| item.map(|(_, auction)| auction))
        .collect()
}

// Query completed auctions
fn query_completed_auctions(
    deps: Deps,
    start_after: Option<u64>,
    limit: Option<u32>,
) -> StdResult<Vec<Auction>> {
    let limit = limit.unwrap_or(50).min(100) as usize;
    let start = start_after.map(Bound::exclusive);
    
    AUCTIONS
        .range(deps.storage, start, None, Order::Ascending)
        .filter(|item| {
            if let Ok((_, auction)) = item {
                auction.status == AuctionStatus::Completed
            } else {
                false
            }
        })
        .take(limit)
        .map(|item| item.map(|(_, auction)| auction))
        .collect()
}

// Create auction
fn execute_create_auction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    item_id: String,
    description: String,
    metal_type: String,
    product_form: String,
    weight: u32,
    starting_price: cosmwasm_std::Uint128,
    reserve_price: Option<cosmwasm_std::Uint128>,
    buy_now_price: Option<cosmwasm_std::Uint128>,
    duration_hours: u64,
) -> Result<Response, ContractError> {
    let next_id = AUCTION_COUNT.load(deps.storage)?;
    
    let auction = Auction {
        id: next_id,
        item_id,
        description,
        metal_type,
        product_form,
        weight,
        starting_price,
        reserve_price,
        buy_now_price,
        highest_bid: None,
        highest_bidder: None,
        seller: info.sender.clone(),
        status: AuctionStatus::Active,
        end_time: env.block.time.plus_seconds(duration_hours * 3600),
        created_at: env.block.time,
    };
    
    AUCTIONS.save(deps.storage, next_id, &auction)?;
    AUCTION_COUNT.save(deps.storage, &(next_id + 1))?;
    
    Ok(Response::new()
        .add_attribute("action", "create_auction")
        .add_attribute("auction_id", next_id.to_string())
        .add_attribute("seller", info.sender))
}

// Place bid
fn execute_place_bid(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
    amount: cosmwasm_std::Uint128,
) -> Result<Response, ContractError> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    if auction.status != AuctionStatus::Active {
        return Err(ContractError::Unauthorized {});
    }
    
    if env.block.time >= auction.end_time {
        return Err(ContractError::Unauthorized {});
    }
    
    if let Some(current_bid) = auction.highest_bid {
        if amount <= current_bid {
            return Err(ContractError::Unauthorized {});
        }
    } else if amount < auction.starting_price {
        return Err(ContractError::Unauthorized {});
    }
    
    auction.highest_bid = Some(amount);
    auction.highest_bidder = Some(info.sender.clone());
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("action", "place_bid")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("bidder", info.sender)
        .add_attribute("amount", amount))
}

// End auction
fn execute_end_auction(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    let config = CONFIG.load(deps.storage)?;
    if info.sender != auction.seller && info.sender != config.admin {
        return Err(ContractError::Unauthorized {});
    }
    
    auction.status = AuctionStatus::Ended;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("action", "end_auction")
        .add_attribute("auction_id", auction_id.to_string()))
}

// Release funds
fn execute_release_funds(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    if info.sender != auction.seller {
        return Err(ContractError::Unauthorized {});
    }
    
    auction.status = AuctionStatus::Completed;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("action", "release_funds")
        .add_attribute("auction_id", auction_id.to_string()))
}

// Cancel auction
fn execute_cancel_auction(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    if info.sender != auction.seller {
        return Err(ContractError::Unauthorized {});
    }
    
    auction.status = AuctionStatus::Cancelled;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("action", "cancel_auction")
        .add_attribute("auction_id", auction_id.to_string()))
}

// Buy now
fn execute_buy_now(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    if auction.status != AuctionStatus::Active {
        return Err(ContractError::Unauthorized {});
    }
    
    if env.block.time >= auction.end_time {
        return Err(ContractError::Unauthorized {});
    }
    
    if auction.buy_now_price.is_none() {
        return Err(ContractError::Unauthorized {});
    }
    
    let buy_now_price = auction.buy_now_price.unwrap();
    
    auction.highest_bid = Some(buy_now_price);
    auction.highest_bidder = Some(info.sender.clone());
    auction.status = AuctionStatus::Ended;
    
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("action", "buy_now")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("buyer", info.sender)
        .add_attribute("price", buy_now_price))
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins};

    #[test]
    fn test_instantiate() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &coins(1000, "ucore"));
        
        let msg = InstantiateMsg {
            admin: "admin".to_string(),
        };
        
        let res = instantiate(deps.as_mut(), env.clone(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());
    }
    
    #[test]
    fn test_create_auction() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        
        let instantiate_info = mock_info("admin", &[]);
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), instantiate_info, instantiate_msg).unwrap();
        
        let info = mock_info("seller", &[]);
        let msg = ExecuteMsg::CreateAuction {
            item_id: "test-item".to_string(),
            description: "Test auction".to_string(),
            metal_type: "Gold".to_string(),
            product_form: "Bar".to_string(),
            weight: 100,
            starting_price: cosmwasm_std::Uint128::new(1000),
            reserve_price: Some(cosmwasm_std::Uint128::new(1500)),
            buy_now_price: Some(cosmwasm_std::Uint128::new(2000)),
            duration_hours: 24,
        };
        
        let res = execute(deps.as_mut(), env.clone(), info, msg).unwrap();
        assert_eq!(res.attributes[0].value, "create_auction");
    }
}
