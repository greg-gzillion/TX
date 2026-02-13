#!/bin/bash
cd ~/coreum-pme/contracts/auction

# Backup
cp src/msg.rs src/msg.rs.backup3

# Option 1: Add JsonSchema to manual derives (simplest)
echo "Adding JsonSchema to manual derive lines..."
sed -i '/pub struct Auction/,/^}/ { /^#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]/s//#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]/ }' src/msg.rs
sed -i '/pub struct Config/,/^}/ { /^#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]/s//#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]/ }' src/msg.rs

# Option 2: OR change all to cw_serde (more consistent)
# echo "Changing all to cw_serde..."
# sed -i 's/^#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]/#[cw_serde]/' src/msg.rs
# sed -i 's/^#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]/#[cw_serde]/' src/msg.rs

echo "✅ Fixed!"
