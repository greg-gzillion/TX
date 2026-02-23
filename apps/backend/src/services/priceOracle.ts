import prisma from '../lib/prisma'

// Metal types supported
export type MetalType = 'gold' | 'silver' | 'platinum' | 'palladium';

// Price cache (exported for routes)
export let priceCache: {
  gold: number;
  silver: number;
  platinum: number;
  palladium: number;
  lastUpdated: Date | null;
} = {
  gold: 5004.80,
  silver: 78.04,
  platinum: 2094.00,
  palladium: 1716.00,
  lastUpdated: new Date()
};

// Update prices (called by admin panel)
export async function updateSpotPrices(
  gold: number,
  silver: number,
  platinum: number,
  palladium: number
): Promise<void> {
  try {
    // Update cache
    priceCache = {
      gold,
      silver,
      platinum,
      palladium,
      lastUpdated: new Date()
    };
    
    // Store in database for history
    await prisma.priceHistory.create({
      data: {
        gold,
        silver,
        platinum,
        palladium
      }
    });
    
    console.log('✅ Spot prices updated manually:', {
      gold, silver, platinum, palladium,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to update spot prices:', error);
    throw error;
  }
}

// Get current spot price for a metal
export function getSpotPrice(metal: MetalType): number {
  return priceCache[metal] || 0;
}

// Get price difference percentage
export function getPriceDifference(metal: MetalType, auctionPrice: number): number {
  const spot = getSpotPrice(metal);
  if (spot === 0) return 0;
  return ((auctionPrice - spot) / spot) * 100;
}

// Initialize - run once at startup
export async function initPriceOracle() {
  try {
    console.log('📊 Loading latest spot prices from database...');
    const lastPrice = await prisma.priceHistory.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (lastPrice) {
      priceCache = {
        gold: lastPrice.gold,
        silver: lastPrice.silver,
        platinum: lastPrice.platinum,
        palladium: lastPrice.palladium,
        lastUpdated: lastPrice.createdAt
      };
      console.log('✅ Loaded prices from database:', {
        gold: lastPrice.gold,
        silver: lastPrice.silver,
        platinum: lastPrice.platinum,
        palladium: lastPrice.palladium,
        timestamp: lastPrice.createdAt
      });
    } else {
      console.log('⚠️ No database records found, using default values');
    }
    
    // No more scheduled Kitco updates
    console.log('📅 Manual updates only (admin panel)');
    
  } catch (error) {
    console.error('❌ Failed to initialize price oracle:', error);
    
    // Ultimate fallback
    try {
      const lastPrice = await prisma.priceHistory.findFirst({
        orderBy: { createdAt: 'desc' }
      });
      if (lastPrice) {
        priceCache = {
          gold: lastPrice.gold,
          silver: lastPrice.silver,
          platinum: lastPrice.platinum,
          palladium: lastPrice.palladium,
          lastUpdated: lastPrice.createdAt
        };
        console.log('📊 Fallback: Loaded cached spot prices from', lastPrice.createdAt);
      }
    } catch (dbError) {
      console.error('❌ Fallback also failed:', dbError);
    }
  }
}