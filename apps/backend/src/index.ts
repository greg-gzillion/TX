import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import auctionRoutes from './routes/auction.routes';
import blockchainRoutes from './routes/blockchain.routes';
import coreumService from './services/blockchain/coreum.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/blockchain', blockchainRoutes);

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

// Auto-connect to Coreum testnet on startup
if (process.env.COREUM_MNEMONIC) {
    coreumService.connect().catch(console.error);
}

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📡 Health: http://localhost:${PORT}/health`);
    console.log(`🔗 Coreum Testnet: ${process.env.COREUM_NODE || 'https://full-node.testnet-1.coreum.dev:26657'}`);
});

export default app;
