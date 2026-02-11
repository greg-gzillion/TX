use cosmwasm_std::{DepsMut, Env, MessageInfo, Response, StdResult, Uint128};

use crate::msg::{Auction, AuctionStatus};
use crate::state::{next_auction_id, AUCTIONS};

pub fn execute_create_auction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    item_id: String,
    reserve_price: Uint128,
    buy_it_now_price: Option<Uint128>,
    duration: u64,
) -> StdResult<Response> {
    // Generate auction ID
    let auction_id = next_auction_id(deps.storage)?;
    let auction_id_str = auction_id.to_string();
    
    // Create auction
    let auction = Auction {
        auction_id: auction_id_str.clone(),
        seller: info.sender.clone(),
        item_id,
        reserve_price,
        buy_it_now_price,
        highest_bid: None,  // Changed from Uint128::zero() to None
        highest_bidder: None,  // Changed from Addr::unchecked("") to None
        start_time: env.block.time.seconds(),
        end_time: env.block.time.seconds() + duration,
        status: AuctionStatus::Active,
    };
    
    // Save auction
    AUCTIONS.save(deps.storage, &auction_id_str, &auction)?;
    
    // Prepare response
    let response = Response::new()
        .add_attribute("action", "create_auction")
        .add_attribute("auction_id", auction_id_str)
        .add_attribute("seller", info.sender.to_string())
        .add_attribute("reserve_price", reserve_price.to_string());
    
    Ok(response)
}
