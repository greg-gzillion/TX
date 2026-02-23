import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Simple admin auth (use env var)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';

// Update prices (protected)
router.post('/prices', async (req, res) => {
  const { password, gold, silver, platinum, palladium } = req.body;
  
  // Check auth
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized' 
    });
  }
  
  // Validate inputs
  if (!gold || !silver || !platinum || !palladium) {
    return res.status(400).json({ 
      success: false, 
      error: 'All price fields are required' 
    });
  }
  
  try {
    // Parse to numbers
    const prices = {
      gold: parseFloat(gold),
      silver: parseFloat(silver),
      platinum: parseFloat(platinum),
      palladium: parseFloat(palladium)
    };
    
    // Validate numbers
    if (Object.values(prices).some(isNaN)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid price values' 
      });
    }
    
    // Store in database
    const newPrice = await prisma.priceHistory.create({
      data: {
        ...prices,
        createdAt: new Date()
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Prices updated successfully',
      data: newPrice
    });
    
  } catch (error) {
    console.error('Failed to update prices:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update prices' 
    });
  }
});

// Get latest prices (public)
router.get('/prices/latest', async (req, res) => {
  try {
    const prices = await prisma.priceHistory.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (!prices) {
      return res.status(404).json({ 
        success: false, 
        error: 'No price data found' 
      });
    }
    
    res.json({
      success: true,
      data: prices
    });
    
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch prices' 
    });
  }
});

export default router;