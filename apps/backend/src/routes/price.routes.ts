import { Router } from 'express';
import { getSpotPrice, priceCache } from '../services/priceOracle';

const router = Router();
// TEMPORARY SEED ENDPOINT - REMOVE AFTER USE
router.get('/seed-prices', async (req, res) => {
  try {
    const prisma = (await import('../lib/prisma')).default;
    
    const result = await prisma.priceHistory.create({
      data: {
        gold: 4865.50,
        silver: 72.56,
        platinum: 2014.00,
        palladium: 1671.00
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Prices seeded successfully',
      data: result 
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
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
})
router.get('/migrate', async (req, res) => {
  try {
    const { exec } = require('child_process');
    exec('npx prisma migrate deploy', { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ error: error.message, stderr });
      }
      res.json({ stdout, stderr });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
