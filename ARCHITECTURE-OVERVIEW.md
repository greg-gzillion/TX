# PhoenixPME Architecture Overview
## Generated: February 13, 2026

## 🏗️ PROJECT STRUCTURE OVERVIEW
/home/greg/dev/TX/
├── apps/ → Application Services
├── contracts/ → Smart Contracts
├── docs/ → Documentation
├── scripts/ → Automation Scripts
└── tests/ → Test Suites

---

## 📦 MODULE 1: APPLICATIONS (`/apps`)

### **Purpose:** Core application services that power the PhoenixPME platform

#### 1.1 Backend (`/apps/backend`)
**Purpose:** Main API server handling business logic and database operations
backend/
├── src/ → Source code
│ ├── controllers/ → Request handlers (MVC Controllers)
│ ├── routes/ → API endpoint definitions
│ ├── services/ → Business logic layer
│ ├── models/ → Data models
│ ├── middleware/ → Auth, logging, error handling
│ ├── validators/ → Input validation schemas
│ ├── config/ → Environment configuration
│ └── lib/ → Utility functions
├── prisma/ → Database layer
│ ├── migrations/ → Database version control
│ └── schema.prisma → Database schema definition
├── dist/ → Compiled JavaScript
└── tests/ → Unit and integration tests

**Key Files:**
- `server.ts` - Entry point, runs on port 3001
- `prisma/schema.prisma` - Database models
- `src/routes/` - API endpoints for auctions, users, etc.

#### 1.2 Frontend (`/apps/frontend`)
**Purpose:** Next.js web application for user interface
frontend/
├── app/ → Next.js App Router pages
├── components/ → Reusable React components
│ └── WalletSelector.tsx → Multi-wallet (Keplr/Leap) integration
├── lib/ → Utilities and API client
├── config/ → Frontend configuration
└── test-scripts/ → Frontend testing utilities

**Key Files:**
- `app/page.tsx` - Landing page with wallet connection
- `components/WalletSelector.tsx` - Treasury wallet selector
- `lib/api.ts` - Backend API client

#### 1.3 Insurance Module (`/apps/insurance-module`)
**Purpose:** Standalone service for auction insurance coverage
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

#### 2.1 Main Auction Contract (`/contracts/auction`)
**Purpose:** Primary auction logic for Coreum blockchain
auction/
├── src/ → Rust contract source
├── scripts/ → Deployment scripts
├── target/ → Compiled WASM
├── Cargo.toml → Rust dependencies
└── various .sh files → Build/deploy automation

#### 2.2 Auction Variants
| Contract | Purpose |
|----------|---------|
| `auction-guaranteed/` | Auctions with guaranteed payouts |
| `auction-simple/` | Minimal auction implementation |
| `auction-working/` | Working reference implementation |
| `phoenix-auction/` | Phoenix-specific auction logic |
| `phoenix-escrow/` | Escrow contract for funds |

#### 2.3 Key Contract Files
- `build_and_deploy.sh` - Contract compilation
- `deploy_coreum.sh` - Testnet deployment
- `src/contract.rs` - Main contract logic
- `Cargo.toml` - Rust package management

---

## 📚 MODULE 3: DOCUMENTATION (`/docs`)

### **Purpose:** Comprehensive project documentation

#### 3.1 Business (`/docs/business`)
- `PHOENIXPME.md` - Project overview
- `PROGRESS.md` - Development timeline
- `COLLECTIBLES_REGISTRY.md` - Asset tracking

#### 3.2 Legal (`/docs/legal`)
- `LICENSE_GPLv3_WITH_CARVEOUT.md` - Open source license
- `COMMERCIAL_TERMS_PART1.md` - Commercial terms
- `FEE_MODEL.md` - Platform fee structure
- `CONTRIBUTOR_AGREEMENT.md` - Contributor terms

#### 3.3 Technical (`/docs/technical`)
- `TECHNICAL_SPECIFICATION.md` - System architecture
- `DAO_OPERATIONS.md` - Governance
- `TOKENOMICS.md` - Token economics

#### 3.4 Development (`/docs/development`)
- `CONTRIBUTOR_GUIDE.md` - How to contribute
- `PROJECT_HEALTH_SUMMARY.md` - Current status

#### 3.5 Setup & Guides (`/docs/setup`, `/docs/guides`)
- `QUICK_START.md` - Getting started
- `INSTALL_DEPENDENCIES.md` - Prerequisites

#### 3.6 Key Documentation Files
- `README.md` - Project overview
- `ROADMAP.md` - Future plans
- `PROGRESS-02132026.md` - Today's achievements

---

## 🤖 MODULE 4: SCRIPTS (`/scripts`)

### **Purpose:** Automation and deployment utilities
scripts/
├── build/ → Build scripts
│ └── quick-build.sh → Fast contract compilation
├── deploy/ → Deployment scripts
│ └── deploy-tx-testnet.sh → Coreum testnet deployment
├── start_all.sh → Launch all services
├── start_backend.sh → Start API server
├── start_frontend.sh → Start Next.js app
└── start_insurance.sh → Start insurance service

---

## 🧪 MODULE 5: TESTS (`/tests`)

### **Purpose:** Quality assurance and testing

tests/
├── e2e/ → End-to-end tests
├── integration/ → Integration tests
├── unit/ → Unit tests
└── fixtures/ → Test data

---

## 🎯 MODULE PURPOSE SUMMARY

| Module | Primary Purpose | Technology |
|--------|----------------|------------|
| **apps/backend** | API & Database | Node.js, Express, Prisma |
| **apps/frontend** | User Interface | Next.js, React, Tailwind |
| **apps/insurance-module** | Insurance Service | Node.js |
| **contracts/** | Blockchain Logic | Rust, CosmWasm |
| **docs/** | Documentation | Markdown |
| **scripts/** | Automation | Bash, Shell |
| **tests/** | Quality Assurance | Jest, Supertest |

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

## ✅ CURRENT STATUS (February 13, 2026)

| Module | Status | Key Achievement |
|--------|--------|-----------------|
| Backend | ✅ Active | REST API running on port 3001 |
| Frontend | ✅ Active | Wallet integration complete |
| Contracts | 🟡 In Progress | Multiple auction variants |
| Insurance | 🟡 In Progress | Standalone service ready |
| Docs | ✅ Complete | Comprehensive documentation |
| Tests | 🟡 In Progress | Structure in place |

---

## 🚀 NEXT MODULES TO DEVELOP

1. **Auction Module** - Create auction listing and bidding UI
2. **User Dashboard** - User auction management
3. **Admin Panel** - Platform administration
4. **Analytics Service** - Platform metrics

---

*Document maintained by Greg - Last updated: February 13, 2026*

