#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_json, Uint128, Addr};
    use phoenix_escrow::contract::{execute, instantiate, query};
    use phoenix_escrow::msg::{
        ExecuteMsg, InstantiateMsg, QueryMsg, 
        ConfigResponse, AuctionResponse
    };

    #[test]
    fn test_instantiate() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("admin", &coins(1000, "utestcore"));
        
        let msg = InstantiateMsg {
            admin: "admin".to_string(),
            fee_percentage: 1,
            fee_address: "fee_collector".to_string(),
            require_kyc: Some(false),
        };
        
        let res = instantiate(deps.as_mut(), env, info, msg).unwrap();
        assert_eq!(0, res.messages.len());
        
        // Query config to verify
        let query_msg = QueryMsg::Config {};
        let query_res: ConfigResponse = from_json(&query(deps.as_ref(), mock_env(), query_msg).unwrap()).unwrap();
        
        assert_eq!(query_res.admin, Addr::unchecked("admin"));
        assert_eq!(query_res.fee_percentage, 1);
        assert_eq!(query_res.require_kyc, false);
    }

    #[test]
    fn test_create_auction() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &coins(1000, "utestcore"));
        
        // First instantiate
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            fee_percentage: 1,
            fee_address: "fee_collector".to_string(),
            require_kyc: Some(false),
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg).unwrap();
        
        // Create auction
        let create_msg = ExecuteMsg::CreateAuction {
            item_id: "item123".to_string(),
            starting_price: Uint128::from(100u128),
            reserve_price: Some(Uint128::from(200u128)),
            buy_now_price: Some(Uint128::from(500u128)),
            duration_hours: 24,
        };
        
        let res = execute(deps.as_mut(), env.clone(), info, create_msg).unwrap();
        assert_eq!(0, res.messages.len());
        
        // Query the auction
        let query_msg = QueryMsg::Auction { id: 0 };
        let query_res: AuctionResponse = from_json(&query(deps.as_ref(), env, query_msg).unwrap()).unwrap();
        
        assert_eq!(query_res.id, 0);
        assert_eq!(query_res.auction.item_id, "item123");
        assert_eq!(query_res.auction.starting_price, Uint128::from(100u128));
    }

    #[test]
    fn test_place_bid() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let creator_info = mock_info("creator", &coins(1000, "utestcore"));
        
        // Instantiate
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            fee_percentage: 1,
            fee_address: "fee_collector".to_string(),
            require_kyc: Some(false),
        };
        instantiate(deps.as_mut(), env.clone(), creator_info.clone(), instantiate_msg).unwrap();
        
        // Create auction
        let create_msg = ExecuteMsg::CreateAuction {
            item_id: "item123".to_string(),
            starting_price: Uint128::from(100u128),
            reserve_price: Some(Uint128::from(200u128)),
            buy_now_price: Some(Uint128::from(500u128)),
            duration_hours: 24,
        };
        execute(deps.as_mut(), env.clone(), creator_info, create_msg).unwrap();
        
        // Place bid
        let bidder_info = mock_info("bidder1", &coins(150, "utestcore"));
        let bid_msg = ExecuteMsg::PlaceBid { auction_id: 0 };
        
        let res = execute(deps.as_mut(), env.clone(), bidder_info, bid_msg).unwrap();
        assert_eq!(0, res.messages.len());
        
        // Query auction to verify bid
        let query_msg = QueryMsg::Auction { id: 0 };
        let query_res: AuctionResponse = from_json(&query(deps.as_ref(), env, query_msg).unwrap()).unwrap();
        
        assert_eq!(query_res.auction.bids.len(), 1);
        assert_eq!(query_res.auction.bids[0].bidder, Addr::unchecked("bidder1"));
        assert_eq!(query_res.auction.bids[0].amount, Uint128::from(150u128));
    }

    #[test]
    fn test_buy_now() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let creator_info = mock_info("creator", &coins(1000, "utestcore"));
        
        // Instantiate
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            fee_percentage: 1,
            fee_address: "fee_collector".to_string(),
            require_kyc: Some(false),
        };
        instantiate(deps.as_mut(), env.clone(), creator_info.clone(), instantiate_msg).unwrap();
        
        // Create auction with buy now price
        let create_msg = ExecuteMsg::CreateAuction {
            item_id: "item123".to_string(),
            starting_price: Uint128::from(100u128),
            reserve_price: Some(Uint128::from(200u128)),
            buy_now_price: Some(Uint128::from(500u128)),
            duration_hours: 24,
        };
        execute(deps.as_mut(), env.clone(), creator_info, create_msg).unwrap();
        
        // Buy now
        let buyer_info = mock_info("buyer", &coins(500, "utestcore"));
        let buy_msg = ExecuteMsg::BuyNow { auction_id: 0 };
        
        let res = execute(deps.as_mut(), env.clone(), buyer_info, buy_msg).unwrap();
        assert_eq!(0, res.messages.len());
        
        // Query auction to verify it's sold
        let query_msg = QueryMsg::Auction { id: 0 };
        let query_res: AuctionResponse = from_json(&query(deps.as_ref(), env, query_msg).unwrap()).unwrap();
        
        assert_eq!(query_res.auction.status, phoenix_escrow::state::AuctionStatus::Sold);
        assert_eq!(query_res.auction.bids.len(), 1);
        assert_eq!(query_res.auction.bids[0].amount, Uint128::from(500u128));
    }

    #[test]
    fn test_kyc_verification() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let admin_info = mock_info("admin", &coins(1000, "utestcore"));
        
        // Instantiate with KYC required
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            fee_percentage: 1,
            fee_address: "fee_collector".to_string(),
            require_kyc: Some(true),
        };
        instantiate(deps.as_mut(), env.clone(), admin_info.clone(), instantiate_msg).unwrap();
        
        // Verify a user
        let verify_msg = ExecuteMsg::VerifyUser {
            address: "user1".to_string(),
        };
        
        let res = execute(deps.as_mut(), env.clone(), admin_info, verify_msg).unwrap();
        assert_eq!(0, res.messages.len());
        
        // Check if user is verified
        let query_msg = QueryMsg::IsVerified {
            address: "user1".to_string(),
        };
        let is_verified: bool = from_json(&query(deps.as_ref(), env, query_msg).unwrap()).unwrap();
        
        assert_eq!(is_verified, true);
    }
}
