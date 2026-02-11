use crate::msg::AuctionResponse;
use crate::state::AUCTIONS;
use cosmwasm_std::{Deps, Order, StdResult};
use cw_storage_plus::Bound;

pub fn query_auction(deps: Deps, auction_id: String) -> StdResult<AuctionResponse> {
    let auction = AUCTIONS.load(deps.storage, &auction_id)?;
    
    Ok(AuctionResponse {
        auction_id: auction.auction_id,
        seller: auction.seller.to_string(),
        item_id: auction.item_id,
        reserve_price: auction.reserve_price,
        buy_it_now_price: auction.buy_it_now_price,
        highest_bid: auction.highest_bid,
        highest_bidder: auction.highest_bidder.map(|addr| addr.to_string()),
        start_time: auction.start_time,
        end_time: auction.end_time,
        status: auction.status,
    })
}

pub fn query_list_auctions(
    deps: Deps,
    start_after: Option<String>,
    limit: Option<u32>,
) -> StdResult<Vec<AuctionResponse>> {
    let limit = limit.unwrap_or(10) as usize;
    
    let start = start_after.as_deref().map(Bound::exclusive);
    
    AUCTIONS
        .range(deps.storage, start, None, Order::Ascending)
        .take(limit)
        .map(|item| {
            item.map(|(_, auction)| AuctionResponse {
                auction_id: auction.auction_id,
                seller: auction.seller.to_string(),
                item_id: auction.item_id,
                reserve_price: auction.reserve_price,
                buy_it_now_price: auction.buy_it_now_price,
                highest_bid: auction.highest_bid,
                highest_bidder: auction.highest_bidder.map(|addr| addr.to_string()),
                start_time: auction.start_time,
                end_time: auction.end_time,
                status: auction.status,
            })
        })
        .collect()
}
