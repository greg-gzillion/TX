# PhoenixPME - Precious Metals Exchange on TX Blockchain

## 📍 Current Status (as of Feb 21, 2026)

### ✅ Working Now:
- ✅ Live frontend/backend infrastructure (Vercel + Render)
- ✅ Wallet connection (Keplr/Leap)
- ✅ Full UI/UX experience
- ✅ TESTUSD token transfers
- ✅ Frontend reorganization (clean structure, no duplicates)
- ✅ Static reference prices (manual updates, no API)
- ✅ 5 successful Vercel deployments
- ✅ Smart contracts ready (7 + 16 tests passing)
- ✅ Auction creation form (8 components, metal inputs, purity)
- ✅ Auction listing page (mock data)
- ✅ Dashboard with user stats

### 🚧 In Progress:
- 🚧 Smart contract deployment (March 6, 2026)
- 🚧 Real auction creation (March 6+)
- 🚧 On-chain bid placement (March 6+)
- 🚧 BidForm component (IN PROGRESS)
- 🚧 Auction detail page (PLANNED)
- 🚧 Community Reserve Fund accumulation (test mode)

### 📅 March 6, 2026:
**TX testnet launches - REAL TESTING BEGINS!**

⏳ **13 DAYS TO GO (as of Feb 21)**

---

## 📊 Recent Achievements

| Date | Achievement |
|------|-------------|
| Feb 21 | ✅ Frontend reorganization complete (no duplicates) |
| Feb 21 | ✅ 5 successful Vercel deployments |
| Feb 21 | ✅ Static reference price banner |
| Feb 21 | ✅ Wallet selector fixed |
| Feb 20 | ✅ PhoenixEscrowClient created |
| Feb 19 | ✅ Smart contract deployed on testnet |

---

## 🎯 Project Overview

Blockchain-based auction platform for physical precious metals with integrated **Community Reserve Fund** (1.1% fees).

**Target Chain:** TX (Coreum + Sologenic Merger)  
**Status:** 🚀 **LIVE!** Deployed on Render & Vercel

---

## Core Components

### 1. Auction Platform
**Purpose:** Peer-to-peer trading of physical precious metals  
**Fee:** 1.1% per successful transaction ([Fee Model](docs/legal/FEE_MODEL.md))  
**Features:**
- Buy It Now & bidding functionality
- Reference market prices (updated manually)
- Seller-set grading premiums
- TX blockchain settlement (March 6+)

### 2. Fee Distribution
**Auction Platform Fees (1.1%):**
- 100% goes to Community Reserve Fund
- Developer allocation: 10% voting weight (not withdrawal rights)

**Note:** The insurance concept has been shelved. The Community Reserve Fund will be governed by future DAO vote. No individual can withdraw funds.

### 3. Community Reserve Fund
**Purpose:** Accumulates 1.1% fees for future community initiatives  
**Governance:** Future DAO will decide fund usage  
**Current Status:** ⚠️ Accumulating in test mode (no withdrawals)  
**Address:** `testcore1m5adn3k68tk4zqmujpnstmp9r933jafzu44tnv`

---

## 🪙 TESTUSD Token - Live on Testnet

The foundation token for PhoenixPME auctions is operational on Coreum testnet (TX-compatible).

| Detail | Value |
|--------|-------|
| **Symbol** | TESTUSD |
| **Denom** | `utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6` |
| **Decimals** | 6 |
| **Transaction** | [37EC84596A02687D8F77E7D92538F518CCE847D8B4A325732B911FD0B0D35E9A](https://explorer.coreum.com/tx/37EC84596A02687D8F77E7D92538F518CCE847D8B4A325732B911FD0B0D35E9A) |

📄 [TESTUSD Token Creation Docs](docs/technical/TESTUSD_TOKEN_CREATION.md)

---

## Technical Architecture

| Component | Technology | Port |
|-----------|------------|------|
| Frontend | React/TypeScript (Next.js) | 3000 |
| Backend | Express.js/PostgreSQL | 3001 |
| Blockchain | TX (Coreum + Sologenic) | - |
| Smart Contracts | CosmWasm (Rust) | - |

### Frontend Structure
components/
├── auctions/
│ ├── create/ # Auction creation form
│ ├── list/ # AuctionCard, AuctionList
│ └── bid/ # BidForm (coming soon)
├── wallet/ # WalletSelector
├── layout/ # NavBar
└── shared/ # Button, FilterTabs, PriceBanner

---

## 🚀 Try It Now!

### Live Demo
| Service | URL |
|---------|-----|
| **Frontend App** | [https://phoenix-frontend-seven.vercel.app](https://phoenix-frontend-seven.vercel.app) |
| **Backend API** | [https://phoenix-api-756y.onrender.com](https://phoenix-api-756y.onrender.com) |
| **Health Check** | [https://phoenix-api-756y.onrender.com/health](https://phoenix-api-756y.onrender.com/health) |

### Reference Metal Prices (as of Feb 20, 2026 close)
| Metal | Price |
|-------|-------|
| 🥇 Gold | $5,105.90 |
| 🥈 Silver | $84.52 |
| 🔷 Platinum | $2,157.00 |
| 🔶 Palladium | $1,743.00 |

⚠️ **Note:** These are reference prices updated manually at market close. Sellers set their own auction prices.

---

## 📦 Quick Local Setup

```bash
git clone https://github.com/greg-gzillion/TX.git
cd TX
# Follow the quick start guide in docs/setup/QUICK_START.md
For detailed development setup, see docs/setup/SETUP_GUIDE.md

🤝 Contributing
We welcome contributors! See:

CONTRIBUTING.md - How to contribute

CURRENT-FOCUS.md - What we're building now

ROADMAP.md - Future plans

Current priorities:

BidForm component

Auction detail page

Real contract integration (March 6)

⚖️ Legal & Compliance
License
This project is dual-licensed. See DUAL_LICENSE.md for details.

User Agreements
Document	Purpose
Terms of Service	Platform usage agreement
Privacy Policy	How your data is handled
Risk Disclosure	Important risks
Insurance Disclaimer	Insurance status
Contributor Agreement
All contributors must agree to the terms in CONTRIBUTOR_AGREEMENT.md.

📞 Contact
Developer: Greg (@greg-gzillion)
Email: gjf20842@gmail.com
GitHub: github.com/greg-gzillion/TX

Keywords
TX Blockchain Coreum Sologenic CosmWasm Precious Metals Gold Silver RWA DEX Escrow P2P Marketplace

This is a reorganized version of the original project at github.com/PhoenixPME/coreum-pme. All legal documents have been transferred and remain in effect.

Last Updated: February 21, 2026
Live Frontend: https://phoenix-frontend-seven.vercel.app
Live API: https://phoenix-api-756y.onrender.com