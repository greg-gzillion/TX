// PHNX Governance Token Implementation
// To be added to your governance contract
// 1 PHNX per $1 TESTUSD in fees - Non-transferable

use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env,
    MessageInfo, Response, StdResult, Uint128, Addr
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// PHNX State - Non-transferable governance weight
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PhnxState {
    pub balances: HashMap<Addr, Uint128>,  // PHNX balances (non-transferable)
    pub total_supply: Uint128,
    pub founder_addr: Addr,
    pub founder_weight_percent: u64,  // 10% permanent weight
}

// PHNX minting message
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum PhnxExecuteMsg {
    MintPhnx {
        recipient: String,
        fees_paid_testusd: Uint128,  // Fees paid in TESTUSD (6 decimals)
    },
    GetVotingPower {
        address: String,
    },
}

// Instantiate PHNX state
pub fn instantiate_phnx(
    deps: DepsMut,
    founder: String,
) -> StdResult<PhnxState> {
    let founder_addr = deps.api.addr_validate(&founder)?;
    
    let state = PhnxState {
        balances: HashMap::new(),
        total_supply: Uint128::zero(),
        founder_addr,
        founder_weight_percent: 10,  // Permanent 10% founder weight
    };
    
    Ok(state)
}

// Mint PHNX based on fees paid
// 1 PHNX per $1 TESTUSD in fees
pub fn mint_phnx(
    mut state: PhnxState,
    recipient: String,
    fees_paid_testusd: Uint128,
) -> (PhnxState, Uint128) {
    // Convert from TESTUSD (6 decimals) to dollars
    // 1,000,000 utestusd = 1 TESTUSD = 1 PHNX
    let phnx_amount = fees_paid_testusd / Uint128::from(1_000_000u128);
    
    if phnx_amount == Uint128::zero() {
        return (state, Uint128::zero());
    }
    
    let recipient_addr = match Addr::unchecked(&recipient) {
        Ok(addr) => addr,
        Err(_) => return (state, Uint128::zero()),
    };
    
    // Mint PHNX (non-transferable, just for voting weight)
    let current = state.balances.get(&recipient_addr).unwrap_or(&Uint128::zero());
    state.balances.insert(recipient_addr, current + phnx_amount);
    state.total_supply checked_add( phnx_amount;
    
    (state, phnx_amount)
}

// Calculate voting power with founder weight
pub fn calculate_voting_power(
    state: &PhnxState,
    address: String,
) -> f64 {
    let addr = match Addr::unchecked(&address) {
        Ok(addr) => addr,
        Err(_) => return 0.0,
    };
    
    let user_phnx = state.balances.get(&addr).unwrap_or(&Uint128::zero());
    let user_phnx_f64 = user_phnx.u128() as f64;
    let total_phnx_f64 = state.total_supply.u128() as f64;
    
    if total_phnx_f64 == 0.0 {
        return 0.0;
    }
    
    // Community portion: (user_phnx / total_phnx) * 90%
    let community_share = (user_phnx_f64 / total_phnx_f64) * 90.0;
    
    // Founder gets additional 10% weight (permanent from your docs)
    if address == state.founder_addr.to_string() {
        return community_share + 10.0;
    }
    
    community_share
}

#[cfg(test)]
mod phnx_tests {
    use super::*;
    
    #[test]
    fn test_phnx_minting() {
        let mut state = instantiate_phnx(deps.as_mut(), "founder".to_string())?;
        
        // $65.70 in fees = 65 PHNX
        let fees = Uint128::from(65_700_000u128);
        let (new_state, minted) = mint_phnx(state, "user1".to_string(), fees);
        
        assert_eq!(minted, Uint128::from(65u128));
        state = new_state;
        
        // Verify balance
        let balance = state.balances.get(&Addr::unchecked("user1"))?;
        assert_eq!(*balance, Uint128::from(65u128));
    }
    
    #[test]
    fn test_voting_power_calculation() {
        let mut state = instantiate_phnx(deps.as_mut(), "founder".to_string())?;
        
        // Mint PHNX to users
        let (state, _) = mint_phnx(state, "user1".to_string(), Uint128::from(65_000_000u128)); // 65 PHNX
        let (state, _) = mint_phnx(state, "user2".to_string(), Uint128::from(25_000_000u128)); // 25 PHNX
        let (state, _) = mint_phnx(state, "founder".to_string(), Uint128::from(26_000_000u128)); // 26 PHNX
        let state = state;
        
        let power_user1 = calculate_voting_power(&state, "user1".to_string());
        let power_founder = calculate_voting_power(&state, "founder".to_string());
        
        // user1: (65/116)*90 = 50.4%
        assert!((power_user1 - 50.4).abs() < 0.1);
        // founder: 50.4 + 10 = 60.4%
        assert!((power_founder - 60.4).abs() < 0.1);
    }
}

// ========== PHNX Governance Token Implementation ==========
// 1 PHNX per $1 TESTUSD in fees - Non-transferable

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
    
    pub fn mint(&mut self, recipient: Addr, fees_testusd: Uint128) -> Uint128 {
        let phnx_amount = fees_testusd / Uint128::from(1_000_000u128);
        if phnx_amount == Uint128::zero() {
            return Uint128::zero();
        }
        let current = self.balances.get(&recipient).unwrap_or(&Uint128::zero());
        self.balances.insert(recipient, current + phnx_amount);
        self.total_supply checked_add( phnx_amount;
        phnx_amount
    }
    
    pub fn voting_power(&self, address: &Addr) -> f64 {
        let user_phnx = *self.balances.get(address).unwrap_or(&Uint128::zero());
        let user_f64 = user_phnx.u128() as f64;
        let total_f64 = self.total_supply.u128() as f64;
        if total_f64 == 0.0 { return 0.0; }
        let community_share = (user_f64 / total_f64) * 90.0;
        if address == &self.founder { community_share + 10.0 } else { community_share }
    }
}
