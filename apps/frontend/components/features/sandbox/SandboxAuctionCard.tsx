'use client';

import { useState } from 'react';
import { SandboxAuction } from './hooks/useSandboxAuctions';

interface Props {
  auction: SandboxAuction;
  selectedWallet: any;
  onPlaceBid: (auctionId: string, amount: number) => void;
  onBuyNow: (auctionId: string) => void;
}

export default function SandboxAuctionCard({ auction, selectedWallet, onPlaceBid, onBuyNow }: Props) {
  const [bidAmount, setBidAmount] = useState(auction.currentBid + 1);
  const [showBidModal, setShowBidModal] = useState(false);
  const isOwner = selectedWallet?.address === auction.sellerAddress;

  // Metal icons (matches your real UI)
  const metalIcons = {
    Gold: '🥇',
    Silver: '🥈',
    Platinum: '🔷',
    Palladium: '🔶',
    Copper: '🟤',
    Other: '💎'
  };

  // Form type badges (matches your real UI)
  const formTypeLabels = {
    coin: '🪙 Coin',
    round: '⭕ Round',
    bar: '📦 Bar',
    jewelry: '💎 Jewelry',
    other: '📦 Other'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image placeholder or first image */}
      <div className="h-48 bg-gradient-to-br from-amber-50 to-gray-100 flex items-center justify-center">
        {auction.images && auction.images.length > 0 ? (
          <img src={auction.images[0]} alt={auction.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl opacity-30">{metalIcons[auction.metalType]}</span>
        )}
      </div>

      <div className="p-4">
        {/* Header with metal and type */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-2xl mr-2">{metalIcons[auction.metalType]}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
              {formTypeLabels[auction.formType]}
            </span>
          </div>
          {auction.isNumismatic && (
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
              🏛️ Numismatic
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg mb-1">{auction.title}</h3>

        {/* Details (matches your real auction view) */}
        <div className="text-sm text-gray-600 mb-3">
          {auction.weight} {auction.weightUnit === 'troy_oz' ? 'oz t' : auction.weightUnit} • 
          {(auction.purity * 100).toFixed(1)}% pure
          {auction.year && ` • ${auction.year}`}
          {auction.mint && ` • ${auction.mint.split(' - ')[0]}`}
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="text-2xl font-bold text-amber-600">
            ${auction.currentBid.toFixed(2)} TESTUSD
          </div>
          {auction.buyNowPrice && (
            <div className="text-sm text-gray-500">
              Buy now: ${auction.buyNowPrice.toFixed(2)} TESTUSD
            </div>
          )}
        </div>

        {/* Seller and bids */}
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>Seller: {auction.sellerName}</span>
          <span>{auction.bids.length} bids</span>
        </div>

        {/* Action buttons (mirrors your real UI) */}
        {!isOwner && selectedWallet ? (
          <div className="flex gap-2">
            <button
              onClick={() => setShowBidModal(true)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Place Bid
            </button>
            {auction.buyNowPrice && (
              <button
                onClick={() => onBuyNow(auction.id)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Buy Now
              </button>
            )}
          </div>
        ) : isOwner ? (
          <div className="px-4 py-2 bg-gray-100 text-gray-500 text-center rounded-lg">
            You listed this item
          </div>
        ) : (
          <div className="px-4 py-2 bg-gray-100 text-gray-500 text-center rounded-lg">
            Select a wallet to bid
          </div>
        )}
      </div>

      {/* Bid Modal (matches your real bid flow) */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Place a Bid</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your bid (TESTUSD)
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                min={auction.currentBid + 1}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum bid: ${(auction.currentBid + 1).toFixed(2)} TESTUSD
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onPlaceBid(auction.id, bidAmount);
                  setShowBidModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Bid
              </button>
              <button
                onClick={() => setShowBidModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
