pub mod phnx;

#[cfg(test)]
mod tests {
    use super::phnx::*;
    use cosmwasm_std::Addr;
    
    #[test]
    fn test_phnx_workflow() {
        let founder = Addr::unchecked("founder");
        let mut state = PhnxState::new(founder);
        
        // Simulate auction completion
        let buyer = Addr::unchecked("buyer");
        let seller = Addr::unchecked("seller");
        let final_price = 5_973_000_000u128; // $5,973 TESTUSD
        let fee = final_price * 11 / 1000; // 1.1% = $65.70
        
        // Mint PHNX to both parties based on fees
        let buyer_phnx = state.mint(buyer.clone(), Uint128::from(fee))?;
        let seller_phnx = state.mint(seller.clone(), Uint128::from(fee))?;
        
        assert_eq!(buyer_phnx, Uint128::from(65u128));
        assert_eq!(seller_phnx, Uint128::from(65u128));
        assert_eq!(state.total_supply, Uint128::from(130u128));
        
        // Verify voting power
        assert!(state.voting_power(&buyer) > 0.0);
    }
}
