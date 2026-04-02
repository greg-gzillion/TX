#!/bin/bash
# Deploy PhoenixPME auction contracts to testnet

CONFIG_FILE="/home/greg/dev/TX/testnet_config.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Run ./setup_testnet.sh first"
    exit 1
fi

# Load config
CHAIN_ID=$(jq -r '.chain_id' $CONFIG_FILE 2>/dev/null || echo "txchain-testnet-1")
RPC=$(jq -r '.rpc' $CONFIG_FILE 2>/dev/null || echo "https://rpc.testnet-1.coreum.dev:443")
BUYER=$(jq -r '.addresses.buyer' $CONFIG_FILE 2>/dev/null)

echo "🚀 Deploying PhoenixPME Auction Contracts"
echo "=========================================="

# First, fund the wallets if not already done
echo ""
echo "📋 STEP 1: Fund wallets from faucet"
echo "   Run these commands in separate terminals:"
echo ""
echo "   curl -X POST https://faucet.testnet-1.coreum.dev/claim \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"address\": \"core1chw2x7f8ee084t2kle528xky64s4l4cwlxaz29\"}'"
echo ""

# Check if we have contract WASM files
echo "📋 STEP 2: Build contract WASM files"
cd /home/greg/dev/TX

# Create artifacts directory
mkdir -p artifacts

# Build escrow contract if source exists
if [ -f "contracts/phoenix_auction/escrow_contract.rs" ]; then
    echo "   Building escrow contract..."
    # Note: Actual build command depends on your setup
    # For now, we'll use a placeholder
    echo "   ⚠️  Build system not configured"
    echo "   Manual deployment required"
fi

echo ""
echo "📋 DEPLOYMENT COMMANDS (run after funding wallets):"
echo ""
echo "# 1. Store escrow contract (if WASM exists)"
echo "txd tx wasm store artifacts/auction_escrow.wasm \\"
echo "  --from buyer_wallet \\"
echo "  --chain-id $CHAIN_ID \\"
echo "  --node $RPC \\"
echo "  --gas 2000000 \\"
echo "  --fees 2000utx \\"
echo "  --keyring-backend test \\"
echo "  --yes"
echo ""
echo "# 2. Instantiate contract"
echo "txd tx wasm instantiate <CODE_ID> \\"
echo "  '{\"collateral_percent\":10,\"duration_days\":30}' \\"
echo "  --from buyer_wallet \\"
echo "  --label \"phoenixpme-escrow\" \\"
echo "  --admin $BUYER \\"
echo "  --chain-id $CHAIN_ID \\"
echo "  --node $RPC \\"
echo "  --keyring-backend test \\"
echo "  --yes"

