const net = require('net');

const server = net.createServer();

server.on('error', (err) => {
  console.log('❌ Error:', err.message);
  process.exit(1);
});

server.listen(3001, () => {
  console.log('✅ Test server bound to 3001');
  console.log('📡 Port 3001 is available!');
  server.close(() => {
    console.log('🔒 Test server closed');
    process.exit(0);
  });
});
