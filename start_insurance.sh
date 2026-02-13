#!/bin/bash
echo "🚀 Starting Phoenix PME Insurance Module..."
echo "=========================================="
cd "$(dirname "$0")/apps/insurance-module" || { echo "❌ Insurance module directory not found!"; exit 1; }
echo "📍 Location: $(pwd)"
echo "🛡️ Insurance services will run on ports 3200-3204"
echo "Press Ctrl+C to stop"
echo ""
npm start
