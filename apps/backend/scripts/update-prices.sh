#!/bin/bash

# Your admin password
PASSWORD="Priceupdate!1"

echo "🔄 Enter new prices (press Enter to keep current values)"
echo ""

# Get current prices from API first (optional - comment out if not needed)
echo "Fetching current prices..."
CURRENT=$(curl -s https://phoenix-api-756y.onrender.com/api/prices)
DEFAULT_GOLD=$(echo $CURRENT | grep -o '"gold":[0-9.]*' | cut -d':' -f2)
DEFAULT_SILVER=$(echo $CURRENT | grep -o '"silver":[0-9.]*' | cut -d':' -f2)
DEFAULT_PLATINUM=$(echo $CURRENT | grep -o '"platinum":[0-9.]*' | cut -d':' -f2)
DEFAULT_PALLADIUM=$(echo $CURRENT | grep -o '"palladium":[0-9.]*' | cut -d':' -f2)

# Fallback defaults if API fails
DEFAULT_GOLD=${DEFAULT_GOLD:-5167}
DEFAULT_SILVER=${DEFAULT_SILVER:-86.61}
DEFAULT_PLATINUM=${DEFAULT_PLATINUM:-2110}
DEFAULT_PALLADIUM=${DEFAULT_PALLADIUM:-1708}

echo "Current prices:"
echo "🥇 Gold: $DEFAULT_GOLD"
echo "🥈 Silver: $DEFAULT_SILVER"
echo "🔷 Platinum: $DEFAULT_PLATINUM"
echo "🔶 Palladium: $DEFAULT_PALLADIUM"
echo ""

read -p "🥇 Gold (current: $DEFAULT_GOLD): " GOLD_INPUT
read -p "🥈 Silver (current: $DEFAULT_SILVER): " SILVER_INPUT
read -p "🔷 Platinum (current: $DEFAULT_PLATINUM): " PLATINUM_INPUT
read -p "🔶 Palladium (current: $DEFAULT_PALLADIUM): " PALLADIUM_INPUT

# Use input if provided, otherwise keep current
GOLD=${GOLD_INPUT:-$DEFAULT_GOLD}
SILVER=${SILVER_INPUT:-$DEFAULT_SILVER}
PLATINUM=${PLATINUM_INPUT:-$DEFAULT_PLATINUM}
PALLADIUM=${PALLADIUM_INPUT:-$DEFAULT_PALLADIUM}

echo ""
echo "📊 Updating prices to:"
echo "🥇 Gold: $GOLD"
echo "🥈 Silver: $SILVER"
echo "🔷 Platinum: $PLATINUM"
echo "🔶 Palladium: $PALLADIUM"
echo ""

read -p "Confirm? (y/n): " CONFIRM
if [[ $CONFIRM == "y" || $CONFIRM == "Y" ]]; then
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
else
    echo "❌ Cancelled"
fi