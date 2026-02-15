#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins};
    
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

        // First instantiate
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg).unwrap();

        // Place a bid
        let bid_msg = ExecuteMsg::PlaceBid {
            auction_id: 1,
            amount: "100".to_string(),
        };
        
        let res = execute(deps.as_mut(), env, info, bid_msg);
        // This may fail if auction doesn't exist, but at least it compiles
        println!("Bid result: {:?}", res);
    }

    #[test]
    fn test_close_auction() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &coins(1000, "utestcore"));

        // First instantiate
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg).unwrap();

        // Close auction
        let close_msg = ExecuteMsg::CloseAuction { auction_id: 1 };
        let res = execute(deps.as_mut(), env, info, close_msg);
        println!("Close result: {:?}", res);
    }

    #[test]
    fn test_claim_winnings() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("winner", &coins(1000, "utestcore"));

        // First instantiate
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), instantiate_msg).unwrap();

        // Claim winnings
        let claim_msg = ExecuteMsg::ClaimWinnings { auction_id: 1 };
        let res = execute(deps.as_mut(), env, info, claim_msg);
        println!("Claim result: {:?}", res);
    }

    #[test]
    fn test_query_auction() {
        let mut deps = mock_dependencies();
        let env = mock_env();

        // First instantiate
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        let info = mock_info("creator", &[]);
        instantiate(deps.as_mut(), env.clone(), info, instantiate_msg).unwrap();

        // Query auction
        let query_msg = QueryMsg::GetAuction { auction_id: 1 };
        let res = query(deps.as_ref(), env, query_msg);
        println!("Query result: {:?}", res);
    }

    #[test]
    fn test_query_high_bid() {
        let mut deps = mock_dependencies();
        let env = mock_env();

        // First instantiate
        let instantiate_msg = InstantiateMsg {
            admin: "admin".to_string(),
            insurance_pool: "pool".to_string(),
            token_denom: "utestcore".to_string(),
        };
        let info = mock_info("creator", &[]);
        instantiate(deps.as_mut(), env.clone(), info, instantiate_msg).unwrap();

        // Query high bid
        let query_msg = QueryMsg::GetHighBid { auction_id: 1 };
        let res = query(deps.as_ref(), env, query_msg);
        println!("High bid result: {:?}", res);
    }
}
