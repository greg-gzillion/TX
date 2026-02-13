# Phoenix PME - Quick Start Guide

## Project Status: ✅ Reorganized & Ready

The project has been successfully reorganized into a clean structure.

## Directory Structure
```
coreum-pme/
├── contracts/          # Smart contracts (Rust/CosmWasm)
├── apps/              # Applications
│   ├── frontend/      # React/Next.js UI
│   └── backend/       # Node.js/Express API
├── docs/              # Documentation
├── scripts/           # Utility scripts
└── config/            # Configuration
```

## Start Development

Open TWO separate terminal windows/tabs:

**Terminal 1 - Backend API:**
```bash
cd ~/coreum-pme
./start_backend.sh
```

**Terminal 2 - Frontend App:**
```bash
cd ~/coreum-pme
./start_frontend.sh
```

## URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/health

## Troubleshooting

**If terminal freezes:**
1. Press `Ctrl+C` to stop
2. If frozen, close terminal window/tab
3. Restart with the script

**To verify setup:**
```bash
cd ~/coreum-pme
./quick_test.sh
```
