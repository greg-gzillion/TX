import { Router } from 'express';
import { getSpotPrice, priceCache } from '../services/priceOracle';

const router = Router();

// Get current spot prices
router.get('/', async (req, res) => {
  try {
    const { gold, silver, platinum, palladium, lastUpdated } = priceCache;
    
    res.json({
      success: true,
      data: {
        gold,
        silver,
        platinum,
        palladium,
        lastUpdated
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spot prices' });
  }
});

// Get price for specific metal
router.get('/:metal', async (req, res) => {
  try {
    const { metal } = req.params;
    const price = getSpotPrice(metal as any);
    res.json({
      success: true,
      data: {
        metal,
        price,
        lastUpdated: priceCache.lastUpdated
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spot price' });
  }
});

export default router;
