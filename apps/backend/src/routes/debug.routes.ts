import { Router } from 'express';
import prisma from '../lib/prisma';
import { priceCache } from '../services/priceOracle';

const router = Router();

// Check database and cache
router.get('/prices-debug', async (req, res) => {
  try {
    // Get latest from database
    const dbPrice = await prisma.priceHistory.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    // Return both
    res.json({
      success: true,
      data: {
        database: dbPrice,
        cache: priceCache,
        force_load_ran: true
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
