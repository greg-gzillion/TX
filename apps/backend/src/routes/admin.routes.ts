import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Simple update endpoint without auth (for scripts)
router.post('/update-prices', async (req, res) => {
  const { password, gold, silver, platinum, palladium } = req.body;
  
  if (password !== 'Priceupdate!1') {
    return res.status(401).json({ success: false, error: 'Invalid password' });
  }
  
  try {
    const goldNum = parseFloat(gold);
    const silverNum = parseFloat(silver);
    const platinumNum = parseFloat(platinum);
    const palladiumNum = parseFloat(palladium);
    
    console.log('Updating prices in database:', { goldNum, silverNum, platinumNum, palladiumNum });
    
    // Create new price entry in database
    const newPrices = await prisma.priceHistory.create({
      data: {
        gold: goldNum,
        silver: silverNum,
        platinum: platinumNum,
        palladium: palladiumNum,
        createdAt: new Date()
      }
    });
    
    // Also update a "latest" record or cache
    const fs = require('fs');
    fs.writeFileSync('/tmp/current_prices.json', JSON.stringify({
      gold: goldNum,
      silver: silverNum,
      platinum: platinumNum,
      palladium: palladiumNum,
      lastUpdated: new Date().toISOString()
    }));
    
    console.log('✅ Prices updated:', newPrices);
    
    res.json({ 
      success: true, 
      message: 'Prices updated successfully',
      data: newPrices 
    });
  } catch (error) {
    console.error('Error updating prices:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update prices';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Get latest prices
router.get('/prices/latest', async (req, res) => {
  try {
    const prices = await prisma.priceHistory.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      data: prices
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prices'
    });
  }
});

// Also update the main prices endpoint
router.post('/prices', async (req, res) => {
  const { password, gold, silver, platinum, palladium } = req.body;
  
  if (password !== 'Priceupdate!1') {
    return res.status(401).json({ success: false, error: 'Invalid password' });
  }
  
  try {
    const newPrices = await prisma.priceHistory.create({
      data: {
        gold: parseFloat(gold),
        silver: parseFloat(silver),
        platinum: parseFloat(platinum),
        palladium: parseFloat(palladium),
        createdAt: new Date()
      }
    });
    
    res.json({
      success: true,
      data: newPrices,
      message: 'Prices updated successfully'
    });
  } catch (error) {
    console.error('Error updating prices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update prices'
    });
  }
});

export default router;
