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
- Insurance pool accumulation

### 📅 March 6, 2026:
TX testnet launches - REAL TESTING BEGINS!

**Target Chain:** TX (Coreum + Sologenic Merger)  
**Status:** 🚀 **LIVE!** Deployed on Render & Vercel

---

## Overview
Blockchain-based auction platform for physical precious metals with integrated insurance funding mechanism.

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
- 100% goes to Community Reserve Fund (building capital for future insurance)
- Developer stake: 10% ownership of accumulated Community Reserve Fund

**Future Insurance Transaction Fees:**
- 10% to Developer (per insurance transaction)
- 90% to Insurance Pool (per insurance transaction)

### 3. Insurance Module (Future)
**Activation:** When Community Reserve Fund reaches sufficient capital  
**Developer Stake:** 10% ownership of Community Reserve Fund  
**Insurance Fee:** Competitive percentage TBD ([Fee Model](docs/legal/FEE_MODEL.md))

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
| Insurance Services | Various | 3200-3204 |

---

## 🚀 Try It Now!

### Live Demo
| Service | URL |
|---------|-----|
| **Frontend App** | [https://phoenix-frontend-seven.vercel.app](https://phoenix-frontend-seven.vercel.app) |
| **Backend API** | [https://phoenix-api-756y.onrender.com](https://phoenix-api-756y.onrender.com) |
| **Health Check** | [https://phoenix-api-756y.onrender.com/health](https://phoenix-api-756y.onrender.com/health) |
| **Metal Prices** | [https://phoenix-api-756y.onrender.com/api/prices](https://phoenix-api-756y.onrender.com/api/prices) |

### Current Metal Prices (as of Feb 17, 2026)
```json
{
  "gold": 4865.50,
  "silver": 72.56,
  "platinum": 2014.00,
  "palladium": 1671.00
}

Quick Local Setup
git clone https://github.com/greg-gzillion/TX.git
cd TX
# Follow the quick start guide in docs/setup/QUICK_START.md
Development
Resource	Link
Repository	github.com/greg-gzillion/TX
Developer	Greg (@greg-gzillion)
Contact	gjf20842@gmail.com
⚖️ Legal & Compliance
License
This project is dual-licensed. See DUAL_LICENSE.md for details.

User Agreements
Terms of Service - Platform usage agreement

Privacy Policy - How your data is handled

Risk Disclosure - Important risks

Insurance Disclaimer - Insurance status

Contributor Agreement
All contributors must agree to the terms in CONTRIBUTOR_AGREEMENT.md.

Keywords
TX Blockchain Coreum Sologenic CosmWasm Precious Metals Gold Silver RWA DEX Escrow P2P Marketplace

This is a reorganized version of the original project at github.com/PhoenixPME/coreum-pme. All legal documents have been transferred and remain in effect.

Last Updated: February 17, 2026
Live Frontend: https://phoenix-frontend-seven.vercel.app
Live API: https://phoenix-api-756y.onrender.com