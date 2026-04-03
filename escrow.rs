// PhoenixPME Escrow Contract
use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env,
    MessageInfo, Response, StdResult, Uint128
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub seller: String,
    pub buyer: String,
    pub collateral_percent: u64,
}

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("seller", msg.seller)
        .add_attribute("buyer", msg.buyer)
        .add_attribute("collateral_percent", msg.collateral_percent.to_string()))
}
