#!/bin/bash
echo "🚀 Starting Phoenix PME Backend..."
echo "================================="
cd "$(dirname "$0")/apps/backend" || { echo "❌ Backend directory not found!"; exit 1; }
echo "📍 Location: $(pwd)"
echo "📡 Backend will run on http://localhost:3001"
echo "Press Ctrl+C to stop"
echo ""
npm start
