use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};
use cosmwasm_schema::cw_serde;

#[cw_serde]
pub struct Config {
    pub admin: Addr,
    pub fee_percentage: u64,
    pub fee_address: Addr,
    pub require_kyc: bool,
}

#[cw_serde]
pub struct Auction {
    pub creator: Addr,
    pub item_id: String,
    pub starting_price: Uint128,
    pub reserve_price: Option<Uint128>,
    pub buy_now_price: Option<Uint128>,
    pub ends_at: u64,
    pub bids: Vec<Bid>,
    pub highest_bid: Option<Bid>,
    pub status: AuctionStatus,
    pub created_at: u64,
}

#[cw_serde]
pub struct Bid {
    pub bidder: Addr,
    pub amount: Uint128,
    pub timestamp: u64,
}

#[cw_serde]
pub enum AuctionStatus {
    Active,
    Ended,
    Sold,
    Cancelled,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const AUCTIONS: Map<u64, Auction> = Map::new("auctions");
pub const AUCTION_COUNT: Item<u64> = Item::new("auction_count");
pub const COMPLETED_AUCTIONS: Map<u64, Auction> = Map::new("completed_auctions");
pub const KYC_VERIFIED: Map<&Addr, bool> = Map::new("kyc_verified");
