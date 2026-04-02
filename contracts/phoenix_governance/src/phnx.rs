use cosmwasm_std::{Addr, StdResult, StdError, Uint128};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub founder: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PhnxState {
    pub balances: HashMap<Addr, Uint128>,
    pub total_supply: Uint128,
    pub founder: Addr,
}

impl PhnxState {
    pub fn new(founder: Addr) -> Self {
        Self {
            balances: HashMap::new(),
            total_supply: Uint128::zero(),
            founder,
        }
    }
    
    // Mint PHNX: 1 PHNX per $1 TESTUSD in fees (1 TESTUSD = 1,000,000 utestusd)
    pub fn mint(&mut self, recipient: Addr, fees_testusd: Uint128) -> StdResult<Uint128> {
        let phnx_amount = fees_testusd.checked_div(Uint128::from(1_000_000u128))
            .map_err(|_| StdError::generic_err("Division error"))?;
        
        if phnx_amount == Uint128::zero() {
            return Ok(Uint128::zero());
        }
        
        let current = self.balances.get(&recipient).copied().unwrap_or(Uint128::zero());
        let new_balance = current.checked_add(phnx_amount)
            .map_err(|_| StdError::generic_err("Balance overflow"))?;
        
        self.balances.insert(recipient, new_balance);
        self.total_supply = self.total_supply.checked_add(phnx_amount)
            .map_err(|_| StdError::generic_err("Total supply overflow"))?;
        
        Ok(phnx_amount)
    }
    
    // Calculate voting power (founder gets 10% permanent weight)
    pub fn voting_power(&self, address: &Addr) -> f64 {
        let user_phnx = self.balances.get(address).copied().unwrap_or(Uint128::zero());
        let user_f64 = user_phnx.u128() as f64;
        let total_f64 = self.total_supply.u128() as f64;
        
        if total_f64 == 0.0 {
            return 0.0;
        }
        
        // Community share: (user_phnx / total_phnx) * 90%
        let community_share = (user_f64 / total_f64) * 90.0;
        
        // Founder gets additional 10% weight
        if address == &self.founder {
            return community_share + 10.0;
        }
        
        community_share
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_mint_phnx() {
        let founder = Addr::unchecked("founder");
        let mut state = PhnxState::new(founder);
        
        // $65.70 in fees = 65 PHNX (65.70 * 1,000,000 = 65,700,000 utestusd)
        let fees = Uint128::from(65_700_000u128);
        let recipient = Addr::unchecked("user1");
        
        let result = state.mint(recipient.clone(), fees);
        assert!(result.is_ok());
        let minted = result?;
        assert_eq!(minted, Uint128::from(65u128));
        
        let balance = state.balances.get(&recipient)?;
        assert_eq!(*balance, Uint128::from(65u128));
        assert_eq!(state.total_supply, Uint128::from(65u128));
    }
    
    #[test]
    fn test_voting_power() {
        let founder = Addr::unchecked("founder");
        let mut state = PhnxState::new(founder.clone());
        
        let user1 = Addr::unchecked("user1");
        let user2 = Addr::unchecked("user2");
        
        // Mint PHNX: 65, 25, 26 respectively
        let _ = state.mint(user1.clone(), Uint128::from(65_000_000u128));
        let _ = state.mint(user2.clone(), Uint128::from(25_000_000u128));
        let _ = state.mint(founder.clone(), Uint128::from(26_000_000u128));
        
        let power_user1 = state.voting_power(&user1);
        let power_user2 = state.voting_power(&user2);
        let power_founder = state.voting_power(&founder);
        
        // Total PHNX = 116
        // user1: (65/116)*90 = 50.43%
        assert!((power_user1 - 50.43).abs() < 0.1);
        // user2: (25/116)*90 = 19.40%
        assert!((power_user2 - 19.40).abs() < 0.1);
        // founder: (26/116)*90 + 10 = 30.17%
        assert!((power_founder - 30.17).abs() < 0.1);
    }
    
    #[test]
    fn test_no_fees_no_phnx() {
        let founder = Addr::unchecked("founder");
        let mut state = PhnxState::new(founder);
        
        let fees = Uint128::zero();
        let recipient = Addr::unchecked("user1");
        
        let minted = state.mint(recipient.clone(), fees)?;
        assert_eq!(minted, Uint128::zero());
        assert!(state.balances.get(&recipient).is_none());
    }
}
