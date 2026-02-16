use cosmwasm_std::{Addr, Uint128};
use cosmwasm_schema::cw_serde;

#[cw_serde]
pub struct InstantiateMsg {
    pub admin: String,
    pub fee_percentage: u64,
    pub fee_address: String,
    pub require_kyc: Option<bool>,
}

#[cw_serde]
pub enum ExecuteMsg {
    CreateAuction {
        item_id: String,
        starting_price: Uint128,
        reserve_price: Option<Uint128>,
        buy_now_price: Option<Uint128>,
        duration_hours: u64,
    },
    PlaceBid {
        auction_id: u64,
    },
    BuyNow {
        auction_id: u64,
    },
    EndAuction {
        auction_id: u64,
    },
    CancelAuction {
        auction_id: u64,
    },
    ReleaseFunds {
        auction_id: u64,
    },
    VerifyUser {
        address: String,
    },
    RevokeVerification {
        address: String,
    },
}

#[cw_serde]
pub enum QueryMsg {
    Config {},
    Auction { id: u64 },
    ListAuctions {
        start_after: Option<u64>,
        limit: Option<u32>,
        filter_active: Option<bool>,
    },
    ListCompletedAuctions {
        start_after: Option<u64>,
        limit: Option<u32>,
    },
    IsVerified { address: String },
}

#[cw_serde]
pub struct ConfigResponse {
    pub admin: Addr,
    pub fee_percentage: u64,
    pub fee_address: Addr,
    pub require_kyc: bool,
}

#[cw_serde]
pub struct AuctionResponse {
    pub id: u64,
    pub auction: crate::state::Auction,
}

#[cw_serde]
pub struct ListAuctionsResponse {
    pub auctions: Vec<AuctionResponse>,
}

#[cw_serde]
pub struct ListCompletedAuctionsResponse {
    pub auctions: Vec<AuctionResponse>,
}
