#!/bin/bash
# Generate test addresses for PhoenixPME

echo "🏦 Generating PhoenixPME Test Addresses"
echo "========================================"

# Create wallets
echo "Creating wallet addresses..."

txd keys add buyer_wallet --keyring-backend test 2>/dev/null
txd keys add seller_wallet --keyring-backend test 2>/dev/null
txd keys add escrow_wallet --keyring-backend test 2>/dev/null
txd keys add fee_collector --keyring-backend test 2>/dev/null

# Get addresses
BUYER=$(txd keys show buyer_wallet -a --keyring-backend test)
SELLER=$(txd keys show seller_wallet -a --keyring-backend test)
ESCROW=$(txd keys show escrow_wallet -a --keyring-backend test)
FEE=$(txd keys show fee_collector -a --keyring-backend test)

echo ""
echo "✅ Addresses created:"
echo "  Buyer:    $BUYER"
echo "  Seller:   $SELLER"
echo "  Escrow:   $ESCROW"
echo "  Fee:      $FEE"
echo ""

# Save to JSON
cat > test_addresses.json << JSON
{
  "testnet": "txchain-testnet-1",
  "rpc": "https://rpc.testnet-1.coreum.dev:443",
  "addresses": {
    "buyer": "$BUYER",
    "seller": "$SELLER",
    "escrow": "$ESCROW",
    "fee_collector": "$FEE"
  },
  "tokens": {
    "TESTUSD": "utestusd",
    "PHNX": "uphnx",
    "TRUST": "utrust",
    "DONT_TRUST": "udonttrust"
  }
}
JSON

echo "💾 Addresses saved to test_addresses.json"
echo ""
echo "Next steps:"
echo "1. Get testnet tokens from faucet"
echo "2. Run: txd tx bank send faucet $BUYER 1000000utestusd"
