# ⚙️ PhoenixPME Technical Setup Guide

**Last Updated:** February 18, 2026
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