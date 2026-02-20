use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};
use cosmwasm_schema::cw_serde;

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
    pub current_bid: Uint128,
    pub highest_bidder: Option<Addr>,
    pub description: String,
    pub created_at: u64,
    pub expires_at: u64,
    pub status: String,
    pub bids: Vec<Bid>,
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