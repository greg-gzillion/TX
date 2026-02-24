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
import adminRoutes from './routes/admin.routes';

// Import middleware
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());

// COMPREHENSIVE CORS CONFIGURATION
const allowedOrigins = [
  'https://phoenix-frontend-seven.vercel.app',
  'http://localhost:3000',
  'https://phoenix-frontend-seven.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Explicitly handle preflight requests
app.options('*', cors());

// Other middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Root route - welcome message
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
      auth: '/api/auth/login',
      admin: '/api/admin/prices'
    }
  });
});

// Health check route (simple)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'phoenixpme-backend',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/sandbox', sandboxRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

export default app;
