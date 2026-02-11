use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, 
    Response, StdResult, to_binary, Addr
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct InstantiateMsg {
    pub admin: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    PlaceBid {},
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetHighestBid {},
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct BidResponse {
    pub amount: String,
    pub bidder: String,
}

// Storage using cosmwasm-std storage (simplest approach)
use cosmwasm_std::Storage;
use std::cell::RefCell;

thread_local! {
    static STORAGE: RefCell<Option<BidResponse>> = RefCell::new(None);
}

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let admin = deps.api.addr_validate(&msg.admin)?;
    
    // Store initial state
    let initial_bid = BidResponse {
        amount: "0".to_string(),
        bidder: admin.to_string(),
    };
    
    // Simple storage approach
    STORAGE.with(|s| {
        *s.borrow_mut() = Some(initial_bid);
    });
    
    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("admin", msg.admin))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::PlaceBid {} => {
            // Get funds (simplified)
            let amount = info.funds.get(0)
                .map(|coin| coin.amount.to_string())
                .unwrap_or_else(|| "0".to_string());
            
            // Update storage
            let new_bid = BidResponse {
                amount: amount.clone(),
                bidder: info.sender.to_string(),
            };
            
            STORAGE.with(|s| {
                *s.borrow_mut() = Some(new_bid);
            });
            
            Ok(Response::new()
                .add_attribute("action", "place_bid")
                .add_attribute("sender", info.sender)
                .add_attribute("amount", amount))
        }
    }
}

#[entry_point]
pub fn query(
    _deps: Deps,
    _env: Env,
    msg: QueryMsg,
) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetHighestBid {} => {
            let response = STORAGE.with(|s| {
                s.borrow().clone().unwrap_or_else(|| BidResponse {
                    amount: "0".to_string(),
                    bidder: "none".to_string(),
                })
            });
            Ok(to_binary(&response)?)
        }
    }
}
