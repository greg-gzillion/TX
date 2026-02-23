const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3200;

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'insurance-module' });
});

// Insurance calculator service
app.get('/api/insurance/calculator', (req, res) => {
    res.json({ 
        service: 'Insurance Calculator',
        status: 'running',
        endpoints: [
            'http://localhost:3201/calculate',
            'http://localhost:3201/premiums'
        ]
    });
});

// Risk assessment service
app.get('/api/insurance/risk', (req, res) => {
    res.json({ 
        service: 'Risk Assessment',
        status: 'running',
        endpoints: [
            'http://localhost:3202/assess',
            'http://localhost:3202/factors'
        ]
    });
});

// Quote generator
app.get('/api/insurance/quote', (req, res) => {
    res.json({ 
        service: 'Quote Generator',
        status: 'running',
        endpoints: [
            'http://localhost:3203/generate',
            'http://localhost:3203/history'
        ]
    });
});

// RLUSD monitor
app.get('/api/insurance/rlusd', (req, res) => {
    res.json({ 
        service: 'RLUSD Monitor',
        status: 'running',
        pool_size: '50,000 RLUSD (target)',
        current: '0 RLUSD (building)',
        endpoints: [
            'http://localhost:3204/balance',
            'http://localhost:3204/transactions'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`🛡️ Insurance Module running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Calculator: http://localhost:3201`);
    console.log(`   Risk: http://localhost:3202`);
    console.log(`   Quote: http://localhost:3203`);
    console.log(`   RLUSD: http://localhost:3204`);
});
