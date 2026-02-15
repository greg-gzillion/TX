'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { auctionClient, Auction } from '../../../lib/contracts/auction-client';

export default function AuctionDetailPage() {
  const params = useParams();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);

  useEffect(() => {
    loadAuction();
  }, [params.id]);

  const loadAuction = async () => {
    try {
      const id = parseInt(params.id as string);
      const auctionData = await auctionClient.getAuction(id);
      setAuction(auctionData);
    } catch (error) {
      console.error('Error loading auction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auction) return;
    
    setIsBidding(true);
    try {
      await auctionClient.placeBid(auction.id, bidAmount);
      alert('✅ Bid placed successfully!');
      loadAuction(); // Refresh auction data
      setBidAmount('');
    } catch (error) {
      alert('Failed to place bid: ' + (error as Error).message);
    } finally {
      setIsBidding(false);
    }
  };

  const handleEndAuction = async () => {
    if (!auction) return;
    if (!confirm('Are you sure you want to end this auction?')) return;
    
    setIsEnding(true);
    try {
      const result = await auctionClient.endAuction(auction.id);
      alert(`✅ Auction ended. Winner: ${result.winner}, Amount: ${result.amount} TEST`);
      loadAuction();
    } catch (error) {
      alert('Failed to end auction: ' + (error as Error).message);
    } finally {
      setIsEnding(false);
    }
  };

  const handleReleaseFunds = async () => {
    if (!auction) return;
    if (!confirm('Release funds to seller?')) return;
    
    setIsReleasing(true);
    try {
      await auctionClient.releaseToSeller(auction.id);
      alert('✅ Funds released to seller');
      loadAuction();
    } catch (error) {
      alert('Failed to release funds: ' + (error as Error).message);
    } finally {
      setIsReleasing(false);
    }
  };

  const isSeller = auction?.seller === "testcore1mj58cdfrkc8uyunw2rna3wvkatdjfhd6f6spqd";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-2xl text-gray-600">Loading auction...</div>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Auction Not Found</h1>
          <Link href="/auctions" className="text-blue-600 hover:underline">
            ← Back to auctions
          </Link>
        </div>
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
          <h1 className="text-3xl font-bold mb-4">Auction #{auction.id}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Item:</span> {auction.item_description}</p>
                <p><span className="font-medium">Seller:</span> {auction.seller}</p>
                <p><span className="font-medium">Starting Price:</span> {auction.starting_price} TEST</p>
                <p><span className="font-medium">Current Bid:</span> {auction.current_bid?.amount || 'No bids'} TEST</p>
                {auction.current_bid && (
                  <p><span className="font-medium">Highest Bidder:</span> {auction.current_bid.bidder}</p>
                )}
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    auction.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    auction.status === 'Ended' ? 'bg-yellow-100 text-yellow-800' :
                    auction.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {auction.status}
                  </span>
                </p>
                <p><span className="font-medium">Created:</span> {new Date(auction.created_at).toLocaleString()}</p>
                <p><span className="font-medium">Ends:</span> {new Date(auction.end_time).toLocaleString()}</p>
              </div>
            </div>

            {auction.status === 'Active' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Place Bid</h2>
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Bid (minimum: {parseInt(auction.current_bid?.amount || auction.starting_price) + 1} TEST)
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={parseInt(auction.current_bid?.amount || auction.starting_price) + 1}
                      step="0.01"
                      className="w-full p-2 border rounded"
                      required
                      disabled={isBidding}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isBidding}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isBidding ? 'Placing Bid...' : 'Place Bid'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Seller Actions */}
          {isSeller && auction.status === 'Active' && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Seller Actions</h2>
              <button
                onClick={handleEndAuction}
                disabled={isEnding}
                className="bg-yellow-600 text-white px-6 py-3 rounded hover:bg-yellow-700 disabled:opacity-50"
              >
                {isEnding ? 'Ending...' : 'End Auction'}
              </button>
            </div>
          )}

          {isSeller && auction.status === 'Ended' && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Seller Actions</h2>
              <button
                onClick={handleReleaseFunds}
                disabled={isReleasing}
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isReleasing ? 'Releasing...' : 'Release Funds to Seller'}
              </button>
            </div>
          )}

          {/* Auction Result */}
          {auction.winner && auction.status !== 'Active' && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Auction Result</h2>
              <p><span className="font-medium">Winner:</span> {auction.winner}</p>
              <p><span className="font-medium">Winning Amount:</span> {auction.winning_amount} TEST</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
