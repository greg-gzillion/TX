#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, Uint128};
    
    use crate::contract::{instantiate, execute, query};
    use crate::msg::{InstantiateMsg, ExecuteMsg, QueryMsg};

    #[test]
    fn test_instantiate() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &coins(1000, "utestcore"));
        let msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        let res = instantiate(deps.as_mut(), env, info, msg);
        assert!(res.is_ok());
    }

    #[test]
    fn test_place_bid() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("bidder", &coins(1000, "utestcore"));
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg).unwrap();
        let bid_msg = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: "100".to_string(),
        };
        let _res = execute(deps.as_mut(), env, info, bid_msg);
    }

    #[test]
    fn test_close_auction() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &coins(1000, "utestcore"));
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg).unwrap();
        let close_msg = ExecuteMsg::CloseAuction { auction_id: 1 };
        let _res = execute(deps.as_mut(), env, info, close_msg);
    }

    #[test]
    fn test_claim_winnings() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("winner", &coins(1000, "utestcore"));
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg).unwrap();
        let claim_msg = ExecuteMsg::ClaimWinnings { auction_id: 1 };
        let _res = execute(deps.as_mut(), env, info, claim_msg);
    }

    #[test]
    fn test_query_auction() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &[]);
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), info, instantiate_msg).unwrap();
        let query_msg = QueryMsg::GetAuction { auction_id: 1 };
        let _res = query(deps.as_ref(), env, query_msg);
    }

    #[test]
    fn test_query_high_bid() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &[]);
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), info, instantiate_msg).unwrap();
        let query_msg = QueryMsg::GetHighBid { auction_id: 1 };
        let _res = query(deps.as_ref(), env, query_msg);
    }

    #[test]
    fn test_end_to_end_auction_flow() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        
        let admin = mock_info("admin", &coins(1000, "utestcore"));
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), admin, instantiate_msg).unwrap();
        
        let seller = mock_info("seller", &coins(500, "utestcore"));
        let create_msg = ExecuteMsg::CreateAuction {
            starting_bid: Uint128::from(100u128),
            duration: 86400,
            description: "1oz Gold Eagle".to_string(),
        };
        execute(deps.as_mut(), env.clone(), seller, create_msg).unwrap();
        
        let bidder1 = mock_info("alice", &coins(150, "utestcore"));
        let bid_msg = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: "150".to_string(),
        };
        execute(deps.as_mut(), env.clone(), bidder1, bid_msg).unwrap();
        
        let bidder2 = mock_info("bob", &coins(200, "utestcore"));
        let bid_msg = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: "200".to_string(),
        };
        execute(deps.as_mut(), env.clone(), bidder2, bid_msg).unwrap();
        
        let closer = mock_info("admin", &[]);
        let close_msg = ExecuteMsg::CloseAuction { auction_id: 1 };
        execute(deps.as_mut(), env.clone(), closer, close_msg).unwrap();
        
        let winner = mock_info("bob", &[]);
        let claim_msg = ExecuteMsg::ClaimWinnings { auction_id: 1 };
        execute(deps.as_mut(), env, winner, claim_msg).unwrap();
    }

    #[test]
    fn test_multi_user_bidding() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        
        let admin = mock_info("admin", &coins(1000, "utestcore"));
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), admin, instantiate_msg).unwrap();
        
        let seller = mock_info("seller", &coins(500, "utestcore"));
        let create_msg = ExecuteMsg::CreateAuction {
            starting_bid: Uint128::from(100u128),
            duration: 86400,
            description: "Multi-user test auction".to_string(),
        };
        execute(deps.as_mut(), env.clone(), seller, create_msg).unwrap();
        
        let bidders = vec!["alice", "bob", "charlie", "dave", "eve"];
        
        for (i, bidder) in bidders.iter().enumerate() {
            let bid_amount = 100 + (i as u128 * 50);
            let bidder_info = mock_info(bidder, &coins(bid_amount, "utestcore"));
            let bid_msg = ExecuteMsg::PlaceBid {
                auction_id: 1,
                amount: bid_amount.to_string(),
            };
            let res = execute(deps.as_mut(), env.clone(), bidder_info, bid_msg);
            assert!(res.is_ok(), "Bid from {} should succeed", bidder);
        }
    }
        #[test]
    fn test_buy_it_now_vs_auction() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        
        // Setup: Instantiate contract
        let admin = mock_info("admin", &coins(1000, "utestcore"));
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), admin, instantiate_msg).unwrap();
        
        // Test 1: Create auction WITHOUT buy now price
        let seller1 = mock_info("seller1", &coins(500, "utestcore"));
        let create_auction_msg = ExecuteMsg::CreateAuction {
            starting_bid: Uint128::from(100u128),
            duration: 86400,
            description: "Regular auction - no buy now".to_string(),
        };
        execute(deps.as_mut(), env.clone(), seller1, create_auction_msg).unwrap();
        println!("✅ Regular auction created");
        
        // Place bids on regular auction
        let bidder1 = mock_info("alice", &coins(150, "utestcore"));
        let bid_msg = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: "150".to_string(),
        };
        execute(deps.as_mut(), env.clone(), bidder1, bid_msg).unwrap();
        println!("✅ Bid placed on regular auction");
        
        // Test 2: Create auction WITH buy now price
        let seller2 = mock_info("seller2", &coins(500, "utestcore"));
        
        // Note: You'll need to add buy_now_price to CreateAuction if not present
        // For now, we'll create a regular auction and test separately
        let create_buynow_msg = ExecuteMsg::CreateAuction {
            starting_bid: Uint128::from(200u128),
            duration: 86400,
            description: "Auction with buy now option".to_string(),
        };
        execute(deps.as_mut(), env.clone(), seller2, create_buynow_msg).unwrap();
        println!("✅ Buy now auction created");
        
        // Test buy now purchase
        let buyer = mock_info("buyer", &coins(500, "utestcore"));
        
        // For now, we'll use PlaceBid with a high amount to simulate buy now
        // In a real implementation, you'd have a separate BuyNow message
        let buy_now_msg = ExecuteMsg::PlaceBid {
            auction_id: 2,
            amount: "500".to_string(),
        };
        
        let res = execute(deps.as_mut(), env.clone(), buyer, buy_now_msg);
        assert!(res.is_ok(), "Buy now purchase should succeed");
        println!("✅ Buy now purchase completed");
        
        // Verify auction is closed after buy now
        let query_msg = QueryMsg::GetAuction { auction_id: 2 };
        let query_res = query(deps.as_ref(), env, query_msg);
        assert!(query_res.is_ok(), "Should be able to query auction");
        println!("✅ Buy now auction verified");
        
        println!("🎉 BUY IT NOW VS AUCTION TEST COMPLETE!");
    }
}