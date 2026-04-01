#!/bin/bash
set -e

echo "🔨 Building PhoenixPME contract for Coreum testnet..."
echo "==================================================="

# Clean previous builds
cargo clean

# Step 1: Build the contract normally
echo "📦 Step 1: Compiling contract..."
cargo build --release --target wasm32-unknown-unknown

WASM_FILE="target/wasm32-unknown-unknown/release/phoenix_auction.wasm"
echo "✅ Original WASM size: $(ls -lh $WASM_FILE | awk '{print $5}')"

# Step 2: Use wasm-opt to disable bulk memory
echo ""
echo "🛠️  Step 2: Optimizing for Coreum compatibility..."

if command -v wasm-opt &> /dev/null; then
    # Create optimized version without bulk memory
    wasm-opt "$WASM_FILE" \
      -Oz \
      --disable-bulk-memory \
      --disable-sign-ext \
      -o "${WASM_FILE%.wasm}_coreum.wasm"
    
    OPTIMIZED_FILE="${WASM_FILE%.wasm}_coreum.wasm"
    echo "✅ Optimized WASM size: $(ls -lh "$OPTIMIZED_FILE" | awk '{print $5}')"
    
    # Verify the optimization
    echo ""
    echo "🔍 Checking WASM features..."
    wasm-opt "$OPTIMIZED_FILE" --print-features 2>&1 | grep -i "bulk memory" || true
    
    echo ""
    echo "🚀 Ready for deployment!"
    echo "Use this file: $OPTIMIZED_FILE"
else
    echo "❌ wasm-opt not found!"
    echo "Install with: sudo apt install binaryen"
    echo ""
    echo "⚠️  Using unoptimized file (may fail deployment)"
    echo "Use this file: $WASM_FILE"
fi
