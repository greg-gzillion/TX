const pinataSDK = require('@pinata/sdk');
require('dotenv').config();

const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
});

pinata.testAuthentication()
  .then(result => console.log('✅ Pinata connected:', result))
  .catch(err => console.error('❌ Pinata failed:', err));
