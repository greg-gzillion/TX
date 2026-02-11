use cosmwasm_std::{DepsMut, MessageInfo, Response, StdResult, Env};

use crate::msg::{Config, InstantiateMsg};
use crate::state::CONFIG;

pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let admin = deps.api.addr_validate(&msg.admin)?.to_string();
    let insurance_pool = deps.api.addr_validate(&msg.insurance_pool)?.to_string();
    
    let config = Config {
        admin,
        insurance_pool,
        token_denom: msg.token_denom,
    };
    
    CONFIG.save(deps.storage, &config)?;
    
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", config.admin.clone())
        .add_attribute("insurance_pool", config.insurance_pool.clone())
        .add_attribute("token_denom", config.token_denom.clone()))
}
