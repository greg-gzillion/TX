use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
};
use cosmwasm_schema::{cw_serde, QueryResponses};
use cw2::set_contract_version;

const CONTRACT_NAME: &str = "crates.io:phoenix-auction";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cw_serde]
pub struct InstantiateMsg {
    pub admin: String,
    pub insurance_pool: String,
    pub token_denom: String,
}

#[cw_serde]
pub enum ExecuteMsg {
    PlaceBid { auction_id: u64 },
    CloseAuction { auction_id: u64 },
    ClaimWinnings { auction_id: u64 },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(AuctionResponse)]
    GetAuction { auction_id: u64 },
    #[returns(BidResponse)]
    GetHighBid { auction_id: u64 },
}

#[cw_serde]
pub struct AuctionResponse {
    pub auction_id: u64,
    pub active: bool,
    pub highest_bidder: String,
    pub highest_bid: String,
}

#[cw_serde]
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
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    
    let admin = deps.api.addr_validate(&msg.admin)?;
    let insurance_pool = deps.api.addr_validate(&msg.insurance_pool)?;
    
    Ok(Response::new()
        .add_attribute("method", "instantiate")
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
        ExecuteMsg::PlaceBid { auction_id } => Ok(Response::new()
            .add_attribute("method", "place_bid")
            .add_attribute("auction_id", auction_id.to_string())
            .add_attribute("sender", info.sender)),
        ExecuteMsg::CloseAuction { auction_id } => Ok(Response::new()
            .add_attribute("method", "close_auction")
            .add_attribute("auction_id", auction_id.to_string())
            .add_attribute("sender", info.sender)),
        ExecuteMsg::ClaimWinnings { auction_id } => Ok(Response::new()
            .add_attribute("method", "claim_winnings")
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
            let response = AuctionResponse {
                auction_id,
                active: true,
                highest_bidder: "none".to_string(),
                highest_bid: "0".to_string(),
            };
            Ok(cosmwasm_std::to_json_binary(&response)?)
        }
        QueryMsg::GetHighBid { auction_id } => {
            let response = BidResponse {
                auction_id,
                bidder: "none".to_string(),
                amount: "0".to_string(),
            };
            Ok(cosmwasm_std::to_json_binary(&response)?)
        }
    }
}
