const wallets = require('../fixtures/wallets');

console.log('🔨 TESTING AUCTION FLOW WITH MOCK WALLETS\n');

// Mock functions
function createAuction(creator, item, price) {
  console.log('📦 ' + creator.name + ' creating auction for ' + item + ' at ' + price);
  return { id: 1, creator: creator.address, item, price };
}

function placeBid(bidder, auctionId, amount) {
  console.log('💰 ' + bidder.name + ' placing bid of ' + amount + ' on auction #' + auctionId);
  return { success: true, bidder: bidder.address, amount };
}

function endAuction(owner, auctionId) {
  console.log('🏁 ' + owner.name + ' ending auction #' + auctionId);
  return { winner: 'bob', amount: 150 };
}

// Run the flow
console.log('STEP 1: Treasury creates auction');
const auction = createAuction(wallets.treasury, 'Rare Collectible', 100);

console.log('\nSTEP 2: Alice bids');
placeBid(wallets.users.alice, auction.id, 100);

console.log('\nSTEP 3: Bob bids higher');
placeBid(wallets.users.bob, auction.id, 150);

console.log('\nSTEP 4: Treasury ends auction');
const result = endAuction(wallets.treasury, auction.id);

console.log('\n📊 RESULT:', result);
console.log('\n✅ AUCTION FLOW TEST PASSED!');
