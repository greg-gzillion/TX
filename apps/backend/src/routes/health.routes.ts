import { Router } from 'express';
import { config } from '../config';

const router = Router();

// Basic health check
router.get('/', async (req, res) => {
  try {
    const startTime = Date.now();

    // Check database connection (simplified for now)
    const dbStatus = config.DATABASE_URL ? 'configured' : 'missing';

    // Get system info
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    const responseTime = Date.now() - startTime;

    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
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
        database: dbStatus,
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
    // You can add actual DB connection test here later
    res.status(200).json({
      success: true,
      data: {
        status: 'configured',
        timestamp: new Date().toISOString(),
        database: config.DATABASE_URL ? 'postgresql' : 'not configured',
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
      features: {
        kyc: config.FEATURE_KYC,
        escrow: config.FEATURE_ESCROW,
        twoFA: config.FEATURE_2FA,
      },
    },
  });
});

export default router;