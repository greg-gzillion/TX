"use client";

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { PhoenixEscrowClient } from '@/lib/contract/phoenix-escrow';

interface BidFormProps {
  auctionId: number;
  currentBid?: string;
  startingPrice: string;
  minBidIncrement?: number; // Default 1% or 0.01 CORE
}

export default function BidForm({ 
  auctionId, 
  currentBid, 
  startingPrice,
  minBidIncrement = 0.01 
}: BidFormProps) {
  const { address, isConnected, client } = useWallet();
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate minimum bid
  const minBid = currentBid 
    ? (parseFloat(currentBid) + minBidIncrement).toFixed(2)
    : startingPrice;

  // Calculate 10% collateral
  const bidNum = parseFloat(bidAmount) || 0;
  const collateral = (bidNum * 0.10).toFixed(2);
  const total = (bidNum * 1.10).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!bidAmount || bidNum <= 0) {
      setError('Please enter a valid bid amount');
      return;
    }

    if (bidNum < parseFloat(minBid)) {
      setError(`Minimum bid is ${minBid} CORE`);
      return;
    }

    setLoading(true);

    try {
      // Convert to ucore (1 CORE = 1,000,000 ucore)
      const bidUcore = (bidNum * 1_000_000).toString();

      const escrowClient = new PhoenixEscrowClient(client!, address);
      const result = await escrowClient.placeBid(auctionId, bidUcore);

      setSuccess(`✅ Bid placed successfully! Transaction: ${result.transactionHash.slice(0, 10)}...`);
      setBidAmount('');
      
      // Refresh the page after 2 seconds to show new bid
      setTimeout(() => window.location.reload(), 2000);

    } catch (err: any) {
      console.error('Bid failed:', err);
      
      // Handle specific errors
      if (err.message.includes('insufficient funds')) {
        setError(`Insufficient funds. You need at least ${total} CORE (bid + 10% collateral)`);
      } else if (err.message.includes('below reserve')) {
        setError('Bid is below reserve price');
      } else {
        setError(err.message || 'Failed to place bid');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Place Your Bid</h3>
      
      {!isConnected ? (
        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">Connect your wallet to place a bid</p>
          <button
            onClick={() => window.location.href = '/wallet'}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bid Input */}
          <div>
            <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Your Bid (CORE)
            </label>
            <input
              type="number"
              id="bidAmount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              step="0.01"
              min={minBid}
              placeholder={`Minimum ${minBid} CORE`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              disabled={loading}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum bid: {minBid} CORE
              {currentBid && ` (current bid: ${currentBid} CORE)`}
            </p>
          </div>

          {/* Collateral Breakdown */}
          {bidAmount && bidNum > 0 && (
            <div className="bg-amber-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Your bid:</span>
                <span className="font-medium">{bidAmount} CORE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Collateral (10%):</span>
                <span className="font-medium">{collateral} CORE</span>
              </div>
              <div className="border-t border-amber-200 my-2 pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total required:</span>
                  <span className="text-amber-800">{total} CORE</span>
                </div>
              </div>
              <p className="text-xs text-amber-700 mt-2">
                🔒 Collateral is fully refundable when auction completes
              </p>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !bidAmount}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              loading || !bidAmount
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Place Bid'
            )}
          </button>

          {/* Wallet Info */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Connected: {address?.slice(0, 10)}...{address?.slice(-6)}
          </p>
        </form>
      )}
    </div>
  );
}
