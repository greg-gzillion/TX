#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins};
    
    // Use the crate name, not crate::
    use phoenix_auction::contract::{instantiate, execute, query};
    use phoenix_auction::msg::{InstantiateMsg, ExecuteMsg, QueryMsg};

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
}