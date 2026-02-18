# Phoenix PME - Quick Start Guide

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
