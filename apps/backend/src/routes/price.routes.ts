import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Get latest prices
router.get('/', async (req, res) => {
  // FORCE CORS HEADERS - IGNORE EVERYTHING ELSE
  res.header('Access-Control-Allow-Origin', 'https://phoenix-frontend-seven.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
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

// Handle OPTIONS requests explicitly
router.options('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://phoenix-frontend-seven.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

export default router;