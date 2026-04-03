#!/bin/bash
# PhoenixPME Price Update Script - Fixed Version

PASSWORD="Priceupdate!1"
API_URL="https://phoenix-api-756y.onrender.com"

echo "🔄 Enter new prices (press Enter to keep current values)"
echo ""

# Get current prices
echo "Fetching current prices..."
CURRENT=$(curl -s "$API_URL/api/prices")

# Extract current values (handle different response formats)
DEFAULT_GOLD=$(echo "$CURRENT" | grep -o '"gold":[0-9.]*' | cut -d':' -f2 | head -1)
DEFAULT_SILVER=$(echo "$CURRENT" | grep -o '"silver":[0-9.]*' | cut -d':' -f2 | head -1)
DEFAULT_PLATINUM=$(echo "$CURRENT" | grep -o '"platinum":[0-9.]*' | cut -d':' -f2 | head -1)
DEFAULT_PALLADIUM=$(echo "$CURRENT" | grep -o '"palladium":[0-9.]*' | cut -d':' -f2 | head -1)

# If extraction failed, try alternative format
if [ -z "$DEFAULT_GOLD" ]; then
    DEFAULT_GOLD=$(echo "$CURRENT" | grep -o 'gold": [0-9.]*' | cut -d' ' -f2 | head -1)
    DEFAULT_SILVER=$(echo "$CURRENT" | grep -o 'silver": [0-9.]*' | cut -d' ' -f2 | head -1)
    DEFAULT_PLATINUM=$(echo "$CURRENT" | grep -o 'platinum": [0-9.]*' | cut -d' ' -f2 | head -1)
    DEFAULT_PALLADIUM=$(echo "$CURRENT" | grep -o 'palladium": [0-9.]*' | cut -d' ' -f2 | head -1)
fi

# Set defaults if still empty
DEFAULT_GOLD=${DEFAULT_GOLD:-4676}
DEFAULT_SILVER=${DEFAULT_SILVER:-72.9}
DEFAULT_PLATINUM=${DEFAULT_PLATINUM:-1980}
DEFAULT_PALLADIUM=${DEFAULT_PALLADIUM:-1490}

echo "Current prices:"
echo "🥇 Gold: $DEFAULT_GOLD"
echo "🥈 Silver: $DEFAULT_SILVER"
echo "🔷 Platinum: $DEFAULT_PLATINUM"
echo "🔶 Palladium: $DEFAULT_PALLADIUM"
echo ""

# Prompt for new values
read -p "🥇 Gold (current: $DEFAULT_GOLD): " GOLD
read -p "🥈 Silver (current: $DEFAULT_SILVER): " SILVER
read -p "🔷 Platinum (current: $DEFAULT_PLATINUM): " PLATINUM
read -p "🔶 Palladium (current: $DEFAULT_PALLADIUM): " PALLADIUM

# Use current if empty
GOLD=${GOLD:-$DEFAULT_GOLD}
SILVER=${SILVER:-$DEFAULT_SILVER}
PLATINUM=${PLATINUM:-$DEFAULT_PLATINUM}
PALLADIUM=${PALLADIUM:-$DEFAULT_PALLADIUM}

echo ""
echo "📊 Updating prices to:"
echo "🥇 Gold: $GOLD"
echo "🥈 Silver: $SILVER"
echo "🔷 Platinum: $PLATINUM"
echo "🔶 Palladium: $PALLADIUM"
echo ""

read -p "Confirm? (y/n): " CONFIRM

if [ "$CONFIRM" = "y" ]; then
    # Try different possible endpoints
    echo "Attempting to update prices..."
    
    # Try endpoint 1: /api/admin/prices
    RESPONSE=$(curl -s -X POST "$API_URL/api/admin/prices" \
        -H "Content-Type: application/json" \
        -d "{
            \"password\": \"$PASSWORD\",
            \"gold\": $GOLD,
            \"silver\": $SILVER,
            \"platinum\": $PLATINUM,
            \"palladium\": $PALLADIUM
        }")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo "✅ Prices updated successfully via /api/admin/prices"
    else
        # Try endpoint 2: /api/admin/update-prices
        RESPONSE2=$(curl -s -X POST "$API_URL/api/admin/update-prices" \
            -H "Content-Type: application/json" \
            -d "{
                \"password\": \"$PASSWORD\",
                \"gold\": $GOLD,
                \"silver\": $SILVER,
                \"platinum\": $PLATINUM,
                \"palladium\": $PALLADIUM
            }")
        
        if echo "$RESPONSE2" | grep -q '"success":true'; then
            echo "✅ Prices updated successfully via /api/admin/update-prices"
        else
            echo "❌ Failed to update prices via API"
            echo "Response: $RESPONSE"
            
            # Fallback: Save to local file
            echo "💾 Saving prices to local file as fallback..."
            cat > /tmp/current_prices.json << EOF
{
  "gold": $GOLD,
  "silver": $SILVER,
  "platinum": $PLATINUM,
  "palladium": $PALLADIUM,
  "lastUpdated": "$(date -Iseconds)"
}
EOF
            echo "✅ Prices saved to /tmp/current_prices.json"
        fi
    fi
fi

echo "✅ Done!"
