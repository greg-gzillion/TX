import { Router, Request, Response } from 'express';

const router = Router();

// Mock data for sandbox
const mockAuctions = [
  { id: 1, title: '1oz Gold Bar', price: 5004.80, seller: 'Robert', bids: 12 },
  { id: 2, title: '10oz Silver Bar', price: 780.40, seller: 'Alice', bids: 8 },
  { id: 3, title: '1oz Platinum Bar', price: 2094.00, seller: 'Charlie', bids: 5 },
];

const testWallets = [
  { name: 'Robert', address: 'testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen', balance: '5,000,000' },
  { name: 'Alice', address: 'testcore14qkw9fplr9xplfl5qwz8rr8f3uxhja8yuf0z6l', balance: '5,000,000' },
  { name: 'Charlie', address: 'testcore1urvw6ta906qphvvrmcuwwxy3z2fqns56er2agu', balance: '5,000,000' },
];

// Get mock auctions
router.get('/auctions', (req: Request, res: Response) => {
  res.json(mockAuctions);
});

// Get test wallets
router.get('/wallets', (req: Request, res: Response) => {
  res.json(testWallets);
});

// Place a mock bid
router.post('/bid/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const auction = mockAuctions.find(a => a.id === parseInt(id));
  
  if (auction) {
    auction.bids += 1;
    res.json({ success: true, auction });
  } else {
    res.status(404).json({ error: 'Auction not found' });
  }
});

export default router;
