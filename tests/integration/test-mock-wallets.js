const wallets = require('../fixtures/wallets');

console.log('🧪 Testing mock wallets:');
console.log('-----------------------');
console.log('Treasury:', wallets.treasury.address);
console.log('Deployer:', wallets.deployer.address);
console.log('Users:', Object.keys(wallets.users).join(', '));
console.log('\n✅ All wallets loaded successfully!');
