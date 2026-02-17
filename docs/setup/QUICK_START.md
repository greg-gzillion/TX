# Phoenix PME - Quick Start Guide

## Project Status: ✅ Reorganized & Ready

This guide will help you get PhoenixPME running locally in just a few minutes.

---

## 📋 **Prerequisites**

Before starting, make sure you have:

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | v18+ | `node --version` |
| PostgreSQL | v14+ | `postgres --version` |
| Git | latest | `git --version` |
| Keplr Wallet | latest | Install from [keplr.app](https://www.keplr.app) |

---

## 🚀 **Quick Start (3 Terminals)**

### **Terminal 1: Start Database**
```bash
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
# Navigate to frontend
cd ~/dev/TX/apps/frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
✅ Frontend will show "ready on http://localhost:3000" - KEEP THIS TERMINAL OPEN

Expected output:

text
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
Open a fourth terminal and run:

bash
# Check backend health
curl http://localhost:3001/health

# Check auctions endpoint
curl http://localhost:3001/api/auctions

# Check frontend is accessible
curl -I http://localhost:3000
All commands should return success responses.

🛑 How to Shut Down
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
Keep Terminals 2 and 3 open while using the app

PostgreSQL runs in the background - no terminal needed

Both servers must be running simultaneously

Never close terminals while the app is in use

The backend terminal will "hang" - THIS IS NORMAL

🚀 Quick Commands Reference
Action	Command
Start database	sudo systemctl start postgresql
Start backend	cd ~/dev/TX/apps/backend && npm start
Start frontend	cd ~/dev/TX/apps/frontend && npm run dev
Check backend	curl http://localhost:3001/health
Check auctions	curl http://localhost:3001/api/auctions
Check frontend	curl -I http://localhost:3000
Stop everything	Ctrl+C in each terminal
📚 Additional Resources
Full Documentation

Architecture Overview

Smart Contracts

API Documentation (when backend is running)

Last Updated: February 16, 2026
Version: 2.0
Author: Greg (@greg-gzillion)
