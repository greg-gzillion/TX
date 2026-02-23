import { Router } from 'express';
import { getSpotPrice, priceCache, updateSpotPrices } from '../services/priceOracle';
import prisma from '../lib/prisma';

const router = Router();

// Get current spot prices from cache
router.get('/', async (req, res) => {
  try {
    const { gold, silver, platinum, palladium, lastUpdated } = priceCache;
    
    console.log('📊 Price API called - Current cache:', {
      gold, silver, platinum, palladium, lastUpdated
    });
    
    res.json({
      success: true,
      data: {
        gold,
        silver,
        platinum,
        palladium,
        lastUpdated,
        source: 'Manual updates (admin panel)',
        nextUpdate: 'Manual only'
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
        source: 'Manual updates (admin panel)'
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

export default router;