#!/bin/bash
# Complete testnet setup for PhoenixPME auction system

set -e  # Stop on error

echo "🚀 PhoenixPME Testnet Setup"
echo "============================"
echo ""

# Configuration
CHAIN_ID="txchain-testnet-1"
RPC="https://rpc.testnet-1.coreum.dev:443"
FAUCET="https://faucet.testnet-1.coreum.dev/claim"

# 1. Check txd installation
echo "1️⃣ Checking txd..."
if ! command -v txd &> /dev/null; then
    echo "❌ txd not found. Installing..."
    cd /tmp
    git clone https://github.com/CoreumFoundation/coreum
    cd coreum
    make install
    cd -
    echo "✅ txd installed"
else
    echo "✅ txd found: $(txd version)"
fi

# 2. Create wallets
echo ""
echo "2️⃣ Creating wallets..."
txd keys add buyer_wallet --keyring-backend test 2>/dev/null || echo "   buyer_wallet already exists"
txd keys add seller_wallet --keyring-backend test 2>/dev/null || echo "   seller_wallet already exists"
txd keys add escrow_wallet --keyring-backend test 2>/dev/null || echo "   escrow_wallet already exists"
txd keys add fee_collector --keyring-backend test 2>/dev/null || echo "   fee_collector already exists"

# Get addresses
BUYER=$(txd keys show buyer_wallet -a --keyring-backend test)
SELLER=$(txd keys show seller_wallet -a --keyring-backend test)
ESCROW=$(txd keys show escrow_wallet -a --keyring-backend test)
FEE=$(txd keys show fee_collector -a --keyring-backend test)

echo ""
echo "   ✅ Addresses created:"
echo "      Buyer:    $BUYER"
echo "      Seller:   $SELLER"
echo "      Escrow:   $ESCROW"
echo "      Fee:      $FEE"

# 3. Save addresses to config
echo ""
echo "3️⃣ Saving configuration..."
cat > /home/greg/dev/TX/testnet_config.json << JSON
{
  "chain_id": "$CHAIN_ID",
  "rpc": "$RPC",
  "faucet": "$FAUCET",
  "addresses": {
    "buyer": "$BUYER",
    "seller": "$SELLER",
    "escrow": "$ESCROW",
    "fee_collector": "$FEE"
  },
  "tokens": {
    "testusd": "utestusd",
    "phnx": "uphnx",
    "trust": "utrust",
    "dont_trust": "udonttrust"
  },
  "auction_params": {
    "collateral_percent": 10,
    "default_duration_days": 30,
    "fee_percent": 1
  }
}
JSON
echo "   ✅ Saved to testnet_config.json"

# 4. Fund wallets (requires manual step - faucet needs interaction)
echo ""
echo "4️⃣ Funding wallets..."
echo ""
echo "   ⚠️  FAUCET REQUIRES MANUAL STEP"
echo ""
echo "   Run these commands to fund each wallet:"
echo ""
echo "   # Fund buyer"
echo "   curl -X POST $FAUCET -H 'Content-Type: application/json' -d '{\"address\": \"$BUYER\"}'"
echo ""
echo "   # Fund seller"
echo "   curl -X POST $FAUCET -H 'Content-Type: application/json' -d '{\"address\": \"$SELLER\"}'"
echo ""
echo "   # Fund escrow"
echo "   curl -X POST $FAUCET -H 'Content-Type: application/json' -d '{\"address\": \"$ESCROW\"}'"
echo ""
echo "   # Fund fee collector"
echo "   curl -X POST $FAUCET -H 'Content-Type: application/json' -d '{\"address\": \"$FEE\"}'"

# 5. Verify setup
echo ""
echo "5️⃣ Verification commands:"
echo ""
echo "   # Check balances"
echo "   txd query bank balances $BUYER --node $RPC --chain-id $CHAIN_ID"
echo "   txd query bank balances $SELLER --node $RPC --chain-id $CHAIN_ID"
echo ""
echo "   # Check testnet status"
echo "   txd status --node $RPC"

echo ""
echo "✅ Setup complete!"
echo "============================"
echo ""
echo "📋 Next steps:"
echo "   1. Fund wallets using faucet (step 4 above)"
echo "   2. Deploy auction contracts"
echo "   3. Create test auction"
echo "   4. Test bid/collateral flow"
