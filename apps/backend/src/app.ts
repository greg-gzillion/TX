import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.routes';
import auctionRoutes from './routes/auction.routes';
import healthRoutes from './routes/health.routes';
import sandboxRoutes from './routes/sandbox.routes';

// Import middleware
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Other middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/sandbox', sandboxRoutes);

// Error handling
app.use(errorHandler);

// 404 handler - remove the '*'
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

export { app };
