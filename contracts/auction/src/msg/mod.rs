use cosmwasm_std::{Addr, Uint128};
use cosmwasm_schema::cw_serde;

#[cw_serde]
pub struct InstantiateMsg {
    pub admin: String,
    pub community_reserve_fund: String,
    pub token_denom: String,
}

#[cw_serde]
pub enum ExecuteMsg {
    CreateAuction {
        starting_bid: Uint128,
        duration: u64,
        description: String,
        reserve_price: Option<Uint128>,
        buy_it_now_price: Option<Uint128>,
        seller_collateral: Uint128,
    },
    PlaceBid {
        auction_id: u64,
        amount: String,
    },
    BuyItNow {
        auction_id: u64,
    },
    CloseAuction {
        auction_id: u64,
    },
    ClaimWinnings {
        auction_id: u64,
    },
}

#[cw_serde]
pub enum QueryMsg {
    GetAuction { auction_id: u64 },
    GetHighBid { auction_id: u64 },
}

#[cw_serde]
pub struct AuctionResponse {
    pub id: u64,
    pub seller: Addr,
    pub starting_price: Uint128,
    pub reserve_price: Uint128,
    pub current_bid: Option<Uint128>,
    pub current_bidder: Option<Addr>,
    pub buy_it_now_price: Option<Uint128>,      
    pub has_buy_it_now: bool,                    
    pub end_time: u64,
    pub status: String,
    pub created_at: u64,
    pub seller_collateral: Uint128,
    pub buyer_collateral: Option<Uint128>,
}

#[cw_serde]
pub struct BidResponse {
    pub bidder: Option<Addr>,
    pub amount: Uint128,
}