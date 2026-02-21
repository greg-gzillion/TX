use cosmwasm_std::Uint128;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub admin: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    CreateAuction {
        item_id: String,
        description: String,
        starting_price: Uint128,
        reserve_price: Uint128,        // ← ADD THIS
        duration_hours: u64,
    },
    PlaceBid {
        auction_id: u64,
    },
    EndAuction {
        auction_id: u64,
    },
    ReleaseEscrow {
        auction_id: u64,
    },
    CancelAuction {
        auction_id: u64,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetAuction {
        auction_id: u64,
    },
    GetActiveAuctions {},
    GetAuctionCount {},
}

// ============ RESPONSE TYPES ============
use crate::state::{Auction, Config};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ConfigResponse {
    pub config: Config,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct AuctionResponse {
    pub auction: Auction,
}
