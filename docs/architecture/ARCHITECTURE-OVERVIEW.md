# PhoenixPME Architecture Overview
## Generated: February 21, 2026

## 🏗️ PROJECT STRUCTURE OVERVIEW
/home/greg/dev/TX/
├── apps/ → Application Services
├── contracts/ → Smart Contracts
├── docs/ → Documentation
├── scripts/ → Automation Scripts
└── tests/ → Test Suites

## 📦 MODULE 1: APPLICATIONS (`/apps`)

### **Purpose:** Core application services that power the PhoenixPME platform

#### 1.1 Backend (`/apps/backend`)
**Purpose:** Main API server handling business logic and database operations

backend/
├── src/ → Source code
│   ├── controllers/ → Request handlers
│   ├── routes/ → API endpoint definitions
│   │   ├── price.routes.ts → Metal price endpoints (updated with logging)
│   │   ├── auction.routes.ts → Auction management
│   │   └── debug.routes.ts → Debug endpoints
│   ├── services/ → Business logic layer
│   │   └── priceOracle.ts → Price fetching & caching
│   ├── models/ → Data models
│   ├── middleware/ → Auth, logging, error handling
│   ├── validators/ → Input validation
│   ├── config/ → Environment configuration
│   └── lib/ → Utility functions
├── prisma/ → Database layer
│   ├── migrations/ → Database version control
│   └── schema.prisma → Database schema
└── dist/ → Compiled JavaScript

**Key Files:**
- `server.ts` - Entry point (port 3001)
- `prisma/schema.prisma` - Database models
- `src/routes/price.routes.ts` - Metal price API

#### 1.2 Frontend (`/apps/frontend`)
**Purpose:** Next.js web application for user interface

frontend/
├── app/ → Next.js pages
│   ├── page.tsx → Homepage with static reference prices
│   ├── auctions/
│   │   ├── page.tsx → Auction listing
│   │   ├── create/
│   │   │   └── page.tsx → Create auction form
│   │   └── [id]/
│   │       └── page.tsx → Auction detail (coming soon)
│   └── dashboard/
│       └── page.tsx → User dashboard
├── components/ → React components
│   ├── auctions/
│   │   ├── create/
│   │   │   └── index.tsx → Create auction form
│   │   └── list/
│   │       ├── AuctionCard.tsx → Individual auction display
│   │       └── AuctionList.tsx → Auction grid
│   ├── wallet/
│   │   └── WalletSelector.tsx → Keplr/Leap wallet connection
│   ├── layout/
│   │   └── NavBar.tsx → Navigation with wallet selector
│   └── shared/
│       ├── ui/
│       │   ├── Button.tsx
│       │   ├── FilterTabs.tsx
│       │   └── PriceBanner.tsx → Static reference prices
│       └── forms/inputs/
│           ├── MetalSelector.tsx
│           ├── WeightInput.tsx
│           ├── PuritySelector.tsx
│           ├── CertificationInput.tsx
│           ├── SerialNumberInput.tsx
│           ├── ImageUploader.tsx
│           ├── FormTypeSelector.tsx
│           └── PriceCalculator.tsx
├── hooks/
│   └── useWallet.ts → Mock wallet hook for testing
├── lib/
│   └── contract/
│       └── phoenix-escrow.ts → Contract client
└── types/
    └── auction.ts → TypeScript definitions

**Current Status (as of Feb 21, 2026):**
- ✅ Clean component organization (no duplicates)
- ✅ Consistent import patterns (default vs named)
- ✅ Wallet connection (Keplr/Leap)
- ✅ Static reference price banner (manual updates)
- ✅ Create auction form with all metal inputs
- ✅ Auction listing page
- ✅ Dashboard with user stats
- ✅ All test pages removed
- ✅ Vercel builds successful

#### 1.3 Community Reserve Fund (formerly Insurance Module)
**Purpose:** 1.1% of platform fees accumulate in community-controlled treasury

**Key Changes (Feb 18, 2026):**
- ✅ Rebranded from "Insurance Pool" to "Community Reserve Fund"
- ✅ 100% of fees go to CRF (no individual access)
- ✅ 10% founder allocation (voting power, not withdrawal)
- ✅ Funds locked until DAO governance active
- ✅ No insurance product - pure community treasury

**Structure:**
community-reserve/
├── smart-contract/ → CRF contract (planned)
├── governance/ → DAO framework (future)
└── docs/
└── TERMINOLOGY_GUIDE.md → Consistent language

text

**Governance:**
- Future DAO will control fund usage
- Founder retains 10% voting power
- No withdrawals until DAO active
- Transparent on-chain balance

---

## 📜 MODULE 2: SMART CONTRACTS (`/contracts`)

### **Purpose:** Blockchain contracts for decentralized auction functionality

#### 2.1 Phoenix Escrow (`/contracts/phoenix-escrow`) ✅ **COMPLETE**
**Purpose:** Core escrow contract with dual collateral system

phoenix-escrow/
├── src/
│   ├── contract.rs → Main contract logic (✅ 7/7 TESTS PASSING)
│   ├── error.rs → Error handling
│   ├── msg.rs → Message types
│   └── state.rs → State management
└── tests/
    └── integration_tests.rs → 7 passing tests

**Implemented Functions:**
- ✅ `execute_create_auction` - Create with 10% seller collateral
- ✅ `execute_place_bid` - Place bids with 10% buyer collateral
- ✅ `execute_finalize_auction` - Complete auction and release funds
- ✅ 1.1% fee calculation for Community Reserve Fund
- ✅ Dual collateral system (both parties protected)

**Test Results:**
running 7 tests
test tests::test_instantiate ... ok
test tests::test_create_auction ... ok
test tests::test_place_bid_with_collateral ... ok
test tests::test_dual_collateral_enforcement ... ok
test tests::test_reserve_not_met ... ok
test tests::test_community_fund_address ... ok
test tests::test_complete_auction_flow ... ok
test result: ok. 7 passed; 0 failed

text

#### 2.2 Main Auction Contract (`/contracts/auction`) ✅ **COMPLETE**
**Purpose:** Primary auction logic for TX blockchain

auction/
├── src/ → Rust contract source
├── tests/ → 16 PASSING TESTS
└── target/ → Compiled WASM (193K optimized)

**Test Results:**
running 16 tests
test tests::test_instantiate ... ok
test tests::test_place_bid ... ok
test tests::test_close_auction ... ok
... (all 16 passing)
test result: ok. 16 passed; 0 failed

text

---

## 📚 MODULE 3: DOCUMENTATION (`/docs`)

### **Purpose:** Comprehensive project documentation (62 files)

#### 3.1 Architecture (`/docs/architecture`)
- `ARCHITECTURE-OVERVIEW.md` - This file (UPDATED Feb 21)
- `SECURITY_PATTERNS.md` - Security architecture
- `ORACLE_DESIGN.md` - Price oracle design

#### 3.2 Business (`/docs/business`)
- `PROGRESS.md` - Development timeline
- `ROADMAP.md` - Future plans
- `FOCUS_PHOENIXPME.md` - Project focus

#### 3.3 Legal (`/docs/legal`)
- `compliance/INSURANCE_DISCLAIMER.md` - Legal disclaimer
- `FEE_MODEL.md` - 1.1% fee structure
- `CONTRIBUTOR_AGREEMENT.md` - Contributor terms
- `TERMINOLOGY_GUIDE.md` - Consistent language guide

#### 3.4 Technical (`/docs/technical`)
- `TECHNICAL_SPECIFICATION.md` - System architecture
- `DAO_OPERATIONS.md` - Governance framework
- `TESTUSD_TOKEN_CREATION.md` - Token details

#### 3.5 Development (`/docs/development`)
- `PROGRESS.md` - Current status
- `PROJECT_HEALTH_SUMMARY.md` - Health metrics

---

## 🤖 MODULE 4: SCRIPTS (`/scripts`)

### **Purpose:** Automation and deployment utilities

scripts/
├── build/ → Build scripts
├── deploy/ → Deployment scripts
│   └── deploy-tx-testnet.sh → TX testnet deployment
├── start_all.sh → Launch all services
├── start_backend.sh → Start API server
└── start_frontend.sh → Start Next.js app

---

## 🧪 MODULE 5: TESTS (`/tests`)

### **Purpose:** Quality assurance and testing

**Test Coverage:**
| Suite | Type | Count | Status |
|-------|------|-------|--------|
| Phoenix Escrow | Contract | 7 tests | ✅ PASSING |
| Auction Contract | Contract | 16 tests | ✅ PASSING |
| **TOTAL** | | **23 tests** | ✅ ALL PASSING |

---

## 🔗 CORE MODULE RELATIONSHIPS
Frontend (Port 3000) ←→ Backend (Port 3001) ←→ Database (PostgreSQL)
↓ ↓
Wallet (Keplr/Leap) Smart Contracts (TX Testnet)
↓ ↓
User Addresses Community Reserve Fund

text

---

## 🎯 MODULE PURPOSE SUMMARY

| Module | Primary Purpose | Status |
|--------|-----------------|--------|
| **apps/backend** | API & Database | ✅ Active |
| **apps/frontend** | User Interface | ✅ Active (reorganized) |
| **contracts/phoenix-escrow** | Escrow with dual collateral | ✅ COMPLETE (7/7 tests) |
| **contracts/auction** | Auction Logic | ✅ COMPLETE (16/16 tests) |
| **docs/** | Documentation | ✅ 62 files |
| **scripts/** | Automation | ✅ Ready |
| **tests/** | Quality Assurance | ✅ 23+ tests |

---

## 📊 CURRENT STATUS (as of Feb 21, 2026)

### ✅ Working Now:
- Clean frontend structure with no duplicates
- Consistent import patterns
- Wallet connection (Keplr/Leap)
- Static reference price banner
- Create auction form with all inputs
- Auction listing page
- Dashboard with user stats
- Backend API with price routes
- Smart contracts (7 + 16 tests passing)
- Vercel builds successful
- All test pages removed

### 🚧 In Progress:
- BidForm component
- Auction detail page
- Real contract integration (March 6)
- Community Reserve Fund governance

### 📅 March 6, 2026:
TX testnet launches - REAL TESTING BEGINS!

---

## ⚠️ CURRENT LIMITATIONS

| Limitation | Description | Mitigation |
|------------|-------------|------------|
| **Price Data** | Static reference prices (manual updates) | Updated weekly, not live |
| **Community Reserve** | Funds accumulate, no withdrawals yet | DAO governance planned |
| **Smart Contracts** | Not yet deployed | March 6 testnet launch |
| **Bid Functionality** | UI ready, contract pending | Post-March 6 |

---

## 🔥 RECENT ACHIEVEMENTS (Feb 21, 2026)

| Achievement | Impact |
|-------------|--------|
| Complete frontend reorganization | Clean, maintainable codebase |
| All duplicates removed | No confusion |
| Consistent import patterns | Easy for contributors |
| Static price banner added | No API costs |
| Wallet selector fixed | Works in production |
| 5 successful Vercel deploys | Stable builds |
| Test pages removed | Clean production build |

---

*Last Updated: February 21, 2026*

