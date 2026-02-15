const fs = require('fs');
const path = require('path');

const wallets = {
  treasury: JSON.parse(fs.readFileSync(path.join(__dirname, 'treasury.json'), 'utf8')),
  deployer: JSON.parse(fs.readFileSync(path.join(__dirname, 'deployer.json'), 'utf8')),
  users: JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'))
  seller: JSON.parse(fs.readFileSync(path.join(__dirname, 'seller.json'), 'utf8')),
  malicious: JSON.parse(fs.readFileSync(path.join(__dirname, 'malicious.json'), 'utf8')),
};

module.exports = wallets;
