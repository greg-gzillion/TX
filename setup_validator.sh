#!/bin/bash
# Validator Setup Script for PhoenixPME

echo "🚀 Setting up TX Validator..."

# Check txd
if ! command -v txd &> /dev/null; then
    echo "Installing txd..."
    git clone https://github.com/CoreumFoundation/coreum
    cd coreum && make install
fi

# Initialize
txd init "PhoenixPME-Validator" --chain-id txchain-mainnet-1
txd keys add phoenix-validator

echo "✅ Validator ready!"
