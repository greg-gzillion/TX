#!/bin/bash
# Working price update script

API_URL="http://localhost:3001"
PASSWORD="Priceupdate!1"

echo "🔄 Current Prices:"
echo ""

# Get current prices
CURRENT=$(curl -s "$API_URL/api/prices/latest" | jq '.data')

GOLD=$(echo "$CURRENT" | jq -r '.gold // 4676')
SILVER=$(echo "$CURRENT" | jq -r '.silver // 72.9')
PLATINUM=$(echo "$CURRENT" | jq -r '.platinum // 1980')
PALLADIUM=$(echo "$CURRENT" | jq -r '.palladium // 1490')

echo "🥇 Gold: $GOLD"
echo "🥈 Silver: $SILVER"
echo "🔷 Platinum: $PLATINUM"
echo "🔶 Palladium: $PALLADIUM"
echo ""

read -p "Enter new Gold price: " NEW_GOLD
read -p "Enter new Silver price: " NEW_SILVER
read -p "Enter new Platinum price: " NEW_PLATINUM
read -p "Enter new Palladium price: " NEW_PALLADIUM

NEW_GOLD=${NEW_GOLD:-$GOLD}
NEW_SILVER=${NEW_SILVER:-$SILVER}
NEW_PLATINUM=${NEW_PLATINUM:-$PLATINUM}
NEW_PALLADIUM=${NEW_PALLADIUM:-$PALLADIUM}

echo ""
echo "📊 Updating to:"
echo "🥇 Gold: $NEW_GOLD"
echo "🥈 Silver: $NEW_SILVER"
echo "🔷 Platinum: $NEW_PLATINUM"
echo "🔶 Palladium: $NEW_PALLADIUM"
echo ""

read -p "Confirm? (y/n): " CONFIRM

if [ "$CONFIRM" = "y" ]; then
    RESPONSE=$(curl -s -X POST "$API_URL/api/admin/update-prices" \
        -H "Content-Type: application/json" \
        -d "{
            \"password\": \"$PASSWORD\",
            \"gold\": $NEW_GOLD,
            \"silver\": $NEW_SILVER,
            \"platinum\": $NEW_PLATINUM,
            \"palladium\": $NEW_PALLADIUM
        }")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo "✅ Prices updated successfully!"
    else
        echo "❌ Update failed: $RESPONSE"
    fi
fi
