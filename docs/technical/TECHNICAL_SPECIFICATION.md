# Technical Specification v0.1

## 1. System Architecture
### 1.1 Core Components
- Asset Token (Coreum Smart Token)
- Auction Escrow Contract (CosmWasm)
- Reputation System
- Settlement Bridge (Coreum ↔ XRPL)

### 1.2 Contract States
ACTIVE → ENDED_WAITING_SHIP → SHIPPED_IN_TRANSIT → DELIVERED_INSPECTION → COMPLETED

## 2. Smart Contract Specification
### 2.1 Auction Escrow Contract
**Functions:**
- `create_auction(reserve_price, duration_days)`
- `place_bid(bid_amount, bid_asset)`
- `post_shipping(tracking_hash)`
- `confirm_delivery()`
- `finalize()`

### 2.2 Penalty System
- Seller bond: 5% of item value in COREUM
- Shipping deadline: 5 business days
- Auto-slashing on failure
