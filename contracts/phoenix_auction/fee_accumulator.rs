// Fee Accumulator for PhoenixPME
// Collects fees from auctions for Community Reserve Fund

use cosmwasm_std::{entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub fee_percent: u64,  // 1% = 1
    pub community_fund: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum ExecuteMsg {
    RecordFee { auction_id: String, amount: Uint128 },
    DistributeFees {},
}

#[entry_point]
pub fn instantiate(deps: DepsMut, env: Env, info: MessageInfo, msg: InstantiateMsg) -> StdResult<Response> {
    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("fee_percent", msg.fee_percent.to_string()))
}
