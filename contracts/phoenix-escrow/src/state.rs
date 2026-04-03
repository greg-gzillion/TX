use cosmwasm_std::Uint128;
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

pub const DEVELOPER_WALLET: &str = "core1mj58cdfrkc8uyunw2rna3wvkatdjfhd6lwtu0m";
pub const COMMUNITY_RESERVE_FUND: &str = "core1m5adn3k68tk4zqmujpnstmp9r933jafzu44tnv";

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema, Default)]
pub struct Reputation {
    pub phnx: Uint128,
    pub trust: Uint128,
    pub dont_trust: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Auction {
    pub seller: String,
    pub item_id: String,
    pub description: String,
    pub starting_price: Uint128,
    pub reserve_price: Uint128,
    pub start_time: u64,
    pub end_time: u64,
    pub current_bid: Option<Bid>,
    // ✅ REMOVED: pub bids: Vec<Bid> - causes memory error
    pub status: AuctionStatus,
    pub escrow_released: bool,
    pub seller_collateral: Uint128,
    pub buyer_collateral: Uint128,
    pub inspection_start: Option<u64>,
    pub inspection_approved: bool,
    pub fee_paid: bool,
    pub confirmed: bool,
    pub bid_processed: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Bid {
    pub bidder: String,
    pub amount: Uint128,
    pub timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub owner: String,
    pub community_reserve_fund: String,
    pub fee_bps: u64,
    pub inspection_period: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum AuctionStatus {
    Active,
    Ended,
    Inspection,
    Completed,
    Disputed,
    Cancelled,
}

pub const AUCTION_COUNT: Item<u64> = Item::new("auction_count");
pub const AUCTIONS: Map<u64, Auction> = Map::new("auctions");
pub const REPUTATION: Map<String, Reputation> = Map::new("reputation");
pub const CONFIG: Item<Config> = Item::new("config");

// ✅ NEW: Store bids individually to prevent memory errors
// Key: (auction_id, bidder_address)
pub const BIDS: Map<(u64, &str), Bid> = Map::new("bids");

// Track bid count per auction for pagination
pub const BID_COUNT: Map<u64, u64> = Map::new("bid_count");
