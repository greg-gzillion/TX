import { Router } from 'express';
import prisma from '../lib/prisma';
import { priceCache } from '../services/priceOracle';

const router = Router();
console.log('🔵🔵🔵 DEBUG ROUTES LOADED SUCCESSFULLY 🔵🔵🔵');

// Simple test endpoint - ALWAYS works
router.get('/test', (req, res) => {
  console.log('✅ Test endpoint hit at:', new Date().toISOString());
  res.json({ 
    success: true, 
    message: 'Debug routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Price debug endpoint
router.get('/prices-debug', async (req, res) => {
  try {
    console.log('📊 Prices-debug endpoint called');
    
    // Get latest from database
    const dbPrice = await prisma.priceHistory.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // Return both database and cache
    res.json({
      success: true,
      data: {
        database: dbPrice,
        cache: {
          gold: priceCache.gold,
          silver: priceCache.silver,
          platinum: priceCache.platinum,
          palladium: priceCache.palladium,
          lastUpdated: priceCache.lastUpdated
        },
        force_load_ran: true
      }
    });
  } catch (error) {
    console.error('❌ Error in prices-debug:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export default router;