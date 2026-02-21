import { Router } from 'express';
import prisma from '../lib/prisma';
import { priceCache } from '../services/priceOracle';

const router = Router();
console.log('✅ DEBUG ROUTES LOADED!');  // This will show in Render logs

// Simple test endpoint
router.get('/test', (req, res) => {
  console.log('📝 Test endpoint called');
  res.json({ 
    success: true, 
    message: 'Debug routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Check database and cache
router.get('/prices-debug', async (req, res) => {
  try {
    console.log('📊 Prices-debug endpoint called');
    const dbPrice = await prisma.priceHistory.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      data: {
        database: dbPrice,
        cache: priceCache,
        force_load_ran: true
      }
    });
  } catch (error: any) {
    console.error('❌ Error in prices-debug:', error);
    res.status(500).json({ 
      success: false, 
      error: error?.message || 'Unknown error occurred' 
    });
  }
});

export default router;