import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.routes';
import auctionRoutes from './routes/auction.routes';
import healthRoutes from './routes/health.routes';
import sandboxRoutes from './routes/sandbox.routes';
import priceRoutes from './routes/price.routes';

// Import middleware
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware - Update with your frontend URL
app.use(cors({
  origin: ['https://phoenix-frontend-seven.vercel.app', 'http://localhost:3000'],
  credentials: true,
}));

// Other middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Root route - welcome message (add BEFORE API routes)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PhoenixPME API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      auctions: '/api/auctions',
      prices: '/api/prices',
      sandbox: '/api/sandbox/auctions',
      auth: '/api/auth/login'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/sandbox', sandboxRoutes);
app.use('/api/prices', priceRoutes); // Note: priceRoutes (singular), not pricesRoutes

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

export { app };
// CORS fix deployed Mon Feb 23 05:16:12 PM MST 2026
