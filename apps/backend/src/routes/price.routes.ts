import { Router } from 'express';
import { getSpotPrice, priceCache } from '../services/priceOracle';

const router = Router();
// TEMPORARY MIGRATION ENDPOINT - REMOVE AFTER USE
router.get('/migrate', async (req, res) => {
  try {
    const { exec } = require('child_process');
    exec('npx prisma migrate deploy', { cwd: process.cwd() }, (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ error: error.message, stderr });
      }
      res.json({ stdout, stderr });
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
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
