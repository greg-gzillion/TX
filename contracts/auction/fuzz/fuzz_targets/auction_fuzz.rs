#![no_main]

use libfuzzer_sys::fuzz_target;
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{coins, Uint128};
use phoenix_auction::contract::{instantiate, execute};
use phoenix_auction::msg::{InstantiateMsg, ExecuteMsg};

fuzz_target!(|data: &[u8]| {
    if let Ok(amount_str) = std::str::from_utf8(data) {
        if let Ok(amount) = amount_str.parse::<u128>() {
            // Only test reasonable amounts
            if amount < 10000 {
                let mut deps = mock_dependencies();
                let env = mock_env();
                
                // Instantiate
                let admin = mock_info("admin", &coins(1000, "utestcore"));
                let instantiate_msg = InstantiateMsg {
                    admin: "admin".to_string(),
                    community_reserve_fund: "pool".to_string(),
                    token_denom: "utestcore".to_string(),
                };
                let _ = instantiate(deps.as_mut(), env.clone(), admin, instantiate_msg);
                
                // Create auction
                let seller = mock_info("seller", &coins(500, "utestcore"));
                let create_msg = ExecuteMsg::CreateAuction {
                    starting_bid: Uint128::from(100u128),
                    duration: 86400,
                    description: "Fuzz test".to_string(),
                };
                let _ = execute(deps.as_mut(), env.clone(), seller, create_msg);
                
                // Place bid
                let bidder = mock_info("bidder", &coins(amount, "utestcore"));
                let bid_msg = ExecuteMsg::PlaceBid {
                    auction_id: 1,
                    amount: amount.to_string(),
                };
                let _ = execute(deps.as_mut(), env, bidder, bid_msg);
            }
        }
    }
});
    
// ========== PHNX Integration ==========
// When auction completes successfully, mint PHNX based on fees paid

pub fn complete_auction_with_phnx(
    mut phnx_state: PhnxState,
    buyer: Addr,
    seller: Addr,
    final_price_testusd: Uint128,
) -> (PhnxState, Uint128, Uint128) {
    // Calculate fee (1.1% of final price)
    let fee = final_price_testusd * Uint128::from(11u128) / Uint128::from(1000u128);
    
    // Split fee equally? Or all to fee collector? 
    // According to your docs, 1.1% goes to Community Reserve Fund
    // PHNX is minted based on fees generated
    
    // Mint PHNX to buyer (based on their fee contribution)
    let buyer_phnx = phnx_state.mint(buyer, fee);
    
    // Mint PHNX to seller (based on their fee contribution)
    let seller_phnx = phnx_state.mint(seller, fee);
    
    (phnx_state, buyer_phnx, seller_phnx)
}
