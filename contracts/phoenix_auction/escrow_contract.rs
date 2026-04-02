// Auction Escrow Contract for PhoenixPME
// 10% collateral from both parties, held until conditions met

use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env,
    MessageInfo, Response, StdResult, Uint128, Addr, Timestamp
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub seller: String,
    pub buyer: String,
    pub auction_id: String,
    pub collateral_percent: u64,  // 10
    pub release_days: u64,         // days until auto-release
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum ExecuteMsg {
    DepositCollateral {},
    ReleaseToSeller {},
    ReleaseToBuyer {},
    RaiseDispute {},
    ResolveDispute { winner: String },
}

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("auction_id", msg.auction_id)
        .add_attribute("collateral_percent", msg.collateral_percent.to_string()))
}
