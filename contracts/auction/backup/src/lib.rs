use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
};

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: (),
) -> StdResult<Response> {
    Ok(Response::default())
}

#[entry_point]
pub fn execute(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: (),
) -> StdResult<Response> {
    Ok(Response::default())
}

#[entry_point]
pub fn query(
    _deps: Deps,
    _env: Env,
    _msg: (),
) -> StdResult<Binary> {
    Ok(Binary::default())
}
