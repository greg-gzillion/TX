#!/bin/bash
echo "🦀 Building Phoenix PME Smart Contracts..."
echo "========================================"
cd "$(dirname "$0")/contracts/auction" || { echo "❌ Auction contract directory not found!"; exit 1; }
echo "📍 Location: $(pwd)"
echo ""
echo "Building auction contract..."
cargo build --release --target wasm32-unknown-unknown
if [ $? -eq 0 ]; then
    echo "✅ Contract built successfully!"
    echo "📦 WASM file: target/wasm32-unknown-unknown/release/phoenix_auction.wasm"
    
    # Copy to artifacts
    mkdir -p ../../artifacts/wasm
    cp target/wasm32-unknown-unknown/release/phoenix_auction.wasm ../../artifacts/wasm/
    echo "📋 Copied to: artifacts/wasm/phoenix_auction.wasm"
else
    echo "❌ Build failed"
    exit 1
fi
