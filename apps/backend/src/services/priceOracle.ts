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
  gold: 5004.80,     // Mock values as fallback
  silver: 78.04,
  platinum: 2094.00,
  palladium: 1716.00,
  lastUpdated: new Date()
};

interface KitcoResponse {
  gold: { usd: number };
  silver: { usd: number };
  platinum: { usd: number };
  palladium: { usd: number };
}

// Fetch from Kitco API
export async function fetchSpotPrices(): Promise<{
  gold: number;
  silver: number;
  platinum: number;
  palladium: number;
}> {
  try {
    const response = await fetch('https://api.kitco.com/metals/prices', {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Kitco API error: ${response.status}`);
    }
    
    const data = await response.json() as KitcoResponse;
    
    return {
      gold: data.gold.usd,
      silver: data.silver.usd,
      platinum: data.platinum.usd,
      palladium: data.palladium.usd
    };
  } catch (error) {
    console.error('Error fetching spot prices:', error);
    
    // Fallback to last known prices from database
    const lastPrice = await prisma.priceHistory.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (lastPrice) {
      return {
        gold: lastPrice.gold,
        silver: lastPrice.silver,
        platinum: lastPrice.platinum,
        palladium: lastPrice.palladium
      };
    }
    
    // Ultimate fallback (keep mock values)
    return {
      gold: 5004.80,
      silver: 78.04,
      platinum: 2094.00,
      palladium: 1716.00
    };
  }
}

// Update prices and store in database
export async function updateSpotPrices(): Promise<void> {
  try {
    const prices = await fetchSpotPrices();
    
    // Update cache
    priceCache = {
      gold: prices.gold,
      silver: prices.silver,
      platinum: prices.platinum,
      palladium: prices.palladium,
      lastUpdated: new Date()
    };
    
    // Store in database for history
    await prisma.priceHistory.create({
      data: {
        gold: prices.gold,
        silver: prices.silver,
        platinum: prices.platinum,
        palladium: prices.palladium
      }
    });
    
    console.log('✅ Spot prices updated:', {
      ...prices,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to update spot prices:', error);
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
    // Try to load latest prices from database
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
      console.log('📊 Loaded cached spot prices from', lastPrice.createdAt);
    } else {
      // Fetch fresh prices
      await updateSpotPrices();
    }
    
    // Schedule daily updates (8am EST)
    const scheduleDaily = () => {
      const now = new Date();
      const target = new Date();
      target.setUTCHours(13, 0, 0, 0); // 8am EST = 13:00 UTC
      
      if (now > target) {
        target.setUTCDate(target.getUTCDate() + 1);
      }
      
      const msUntilTarget = target.getTime() - now.getTime();
      
      setTimeout(async () => {
        await updateSpotPrices();
        scheduleDaily();
      }, msUntilTarget);
    };
    
    scheduleDaily();
  } catch (error) {
    console.error('❌ Failed to initialize price oracle:', error);
  }
}