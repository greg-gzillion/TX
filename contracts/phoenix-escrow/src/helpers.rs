use cosmwasm_std::Uint128;

pub fn calculate_fee(amount: Uint128) -> Uint128 {
    // 1.1% = 110 / 10000
    amount.multiply_ratio(110u128, 10000u128)
}

pub fn calculate_collateral(amount: Uint128) -> Uint128 {
    // 10% = 1000 / 10000
    amount.multiply_ratio(1000u128, 10000u128)
}
