use cosmwasm_std::Uint128;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

// ==================== YOUR MAINNET WALLET ====================
pub const DEVELOPER_WALLET: &str = "core1mj58cdfrkc8uyunw2rna3wvkatdjfhd6lwtu0m";

// ==================== DATA STRUCTURES ====================
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Auction {
    pub seller: String,
    pub item_id: String,
    pub description: String,
    pub starting_price: Uint128,
    pub reserve_price: Option<Uint128>,
    pub start_time: u64,
    pub end_time: u64,
    pub current_bid: Option<Bid>,
    pub bids: Vec<Bid>,
    pub status: AuctionStatus,
    pub escrow_released: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Bid {
    pub bidder: String,
    pub amount: Uint128,
    pub timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum AuctionStatus {
    Active,
    Ended,
    Cancelled,
}

// ==================== STORAGE ====================
use cw_storage_plus::{Item, Map};

// Counter for auction IDs
pub const AUCTION_COUNT: Item<u64> = Item::new("auction_count");

// Store all auctions by ID
pub const AUCTIONS: Map<u64, Auction> = Map::new("auctions");
