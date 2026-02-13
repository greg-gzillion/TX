#!/bin/bash

# Your wallet
WALLET="funded-wallet"
WALLET_ADDR=$(cored keys show $WALLET -a --keyring-backend os)
CHAIN_ID="coreum-testnet-1"
NODE="https://full-node.testnet-1.coreum.dev:26657"

echo "🚀 Deploying to Coreum testnet"
echo "==============================="
echo "📬 Wallet: $WALLET ($WALLET_ADDR)"
echo "🔗 Chain: $CHAIN_ID"
echo ""

# Check if WASM file exists
if [ ! -f "phoenix_auction.wasm" ]; then
    echo "❌ phoenix_auction.wasm not found!"
    echo "   Run ./build_coreum_simple.sh first"
    exit 1
fi

# Check balance
echo "💰 Checking balance..."
BALANCE=$(cored query bank balances $WALLET_ADDR \
  --denom utestcore \
  --node $NODE \
  --output json | jq -r '.amount // 0')

echo "   Balance: $BALANCE utestcore"

if [ "$BALANCE" -lt "1000000" ]; then
    echo "⚠️  Low balance! You need at least 1,000,000 utestcore"
    echo "   Get testnet funds from: https://faucet.testnet-1.coreum.dev"
    read -p "   Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Deploy
echo ""
echo "📤 Uploading contract..."
cored tx wasm store phoenix_auction.wasm \
  --from $WALLET \
  --keyring-backend os \
  --chain-id $CHAIN_ID \
  --node $NODE \
  --gas auto \
  --gas-adjustment 1.5 \
  --fees 1000000utestcore \
  --yes

echo ""
echo "✅ Deployment submitted!"
echo "   Check status with: cored query tx <TX_HASH> --node $NODE"
