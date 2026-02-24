"use client";

// components/auctions/list/AuctionCard.tsx
import { Auction } from '@/lib/contract/phoenix-escrow';

// TESTUSD has 6 decimals (same as USDC)
const TESTUSD_DECIMALS = 1_000_000;

// Format TESTUSD amount with proper decimals
const formatTestUsd = (amount: string): string => {
  if (!amount) return '0.00';
  const value = parseInt(amount) / TESTUSD_DECIMALS;
  return value.toFixed(2);
};

interface Props {
  auction: Auction;
  onBid?: (id: number) => void;
}

export default function AuctionCard({ auction, onBid }: Props) {
  // Guard against undefined auction
  if (!auction || !auction.description) {
    return null;
  }

  let metadata;
  try {
    metadata = JSON.parse(auction.description);
  } catch (e) {
    console.error('Failed to parse auction description:', e);
    return null;
  }
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-2xl mr-2">
            {metadata?.item?.metalType === 'Gold' && '🥇'}
            {metadata?.item?.metalType === 'Silver' && '🥈'}
            {metadata?.item?.metalType === 'Platinum' && '🔷'}
            {metadata?.item?.metalType === 'Palladium' && '🔶'}
          </span>
          <h3 className="text-lg font-semibold">
            {metadata?.item?.metalType} {metadata?.item?.formType}
          </h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${
          auction.status === 'Active' ? 'bg-green-100 text-green-800' :
          auction.status === 'Sold' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {auction.status}
        </span>
      </div>
      
      <div className="mt-2 space-y-1 text-sm text-gray-600">
        <p>Weight: {metadata?.item?.weight} {metadata?.item?.weightUnit}</p>
        <p>Purity: {metadata?.item?.purity ? (parseFloat(metadata.item.purity) * 100).toFixed(1) : 'N/A'}%</p>
        {metadata?.item?.certification && (
          <p className="text-amber-600">⭐ {metadata.item.certification}</p>
        )}
        {metadata?.item?.serialNumber && <p>Serial: {metadata.item.serialNumber}</p>}
      </div>
      
      <div className="mt-4 space-y-2">
        {/* Price and Bid Section */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Current Bid</p>
            <p className="text-xl font-bold text-amber-700">
              ${auction.current_bid 
                ? formatTestUsd(auction.current_bid)
                : formatTestUsd(auction.starting_price)
              } TESTUSD
            </p>
          </div>
          <button 
            onClick={() => onBid?.(auction.id)}
            disabled={auction.status !== 'Active'}
            className={`px-4 py-2 rounded font-medium ${
              auction.status === 'Active'
                ? 'bg-amber-600 text-white hover:bg-amber-700' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {auction.status === 'Active' ? 'Place Bid' : auction.status}
          </button>
        </div>

        {/* Reserve Price Info */}
        {auction.reserve_price && (
          <div className="text-xs text-gray-400 flex justify-between">
            <span>Reserve: ${formatTestUsd(auction.reserve_price)} TESTUSD</span>
            {auction.current_bid && parseInt(auction.current_bid) >= parseInt(auction.reserve_price) && (
              <span className="text-green-600">✓ Reserve met</span>
            )}
          </div>
        )}

        {/* Time Remaining */}
        <div className="text-xs text-gray-400">
          Ends: {new Date(auction.end_time * 1000).toLocaleString()}
        </div>

        {/* Seller Info */}
        <div className="text-xs text-gray-400 truncate">
          Seller: {auction.seller.slice(0, 8)}...{auction.seller.slice(-6)}
        </div>
      </div>
    </div>
  );
}