#!/bin/bash
# Fix InstantiateMsg in tests

# Replace incomplete InstantiateMsg with full version
sed -i 's/InstantiateMsg {$/InstantiateMsg {\n        owner: "admin".to_string(),\n        community_reserve_fund: "core1m5adn3k68tk4zqmujpnstmp9r933jafzu44tnv".to_string(),\n        fee_bps: Some(110),\n        inspection_period: Some(172800),/g' tests/integration_tests.rs

# Remove duplicate fields that might appear
sed -i '/owner: "admin".to_string(),/d' tests/integration_tests.rs
sed -i '/^[[:space:]]*owner:/d' tests/integration_tests.rs
