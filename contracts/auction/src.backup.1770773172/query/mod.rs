use cosmwasm_std::{to_binary, Binary, Deps, Env, StdResult};

use crate::msg::QueryMsg;

pub mod auction;
pub mod config;

pub fn query(
    deps: Deps,
    _env: Env,
    msg: QueryMsg,
) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetAuction { auction_id } => {
            let res = auction::query_auction(deps, auction_id)?;
            to_binary(&res)
        }
        QueryMsg::ListAuctions { start_after, limit } => {
            let res = auction::query_list_auctions(deps, start_after, limit)?;
            to_binary(&res)
        }
        QueryMsg::GetConfig {} => {
            let res = config::query_config(deps)?;
            to_binary(&res)
        }
    }
}
