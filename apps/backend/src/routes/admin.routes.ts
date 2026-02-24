import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Middleware to check admin password
const checkAdminPassword = (req: any, res: any, next: any) => {
  const { password } = req.body;
  
  // For debugging - log received password (remove in production)
  console.log('Admin password check:', { 
    received: password ? '***' : 'none',
    hasEnvVar: !!process.env.ADMIN_PASSWORD 
  });
  
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid password'
    });
  }
  
  next();
};

// Get latest prices
router.get('/prices/latest', async (req, res) => {
  try {
    const prices = await prisma.priceHistory.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    // Set CORS headers explicitly
    res.header('Access-Control-Allow-Origin', 'https://phoenix-frontend-seven.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    
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

// Update prices (protected)
router.post('/prices', checkAdminPassword, async (req, res) => {
  try {
    const { gold, silver, platinum, palladium } = req.body;
    
    console.log('Updating prices:', { gold, silver, platinum, palladium });
    
    // Validate inputs
    if (!gold || !silver || !platinum || !palladium) {
      return res.status(400).json({
        success: false,
        error: 'All price fields are required'
      });
    }
    
    // Create new price entry
    const newPrices = await prisma.priceHistory.create({
      data: {
        gold: parseFloat(gold),
        silver: parseFloat(silver),
        platinum: parseFloat(platinum),
        palladium: parseFloat(palladium)
      }
    });
    
    // Set CORS headers explicitly
    res.header('Access-Control-Allow-Origin', 'https://phoenix-frontend-seven.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    
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

// Handle OPTIONS requests for CORS preflight
router.options('/prices', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://phoenix-frontend-seven.vercel.app');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

router.options('/prices/latest', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://phoenix-frontend-seven.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

export default router;
