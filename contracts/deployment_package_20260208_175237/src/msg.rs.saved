use cosmwasm_std::Uint128;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use crate::state::{MetalType, ProductForm, WeightUnit};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct InstantiateMsg {
    pub admin: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    CreateAuction {
        item_id: String,
        description: String,
        
        // Metal Details
        metal_type: MetalType,
        product_form: ProductForm,
        weight: u64,
        weight_unit: WeightUnit,
        purity_percent: u8,
        brand: Option<String>,
        year: Option<u16>,
        
        // Professional Grading
        graded: bool,
        grade: Option<String>,
        cert_number: Option<String>,
        
        // Auction Details
        starting_price: Uint128,
        reserve_price: Option<Uint128>,
        duration_hours: u64,
    },
    PlaceBid {
        auction_id: u64,
        amount: Uint128,
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
    GetAuctionsByMetal {
        metal_type: MetalType,
    },
    GetAuctionsByForm {
        product_form: ProductForm,
    },
    GetAuctionsByMetalAndForm {
        metal_type: MetalType,
        product_form: ProductForm,
    },
    GetGradedAuctions {
        graded: bool,
    },
    GetAuctionCount {},
}
