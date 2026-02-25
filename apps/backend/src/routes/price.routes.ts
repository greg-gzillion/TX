import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Get latest prices - with ABSOLUTELY NO FUCKS GIVEN CORS
router.get('/', async (req, res) => {
  // Kill all caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Force CORS for EVERYONE
  res.setHeader('Access-Control-Allow-Origin', '*');  // TEMPORARY - open to all
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
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

// Handle OPTIONS requests - EXPLICITLY
router.options('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

export default router;