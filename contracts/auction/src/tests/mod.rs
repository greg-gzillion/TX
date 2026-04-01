use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{coins, Uint128};

use crate::contract::{instantiate, execute};
use crate::msg::{InstantiateMsg, ExecuteMsg};

// Helper to create a valid bech32 address for testing
fn valid_addr(name: &str) -> String {
    // Mock environment accepts any string, but addr_validate expects a bech32 format
    // Use a simple format that addr_validate might accept in mock_dependencies
    format!("{}", name)
}

#[test]
fn test_instantiate() {
    let mut deps = mock_dependencies();
    let env = mock_env();
    let info = mock_info("creator", &coins(1000, "utestcore"));
    let msg = InstantiateMsg {
        admin: "admin".to_string(),
        community_reserve_fund: "reserve".to_string(),
        token_denom: "utestcore".to_string(),
    };
    let res = instantiate(deps.as_mut(), env, info, msg);
    // addr_validate in mock_dependencies expects a simple string
    // It might actually work with simple strings
    assert!(res.is_ok(), "Instantiate failed: {:?}", res.err());
}

#[test]
fn test_create_auction() {
    let mut deps = mock_dependencies();
    let env = mock_env();
    let info = mock_info("admin", &coins(1000, "utestcore"));
    let instantiate_msg = InstantiateMsg {
        admin: "admin".to_string(),
        community_reserve_fund: "reserve".to_string(),
        token_denom: "utestcore".to_string(),
    };
    let res = instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg);
    assert!(res.is_ok(), "Instantiate failed: {:?}", res.err());
    
    let create_msg = ExecuteMsg::CreateAuction {
        starting_bid: Uint128::from(100u128),
        duration: 86400,
        description: "Test auction".to_string(),
        reserve_price: None,
        buy_it_now_price: None,
        seller_collateral: Uint128::from(10u128),
    };
    let seller_info = mock_info("seller", &coins(10, "utestcore"));
    let result = execute(deps.as_mut(), env, seller_info, create_msg);
    assert!(result.is_ok(), "Create auction failed: {:?}", result.err());
}

#[test]
fn test_place_bid() {
    let mut deps = mock_dependencies();
    let env = mock_env();
    let info = mock_info("admin", &coins(1000, "utestcore"));
    let instantiate_msg = InstantiateMsg {
        admin: "admin".to_string(),
        community_reserve_fund: "reserve".to_string(),
        token_denom: "utestcore".to_string(),
    };
    let res = instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg);
    assert!(res.is_ok(), "Instantiate failed: {:?}", res.err());
    
    let create_msg = ExecuteMsg::CreateAuction {
        starting_bid: Uint128::from(100u128),
        duration: 86400,
        description: "Test auction".to_string(),
        reserve_price: None,
        buy_it_now_price: None,
        seller_collateral: Uint128::from(10u128),
    };
    let seller_info = mock_info("seller", &coins(10, "utestcore"));
    let create_result = execute(deps.as_mut(), env.clone(), seller_info, create_msg);
    assert!(create_result.is_ok(), "Create auction failed: {:?}", create_result.err());
    
    let bid_msg = ExecuteMsg::PlaceBid {
        auction_id: 1,
        amount: "150".to_string(),
    };
    let bidder_info = mock_info("bidder", &coins(150, "utestcore"));
    let bid_result = execute(deps.as_mut(), env, bidder_info, bid_msg);
    assert!(bid_result.is_ok(), "Place bid failed: {:?}", bid_result.err());
}

#[test]
fn test_buy_it_now() {
    let mut deps = mock_dependencies();
    let env = mock_env();
    let info = mock_info("admin", &coins(1000, "utestcore"));
    let instantiate_msg = InstantiateMsg {
        admin: "admin".to_string(),
        community_reserve_fund: "reserve".to_string(),
        token_denom: "utestcore".to_string(),
    };
    let res = instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg);
    assert!(res.is_ok(), "Instantiate failed: {:?}", res.err());
    
    let create_msg = ExecuteMsg::CreateAuction {
        starting_bid: Uint128::from(100u128),
        duration: 86400,
        description: "Test auction with buy now".to_string(),
        reserve_price: None,
        buy_it_now_price: Some(Uint128::from(200u128)),
        seller_collateral: Uint128::from(10u128),
    };
    let seller_info = mock_info("seller", &coins(10, "utestcore"));
    let create_result = execute(deps.as_mut(), env.clone(), seller_info, create_msg);
    assert!(create_result.is_ok(), "Create auction failed: {:?}", create_result.err());
    
    let buy_msg = ExecuteMsg::BuyItNow { auction_id: 1 };
    let buyer_info = mock_info("buyer", &coins(200, "utestcore"));
    let buy_result = execute(deps.as_mut(), env, buyer_info, buy_msg);
    assert!(buy_result.is_ok(), "Buy it now failed: {:?}", buy_result.err());
}

#[test]
fn test_end_to_end_auction_flow() {
    let mut deps = mock_dependencies();
    let env = mock_env();
    
    let admin = mock_info("admin", &coins(1000, "utestcore"));
    let instantiate_msg = InstantiateMsg {
        admin: "admin".to_string(),
        community_reserve_fund: "reserve".to_string(),
        token_denom: "utestcore".to_string(),
    };
    let res = instantiate(deps.as_mut(), env.clone(), admin, instantiate_msg);
    assert!(res.is_ok(), "Instantiate failed: {:?}", res.err());
    
    let seller = mock_info("seller", &coins(10, "utestcore"));
    let create_msg = ExecuteMsg::CreateAuction {
        starting_bid: Uint128::from(100u128),
        duration: 86400,
        description: "1oz Gold Eagle".to_string(),
        reserve_price: None,
        buy_it_now_price: None,
        seller_collateral: Uint128::from(10u128),
    };
    let create_result = execute(deps.as_mut(), env.clone(), seller, create_msg);
    assert!(create_result.is_ok(), "Create auction failed: {:?}", create_result.err());
    
    let alice = mock_info("alice", &coins(150, "utestcore"));
    let bid_msg1 = ExecuteMsg::PlaceBid {
        auction_id: 1,
        amount: "150".to_string(),
    };
    let bid1_result = execute(deps.as_mut(), env.clone(), alice, bid_msg1);
    assert!(bid1_result.is_ok(), "First bid failed: {:?}", bid1_result.err());
    
    let bob = mock_info("bob", &coins(200, "utestcore"));
    let bid_msg2 = ExecuteMsg::PlaceBid {
        auction_id: 1,
        amount: "200".to_string(),
    };
    let bid2_result = execute(deps.as_mut(), env.clone(), bob, bid_msg2);
    assert!(bid2_result.is_ok(), "Second bid failed: {:?}", bid2_result.err());
    
    let closer = mock_info("admin", &[]);
    let close_msg = ExecuteMsg::CloseAuction { auction_id: 1 };
    let close_result = execute(deps.as_mut(), env.clone(), closer, close_msg);
    assert!(close_result.is_ok(), "Close auction failed: {:?}", close_result.err());
    
    let winner = mock_info("bob", &[]);
    let claim_msg = ExecuteMsg::ClaimWinnings { auction_id: 1 };
    let claim_result = execute(deps.as_mut(), env, winner, claim_msg);
    assert!(claim_result.is_ok(), "Claim winnings failed: {:?}", claim_result.err());
}
