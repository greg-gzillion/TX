# PhoenixPME Architecture Overview
## Generated: February 13, 2026

## 🏗️ PROJECT STRUCTURE OVERVIEW
/home/greg/dev/TX/
├── apps/ → Application Services
├── contracts/ → Smart Contracts
├── docs/ → Documentation
├── scripts/ → Automation Scripts
└── tests/ → Test Suites (✅ EXPANDED)

## 📦 MODULE 1: APPLICATIONS (`/apps`)

### **Purpose:** Core application services that power the PhoenixPME platform

#### 1.1 Backend (`/apps/backend`)
**Purpose:** Main API server handling business logic and database operations

backend/
├── src/ → Source code
│ ├── controllers/ → Request handlers
│ ├── routes/ → API endpoint definitions
│ ├── services/ → Business logic layer
│ ├── models/ → Data models
│ ├── middleware/ → Auth, logging, error handling
│ ├── validators/ → Input validation
│ ├── config/ → Environment configuration
│ ├── tests/ → Backend unit tests
│ └── lib/ → Utility functions
├── prisma/ → Database layer
│ ├── migrations/ → Database version control
│ └── schema.prisma → Database schema
├── dist/ → Compiled JavaScript
└── tests/ → Additional test suites

**Key Files:**
- `server.ts` - Entry point (port 3001)
- `prisma/schema.prisma` - Database models
- `src/routes/` - API endpoints for auctions

#### 1.2 Frontend (`/apps/frontend`)
**Purpose:** Next.js web application for user interface

frontend/
├── app/ → Next.js App Router pages
│ └── page.tsx → Landing page with wallet connection
├── components/ → Reusable React components
│ └── WalletSelector.tsx → Multi-wallet (Keplr/Leap) integration
├── lib/ → Utilities and API client
│ └── api.ts → Backend API client
├── config/ → Frontend configuration
└── test-scripts/ → Frontend testing utilities


**Key Achievements:**
- ✅ Keplr wallet integration
- ✅ Leap wallet integration
- ✅ Treasury address: `testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen`
- ✅ Multi-wallet selector with persistent sessions

#### 1.3 Insurance Module (`/apps/insurance-module`)
**Purpose:** Fees generated deposited into insurance pool

insurance-module/
├── server.js → Insurance API server
└── package.json → Dependencies

#### 1.4 Middleware Backup (`/apps/middleware-backup`)
**Purpose:** Shared middleware components for API security

middleware-backup/
├── apiKey.middleware.ts → API key authentication
├── auth.middleware.ts → JWT authentication
├── errorHandler.ts → Global error handling
├── requestLogger.ts → Request logging
└── validation.middleware.ts → Input validation

---

## 📜 MODULE 2: SMART CONTRACTS (`/contracts`)

### **Purpose:** Blockchain contracts for decentralized auction functionality

#### 2.1 Phoenix Escrow (`/contracts/phoenix-escrow`) ✅ **COMPLETE**
**Purpose:** Core escrow contract with KYC/AML integration

phoenix-escrow/
├── src/
│ ├── contract.rs → Main contract logic (✅ ALL FUNCTIONS IMPLEMENTED)
│ ├── error.rs → Error handling (✅ COMPLETE)
│ ├── msg.rs → Message types (✅ COMPLETE)
│ └── state.rs → State management (✅ COMPLETE)
├── tests/
│ └── integration_tests.rs → 5 PASSING TESTS
├── Cargo.toml → Dependencies
└── Cargo.lock

**Implemented Functions:**
- ✅ `execute_create_auction` - Create new auctions
- ✅ `execute_place_bid` - Place bids on auctions
- ✅ `execute_buy_now` - Instant purchase at fixed price
- ✅ `execute_end_auction` - Close expired auctions
- ✅ `execute_cancel_auction` - Cancel auctions (no bids)
- ✅ `execute_release_funds` - Release funds to seller
- ✅ KYC verification (configurable)

**Test Results:**
running 5 tests
test tests::test_instantiate ... ok
test tests::test_create_auction ... ok
test tests::test_place_bid ... ok
test tests::test_buy_now ... ok
test tests::test_kyc_verification ... ok

#### 2.2 Main Auction Contract (`/contracts/auction`)
**Purpose:** Primary auction logic for Coreum blockchain

auction/
├── src/ → Rust contract source
├── scripts/ → Deployment scripts
├── target/ → Compiled WASM
├── tests/ → (Pending)
├── Cargo.toml → Rust dependencies
└── various .sh files → Build/deploy automation

#### 2.3 Auction Variants
| Contract | Purpose | Status |
|----------|---------|--------|
| `auction-guaranteed/` | Auctions with guaranteed payouts | 🟡 In Progress |
| `auction-simple/` | Minimal auction implementation | 🟡 In Progress |
| `auction-working/` | Working reference implementation | 🟡 In Progress |
| `phoenix-auction/` | Phoenix-specific auction logic | 🟡 In Progress |
| `phoenix-escrow/` | Escrow contract for funds | ✅ COMPLETE |

#### 2.4 Key Contract Files
- `build_and_deploy.sh` - Contract compilation
- `deploy_coreum.sh` - Testnet deployment
- `src/contract.rs` - Main contract logic
- `Cargo.toml` - Rust package management

---

## 📚 MODULE 3: DOCUMENTATION (`/docs`)

### **Purpose:** Comprehensive project documentation

#### 3.1 Architecture (`/docs/architecture`) ✅ **UPDATED**
- `ARCHITECTURE-OVERVIEW.md` - Complete system architecture (UPDATED Feb 13)
- `README.md` - Architecture folder guide
- `PHOENIXPME.md` - Project overview
- `PROGRESS.md` - Development timeline
- `COLLECTIBLES_REGISTRY.md` - Asset tracking

#### 3.2 Business (`/docs/business`)
- `PHOENIXPME.md` - Project overview
- `PROGRESS.md` - Development timeline
- `COLLECTIBLES_REGISTRY.md` - Asset tracking

#### 3.3 Legal (`/docs/legal`)
- `LICENSE_GPLv3_WITH_CARVEOUT.md` - Open source license
- `COMMERCIAL_TERMS_PART1.md` - Commercial terms
- `FEE_MODEL.md` - Platform fee structure
- `CONTRIBUTOR_AGREEMENT.md` - Contributor terms
- `NOTICE.md` - Legal notices
- `TX_INTEGRATION_NOTICE.md` - TX ecosystem integration

#### 3.4 Technical (`/docs/technical`)
- `TECHNICAL_SPECIFICATION.md` - System architecture
- `DAO_OPERATIONS.md` - Governance
- `TOKENOMICS.md` - Token economics

#### 3.5 Development (`/docs/development`)
- `CONTRIBUTOR_GUIDE.md` - How to contribute
- `PROJECT_HEALTH_SUMMARY.md` - Current status

#### 3.6 Setup & Guides (`/docs/setup`, `/docs/guides`)
- `QUICK_START.md` - Getting started
- `INSTALL_DEPENDENCIES.md` - Prerequisitess

#### 3.7 Key Documentation Files
- `README.md` - Project overview
- `ROADMAP.md` - Future plans
- `PROGRESS-02132026.md` - Today's achievements
- `FOCUS_PHOENIXPME.md` - Project focus

---

## 🤖 MODULE 4: SCRIPTS (`/scripts`)

### **Purpose:** Automation and deployment utilities

scripts/
├── build/ → Build scripts
│ └── quick-build.sh → Fast contract compilation
├── deploy/ → Deployment scripts
│ └── deploy-tx-testnet.sh → Coreum testnet deployment
├── build_contracts.sh → Contract build automation
├── start_all.sh → Launch all services
├── start_backend.sh → Start API server
├── start_frontend.sh → Start Next.js app
└── start_insurance.sh → Start insurance service

---

## 🧪 MODULE 5: TESTS (`/tests`) ✅ **EXPANDED**

### **Purpose:** Quality assurance and testing

tests/
├── e2e/ → End-to-end tests
├── fixtures/ → Test data ✅ NEW
│ └── wallets/ → Mock wallet system
│ ├── treasury.json → Admin wallet (10,000,000 balance)
│ ├── deployer.json → Deployment wallet (5,000,000 balance)
│ ├── users.json → 3 test users (alice, bob, charlie)
│ └── index.js → Wallet loader utility
├── integration/ → Integration tests ✅ NEW
│ ├── auction-flow.test.js → Full auction lifecycle test
│ └── test-mock-wallets.js → Wallet loader verification
└── unit/ → Unit tests

### **Test Coverage:**
| Test Suite | Type | Status | Description |
|------------|------|--------|-------------|
| `phoenix-escrow/tests/` | Contract | ✅ PASSING | 5 unit tests for escrow |
| `tests/integration/auction-flow.test.js` | Integration | ✅ PASSING | Complete auction lifecycle |
| `tests/integration/test-mock-wallets.js` | Integration | ✅ PASSING | Wallet loader verification |

### **Mock Wallet System:**
| Wallet | Address | Balance | Role |
|--------|---------|---------|------|
| Treasury | `testcore1mocktreasuryaddress12345` | 13,000,000 | Admin |
| Deployer | `testcore1mockdeployeraddress67890` | 5,000,000 | Deployment |
| Insurance | `testcore1mockinsurancepool66666` | 0 | Pool |
| Seller | `testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen` | 5,000,000 | REAL - Can list items |
| Alice | `testcore14qkw9fplr9xplfl5qwz8rr8f3uxhja8yuf0z6l` | 1,000,000 | REAL - Can bid |
| Bob | `testcore1afmlm9ra7m555vurve6ek4754rnv7max2hl6en` | 2,000,000 | REAL - Can bid |
| Charlie | `testcore1urvw6ta906qphvvrmcuwwxy3z2fqns56er2agu` | 3,000,000 | REAL - Can bid |

### **Test Results:**

🔨 TESTING AUCTION FLOW WITH MOCK WALLETS
STEP 1: Treasury creates auction
📦 treasury creating auction for Rare Collectible at 100
STEP 2: Alice bids
💰 alice placing bid of 100 on auction #1
STEP 3: Bob bids higher
💰 bob placing bid of 150 on auction #1
STEP 4: Treasury ends auction
🏁 treasury ending auction #1
📊 RESULT: { winner: 'bob', amount: 150 }
✅ AUCTION FLOW TEST PASSED!

---


---

## 🎯 MODULE PURPOSE SUMMARY

| Module | Primary Purpose | Technology | Status |
|--------|----------------|------------|--------|
| **apps/backend** | API & Database | Node.js, Express, Prisma | ✅ Active |
| **apps/frontend** | User Interface | Next.js, React, Tailwind | ✅ Active |
| **apps/insurance-module** | Insurance Service | Node.js | 🟡 In Progress |
| **contracts/phoenix-escrow** | Escrow with KYC | Rust, CosmWasm | ✅ COMPLETE |
| **contracts/auction** | Auction Logic | Rust, CosmWasm | 🟡 In Progress |
| **docs/** | Documentation | Markdown | ✅ Complete |
| **scripts/** | Automation | Bash, Shell | ✅ Ready |
| **tests/** | Quality Assurance | Jest, Node | ✅ EXPANDED |

---

## 🔗 CORE MODULE RELATIONSHIPS

Frontend (Port 3000)
↓ API Calls
Backend (Port 3001)
↓ Database Queries
Prisma (PostgreSQL)
↑
Smart Contracts (Coreum Testnet)
↓
Insurance Module (Standalone Service)

---


---

## ✅ CURRENT STATUS (February 13, 2026 - END OF DAY)

| Module | Status | Key Achievement |
|--------|--------|-----------------|
| Backend | ✅ Active | REST API running on port 3001 |
| Frontend | ✅ Active | Multi-wallet (Keplr/Leap) complete |
| **phoenix-escrow** | ✅ **COMPLETE** | 5/5 tests passing, all functions implemented |
| Auction Contract | 🟡 In Progress | Ready for testing |
| Insurance | 🟡 In Progress | Standalone service ready |
| Docs | ✅ Complete | Architecture updated with today's progress |
| **Tests** | ✅ **EXPANDED** | Mock wallet system + integration tests |

---

## 📊 TODAY'S ACHIEVEMENTS (February 13, 2026)

| Achievement | Status | Impact |
|-------------|--------|--------|
| Mock wallet system | ✅ COMPLETE | Zero-risk testing environment |
| Auction flow tests | ✅ PASSING | Full lifecycle verified |
| Phoenix-escrow contract | ✅ COMPLETE | 5 passing tests |
| Architecture docs | ✅ UPDATED | Reflects current state |
| GitHub commits | ✅ PUSHED | 3+ commits today |

---

## 🚀 NEXT MODULES TO DEVELOP (Pre-TX Launch)

| Priority | Module | Timeline |
|----------|--------|----------|
| 1 | Deploy phoenix-escrow to testnet | After TX launch (March 6) |
| 2 | Add tests for auction contract | Before TX launch |
| 3 | Create auction listing UI | Before TX launch |
| 4 | User dashboard | Before TX launch |

---

## 📅 TX MAINNET LAUNCH: MARCH 6, 2026 (22 DAYS)

**Preparation Status:**
- ✅ Contracts: Phoenix-escrow complete and tested
- ✅ Tests: Mock wallet system ready
- ✅ Frontend: Wallet integration working
- ✅ Backend: API ready
- ✅ Documentation: Complete
- 🔄 Auction contract: In progress

---
