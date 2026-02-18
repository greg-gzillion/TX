# PhoenixPME - Precious Metals Exchange on TX Blockchain

**Target Chain:** TX (Coreum + Sologenic Merger)  
**Status:** Reorganized & Ready for Deployment

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
- 100% goes to insurance pool (building capital for future insurance)
- Developer stake: 10% ownership of accumulated insurance pool

**Future Insurance Transaction Fees:**
- 10% to Developer (per insurance transaction)
- 90% to Insurance Pool (per insurance transaction)

### 3. Insurance Module (Future)
**Activation:** When insurance pool reaches sufficient capital  
**Developer Stake:** 10% ownership of insurance pool  
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

## 🚀 Try It Now!

### Live Demo
API: https://phoenix-api-756y.onrender.com
Prices: https://phoenix-api-756y.onrender.com/api/prices

### Quick Local Setup
```bash
git clone https://github.com/greg-gzillion/TX.git
cd TX
# Follow the quick start guide in docs/setup/

## Development
| Resource | Link |
|----------|------|
| Repository | [github.com/greg-gzillion/TX](https://github.com/greg-gzillion/TX) |
| Developer | Greg ([@greg-gzillion](https://github.com/greg-gzillion)) |
| Contact | gjf20842@gmail.com |

---

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

---

## Keywords
`TX Blockchain` `Coreum` `Sologenic` `CosmWasm` `Precious Metals` `Gold` `Silver` `RWA` `DEX` `Escrow` `P2P Marketplace`

---

*This is a reorganized version of the original project at [github.com/PhoenixPME/coreum-pme](https://github.com/PhoenixPME/coreum-pme). All legal documents have been transferred and remain in effect.*
