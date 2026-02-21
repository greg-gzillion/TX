import { Router } from 'express';
import { getSpotPrice, priceCache, updateSpotPrices } from '../services/priceOracle';

const router = Router();

// Get current spot prices from cache (updated daily by Kitco)
router.get('/', async (req, res) => {
  try {
    const { gold, silver, platinum, palladium, lastUpdated } = priceCache;
    
    // Calculate time since last update
    const now = new Date();
    const lastUpdate = lastUpdated ? new Date(lastUpdated) : null;
    const hoursSinceUpdate = lastUpdate 
      ? Math.round((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)) 
      : null;
    
    console.log('📊 Price API called - Current cache:', {
      gold, 
      silver, 
      platinum, 
      palladium, 
      lastUpdated,
      hoursSinceUpdate: hoursSinceUpdate ? `${hoursSinceUpdate}h` : 'N/A'
    });
    
    res.json({
      success: true,
      data: {
        gold,
        silver,
        platinum,
        palladium,
        lastUpdated,
        source: 'Kitco API (daily update at 8am EST)',
        nextUpdate: getNextUpdateTime()
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
});

// Get price for specific metal
router.get('/:metal', async (req, res) => {
  try {
    const { metal } = req.params;
    const validMetals = ['gold', 'silver', 'platinum', 'palladium'];
    
    if (!validMetals.includes(metal)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid metal type. Must be one of: ${validMetals.join(', ')}` 
      });
    }
    
    const price = getSpotPrice(metal as any);
    res.json({
      success: true,
      data: {
        metal,
        price,
        lastUpdated: priceCache.lastUpdated,
        source: 'Kitco API'
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
});

// Manual update endpoint (protected - you can add auth later)
router.post('/update', async (req, res) => {
  try {
    console.log('🔄 Manual price update triggered');
    await updateSpotPrices();
    res.json({
      success: true,
      message: 'Prices updated successfully',
      data: priceCache
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
});

// Helper function to calculate next update time (8am EST daily)
function getNextUpdateTime(): string {
  const now = new Date();
  const next = new Date();
  next.setUTCHours(13, 0, 0, 0); // 8am EST = 13:00 UTC
  
  if (now > next) {
    next.setUTCDate(next.getUTCDate() + 1);
  }
  
  return next.toISOString();
}

export default router;