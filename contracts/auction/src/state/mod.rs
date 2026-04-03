use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub struct Config {
    pub admin: Addr,
    pub community_reserve_fund: Addr,
    pub token_denom: String,
}

#[cw_serde]
pub struct Auction {
    pub id: u64,
    pub creator: Addr,
    pub starting_bid: Uint128,
    pub reserve_price: Option<Uint128>,
    pub current_bid: Uint128,
    pub highest_bidder: Option<Addr>,
    pub buy_it_now_price: Option<Uint128>,
    pub description: String,
    pub created_at: u64,
    pub expires_at: u64,
    pub status: String,
    // ✅ REMOVED: bids: Vec<Bid> - causes memory error
    pub seller_collateral: Uint128,
    pub buyer_collateral: Option<Uint128>,
}

#[cw_serde]
pub struct Bid {
    pub bidder: Addr,
    pub amount: Uint128,
    pub timestamp: u64,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const AUCTIONS: Map<u64, Auction> = Map::new("auctions");
pub const AUCTION_COUNT: Item<u64> = Item::new("auction_count");

// ✅ NEW: Store bids individually to prevent memory errors
// Key: (auction_id, bidder_address)
pub const BIDS: Map<(u64, &Addr), Bid> = Map::new("bids");

// Track bid count per auction for pagination
pub const BID_COUNT: Map<u64, u64> = Map::new("bid_count");
