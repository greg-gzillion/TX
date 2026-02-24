"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/lib/contexts/ToastContext';
import { PhoenixEscrowClient } from '@/lib/contract/phoenix-escrow';

interface BidFormProps {
  auctionId: number;
  currentBid?: string;
  startingPrice: string;
  minBidIncrement?: number;
  onBidPlaced?: () => void; // For auto-update
}

export default function BidForm({ 
  auctionId, 
  currentBid, 
  startingPrice,
  minBidIncrement = 0.01,
  onBidPlaced
}: BidFormProps) {
  const { address, isConnected, client } = useWallet();
  const { showToast } = useToast();
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<string>('0');

  // Calculate minimum bid
  const minBid = currentBid 
    ? (parseFloat(currentBid) + minBidIncrement).toFixed(2)
    : startingPrice;

  // Calculate 10% collateral
  const bidNum = parseFloat(bidAmount) || 0;
  const collateral = (bidNum * 0.10).toFixed(2);
  const total = (bidNum * 1.10).toFixed(2);

  // Fetch balance when connected
  useEffect(() => {
    if (isConnected && client) {
      fetchBalance();
    }
  }, [isConnected, client]);

  const fetchBalance = async () => {
    try {
      const balance = await client?.getBalance(address, 'ucore');
      setBalance(balance?.amount || '0');
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!isConnected) {
      showToast('Please connect your wallet first', 'error');
      setLoading(false);
      return;
    }

    if (!bidAmount || bidNum <= 0) {
      showToast('Please enter a valid bid amount', 'error');
      setLoading(false);
      return;
    }

    if (bidNum < parseFloat(minBid)) {
      showToast(`Minimum bid is ${minBid} CORE`, 'error');
      setLoading(false);
      return;
    }

    if (bidNum * 1.1 > (parseInt(balance) / 1_000_000)) {
      showToast(`Insufficient funds. Need ${total} CORE`, 'error');
      setLoading(false);
      return;
    }

    try {
      // Convert to ucore (1 CORE = 1,000,000 ucore)
      const bidUcore = (bidNum * 1_000_000).toString();

      const escrowClient = new PhoenixEscrowClient(client!, address);
      const result = await escrowClient.placeBid(auctionId, bidUcore);

      showToast(`✅ Bid placed successfully!`, 'success');
      setBidAmount('');
      
      if (onBidPlaced) {
        onBidPlaced();
      }

    } catch (err: any) {
      console.error('Bid failed:', err);
      showToast(err.message || 'Failed to place bid', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      {/* eBay-style header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-sm text-gray-500">Current bid:</span>
          <span className="text-2xl font-bold ml-2">
            {currentBid ? `$${currentBid}` : `$${startingPrice} (start)`}
          </span>
        </div>
      </div>

      {!isConnected ? (
        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">Connect your wallet to bid</p>
          <button
            onClick={() => window.location.href = '/wallet'}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bid Input - eBay style */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Your maximum bid (CORE)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                step="0.01"
                min={minBid}
								max={(parseInt(balance) / 1_000_000 / 1.1).toFixed(2)}
                placeholder={`Enter ${minBid} or more`}
                className="w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ℹ️ We'll bid for you up to this amount
            </p>
          </div>

          {/* Balance check */}
          {bidAmount && bidNum > 0 && (
            <div className="bg-blue-50 rounded-lg p-3 text-sm">
              <div className="flex justify-between">
                <span>Your balance:</span>
                <span className="font-mono">{(parseInt(balance) / 1_000_000).toFixed(2)} CORE</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Total needed:</span>
                <span className="font-mono">{total} CORE</span>
              </div>
              {bidNum * 1.1 > (parseInt(balance) / 1_000_000) && (
                <p className="text-red-600 text-xs mt-1">
                  ⚠️ Insufficient balance
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !bidAmount || (bidNum * 1.1 > (parseInt(balance) / 1_000_000))}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              loading || !bidAmount
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {loading ? 'Placing Bid...' : 'Place Bid'}
          </button>

          {/* Fine print */}
          <p className="text-xs text-gray-400 text-center">
            🔒 Your max bid is hidden from other bidders
          </p>
        </form>
      )}
    </div>
  );
}