const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Your PhoenixPME configuration
const CONFIG = {
    YOUR_ADDRESS: 'testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6',
    PLATFORM_FEE: 0.011, // 1.1%
    TOKEN: 'TESTUSD'
};

// Health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'PhoenixPME Auction Platform',
        version: '1.0.0',
        blockchain: 'Coreum Testnet',
        address: CONFIG.YOUR_ADDRESS,
        platform_fee: `${(CONFIG.PLATFORM_FEE * 100).toFixed(1)}%`,
        settlement_token: CONFIG.TOKEN
    });
});

// Blockchain wallet info
app.get('/api/blockchain/wallet', (req, res) => {
    res.json({
        address: CONFIG.YOUR_ADDRESS,
        isInitialized: true,
        network: 'coreum-testnet-1',
        token_denom: 'utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6'
    });
});

// Calculate fee endpoint
app.post('/api/calculate-fee', (req, res) => {
    const { amount } = req.body;
    const amountNum = parseFloat(amount) || 1000;
    const fee = amountNum * CONFIG.PLATFORM_FEE;
    const net = amountNum - fee;
    
    res.json({
        success: true,
        calculation: {
            gross_amount: amountNum.toFixed(2),
            platform_fee_percent: (CONFIG.PLATFORM_FEE * 100).toFixed(1),
            platform_fee_amount: fee.toFixed(2),
            net_to_seller: net.toFixed(2)
        },
        formula: 'net = gross × (1 - 0.011)',
        token: CONFIG.TOKEN
    });
});

// Auction endpoints
app.get('/api/auctions', (req, res) => {
    res.json({
        auctions: [
            {
                id: 'PHX-001',
                item: '1oz Gold Bar - 999.9 Fine',
                description: 'Investment grade gold bullion',
                seller: CONFIG.YOUR_ADDRESS,
                starting_price: '1000.00',
                current_bid: '1050.00',
                currency: CONFIG.TOKEN,
                status: 'active',
                ends_in: '2 days',
                fee_note: '1.1% platform fee applies on settlement'
            },
            {
                id: 'PHX-002',
                item: '2024 American Silver Eagle',
                description: '1oz .999 fine silver coin',
                seller: CONFIG.YOUR_ADDRESS,
                starting_price: '50.00',
                current_bid: '52.75',
                currency: CONFIG.TOKEN,
                status: 'active',
                ends_in: '1 day',
                fee_note: '1.1% platform fee applies on settlement'
            }
        ],
        platform_info: {
            name: 'PhoenixPME',
            fee_structure: '1.1% of final bid',
            settlement: 'TESTUSD tokens on Coreum',
            insurance_pool: 'Fees fund platform insurance'
        }
    });
});

// Create auction (simulated)
app.post('/api/auctions', (req, res) => {
    const { item, price, description } = req.body;
    
    res.json({
        success: true,
        message: 'Auction creation simulated. In production, this would create a smart contract on Coreum blockchain.',
        auction: {
            id: `PHX-${Date.now().toString().slice(-6)}`,
            item: item || 'Precious Metal Item',
            price: price || '1000.00',
            description: description || 'PhoenixPME auction listing',
            seller: CONFIG.YOUR_ADDRESS,
            currency: CONFIG.TOKEN,
            status: 'pending_blockchain',
            fee: '1.1% will be deducted upon settlement',
            next_steps: 'Smart contract deployment required'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 PHOENIXPME AUCTION PLATFORM BACKEND - RUNNING!');
    console.log('='.repeat(60));
    console.log(`📍 Port: ${PORT}`);
    console.log(`💰 Your Address: ${CONFIG.YOUR_ADDRESS}`);
    console.log(`📊 Platform Fee: ${(CONFIG.PLATFORM_FEE * 100).toFixed(1)}%`);
    console.log(`💎 Settlement Token: ${CONFIG.TOKEN}`);
    console.log('');
    console.log('🔗 Available Endpoints:');
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log(`   GET  http://localhost:${PORT}/api/blockchain/wallet`);
    console.log(`   GET  http://localhost:${PORT}/api/auctions`);
    console.log(`   POST http://localhost:${PORT}/api/calculate-fee`);
    console.log(`   POST http://localhost:${PORT}/api/auctions`);
    console.log('');
    console.log('💡 Test with: curl http://localhost:3001/health');
    console.log('='.repeat(60));
});
