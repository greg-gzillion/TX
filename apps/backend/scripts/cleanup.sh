#!/bin/bash
echo "Cleaning up ports..."
sudo fuser -k 3000/tcp 3001/tcp 3002/tcp 3003/tcp 2>/dev/null
sudo pkill -9 node 2>/dev/null
echo "Ports cleared"
