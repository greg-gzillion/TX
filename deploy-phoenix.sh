#!/bin/bash
# PhoenixPME - Deploy to TX Testnet

set -e

# ============================================
# CONFIGURATION
# ============================================
CHAIN_ID="txchain-testnet-1"
RPC_URL="https://full-node.testnet.tx.dev:26657"
DENOM="utestcore"
KEYRING_BACKEND="test"
WASM_PATH="/home/greg/dev/TX/contracts/phoenix-escrow/target/wasm32-unknown-unknown/release/phoenix_escrow.wasm"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🦅 PhoenixPME Deployment to TX Testnet${NC}"
echo "========================================"
echo ""

# Check WASM file
echo -e "${YELLOW}📦 Checking contract...${NC}"
if [ ! -f "$WASM_PATH" ]; then
    echo -e "${RED}❌ Contract not found! Build it first:${NC}"
    echo "   phoenix-build rust"
    exit 1
fi
echo -e "${GREEN}✅ Contract: $(basename $WASM_PATH) ($(du -h $WASM_PATH | cut -f1))${NC}"
echo ""

# List available wallets
echo -e "${YELLOW}🔑 Available wallets:${NC}"
txd keys list --keyring-backend $KEYRING_BACKEND
echo ""

# Ask for wallet
read -p "Enter wallet name to use (from list above): " WALLET_NAME

# Check if wallet exists
if ! txd keys show $WALLET_NAME --keyring-backend $KEYRING_BACKEND &>/dev/null; then
    echo -e "${RED}❌ Wallet '$WALLET_NAME' not found!${NC}"
    exit 1
fi

WALLET_ADDR=$(txd keys show $WALLET_NAME -a --keyring-backend $KEYRING_BACKEND)
echo -e "${GREEN}✅ Using wallet: $WALLET_ADDR${NC}"
echo ""

# Check balance
echo -e "${YELLOW}💰 Checking balance...${NC}"
BALANCE=$(txd query bank balances $WALLET_ADDR --node $RPC_URL --denom $DENOM -o json 2>/dev/null | jq -r '.amount // "0"')
echo -e "   Balance: $BALANCE $DENOM"
echo ""

# Deploy
echo -e "${YELLOW}🚀 Deploying contract...${NC}"
echo "   Chain: $CHAIN_ID"
echo "   RPC: $RPC_URL"
echo ""

txd tx wasm store "$WASM_PATH" \
  --from "$WALLET_NAME" \
  --chain-id "$CHAIN_ID" \
  --node "$RPC_URL" \
  --gas auto --gas-adjustment 1.3 \
  --keyring-backend "$KEYRING_BACKEND" \
  -y

echo ""
echo -e "${GREEN}✅ Deployment submitted!${NC}"
echo ""
echo "Get code ID with:"
echo "  txd query wasm list-code --node $RPC_URL"
