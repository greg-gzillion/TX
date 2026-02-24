import app from './app';
import { config } from './config';

const PORT = config.PORT || 3001;

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 PhoenixPME Backend Server Started!
📍 Port: ${PORT}
📅 Time: ${new Date().toISOString()}
📊 Environment: ${config.NODE_ENV || 'development'}
🔗 Health: http://localhost:${PORT}/api/health
🔗 API: http://localhost:${PORT}/api

📝 Available Endpoints:
  GET  /api/health            - Health check
  GET  /api/health/database    - Database status
  GET  /api/health/config      - Config info
  POST /api/auth/register     - Register user
  POST /api/auth/login        - Login user
  GET  /api/auctions          - List auctions
  GET  /api/sandbox/auctions  - Mock auctions
  GET  /api/sandbox/wallets   - Test wallets
  `);
});
