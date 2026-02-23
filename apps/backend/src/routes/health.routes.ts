import { Router } from 'express';
import { config } from '../config';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Test route - to verify routing is working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Health routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Basic health check
router.get('/', async (req, res) => {
  try {
    const startTime = Date.now();

    // ACTUALLY test database connection
    let dbConnected = false;
    let dbError = null;
    
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch (error) {
      dbError = error instanceof Error ? error.message : 'Database connection failed';
      console.error('Database connection error:', error);
    }

    // Get system info
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    const responseTime = Date.now() - startTime;

    res.status(dbConnected ? 200 : 503).json({
      success: dbConnected,
      data: {
        status: dbConnected ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        service: config.APP_NAME || 'phoenixpme-backend',
        version: config.VERSION,
        environment: config.NODE_ENV,
        nodeVersion: process.version,
        uptime: `${Math.floor(uptime)} seconds`,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
        },
        database: {
          configured: !!config.DATABASE_URL,
          connected: dbConnected,
          error: dbError,
          // Show which URL is being used (masked)
          url: config.DATABASE_URL?.replace(/:([^@]+)@/, ':****@'),
        },
        features: {
          kyc: config.FEATURE_KYC,
          escrow: config.FEATURE_ESCROW,
          twoFA: config.FEATURE_2FA,
        },
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
});

// Database health check
router.get('/database', async (req, res) => {
  try {
    let connected = false;
    let error = null;
    
    try {
      await prisma.$queryRaw`SELECT 1`;
      connected = true;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Connection failed';
    }
    
    res.status(connected ? 200 : 500).json({
      success: connected,
      data: {
        status: connected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        database: config.DATABASE_URL ? 'postgresql' : 'not configured',
        url: config.DATABASE_URL?.replace(/:([^@]+)@/, ':****@'),
        error: error,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Database check failed',
      },
    });
  }
});

// Config health check (expose non-sensitive config)
router.get('/config', async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      environment: config.NODE_ENV,
      version: config.VERSION,
      appName: config.APP_NAME,
      appUrl: config.APP_URL,
      database: {
        configured: !!config.DATABASE_URL,
        url: config.DATABASE_URL?.replace(/:([^@]+)@/, ':****@'),
      },
      features: {
        kyc: config.FEATURE_KYC,
        escrow: config.FEATURE_ESCROW,
        twoFA: config.FEATURE_2FA,
      },
    },
  });
});

// Debug endpoint to see ALL environment (BE CAREFUL - sanitize!)
router.get('/debug-env', async (req, res) => {
  // Only allow in development or with secret token
  if (config.NODE_ENV !== 'development' && req.query.secret !== 'your-debug-secret') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const dbUrl = process.env.DATABASE_URL || 'not set';
  const prodDbUrl = process.env.PROD_DATABASE_URL || 'not set';
  
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL_set: !!process.env.DATABASE_URL,
    DATABASE_URL_preview: dbUrl.replace(/:([^@]+)@/, ':****@'),
    PROD_DATABASE_URL_set: !!process.env.PROD_DATABASE_URL,
    PROD_DATABASE_URL_preview: prodDbUrl.replace(/:([^@]+)@/, ':****@'),
    config_DATABASE_URL: config.DATABASE_URL?.replace(/:([^@]+)@/, ':****@'),
    timestamp: new Date().toISOString(),
  });
});

export default router;