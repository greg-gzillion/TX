use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
    Addr,
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub admin: String,
    pub insurance_pool: String,
    pub token_denom: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    PlaceBid {
        auction_id: u64,
    },
    CloseAuction {
        auction_id: u64,
    },
    ClaimWinnings {
        auction_id: u64,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetAuction { auction_id: u64 },
    GetHighBid { auction_id: u64 },
}

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    // Store admin address
    let admin = deps.api.addr_validate(&msg.admin)?;
    
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", admin)
        .add_attribute("insurance_pool", msg.insurance_pool)
        .add_attribute("token_denom", msg.token_denom)
        .add_attribute("sender", info.sender))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::PlaceBid { auction_id } => {
            Ok(Response::new()
                .add_attribute("method", "place_bid")
                .add_attribute("auction_id", auction_id.to_string())
                .add_attribute("sender", info.sender)
                .add_attribute("amount", info.funds[0].to_string()))
        }
        ExecuteMsg::CloseAuction { auction_id } => {
            Ok(Response::new()
                .add_attribute("method", "close_auction")
                .add_attribute("auction_id", auction_id.to_string())
                .add_attribute("sender", info.sender))
        }
        ExecuteMsg::ClaimWinnings { auction_id } => {
            Ok(Response::new()
                .add_attribute("method", "claim_winnings")
                .add_attribute("auction_id", auction_id.to_string())
                .add_attribute("sender", info.sender))
        }
    }
}

#[entry_point]
pub fn query(
    deps: Deps,
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
            cosmwasm_std::to_json_binary(&response)
        }
        QueryMsg::GetHighBid { auction_id } => {
            let response = BidResponse {
                auction_id,
                bidder: "none".to_string(),
                amount: "0".to_string(),
            };
            cosmwasm_std::to_json_binary(&response)
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct AuctionResponse {
    pub auction_id: u64,
    pub active: bool,
    pub highest_bidder: String,
    pub highest_bid: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct BidResponse {
    pub auction_id: u64,
    pub bidder: String,
    pub amount: String,
}
