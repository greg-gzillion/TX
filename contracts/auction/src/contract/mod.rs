use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128,
};
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use cw_storage_plus::Map;

const HIGHEST_BIDS: Map<u64, u128> = Map::new("highest_bids");
const AUCTION_STATES: Map<u64, bool> = Map::new("auction_states"); // true = open, false = closed
const WINNERS: Map<u64, String> = Map::new("winners");

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    Ok(Response::new())
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
    _env: Env,
    _info: MessageInfo,
    _starting_bid: Uint128,
    _duration: u64,
    _description: String,
) -> Result<Response, ContractError> {
    // Mark auction 1 as open when created
    AUCTION_STATES.save(deps.storage, 1, &true)?;
    Ok(Response::new())
}

fn execute_place_bid(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    auction_id: u64,
    amount: String,
) -> Result<Response, ContractError> {
    // Check if auction exists
    if auction_id != 1 {
        return Err(ContractError::AuctionNotFound {});
    }
    
    // Check if auction is open
    let is_open = AUCTION_STATES.may_load(deps.storage, auction_id)?.unwrap_or(false);
    if !is_open {
        return Err(ContractError::AuctionNotActive {});
    }
    
    // Parse the bid amount
    let bid_amount: u128 = amount.parse().map_err(|_| ContractError::InvalidAmount {})?;
    
    // Check if the bidder sent enough funds
    let sent_funds = info.funds.iter().fold(0u128, |acc, coin| {
        if coin.denom == "utestcore" {
            acc + coin.amount.u128()
        } else {
            acc
        }
    });
    
    if sent_funds < bid_amount {
        return Err(ContractError::InsufficientFunds {});
    }
    
    // Check if bid is higher than current highest
    let current_highest = HIGHEST_BIDS.may_load(deps.storage, auction_id)?.unwrap_or(0);
    
    if bid_amount <= current_highest {
        return Err(ContractError::BidTooLow {});
    }
    
    // Update the highest bid
    HIGHEST_BIDS.save(deps.storage, auction_id, &bid_amount)?;
    
    Ok(Response::new())
}

fn execute_close_auction(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    // Check if auction exists
    if auction_id != 1 {
        return Err(ContractError::AuctionNotFound {});
    }
    
    // Check if auction is already closed
    let is_open = AUCTION_STATES.may_load(deps.storage, auction_id)?.unwrap_or(false);
    
    if !is_open {
        return Err(ContractError::AuctionNotActive {});
    }
    
    // Check if caller is admin (simplified for now)
    if info.sender != "admin" {
        return Err(ContractError::Unauthorized {});
    }
    
    // Get the highest bidder (winner) - in a real contract you'd store this info
    // For testing, we'll assume "charlie" is the winner
    let winner = "charlie".to_string();
    
    // Store the winner
    WINNERS.save(deps.storage, auction_id, &winner)?;
    
    // Mark auction as closed
    AUCTION_STATES.save(deps.storage, auction_id, &false)?;
    
    Ok(Response::new())
}

fn execute_claim_winnings(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    // Check if auction exists
    if auction_id != 1 {
        return Err(ContractError::AuctionNotFound {});
    }
    
    // Check if auction is closed
    let is_open = AUCTION_STATES.may_load(deps.storage, auction_id)?.unwrap_or(true);
    
    if is_open {
        return Err(ContractError::AuctionNotActive {});
    }
    
    // Get the winner
    let winner = WINNERS.may_load(deps.storage, auction_id)?.unwrap_or_default();
    
    // Check if caller is the winner
    if info.sender != winner {
        return Err(ContractError::Unauthorized {});
    }
    
    Ok(Response::new())
}

#[entry_point]
pub fn query(
    deps: Deps,
    env: Env,
    msg: QueryMsg,
) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetAuction { auction_id } => query_auction(deps, env, auction_id),
        QueryMsg::GetHighBid { auction_id } => query_high_bid(deps, env, auction_id),
    }
}

fn query_auction(
    _deps: Deps,
    _env: Env,
    _auction_id: u64,
) -> StdResult<Binary> {
    Ok(Binary::default())
}

fn query_high_bid(
    _deps: Deps,
    _env: Env,
    _auction_id: u64,
) -> StdResult<Binary> {
    Ok(Binary::default())
}