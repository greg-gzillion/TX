#!/bin/bash
echo "Updating all dependencies to latest compatible versions..."

# Update cosmwasm-std to latest v1.x
sed -i 's/cosmwasm-std = { version = "1.5.0"/cosmwasm-std = { version = "1.6"/' Cargo.toml

# Update other dependencies
sed -i 's/cosmwasm-storage = { version = "1.5.0"/cosmwasm-storage = { version = "1.6"/' Cargo.toml
sed -i 's/cw-storage-plus = "1.1.0"/cw-storage-plus = "1.2"/' Cargo.toml
sed -i 's/cw-utils = "3.0.0"/cw-utils = "4.0"/' Cargo.toml
sed -i 's/cosmwasm-schema = { version = "1.5.0"/cosmwasm-schema = { version = "1.6"/' Cargo.toml

echo "Updated Cargo.toml:"
grep -E '(cosmwasm|cw-|version)' Cargo.toml

echo ""
echo "Running cargo update..."
cargo update

echo ""
echo "Checking curve25519-dalek versions..."
grep -A2 'name = "curve25519-dalek"' Cargo.lock
