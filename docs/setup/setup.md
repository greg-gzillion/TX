# PhoenixPME Setup Guide

## 🌐 Live Cloud Version (No Setup Required!)

The application is already deployed:

| Service | URL | Status |
|---------|-----|--------|
| **Live API** | `https://phoenix-api-756y.onrender.com` | ✅ Active |
| **Health Check** | `https://phoenix-api-756y.onrender.com/health` | ✅ Online |
| **Metal Prices** | `https://phoenix-api-756y.onrender.com/api/prices` | ✅ Live Data |

### Current Metal Prices (as of Feb 17, 2026)
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

🚀 Quick Setup

Backend
bash
cd apps/backend
npm install
npm start
# Runs on http://localhost:3001

Frontend
bash
cd apps/frontend
npm install
npm run dev
# Runs on http://localhost:3000

# Check live API
curl https://phoenix-api-756y.onrender.com/health

# Check local backend
curl http://localhost:3001/health

Last Updated: February 17, 2026
Live API: https://phoenix-api-756y.onrender.com
