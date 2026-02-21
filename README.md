# PhoenixPME - Precious Metals Exchange on TX Blockchain

## 📍 Current Status (as of Feb 18, 2026)

### ✅ Working Now:
- Live frontend/backend infrastructure
- Real-time metal prices
- Wallet connection (Keplr/Leap)
- Full UI/UX experience
- TESTUSD token transfers

### 🚧 In Progress:
- Smart contract testing (starts March 6)
- Real auction creation
- On-chain bid placement
- Community Reserve Fund accumulation

### 📅 March 6, 2026:
TX testnet launches - REAL TESTING BEGINS!

**Target Chain:** TX (Coreum + Sologenic Merger)  
**Status:** 🚀 **LIVE!** Deployed on Render & Vercel

---

## Overview
Blockchain-based auction platform for physical precious metals with integrated Community Reserve Fund.

---

## Core Components

### 1. Auction Platform
**Purpose:** Peer-to-peer trading of physical precious metals  
**Fee:** 1.1% per successful transaction ([Fee Model](docs/legal/FEE_MODEL.md))  
**Features:**
- Buy It Now & bidding functionality
- Real-time market data integration
- Seller-set grading premiums
- TX blockchain (Coreum/Sologenic merger) settlement

### 2. Fee Distribution
**Auction Platform Fees (1.1%):**
- 100% goes to Community Reserve Fund
- Developer allocation: 10% of Community Reserve Fund (founder development reward)

**Note:** The insurance concept has been shelved. The Community Reserve Fund will be governed by future DAO vote.

### 3. Community Reserve Fund
**Purpose:** Accumulates 1.1% fees for future community initiatives  
**Governance:** Future DAO will decide fund usage  
**Developer Allocation:** 10% of fund (development reward)

---

## 🪙 TESTUSD Token - Live on TX Testnet

The foundation token for PhoenixPME auctions is now operational on Coreum testnet.

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
| Frontend | React/TypeScript | 3000 |
| Backend | Express.js/PostgreSQL | 3001 |
| Blockchain | Coreum (CosmWasm) | - |
| Reserve Services | Future | TBD |

---

## 🚀 Try It Now!

### Live Demo
| Service | URL |
|---------|-----|
| **Frontend App** | [https://phoenix-frontend-seven.vercel.app](https://phoenix-frontend-seven.vercel.app) |
| **Backend API** | [https://phoenix-api-756y.onrender.com](https://phoenix-api-756y.onrender.com) |
| **Health Check** | [https://phoenix-api-756y.onrender.com/health](https://phoenix-api-756y.onrender.com/health) |
| **Metal Prices** | [https://phoenix-api-756y.onrender.com/api/prices](https://phoenix-api-756y.onrender.com/api/prices) |


## Quick Local Setup
```bash
git clone https://github.com/greg-gzillion/TX.git
cd TX
# Follow the quick start guide in docs/setup/QUICK_START.md
```

## Development
| Resource | Link |
|----------|------|
| Repository | [github.com/greg-gzillion/TX](https://github.com/greg-gzillion/TX) |
| Developer | Greg ([@greg-gzillion](https://github.com/greg-gzillion)) |
| Contact | gjf20842@gmail.com |

## ⚖️ Legal & Compliance

### License
This project is dual-licensed. See [DUAL_LICENSE.md](docs/legal/DUAL_LICENSE.md) for details.

### User Agreements
- [Terms of Service](TERMS_OF_SERVICE.md) - Platform usage agreement
- [Privacy Policy](PRIVACY_POLICY.md) - How your data is handled
- [Risk Disclosure](docs/legal/compliance/RISK_DISCLOSURE.md) - Important risks
- [Insurance Disclaimer](docs/legal/compliance/INSURANCE_DISCLAIMER.md) - Insurance status

### Contributor Agreement
All contributors must agree to the terms in [CONTRIBUTOR_AGREEMENT.md](docs/legal/CONTRIBUTOR_AGREEMENT.md).

## Keywords
`TX Blockchain` `Coreum` `Sologenic` `CosmWasm` `Precious Metals` `Gold` `Silver` `RWA` `DEX` `Escrow` `P2P Marketplace`

---

*This is a reorganized version of the original project at [github.com/PhoenixPME/coreum-pme](https://github.com/PhoenixPME/coreum-pme). All legal documents have been transferred and remain in effect.*

**Last Updated:** February 18, 2026  
**Live Frontend:** [https://phoenix-frontend-seven.vercel.app](https://phoenix-frontend-seven.vercel.app)  
**Live API:** [https://phoenix-api-756y.onrender.com](https://phoenix-api-756y.onrender.com)
