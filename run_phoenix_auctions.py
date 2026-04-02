#!/usr/bin/env python3
"""
PhoenixPME Complete Auction System
Integrates: Live market data + Your rules + TX blockchain
"""

from market_data_integration import MarketDataIntegration
from phoenix_accurate_engine import PhoenixAccurateEngine
import json

def main():
    print("\n" + "="*70)
    print("🏛️ PHOENIXPME COMPLETE AUCTION SYSTEM")
    print("="*70)
    
    # 1. Load live market data
    print("\n📊 STEP 1: Loading live precious metals prices...")
    market = MarketDataIntegration()
    auction_items = market.generate_auction_items()
    
    # 2. Initialize auction engine with your rules
    print("\n⚙️ STEP 2: Initializing auction engine...")
    engine = PhoenixAccurateEngine()
    engine.create_users(15)  # Create 15 users for realistic trading
    
    # 3. Create auctions from real items
    print("\n🏺 STEP 3: Creating auctions with real-time pricing...")
    for i, item in enumerate(auction_items[:10]):  # First 10 items
        seller = engine.users[i % len(engine.users)]
        auction = engine.create_auction(
            seller, 
            item['description'], 
            item['market_value']
        )
        # Add item details to auction
        auction['metal_type'] = item['metal']
        auction['weight_oz'] = item['weight_oz']
        auction['collateral_amount'] = item['collateral']
    
    # 4. Save complete configuration
    config = {
        'market_prices': market.live_prices,
        'auction_rules': engine.rules,
        'users': len(engine.users),
        'auctions': len(engine.auctions),
        'timestamp': '2026-04-02'
    }
    
    with open('/home/greg/dev/TX/phoenix_config.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print("\n✅ Complete system ready!")
    print(f"   • {len(engine.users)} users created")
    print(f"   • {len(engine.auctions)} auctions available")
    print(f"   • Real-time gold price: ${market.live_prices['gold']['ask']:,.2f}")
    print(f"   • Your rules: 10% collateral, 1.1% fee, 48h inspection")
    
    print("\n📁 Configuration saved to: /home/greg/dev/TX/phoenix_config.json")

if __name__ == "__main__":
    main()
