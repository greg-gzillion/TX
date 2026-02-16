use cosmwasm_std::{Addr, Uint128};
use cosmwasm_schema::cw_serde;

#[cw_serde]
pub struct InstantiateMsg {
    pub admin: String,
    pub insurance_pool: String,
    pub token_denom: String,
}

#[cw_serde]
pub enum ExecuteMsg {
    CreateAuction {
        starting_bid: Uint128,
        duration: u64,
        description: String,
    },
    PlaceBid {
        auction_id: u64,
        amount: String,
    },
    CloseAuction {
        auction_id: u64,
    },
    ClaimWinnings {
        auction_id: u64,
    },
}

#[cw_serde]
pub enum QueryMsg {
    GetAuction { auction_id: u64 },
    GetHighBid { auction_id: u64 },
}

#[cw_serde]
pub struct AuctionResponse {
    pub auction_id: u64,
    pub active: bool,
    pub highest_bidder: String,
    pub highest_bid: String,
}

#[cw_serde]
pub struct BidResponse {
    pub bidder: Option<Addr>,
    pub amount: Uint128,
}