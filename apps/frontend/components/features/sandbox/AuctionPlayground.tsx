'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/shared/ui/Button';

const API_URL = 'https://phoenix-api-756y.onrender.com';

export function AuctionPlayground({ wallet }: { wallet: any }) {
  const [referencePrices, setReferencePrices] = useState({
    gold: 5183.70,
    silver: 87.38,
    platinum: 2254.00,
    palladium: 1754.00
  });
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [pricesLoaded, setPricesLoaded] = useState(false);
  
  // Use reference prices for mock auctions
  const [mockAuctions, setMockAuctions] = useState([
    { 
      id: 1, 
      title: '1oz Gold Bar', 
      price: 5183.70,
      seller: 'Test Seller 1',
      sellerWallet: 'test_wallet_1',
      bids: 12 
    },
    { 
      id: 2, 
      title: '10oz Silver Bar', 
      price: 873.80,
      seller: 'Test Seller 2',
      sellerWallet: 'test_wallet_2',
      bids: 8 
    },
    { 
      id: 3, 
      title: '1oz Platinum Bar', 
      price: 2254.00,
      seller: 'Test Seller 3',
      sellerWallet: 'test_wallet_3',
      bids: 5 
    },
    { 
      id: 4, 
      title: '1oz Palladium Bar', 
      price: 1754.00,
      seller: 'Test Seller 4',
      sellerWallet: 'test_wallet_4',
      bids: 3 
    },
  ]);
  
  const [newAuction, setNewAuction] = useState({ title: '', price: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch prices ONCE when component mounts
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/prices`);
        const data = await response.json();
        if (data.success && data.data) {
          const prices = {
            gold: data.data.gold,
            silver: data.data.silver,
            platinum: data.data.platinum,
            palladium: data.data.palladium
          };
          
          setReferencePrices(prices);
          setLastUpdated(new Date(data.data.createdAt).toLocaleString());
          setPricesLoaded(true);
          
          // Update auction prices with fetched data
          setMockAuctions([
            { 
              id: 1, 
              title: '1oz Gold Bar', 
              price: prices.gold,
              seller: 'Test Seller 1',
              sellerWallet: 'test_wallet_1',
              bids: 12 
            },
            { 
              id: 2, 
              title: '10oz Silver Bar', 
              price: prices.silver * 10,
              seller: 'Test Seller 2',
              sellerWallet: 'test_wallet_2',
              bids: 8 
            },
            { 
              id: 3, 
              title: '1oz Platinum Bar', 
              price: prices.platinum,
              seller: 'Test Seller 3',
              sellerWallet: 'test_wallet_3',
              bids: 5 
            },
            { 
              id: 4, 
              title: '1oz Palladium Bar', 
              price: prices.palladium,
              seller: 'Test Seller 4',
              sellerWallet: 'test_wallet_4',
              bids: 3 
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      }
    };
    
    fetchPrices();
    // NO INTERVAL - only fetch once on mount
  }, []); // Empty dependency array = run once

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
        sellerWallet: wallet?.address || 'unknown',
        bids: 0
      }
    ]);
    setNewAuction({ title: '', price: '' });
    setShowCreateForm(false);
  };

  // Reset form when closing
  useEffect(() => {
    if (!showCreateForm) {
      setNewAuction({ title: '', price: '' });
    }
  }, [showCreateForm]);

  return (
    <div>
      {/* Price Update Indicator - STATIC */}
      {lastUpdated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-4 text-xs text-blue-700 flex justify-between items-center flex-wrap gap-2">
          <span>📊 Reference prices from: {lastUpdated}</span>
          <span className="font-mono">
            🥇 ${referencePrices.gold.toFixed(2)} • 🥈 ${referencePrices.silver.toFixed(2)} • 
            🔷 ${referencePrices.platinum.toFixed(2)} • 🔶 ${referencePrices.palladium.toFixed(2)}
          </span>
        </div>
      )}

      {/* Sandbox Banner */}
      <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 mb-6">
        <p className="text-purple-800 text-sm flex items-center flex-wrap">
          <span className="text-xl mr-2">🧪</span>
          <strong>SANDBOX MODE:</strong> Auctions use reference prices. Bids are mock data.
          <span className="ml-1">Refresh page to update prices.</span>
          <a href="/auctions/create" className="underline ml-2 font-bold">Go to real auctions →</a>
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
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Starting Price (TESTUSD)"
                  value={newAuction.price}
                  onChange={(e) => setNewAuction({ ...newAuction, price: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreateAuction} variant="primary" size="md">
                    Create Mock Auction
                  </Button>
                  <Button onClick={() => setShowCreateForm(false)} variant="secondary" size="md">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAuctions.map((auction) => (
              <div key={auction.id} className="border rounded-lg p-4 hover:shadow-md transition bg-white">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-lg">{auction.title}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {auction.bids} {auction.bids === 1 ? 'bid' : 'bids'}
                  </span>
                </div>
                
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  ${auction.price.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  <div>Seller: {auction.seller}</div>
                  {wallet?.address === auction.sellerWallet && (
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      ✓ Your auction
                    </span>
                  )}
                </div>
                
                <Button 
                  variant="primary" 
                  size="sm" 
                  fullWidth
                  onClick={() => handleBid(auction.id)}
                  disabled={wallet?.address === auction.sellerWallet}
                  title={wallet?.address === auction.sellerWallet ? "You cannot bid on your own auction" : "Place a test bid"}
                >
                  {wallet?.address === auction.sellerWallet ? 'Your Auction' : 'Place Bid (Test)'}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              Sandbox Controls
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Selected Wallet</p>
                <div className="bg-white p-2 rounded border text-sm">
                  <div className="font-bold">{wallet.name}</div>
                  <div className="text-xs text-gray-500 font-mono truncate">{wallet.address}</div>
                  <div className="text-xs text-green-600 mt-1">{wallet.balance}</div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Reference Prices</p>
                <div className="bg-white p-2 rounded border text-xs">
                  <div>🕒 {lastUpdated || 'Loading...'}</div>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <span>🥇 ${referencePrices.gold.toFixed(2)}</span>
                    <span>🥈 ${referencePrices.silver.toFixed(2)}</span>
                    <span>🔷 ${referencePrices.platinum.toFixed(2)}</span>
                    <span>🔶 ${referencePrices.palladium.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <ol className="list-decimal ml-5 text-sm text-gray-600 space-y-1 mt-4">
              <li>Click <span className="font-medium">&ldquo;Place Bid&rdquo;</span> to increase bid count (mock data)</li>
              <li>Create your own mock auction with the <span className="font-medium">&ldquo;+ Create Mock Auction&rdquo;</span> button</li>
              <li>Different wallets can bid on different auctions</li>
              <li>You cannot bid on your own auctions (realistic behavior)</li>
              <li>All data is temporary - resets on page refresh</li>
              <li>Prices are loaded once - refresh to get latest reference prices</li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}