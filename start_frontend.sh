#!/bin/bash
echo "🚀 Starting Phoenix PME Frontend..."
echo "=================================="
cd "$(dirname "$0")/apps/frontend" || { echo "❌ Frontend directory not found!"; exit 1; }
echo "📍 Location: $(pwd)"
echo "🎨 Frontend will run on http://localhost:3000"
echo "Press Ctrl+C to stop"
echo ""
npm run dev
