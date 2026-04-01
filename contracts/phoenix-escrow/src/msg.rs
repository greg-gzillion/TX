use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Uint128;

#[cw_serde]
pub struct InstantiateMsg {
    pub owner: String,
    pub community_reserve_fund: String,
    pub fee_bps: Option<u64>,
    pub inspection_period: Option<u64>,
}

#[cw_serde]
pub enum ExecuteMsg {
    CreateAuction {
        item_id: String,
        description: String,
        starting_price: Uint128,
        reserve_price: Uint128,
        duration_hours: u64,
    },
    PlaceBid {
        auction_id: u64,
    },
    EndAuction {
        auction_id: u64,
    },
    ApproveInspection {
        auction_id: u64,
    },
    RejectInspection {
        auction_id: u64,
        reason: String,
    },
    ReleaseEscrow {
        auction_id: u64,
    },
    CancelAuction {
        auction_id: u64,
    },
    ClaimRefund {
        auction_id: u64,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(AuctionResponse)]
    GetAuction { auction_id: u64 },
    #[returns(ReputationResponse)]
    GetReputation { address: String },
}

#[cw_serde]
pub struct AuctionResponse {
    pub auction: crate::state::Auction,
}

#[cw_serde]
pub struct ReputationResponse {
    pub reputation: crate::state::Reputation,
}
