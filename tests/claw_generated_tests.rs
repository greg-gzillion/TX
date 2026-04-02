#[test]
fn test_multi_currency_conversion() {
    let btc = convert_to_testusd("BTC", 0.01);
    assert_eq!(btc, 650_000_000);
    
    let eth = convert_to_testusd("ETH", 0.5);
    assert_eq!(eth, 1_600_000_000);
}

#[test]
fn test_collateral_calculation() {
    let price = 5_973_000_000u128;
    let collateral = price * 10 / 100;
    assert_eq!(collateral, 597_300_000);
}

#[test]
fn test_phnx_minting() {
    let fees = 65_700_000u128;
    let phnx = fees / 1_000_000;
    assert_eq!(phnx, 65);
}
