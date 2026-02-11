use crate::msg::ConfigResponse;
use crate::state::CONFIG;
use cosmwasm_std::{Deps, StdResult};

pub fn query_config(deps: Deps) -> StdResult<ConfigResponse> {
    let config = CONFIG.load(deps.storage)?;
    Ok(ConfigResponse {
        admin: config.admin,
        insurance_pool: config.insurance_pool,
        token_denom: config.token_denom,
    })
}
