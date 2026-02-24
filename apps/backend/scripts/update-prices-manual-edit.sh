#!/bin/bash

# Kitco live prices as of Feb 23, 2026 19:44 EST
GOLD=5229.30
SILVER=87.72
PLATINUM=2148.00
PALLADIUM=1723.00

# Your admin password
PASSWORD="Priceupdate!1"

echo "🔄 Updating prices to Kitco live rates..."
echo "🥇 Gold: $GOLD"
echo "🥈 Silver: $SILVER"
echo "🔷 Platinum: $PLATINUM"
echo "🔶 Palladium: $PALLADIUM"

curl -X POST https://phoenix-api-756y.onrender.com/api/admin/prices \
  -H "Content-Type: application/json" \
  -d "{
    \"password\": \"$PASSWORD\",
    \"gold\": $GOLD,
    \"silver\": $SILVER,
    \"platinum\": $PLATINUM,
    \"palladium\": $PALLADIUM
  }"

echo -e "\n✅ Done!"