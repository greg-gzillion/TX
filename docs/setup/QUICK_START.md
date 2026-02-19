# Phoenix PME - Quick Start Guide
# Phoenix PME - Quick Start Guide
## 🚧 Important Note About Smart Contracts
## 🚧 Critical Timeline Information

**The current Coreum testnet (v3.x) is NOT compatible with our smart contracts (built for v5.0+).**

### 📅 March 6, 2026 - TX TESTNET LAUNCHES
**This is when REAL TESTING BEGINS, NOT mainnet launch.**

On March 6:
- ✅ TX unified testnet goes live
- ✅ Smart contracts CAN be deployed
- ✅ Real testing of auctions/bids starts
- ⏳ Mainnet is still weeks/months away

### What This Means For You:
- **Now:** Use the live UI with mock data
- **March 6+:** Help test real contracts on testnet
- **Future:** Mainnet launch after successful testing

**We're not launching March 6 - we're STARTING REAL TESTING March 6.**

**Why?** TX (Coreum + Sologenic merger) launches March 6 with unified v6.0 testnet and backward compatibility. Your contracts will work immediately.
## Project Status: ✅ **LIVE!** Deployed on Render & Vercel

This guide will help you get PhoenixPME running locally OR connect to the live cloud deployment.

---

## 🚀 **Option 1: Use the Live Cloud Version (Easiest)**

No installation needed! The app is already deployed:

| Service | URL | Status |
|---------|-----|--------|
| **Live Frontend** | `https://phoenix-frontend-seven.vercel.app` | ✅ Active |
| **Live API** | `https://phoenix-api-756y.onrender.com` | ✅ Active |
| **Health Check** | `https://phoenix-api-756y.onrender.com/health` | ✅ Online |
| **Metal Prices** | `https://phoenix-api-756y.onrender.com/api/prices` | ✅ Live Data |

### **Current Metal Prices** (as of Feb 17, 2026)
```json
{
  "gold": 4865.50,
  "silver": 72.56,
  "platinum": 2014.00,
  "palladium": 1671.00
}

⚠️ Note: Free tier spins down after inactivity. First request may take 30-50 seconds.


📋 Local Development Setup
Prerequisites
Node.js v20+ (check with node --version)
PostgreSQL v14+ (check with postgres --version)
Git (check with git --version)
Docker (optional, for local blockchain)
Keplr wallet (install from keplr.app)

🚀 Quick Start (3 Terminals)

Terminal 1: Start Database
bash
# Start PostgreSQL (runs in background)
sudo systemctl start postgresql

# Verify it's running
sudo systemctl status postgresql
✅ You should see active (exited) - this is normal
Terminal 2: Start Backend API
# Navigate to backend
cd ~/dev/TX/apps/backend

# Load environment variables
export $(cat .env | xargs)

# Install dependencies (first time only)
npm install

# Start the server
npm start
✅ Backend will show a banner and "hang" - KEEP THIS TERMINAL OPEN

Expected output:
PhoenixPME Backend Server Started!
📍 Port: 3001
🔗 Health: http://localhost:3001/healtht

Terminal 3: Start Frontend App
bash
# Navigate to frontend
cd ~/dev/TX/apps/frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
✅ Frontend will show "ready on http://localhost:3000" - KEEP THIS TERMINAL OPEN

Expected output:
ready - started server on http://localhost:3000

🎯 Using the Application
Open browser to https://phoenix-frontend-seven.vercel.app (or http://localhost:3000 locally)

Click "Connect Keplr" button

Approve in Keplr extension

Start bidding!

✅ Verify Everything is Working
bash
# Check live cloud API
curl https://phoenix-api-756y.onrender.com/health
curl https://phoenix-api-756y.onrender.com/api/prices

# Check local backend (if running)
curl http://localhost:3001/health

🚀 Quick Commands Reference
Action	Command
Live Frontend	https://phoenix-frontend-seven.vercel.app
Live API	https://phoenix-api-756y.onrender.com
Live Prices	https://phoenix-api-756y.onrender.com/api/prices
Start database	sudo systemctl start postgresql
Start backend	cd ~/dev/TX/apps/backend && npm start
Start frontend	cd ~/dev/TX/apps/frontend && npm run dev
Stop everything	Ctrl+C in each terminal
Last Updated: February 17, 2026
Version: 3.0
Live Frontend: https://phoenix-frontend-seven.vercel.app
Live API: https://phoenix-api-756y.onrender.com
Author: Greg (@greg-gzillion)

## 🔧 Wallet Setup Guide

### Step 1: Install a Wallet

Choose one of these compatible wallets:

| Wallet | Installation | Best For |
|--------|--------------|----------|
| **Keplr** | [keplr.app](https://www.keplr.app) | Most users, stable |
| **Leap** | [leapwallet.io](https://www.leapwallet.io) | Alternative, great UI |

### Step 2: Add Coreum Testnet

#### For Keplr:
1. Open Keplr extension
2. Click the hamburger menu (☰)
3. Select "Add Chain"
4. Enter these details:

```json
{
  "chainId": "coreum-testnet-1",
  "chainName": "Coreum Testnet",
  "rpc": "https://full-node.testnet-1.coreum.dev:26657",
  "rest": "https://rest-full-node.testnet-1.coreum.dev",
  "bip44": {
    "coinType": 990
  },
  "bech32Config": {
    "bech32PrefixAccAddr": "testcore",
    "bech32PrefixAccPub": "testcorepub",
    "bech32PrefixValAddr": "testcorevaloper",
    "bech32PrefixValPub": "testcorevaloperpub",
    "bech32PrefixConsAddr": "testcorevalcons",
    "bech32PrefixConsPub": "testcorevalconspub"
  },
  "currencies": [
    {
      "coinDenom": "TESTCORE",
      "coinMinimalDenom": "utestcore",
      "coinDecimals": 6,
      "coinGeckoId": "coreum"
    }
  ],
  "feeCurrencies": [
    {
      "coinDenom": "TESTCORE",
      "coinMinimalDenom": "utestcore",
      "coinDecimals": 6
    }
  ],
  "stakeCurrency": {
    "coinDenom": "TESTCORE",
    "coinMinimalDenom": "utestcore",
    "coinDecimals": 6
  },
  "gasPriceStep": {
    "low": 0.01,
    "average": 0.025,
    "high": 0.03
  }
}
Click "Add Chain"

Approve in wallet

For Leap:
Similar process, search for "Coreum Testnet" in the network selector

Step 3: Get Test Tokens
Token	Purpose	How to Get
TESTCORE	Gas fees	Coreum Faucet
TESTUSD	Auctions	Coming March 6 with TX testnet
Step 4: Add TESTUSD Token (Manual - Until March 6)
Since TESTUSD isn't auto-detected yet, add it manually:

In Keplr, go to "Add Token"

Enter:

Denom: utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6

Symbol: TESTUSD

Decimals: 6

Click "Add"

Step 5: Verify Connection
Visit PhoenixPME

Click "Connect Wallet"

Your address should appear

You should see TESTCORE balance (TESTUSD after March 6)

❓ Wallet Troubleshooting
Problem	Solution
"Chain not found"	Double-check chain ID: coreum-testnet-1
"No TESTCORE"	Use faucet link above
"TESTUSD not visible"	Add manually using denom above
"Connection fails"	Refresh page, ensure wallet unlocked
"Wrong network"	Switch to Coreum testnet in wallet
text

## 📝 **Also add this to Quick Commands:**

```markdown
| Action | Command/URL |
|--------|-------------|
| **Coreum Faucet** | `https://faucet.testnet-1.coreum.dev` |
| **TESTUSD Denom** | `utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6` |
🚀 This addition gives users:
✅ Step-by-step wallet setup

✅ Exact chain configuration

✅ TESTUSD manual addition guide

✅ Faucet links

✅ Troubleshooting help


