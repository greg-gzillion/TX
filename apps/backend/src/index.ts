import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRoutes from './routes/auth.routes';
import auctionRoutes from './routes/auction.routes';
import blockchainRoutes from './routes/blockchain.routes';
import priceRoutes from './routes/price.routes';
import debugRoutes from './routes/debug.routes';  // Add this import
import coreumService from './services/blockchain/coreum.service';
import { initPriceOracle, priceCache } from './services/priceOracle';
import prisma from './lib/prisma';

// Load environment variables FIRST
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://phoenix-frontend.vercel.app'
  ]
}));
app.use(express.json());

// Routes - ALL routes must be AFTER app is defined
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/debug', debugRoutes);  // This line is now in the correct place

// Health check with Coreum testnet info
app.get('/health', async (req, res) => {
    const isConnected = coreumService.isConnected();
    const address = coreumService.getAddress();
    
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'phoenixpme-backend',
        version: '1.0.0',
        blockchain: {
            network: 'coreum-testnet-1',
            node: process.env.COREUM_NODE || 'https://full-node.testnet-1.coreum.dev:26657',
            chain_id: process.env.COREUM_CHAIN_ID || 'coreum-testnet-1',
            connected: isConnected,
            address: address || null,
            denom: process.env.COREUM_DENOM || 'utestcore',
            testusd: {
                denom: process.env.TESTUSD_DENOM || 'utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6',
                contract: process.env.TESTUSD_CONTRACT || null
            }
        }
    });
});

// Swagger API Documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PhoenixPME API',
      version: '1.0.0',
      description: 'Backend API for Phoenix Precious Metals Exchange',
    },
    servers: [{ url: 'http://localhost:3001' }],
  },
  apis: ['./src/docs/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ============================================
// SERVER INITIALIZATION
// ============================================

// Auto-connect to Coreum testnet on startup
if (process.env.COREUM_MNEMONIC) {
    coreumService.connect().catch(console.error);
}

// Initialize price oracle (starts daily updates)
initPriceOracle().catch(console.error);

// FORCE LOAD: Read latest prices from database on startup
(async () => {
  try {
    console.log('🔍 FORCE LOAD: Reading latest prices from database...');
    const latestPrice = await prisma.priceHistory.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (latestPrice) {
      priceCache.gold = latestPrice.gold;
      priceCache.silver = latestPrice.silver;
      priceCache.platinum = latestPrice.platinum;
      priceCache.palladium = latestPrice.palladium;
      priceCache.lastUpdated = latestPrice.createdAt;
      
      console.log('✅ FORCE LOAD SUCCESS:', {
        gold: latestPrice.gold,
        silver: latestPrice.silver,
        platinum: latestPrice.platinum,
        palladium: latestPrice.palladium,
        timestamp: latestPrice.createdAt
      });
    } else {
      console.log('⚠️ No price records found in database');
    }
  } catch (error) {
    console.error('❌ FORCE LOAD FAILED:', error);
  }
})();

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  });
}

export default app;