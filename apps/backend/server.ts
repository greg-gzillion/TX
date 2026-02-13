import 'dotenv/config';
import app from './src/index';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
