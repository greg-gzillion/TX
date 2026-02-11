use cosmwasm_std::{entry_point, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, to_binary};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct InstantiateMsg {
    pub admin: String,
    pub insurance_pool: String,
    pub token_denom: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    PlaceBid { auction_id: u64, amount: String },
    CloseAuction { auction_id: u64 },
    ClaimWinnings { auction_id: u64 },
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetAuction { auction_id: u64 },
    GetHighBid { auction_id: u64 },
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AuctionResponse {
    pub auction_id: u64,
    pub active: bool,
    pub highest_bidder: String,
    pub highest_bid: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct BidResponse {
    pub auction_id: u64,
    pub bidder: String,
    pub amount: String,
}

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let admin = deps.api.addr_validate(&msg.admin)?;
    let insurance_pool = deps.api.addr_validate(&msg.insurance_pool)?;
    
    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("admin", admin)
        .add_attribute("insurance_pool", insurance_pool)
        .add_attribute("token_denom", msg.token_denom))
}

#[entry_point]
pub fn execute(
    _deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::PlaceBid { auction_id, amount } => Ok(Response::new()
            .add_attribute("action", "place_bid")
            .add_attribute("auction_id", auction_id.to_string())
            .add_attribute("amount", amount)
            .add_attribute("sender", info.sender)),
        ExecuteMsg::CloseAuction { auction_id } => Ok(Response::new()
            .add_attribute("action", "close_auction")
            .add_attribute("auction_id", auction_id.to_string())
            .add_attribute("sender", info.sender)),
        ExecuteMsg::ClaimWinnings { auction_id } => Ok(Response::new()
            .add_attribute("action", "claim_winnings")
            .add_attribute("auction_id", auction_id.to_string())
            .add_attribute("sender", info.sender)),
    }
}

#[entry_point]
pub fn query(
    _deps: Deps,
    _env: Env,
    msg: QueryMsg,
) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetAuction { auction_id } => {
            let resp = AuctionResponse {
                auction_id,
                active: true,
                highest_bidder: "none".to_string(),
                highest_bid: "0".to_string(),
            };
            Ok(to_binary(&resp)?)
        }
        QueryMsg::GetHighBid { auction_id } => {
            let resp = BidResponse {
                auction_id,
                bidder: "none".to_string(),
                amount: "0".to_string(),
            };
            Ok(to_binary(&resp)?)
        }
    }
}
