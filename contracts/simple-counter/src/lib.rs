use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, 
    Response, StdResult, to_json_binary
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub count: i32,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Increment {},
    Reset { count: i32 },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetCount {},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CountResponse {
    pub count: i32,
}

const COUNT_KEY: &[u8] = b"count";

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    deps.storage.set(COUNT_KEY, &msg.count.to_le_bytes());
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("count", msg.count.to_string()))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::Increment {} => {
            let data = deps.storage.get(COUNT_KEY).unwrap_or(vec![0; 4]);
            let mut count = i32::from_le_bytes(data.try_into().unwrap_or([0; 4]));
            count += 1;
            deps.storage.set(COUNT_KEY, &count.to_le_bytes());
            Ok(Response::new().add_attribute("count", count.to_string()))
        }
        ExecuteMsg::Reset { count } => {
            deps.storage.set(COUNT_KEY, &count.to_le_bytes());
            Ok(Response::new().add_attribute("count", count.to_string()))
        }
    }
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetCount {} => {
            let data = deps.storage.get(COUNT_KEY).unwrap_or(vec![0; 4]);
            let count = i32::from_le_bytes(data.try_into().unwrap_or([0; 4]));
            to_json_binary(&CountResponse { count })
        }
    }
}
