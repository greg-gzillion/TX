'use client';

import { useState, useEffect } from 'react';  // 👈 Add useEffect import
import { Button } from '@/components/ui/Button';

export function AuctionPlayground({ wallet }: { wallet: any }) {
  const [mockAuctions, setMockAuctions] = useState([
   { id: 1, title: '1oz Gold Bar', price: 5004.80, seller: 'Robert', bids: 12 },
   { id: 2, title: '10oz Silver Bar', price: 780.40, seller: 'Alice', bids: 8 },
   { id: 3, title: '1oz Platinum Bar', price: 2094.00, seller: 'Charlie', bids: 5 },
   ]);
  const [newAuction, setNewAuction] = useState({ title: '', price: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleBid = (auctionId: number) => {
    setMockAuctions(prev =>
      prev.map(auction =>
        auction.id === auctionId
          ? { ...auction, bids: auction.bids + 1 }
          : auction
      )
    );
  };

  const handleCreateAuction = () => {
    if (!newAuction.title || !newAuction.price) {
      alert('Please fill in both title and price');
      return;
    }
    
    const priceNum = parseFloat(newAuction.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price');
      return;
    }

    const newId = Math.max(...mockAuctions.map(a => a.id)) + 1;
    setMockAuctions([
      ...mockAuctions,
      {
        id: newId,
        title: newAuction.title,
        price: priceNum,
        seller: wallet?.name || 'Anonymous',
        bids: 0
      }
    ]);
    setNewAuction({ title: '', price: '' });
    setShowCreateForm(false);
  };

  // Fixed useEffect
  useEffect(() => {
    if (!showCreateForm) {
      setNewAuction({ title: '', price: '' });
    }
  }, [showCreateForm]);

  return (
    <div>
      {/* Sandbox Banner - Added at the top */}
      <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 mb-6">
        <p className="text-purple-800 text-sm flex items-center">
          <span className="text-xl mr-2">🧪</span>
          <strong>SANDBOX MODE:</strong> All auctions and bids are temporary mock data. 
          <a href="/auctions/create" className="underline ml-1 font-bold">Go to real auctions →</a>
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🏛️ Auction Playground</h2>
        {wallet && (
          <Button 
            variant="gold" 
            size="sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Create Mock Auction'}
          </Button>
        )}
      </div>

      <p className="text-gray-600 mb-6">
        Test auctions with mock data. Real contract integration coming March 6.
      </p>

      {!wallet ? (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <p className="text-yellow-700">👆 Select a test wallet above to start bidding</p>
        </div>
      ) : (
        <>
          {showCreateForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-3">Create New Mock Auction</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Title (e.g., 1oz Gold Coin)"
                  value={newAuction.title}
                  onChange={(e) => setNewAuction({ ...newAuction, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Starting Price (TESTUSD)"
                  value={newAuction.price}
                  onChange={(e) => setNewAuction({ ...newAuction, price: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <Button onClick={handleCreateAuction} variant="primary">
                  Create Mock Auction
                </Button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAuctions.map((auction) => (
              <div key={auction.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{auction.title}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {auction.bids} bids
                  </span>
                </div>
                <div className="text-2xl font-bold text-amber-600 mb-2">
                  ${auction.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  Seller: {auction.seller}
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  fullWidth
                  onClick={() => handleBid(auction.id)}
                >
                  Place Bid (Test)
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">🎮 Sandbox Controls</h3>
            <p className="text-sm text-gray-600 mb-2">
              Selected wallet: <span className="font-bold">{wallet.name}</span> ({wallet.balance})
            </p>
            <ol className="list-decimal ml-5 text-sm text-gray-600 space-y-1">
              <li>Click "Place Bid" to increase bid count (mock)</li>
              <li>Create your own mock auction with the button above</li>
              <li>Different wallets can bid on auctions</li>
              <li>All data is temporary - reset on page refresh</li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}