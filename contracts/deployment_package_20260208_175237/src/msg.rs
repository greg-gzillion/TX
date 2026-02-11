use cosmwasm_std::Uint128;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::state::Auction;

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
        metal_type: String,
        product_form: String,
        weight: u32,
        starting_price: Uint128,
        reserve_price: Option<Uint128>,
        buy_now_price: Option<Uint128>,
        duration_hours: u64,
    },
    PlaceBid {
        auction_id: u64,
        amount: Uint128,
    },
    EndAuction {
        auction_id: u64,
    },
    ReleaseFunds {
        auction_id: u64,
    },
    CancelAuction {
        auction_id: u64,
    },
    BuyNow {
        auction_id: u64,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetConfig {},
    GetAuction {
        id: u64,
    },
    ListAuctions {
        start_after: Option<u64>,
        limit: Option<u32>,
    },
    GetCompletedAuctions {
        start_after: Option<u64>,
        limit: Option<u32>,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ConfigResponse {
    pub admin: cosmwasm_std::Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct AuctionResponse {
    pub auction: Auction,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct AuctionsResponse {
    pub auctions: Vec<Auction>,
}
