# ⚙️ PhoenixPME Technical Setup Guide

**Last Updated:** February 21, 2026
**Purpose:** For developers who want to run the PhoenixPME platform locally

---

## 📋 Prerequisites

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | v20+ | `node --version` |
| PostgreSQL | v14+ | `postgres --version` |
| Git | latest | `git --version` |
| Docker | latest (optional) | `docker --version` |

---

## 🚀 Quick Start (3 Terminals)

### Terminal 1: Start Database
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Verify it's running
sudo systemctl status postgresql
Terminal 2: Start Backend
bash
cd ~/dev/TX/apps/backend

# Install dependencies
npm install

# Set environment variables
export $(cat .env | xargs)

# Start server
npm start
# Runs on http://localhost:3001
Terminal 3: Start Frontend
bash
cd ~/dev/TX/apps/frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Runs on http://localhost:3000
🔧 Configuration Files
Backend .env example:
env
DATABASE_URL="postgresql://postgres@localhost:5432/phoenix"
PORT=3001
NODE_ENV=development
Frontend .env.local example:
env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CHAIN_ID=coreum-testnet-1
🐳 Docker Setup (Optional)
bash
# Run PostgreSQL via Docker
docker run --name phoenix-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:14
✅ Verification
bash
# Check backend
curl http://localhost:3001/health

# Check frontend
curl -I http://localhost:3000
📚 Related Docs
Quick Start Guide - For users using the platform

Coreum Reference - Official Coreum documentation

## 🚀 Quick Start (3 Terminals)
+ 
+ ⚠️ **Note:** The testnet is currently unstable. The frontend uses a mock wallet for UI testing until March 6.

## ✅ Verification
bash
# Check backend
curl http://localhost:3001/health

# Check frontend
curl -I http://localhost:3000
+ 
+ # When running, you should see:
+ # - Frontend: http://localhost:3000
+ # - Mock wallet available for testing

## 🔧 Troubleshooting
+ 
+ ### Mock Wallet Not Showing
+ If the wallet selector doesn't appear, check that:
+ - You're running the latest code (`git pull`)
+ - Dependencies are installed (`npm install`)
+ - No errors in browser console (F12)

4. Add troubleshooting note
diff
## 🔧 Troubleshooting
+ 
+ ### Mock Wallet Not Showing
+ If the wallet selector doesn't appear, check that:
+ - You're running the latest code (`git pull`)
+ - Dependencies are installed (`npm install`)
+ - No errors in browser console (F12)
🔧 FIX COMMANDS:
bash
cd ~/dev/TX/docs/setup
nano SETUP_GUIDE.md
# Make the updates above
📋 UPDATED ENVIRONMENT VARIABLES:
The .env examples are still correct:

bash
# Backend .env
DATABASE_URL="postgresql://postgres@localhost:5432/phoenix"
PORT=3001
NODE_ENV=development

# Frontend .env.local  
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CHAIN_ID=coreum-testnet-1
