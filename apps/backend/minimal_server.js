const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Phoenix PME Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API endpoints placeholder
app.get('/api', (req, res) => {
  res.json({
    name: 'Phoenix PME API',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/auth',
      '/api/auctions'
    ]
  });
});

// Auth placeholder
app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint (placeholder)' });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ message: 'Register endpoint (placeholder)' });
});

// Auctions placeholder
app.get('/api/auctions', (req, res) => {
  res.json({ message: 'Get auctions endpoint (placeholder)' });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`==================================`);
  console.log(`   PHOENIX PME BACKEND SERVER`);
  console.log(`==================================`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
  console.log(`==================================`);
});
