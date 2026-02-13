#!/bin/bash

echo "🦀 Building contract for Coreum testnet..."
echo "========================================"

# Build the contract
cargo build --release --target wasm32-unknown-unknown

# Get the wasm file
WASM_FILE="target/wasm32-unknown-unknown/release/phoenix_auction.wasm"
if [ ! -f "$WASM_FILE" ]; then
    echo "❌ Build failed - WASM file not found"
    exit 1
fi

# Copy to current directory
cp "$WASM_FILE" ./phoenix_auction.wasm

echo "✅ Build successful!"
echo "📦 WASM file: $(pwd)/phoenix_auction.wasm"
echo "📏 Size: $(wc -c < phoenix_auction.wasm) bytes"

# Check if wasm-opt is available for optimization
if command -v wasm-opt &> /dev/null; then
    echo ""
    echo "🔧 Optimizing with wasm-opt..."
    wasm-opt phoenix_auction.wasm -Oz -o phoenix_auction_optimized.wasm
    echo "✅ Optimized: $(wc -c < phoenix_auction_optimized.wasm) bytes"
fi

echo ""
echo "🚀 To deploy:"
echo "cored tx wasm store phoenix_auction.wasm \\"
echo "  --from funded-wallet \\"
echo "  --keyring-backend os \\"
echo "  --chain-id coreum-testnet-1 \\"
echo "  --node https://full-node.testnet-1.coreum.dev:26657 \\"
echo "  --gas auto --gas-adjustment 1.5 --fees 1000000utestcore --yes"
