#!/bin/bash
# Create realistic auction simulation with 10 users

echo "🏛️ CREATING PHOENIXPME AUCTION SIMULATION"
echo "========================================="
echo "Generating 10 users with individual escrow accounts..."

# Configuration
CHAIN_ID="coreum-testnet-1"
RPC="https://rpc.testnet-1.coreum.dev:443"
FAUCET="https://faucet.testnet-1.coreum.dev/claim"

# Create arrays for users
declare -a USERS=(
    "precious_metal_collector"
    "gold_investor" 
    "silver_whale"
    "platinum_trader"
    "coin_dealer"
    "jewelry_lover"
    "bullion_banker"
    "numismatist"
    "estate_liquidator"
    "vintage_collector"
)

# Create users and their escrow accounts
echo "" > auction_users.txt
echo "{\"users\": [" > auction_users.json

for i in "${!USERS[@]}"; do
    USER="${USERS[$i]}"
    USER_NUM=$((i+1))
    
    echo ""
    echo "📝 Creating User $USER_NUM: $USER"
    
    # Create main user wallet
    USER_ADDR=$(txd keys add $USER --keyring-backend test --chain-id $CHAIN_ID 2>&1 | grep "address:" | awk '{print $2}')
    USER_MNEMONIC=$(txd keys show $USER -a --keyring-backend test 2>&1)
    
    # Create user's escrow wallet (for holding collateral)
    ESCROW_NAME="${USER}_escrow"
    ESCROW_ADDR=$(txd keys add $ESCROW_NAME --keyring-backend test --chain-id $CHAIN_ID 2>&1 | grep "address:" | awk '{print $2}')
    
    echo "  User Address: $USER_ADDR"
    echo "  Escrow Address: $ESCROW_ADDR"
    
    # Save to files
    echo "User $USER_NUM: $USER" >> auction_users.txt
    echo "  Main: $USER_ADDR" >> auction_users.txt
    echo "  Escrow: $ESCROW_ADDR" >> auction_users.txt
    echo "" >> auction_users.txt
    
    # Add to JSON
    cat >> auction_users.json << JSON
    {
      "id": $USER_NUM,
      "name": "$USER",
      "address": "$USER_ADDR",
      "escrow": "$ESCROW_ADDR",
      "role": "bidder",
      "reputation": $((RANDOM % 100 + 1))
    },
JSON
    
    # Fund from faucet (with delay to avoid rate limiting)
    echo "  💰 Funding $USER from faucet..."
    curl -X POST $FAUCET \
      -H 'Content-Type: application/json' \
      -d "{\"address\": \"$USER_ADDR\"}" 2>/dev/null > /dev/null
    
    sleep 1
    
    # Also fund escrow account with minimum collateral
    echo "  💰 Funding escrow with collateral..."
    curl -X POST $FAUCET \
      -H 'Content-Type: application/json' \
      -d "{\"address\": \"$ESCROW_ADDR\"}" 2>/dev/null > /dev/null
    
    sleep 1
done

# Fix JSON (remove trailing comma and close array)
sed -i '$ s/,$//' auction_users.json
echo "  ]\n}" >> auction_users.json

echo ""
echo "✅ Created 10 auction participants!"
echo "========================================="
echo "📁 Files created:"
echo "  • auction_users.txt - Human readable list"
echo "  • auction_users.json - Machine readable config"
echo ""
echo "📊 User summary:"
cat auction_users.txt | head -20
