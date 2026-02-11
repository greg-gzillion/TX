import { Router } from 'express';
import { config } from '../config';

const router = Router();

// Basic health check
router.get('/', async (req, res) => {
  try {
    const startTime = Date.now();

    // Check database connection

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
        service: 'phoenixpme-backend',
        version: config.VERSION || '1.0.0',
        nodeVersion: process.version,
        uptime: `${Math.floor(uptime)} seconds`,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
        },
        database: 'connected',
        redis: 'not configured', // Temporarily disabled
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        redis: 'not configured',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
});

// Database health check
router.get('/database', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        status: 'connected',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {
        status: 'disconnected',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Database connection failed',
      },
    });
  }
});

export default router;
