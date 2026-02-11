import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { coreumService } from './services/blockchain/coreum.service';
import blockchainRoutes from './routes/blockchain.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize blockchain connection
async function initializeBlockchain() {
    try {
        const mnemonic = process.env.COREUM_MNEMONIC;
        
        if (!mnemonic) {
            console.warn('⚠️  COREUM_MNEMONIC not set in .env file');
            console.warn('   Blockchain features will be disabled');
            return false;
        }
        
        console.log('🔄 Initializing blockchain connection...');
        await coreumService.initialize(mnemonic);
        
        const walletInfo = coreumService.getWalletInfo();
        console.log(`💰 Backend Wallet: ${walletInfo.address}`);
        
        const health = await coreumService.healthCheck();
        if (health.healthy) {
            console.log(`✅ Blockchain connected. Block height: ${health.blockHeight}`);
            return true;
        } else {
            console.warn(`⚠️  Blockchain health check failed: ${health.error}`);
            return false;
        }
        
    } catch (error: any) {
        console.error('❌ Failed to initialize blockchain:', error.message);
        return false;
    }
}

// Routes
app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'phoenixpme-backend',
        blockchain: coreumService.getWalletInfo().isInitialized ? 'connected' : 'disabled'
    });
});

// Blockchain API routes
app.use('/api/blockchain', blockchainRoutes);

// Simple auction endpoints
app.get('/api/auctions', (_req, res) => {
    res.json([
        { 
            id: 1, 
            item: 'Gold Bar 1oz', 
            price: '1000.00',
            seller: 'testcore1seller123...',
            status: 'active',
            token: 'TESTUSD'
        },
        { 
            id: 2, 
            item: 'Silver Coin 2024', 
            price: '50.75',
            seller: 'testcore1seller456...',
            status: 'active',
            token: 'TESTUSD'
        }
    ]);
});

app.post('/api/auctions', async (_req, res) => {
    try {
        res.json({ 
            success: true, 
            message: 'Auction creation simulated. Real blockchain auction coming soon.'
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
async function startServer() {
    console.log('\n🚀 PhoenixPME Backend Server Starting...');
    
    // Initialize blockchain
    const blockchainReady = await initializeBlockchain();
    
    app.listen(PORT, () => {
        console.log(`\n✅ Server Started Successfully!`);
        console.log(`📍 Port: ${PORT}`);
        console.log(`🔗 Health: http://localhost:${PORT}/health`);
        console.log(`💰 Wallet: http://localhost:${PORT}/api/blockchain/wallet`);
        console.log(`📊 Blockchain: ${blockchainReady ? '✅ Connected' : '⚠️ Disabled'}`);
        console.log(`\n💡 Tip: Fund your backend wallet at: https://faucet.testnet-1.coreum.dev`);
    });
}

// Start the server
startServer().catch(console.error);
