use cw_storage_plus::{Item, Map};
use crate::msg::{Auction, Bid, Config};

// Contract configuration
pub const CONFIG: Item<Config> = Item::new("config");

// All auctions, keyed by auction_id (String)
pub const AUCTIONS: Map<&str, Auction> = Map::new("auctions");

// Bids storage: (auction_id, bidder) -> Bid
pub const BIDS: Map<(&str, &str), Bid> = Map::new("bids");

// Next auction ID counter
pub const NEXT_AUCTION_ID: Item<u64> = Item::new("next_auction_id");

// Helper function to generate next auction ID
pub fn next_auction_id(storage: &mut dyn cosmwasm_std::Storage) -> Result<u64, cosmwasm_std::StdError> {
    let id = NEXT_AUCTION_ID.update(storage, |id| Ok::<u64, cosmwasm_std::StdError>(id + 1))?;
    Ok(id)
}
