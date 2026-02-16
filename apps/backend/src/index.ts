import app from './server';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
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
  GET  /api/profile           - User profile (protected)
  `);
});
