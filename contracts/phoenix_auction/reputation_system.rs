// Reputation System for PhoenixPME
// TRUST and DONT_TRUST soul-bound tokens

use cosmwasm_std::{entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub trust_token_id: String,
    pub dont_trust_token_id: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum ExecuteMsg {
    AwardTrust { recipient: String, auction_id: String },
    AwardDontTrust { recipient: String, auction_id: String },
    GetScore { address: String },
}
