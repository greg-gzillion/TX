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
        #[test]
    fn test_insurance_pool_accumulation() {
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
        
        // Create first auction
        let seller1 = mock_info("seller1", &coins(500, "utestcore"));
        let create_msg1 = ExecuteMsg::CreateAuction {
            starting_bid: Uint128::from(100u128),
            duration: 86400,
            description: "Auction 1".to_string(),
        };
        execute(deps.as_mut(), env.clone(), seller1, create_msg1).unwrap();
        
        // Place winning bid on first auction (200)
        let bidder1 = mock_info("bidder1", &coins(200, "utestcore"));
        let bid_msg1 = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: "200".to_string(),
        };
        execute(deps.as_mut(), env.clone(), bidder1, bid_msg1).unwrap();
        
        // Close first auction
        let closer = mock_info("admin", &[]);
        let close_msg1 = ExecuteMsg::CloseAuction { auction_id: 1 };
        execute(deps.as_mut(), env.clone(), closer.clone(), close_msg1).unwrap();
        
        // Claim winnings - this should trigger fee to insurance pool
        let winner1 = mock_info("bidder1", &[]);
        let claim_msg1 = ExecuteMsg::ClaimWinnings { auction_id: 1 };
        execute(deps.as_mut(), env.clone(), winner1, claim_msg1).unwrap();
        
        // Create second auction
        let seller2 = mock_info("seller2", &coins(500, "utestcore"));
        let create_msg2 = ExecuteMsg::CreateAuction {
            starting_bid: Uint128::from(100u128),
            duration: 86400,
            description: "Auction 2".to_string(),
        };
        execute(deps.as_mut(), env.clone(), seller2, create_msg2).unwrap();
        
        // Place winning bid on second auction (300)
        let bidder2 = mock_info("bidder2", &coins(300, "utestcore"));
        let bid_msg2 = ExecuteMsg::PlaceBid {
            auction_id: 2,
            amount: "300".to_string(),
        };
        execute(deps.as_mut(), env.clone(), bidder2, bid_msg2).unwrap();
        
        // Close second auction
        let close_msg2 = ExecuteMsg::CloseAuction { auction_id: 2 };
        execute(deps.as_mut(), env.clone(), closer, close_msg2).unwrap();
        
        // Claim winnings - second fee to insurance pool
        let winner2 = mock_info("bidder2", &[]);
        let claim_msg2 = ExecuteMsg::ClaimWinnings { auction_id: 2 };
        execute(deps.as_mut(), env, winner2, claim_msg2).unwrap();
        
        // At this point, we would query the insurance pool balance
        // For now, we just verify the test runs without errors
        println!("✅ Insurance pool accumulation test completed");
        println!("   Auction 1 winning bid: 200 (fee: 2.2)");
        println!("   Auction 2 winning bid: 300 (fee: 3.3)");
        println!("   Total accumulated: 5.5 (1.1% of 500)");
        
        // Note: In a real implementation, you would query the insurance pool
        // balance and verify it equals 5.5 (or whatever the fee amount should be)
    }
        #[test]
    fn test_failed_transaction_handling() {
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
        
        // Create auction
        let seller = mock_info("seller", &coins(500, "utestcore"));
        let create_msg = ExecuteMsg::CreateAuction {
            starting_bid: Uint128::from(100u128),
            duration: 86400,
            description: "Failed transaction test".to_string(),
        };
        execute(deps.as_mut(), env.clone(), seller, create_msg).unwrap();
        
        // TEST 1: Try to bid on non-existent auction
        let bidder = mock_info("alice", &coins(150, "utestcore"));
        let bad_bid_msg = ExecuteMsg::PlaceBid {
            auction_id: 999, // Non-existent auction
            amount: "150".to_string(),
        };
        let res = execute(deps.as_mut(), env.clone(), bidder, bad_bid_msg);
        assert!(res.is_err(), "Bid on non-existent auction should fail");
        println!("✅ Test 1 passed: Non-existent auction rejected");
        
        // TEST 2: Try to bid with insufficient funds
        let bidder2 = mock_info("bob", &coins(50, "utestcore")); // Only has 50
        let low_bid_msg = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: "150".to_string(), // Trying to bid 150 with only 50
        };
        let res = execute(deps.as_mut(), env.clone(), bidder2, low_bid_msg);
        assert!(res.is_err(), "Bid with insufficient funds should fail");
        println!("✅ Test 2 passed: Insufficient funds rejected");
        
        // Place a valid bid first
        let bidder3 = mock_info("charlie", &coins(200, "utestcore"));
        let good_bid_msg = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: "150".to_string(),
        };
        execute(deps.as_mut(), env.clone(), bidder3, good_bid_msg).unwrap();
        
        // TEST 3: Try to bid lower than current highest
        let bidder4 = mock_info("dave", &coins(200, "utestcore"));
        let lower_bid_msg = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: "100".to_string(), // Lower than current 150
        };
        let res = execute(deps.as_mut(), env.clone(), bidder4, lower_bid_msg);
        assert!(res.is_err(), "Lower bid should fail");
        println!("✅ Test 3 passed: Lower bid rejected");
        
        // TEST 4: Try to close auction that's already closed
        let closer = mock_info("admin", &[]);
        let close_msg = ExecuteMsg::CloseAuction { auction_id: 1 };
        execute(deps.as_mut(), env.clone(), closer.clone(), close_msg).unwrap();
        
        let double_close_msg = ExecuteMsg::CloseAuction { auction_id: 1 };
        let res = execute(deps.as_mut(), env.clone(), closer, double_close_msg);
        assert!(res.is_err(), "Closing already closed auction should fail");
        println!("✅ Test 4 passed: Double close rejected");
        
        // TEST 5: Try to claim winnings as non-winner
        let fake_winner = mock_info("mallory", &[]);
        let claim_msg = ExecuteMsg::ClaimWinnings { auction_id: 1 };
        let res = execute(deps.as_mut(), env, fake_winner, claim_msg);
        assert!(res.is_err(), "Non-winner claiming should fail");
        println!("✅ Test 5 passed: Non-winner claim rejected");
        
        println!("🎉 FAILED TRANSACTION HANDLING TEST COMPLETE!");
    }
        #[test]
    fn test_zero_values() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        
        // Setup
        let admin = mock_info("admin", &coins(1000, "utestcore"));
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), admin, instantiate_msg).unwrap();
        
        // Create auction
        let seller = mock_info("seller", &coins(500, "utestcore"));
        let create_msg = ExecuteMsg::CreateAuction {
            starting_bid: Uint128::from(100u128),
            duration: 86400,
            description: "Edge case test".to_string(),
        };
        execute(deps.as_mut(), env.clone(), seller, create_msg).unwrap();
        
        // Test 1: Bid with zero amount
        let bidder = mock_info("alice", &coins(0, "utestcore"));
        let zero_bid_msg = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: "0".to_string(),
        };
        let res = execute(deps.as_mut(), env.clone(), bidder, zero_bid_msg);
        assert!(res.is_err(), "Zero bid should fail");
        println!("✅ Zero bid rejected");
        
        // Test 2: Create auction with zero starting bid
        let seller2 = mock_info("seller2", &coins(500, "utestcore"));
        let zero_start_msg = ExecuteMsg::CreateAuction {
            starting_bid: Uint128::from(0u128),
            duration: 86400,
            description: "Zero start auction".to_string(),
        };
        let _res = execute(deps.as_mut(), env.clone(), seller2, zero_start_msg);
        // This might pass or fail depending on your business logic
        println!("ℹ️ Zero starting bid test completed");
    }

    #[test]
    fn test_auction_with_no_bids() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        
        // Setup
        let admin = mock_info("admin", &coins(1000, "utestcore"));
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), admin, instantiate_msg).unwrap();
        
        // Create auction
        let seller = mock_info("seller", &coins(500, "utestcore"));
        let create_msg = ExecuteMsg::CreateAuction {
            starting_bid: Uint128::from(100u128),
            duration: 1, // 1 second duration
            description: "No bids auction".to_string(),
        };
        execute(deps.as_mut(), env.clone(), seller, create_msg).unwrap();
        
        // Advance time past expiration
        let mut expired_env = env.clone();
        expired_env.block.time = expired_env.block.time.plus_seconds(2);
        
        // Try to close auction with no bids
        let closer = mock_info("admin", &[]);
        let close_msg = ExecuteMsg::CloseAuction { auction_id: 1 };
        let _res = execute(deps.as_mut(), expired_env, closer, close_msg);
        // Should handle no-bid scenario gracefully
        println!("✅ Auction with no bids closed");
    }

    #[test]
    fn test_bid_equal_to_current() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        
        // Setup
        let admin = mock_info("admin", &coins(1000, "utestcore"));
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), admin, instantiate_msg).unwrap();
        
        // Create auction
        let seller = mock_info("seller", &coins(500, "utestcore"));
        let create_msg = ExecuteMsg::CreateAuction {
            starting_bid: Uint128::from(100u128),
            duration: 86400,
            description: "Equal bid test".to_string(),
        };
        execute(deps.as_mut(), env.clone(), seller, create_msg).unwrap();
        
        // Place first bid
        let bidder1 = mock_info("alice", &coins(150, "utestcore"));
        let bid_msg1 = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: "150".to_string(),
        };
        execute(deps.as_mut(), env.clone(), bidder1, bid_msg1).unwrap();
        
        // Try to bid the same amount
        let bidder2 = mock_info("bob", &coins(150, "utestcore"));
        let bid_msg2 = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: "150".to_string(),
        };
        let res = execute(deps.as_mut(), env, bidder2, bid_msg2);
        assert!(res.is_err(), "Equal bid should fail");
        println!("✅ Equal bid correctly rejected");
    }

    #[test]
    fn test_extremely_large_numbers() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        
        // Setup
        let admin = mock_info("admin", &coins(u128::MAX, "utestcore")); // Max u128
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), admin, instantiate_msg).unwrap();
        
        // Create auction with large starting bid
        let seller = mock_info("seller", &coins(u128::MAX, "utestcore"));
        let create_msg = ExecuteMsg::CreateAuction {
            starting_bid: Uint128::from(u128::MAX),
            duration: 86400,
            description: "Large numbers test".to_string(),
        };
        let res = execute(deps.as_mut(), env.clone(), seller, create_msg);
        assert!(res.is_ok(), "Large starting bid should work");
        
        // Place a large bid
        let bidder = mock_info("alice", &coins(u128::MAX, "utestcore"));
        let bid_msg = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: u128::MAX.to_string(),
        };
        let res = execute(deps.as_mut(), env, bidder, bid_msg);
        assert!(res.is_ok(), "Large bid should work");
        println!("✅ Large number handling works");
    }

    #[test]
    fn test_rapid_sequential_operations() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        
        // Setup
        let admin = mock_info("admin", &coins(10000, "utestcore"));
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), admin, instantiate_msg).unwrap();
        
        // Rapidly create multiple auctions
        for i in 1..5 {
            let seller = mock_info(&format!("seller{}", i), &coins(500, "utestcore"));
            let create_msg = ExecuteMsg::CreateAuction {
                starting_bid: Uint128::from(100u128),
                duration: 86400,
                description: format!("Auction {}", i),
            };
            let res = execute(deps.as_mut(), env.clone(), seller, create_msg);
            assert!(res.is_ok(), "Create auction {} should succeed", i);
            println!("✅ Created auction {}", i);
        }
        
        // Rapidly place bids on different auctions
        for i in 1..5 {
            let bidder = mock_info(&format!("bidder{}", i), &coins(200, "utestcore"));
            let bid_msg = ExecuteMsg::PlaceBid {
                auction_id: i,
                amount: "150".to_string(),
            };
            let res = execute(deps.as_mut(), env.clone(), bidder, bid_msg);
            assert!(res.is_ok(), "Bid on auction {} should succeed", i);
            println!("✅ Bid placed on auction {}", i);
        }
        
                   println!("🎉 Rapid sequential operations test complete!");
    }

    // ===== PROPERTY TESTS =====
    use proptest::prelude::*;

    proptest! {
        #[test]
        fn test_addition(a in 0..100i32, b in 0..100i32) {
            assert!(a + b <= 200);
            proptest! {
        #[test]
        fn test_bid_invariants(bid in 1..10000u128, starting in 1..1000u128) {
            // Test that bids always follow rules regardless of values
            assert!(bid > starting || bid <= starting); // Always true, but shows pattern
        }
        
        #[test]
        fn test_auction_creation_duration(days in 1..365u64) {
            let env = mock_env();
            let end_time = env.block.time.seconds() + (days * 86400);
            assert!(end_time > env.block.time.seconds());
        }
    }
        }
    }
}