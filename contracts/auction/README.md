# PhoenixPME Auction Contract

## Overview
Core auction logic for peer-to-peer precious metals trading on the TX blockchain.

## Features
- ✅ Create auctions with minimum bid, reserve price, and buy-now option
- ✅ Place bids (must be higher than current highest)
- ✅ Buy now functionality (instantly wins auction)
- ✅ Auction expiration (bids cannot be placed after end time)
- ✅ Cancel auction (only if no bids placed)
- ✅ End auction and determine winner
- ✅ Release funds to seller after auction completion

## Directory Structure
auction/
├── src/ # Source code
│ └── lib.rs
├── tests/ # Integration tests (10+ tests)
│ └── integration_tests.rs
├── scripts/ # Build/deploy utilities
│ ├── build/ # Build scripts
│ ├── deploy/ # Deployment scripts
│ └── fix/ # Fix utilities
├── archives/ # Historical backups
├── Cargo.toml
├── Cargo.lock
└── README.md


## Building
```bash
# Standard build
cargo build --release --target wasm32-unknown-unknown

# Using build script
./scripts/build/build_coreum.sh


Testing
# Run all tests
cargo test

# Run specific test
cargo test test_place_bid -- --nocapture

Deployment
# Using build script
./scripts/build/build_coreum.sh

Test Coverage
✅ Instantiation (1 test)

✅ Bid placement (2 tests)

✅ Bid validation (1 test)

✅ Auction expiration (1 test)

✅ Multiple bids (1 test)

✅ Reserve price (1 test)

✅ Buy now (1 test)

✅ Cancellation (3 tests)

✅ Fund release (1 test)

Total: 11 passing tests

Dependencies
cosmwasm-std = "1.5"

cw-storage-plus = "1.2"

cw2 = "1.1"

schemars = "0.8"

serde = "1.0"

thiserror = "1.0"


### **Step 4: Clean up unused files**
```bash
# Move any remaining root files to appropriate places
mv find_coreum_info.sh scripts/fix/ 2>/dev/null
mv instantiate_auction.sh scripts/deploy/ 2>/dev/null
mv instantiate_tx_details.json docs/ 2>/dev/null
mv Dockerfile scripts/ 2>/dev/null
mv wasm32-unknown-unknown-coreum.json config/ 2>/dev/null || mkdir -p config && mv wasm32-unknown-unknown-coreum.json config/

Step 5: Run tests and verify
cargo test


auction/
├── src/
│   └── lib.rs
├── tests/
│   └── integration_tests.rs (11 tests)
├── scripts/
│   ├── build/
│   ├── deploy/
│   └── fix/
├── archives/
├── config/
│   └── wasm32-unknown-unknown-coreum.json
├── docs/
│   └── instantiate_tx_details.json
├── Cargo.toml
├── Cargo.lock
├── README.md
└── .gitignore



