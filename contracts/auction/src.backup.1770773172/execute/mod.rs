use cosmwasm_std::{DepsMut, Env, MessageInfo, Response, StdResult};

use crate::msg::ExecuteMsg;

pub mod bid;
pub mod buy_now;
pub mod create;
pub mod settle;

pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::CreateAuction {
            item_id,
            reserve_price,
            buy_it_now_price,
            duration,
        } => create::execute_create_auction(deps, env, info, item_id, reserve_price, buy_it_now_price, duration),
        ExecuteMsg::PlaceBid { auction_id } => bid::execute_place_bid(deps, env, info, auction_id),
        ExecuteMsg::BuyItNow { auction_id } => buy_now::execute_buy_it_now(deps, env, info, auction_id),
        ExecuteMsg::SettleAuction { auction_id } => settle::execute_settle_auction(deps, env, info, auction_id),
    }
}
