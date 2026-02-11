import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP',
});
app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'phoenixpme-backend',
    version: '1.0.0',
  });
});

// Simple auth endpoints
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      res.status(400).json({ 
        success: false, 
        error: 'Email, password, and name are required' 
      });
      return;
    }
    
    console.log('Register:', { email, name });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: { 
          id: 'mock-' + Date.now(), 
          email, 
          name, 
          role: 'user', 
          status: 'active',
          createdAt: new Date().toISOString()
        },
        tokens: {
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now()
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
      return;
    }
    
    console.log('Login:', { email });
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { 
          id: 'user-123', 
          email, 
          name: 'Test User', 
          role: 'user', 
          status: 'active' 
        },
        tokens: {
          accessToken: 'real-jwt-token-here',
          refreshToken: 'real-refresh-token-here'
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Auction endpoints
app.get('/api/auctions', (req, res) => {
  res.json({
    success: true,
    data: {
      auctions: [
        { 
          id: '1', 
          title: 'Gold Bar 1oz', 
          description: '999.9 pure gold bar',
          currentBid: 1950, 
          status: 'active',
          endsAt: new Date(Date.now() + 86400000).toISOString()
        },
        { 
          id: '2', 
          title: 'Silver Coin 10oz', 
          description: 'American Silver Eagle',
          currentBid: 280, 
          status: 'active',
          endsAt: new Date(Date.now() + 172800000).toISOString()
        }
      ],
      total: 2,
      page: 1,
      pages: 1
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 PhoenixPME Backend Server Started!
📍 Port: ${PORT}
📅 Time: ${new Date().toISOString()}
📊 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Health: http://localhost:${PORT}/health
🔗 API: http://localhost:${PORT}/api

📝 Available Endpoints:
  GET  /health                - Health check
  POST /api/auth/register     - Register user
  POST /api/auth/login        - Login user
  GET  /api/auctions          - List auctions
  `);
});
