'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import WalletSelector from '../../../components/WalletSelector';

interface Bid {
  bidder: string;
  amount: number;
  timestamp: string;
}

interface Auction {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  startingPrice: number;
  buyNowPrice?: number;
  endsAt: string;
  bids: Bid[];
  status: 'active' | 'ended' | 'sold';
}

export default function AuctionDetailPage() {
  const params = useParams();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setAuction({
        id: params.id as string,
        title: 'Sample Auction',
        description: 'This is a sample auction description.',
        currentBid: 150,
        startingPrice: 100,
        buyNowPrice: 500,
        endsAt: '2024-03-01',
        status: 'active',
        bids: [
          { bidder: 'testcore1...1234', amount: 150, timestamp: '2 hours ago' },
          { bidder: 'testcore1...5678', amount: 120, timestamp: '3 hours ago' },
        ]
      });
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Placed bid of ${bidAmount} TEST`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading auction details...</div>;
  }

  if (!auction) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl mb-4">Auction not found</h1>
        <Link href="/auctions" className="text-blue-600 hover:underline">
          Back to auctions
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/auctions" className="text-blue-600 hover:underline mb-4 block">
          ← Back to auctions
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">{auction.title}</h1>
          <p className="text-gray-600 mb-6">{auction.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Current Bid:</span> {auction.currentBid} TEST</p>
                <p><span className="font-medium">Starting Price:</span> {auction.startingPrice} TEST</p>
                {auction.buyNowPrice && (
                  <p><span className="font-medium">Buy Now:</span> {auction.buyNowPrice} TEST</p>
                )}
                <p><span className="font-medium">Ends:</span> {auction.endsAt}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    auction.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                  }`}>
                    {auction.status}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Place Bid</h2>
              {!walletAddress ? (
                <WalletSelector onConnect={setWalletAddress} />
              ) : (
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Bid (minimum: {auction.currentBid + 1} TEST)
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={auction.currentBid + 1}
                      step="0.01"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Place Bid
                  </button>
                </form>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Bid History</h2>
            {auction.bids.length === 0 ? (
              <p className="text-gray-500">No bids yet</p>
            ) : (
              <div className="space-y-2">
                {auction.bids.map((bid, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <span className="font-mono text-sm">{bid.bidder}</span>
                    <span className="font-medium">{bid.amount} TEST</span>
                    <span className="text-gray-500 text-sm">{bid.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
