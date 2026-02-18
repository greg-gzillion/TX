# Phoenix PME - Quick Start Guide

## Project Status: ✅ **LIVE!** Deployed on Render

This guide will help you get PhoenixPME running locally OR connect to the live cloud deployment.

---

## 🚀 **Option 1: Use the Live Cloud Version (Easiest)**

No installation needed! The app is already deployed:

| Service | URL | Status |
|---------|-----|--------|
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


📋 Option 2: Run Locally
Prerequisites

# Install Dependencies
### Frontend:
```bash
cd apps/frontend
npm install

## Install Dependencies

Backend:
cd apps/backend
npm install

Requirement	Version	Check Command
Node.js	v18+	node --version
PostgreSQL	v14+	postgres --version
Git	latest	git --version
Keplr Wallet	latest	Install from keplr.app

🚀 Quick Start (3 Terminals)
Terminal 1: Start Database
bash
# Start PostgreSQL (runs in background)
sudo systemctl start postgresql

# Verify it's running
sudo systemctl status postgresql
✅ You should see active (exited) - this is normal


Terminal 2: Start Backend API
bash
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
🚀 PhoenixPME Backend Server Started!
📍 Port: 3001
🔗 Health: http://localhost:3001/health


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
Connect Wallet
Open browser to http://localhost:3000

Click "Connect Keplr" button

Approve in Keplr extension

You'll be redirected to auctions page

Create an Auction
Click "Create New Auction" button

Fill in the details:

Metal type (Gold/Silver/Platinum/Palladium)

Purity (999.9, 999, etc.)

Weight

Starting price

Duration

Click "Create Auction"

Place a Bid
Click on any auction card

Enter your bid amount

Click "Place Bid"

Select Wallet Role
Use the dropdown to switch between test wallets:

Wallet	Balance	Permissions
Seller	5,000,000 TESTUSD	Can list items
Alice	1,000,000 TESTUSD	Can bid
Bob	2,000,000 TESTUSD	Can bid
Charlie	3,000,000 TESTUSD	Can bid
Treasury	13,000,000 TESTUSD	Admin
Deployer	5,000,000 TESTUSD	System
Insurance	0 TESTUSD	Escrow
✅ Verify Everything is Working
bash
# Check live cloud API
curl https://phoenix-api-756y.onrender.com/health
curl https://phoenix-api-756y.onrender.com/api/prices

# Check local backend (if running)
curl http://localhost:3001/health
curl http://localhost:3001/api/auctions
curl -I http://localhost:3000
🛑 How to Shut Down Local Instance
Server	Action
Frontend	Press Ctrl+C in Terminal 3
Backend	Press Ctrl+C in Terminal 2
Database	sudo systemctl stop postgresql (optional)
🔧 Troubleshooting
Backend won't start
bash
# Check if .env file exists and has correct database URL
cat ~/dev/TX/apps/backend/.env

# Should contain:
# DATABASE_URL="postgresql://postgres@localhost:5432/phoenix"
Frontend shows blank page
Open browser console (F12)

Look for error messages

Ensure backend is running: curl http://localhost:3001/health

Wallet won't connect
Make sure Keplr is installed

Check you're on Coreum testnet

Look for errors in browser console

Database connection errors
bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Verify database exists
sudo -u postgres psql -c "\l" | grep phoenix

# If missing, create it
sudo -u postgres createdb phoenix
📌 Important Notes
Live cloud version is free but may have cold starts (30-50s delay)

Keep Terminals 2 and 3 open while using the app locally

PostgreSQL runs in the background - no terminal needed

Both servers must be running simultaneously for local dev

The backend terminal will "hang" - THIS IS NORMAL

🚀 Quick Commands Reference
Action	Command
Check live API	curl https://phoenix-api-756y.onrender.com/health
Check live prices	curl https://phoenix-api-756y.onrender.com/api/prices
Start database	sudo systemctl start postgresql
Start backend	cd ~/dev/TX/apps/backend && npm start
Start frontend	cd ~/dev/TX/apps/frontend && npm run dev
Check local backend	curl http://localhost:3001/health
Stop everything	Ctrl+C in each terminal
📚 Additional Resources
Full Documentation

Architecture Overview

Smart Contracts

Live API Documentation

GitHub Repository

Last Updated: February 17, 2026
Version: 2.1
Live API: https://phoenix-api-756y.onrender.com
Author: Greg (@greg-gzillion)
