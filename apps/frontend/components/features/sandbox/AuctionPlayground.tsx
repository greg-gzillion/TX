'use client';

import { useState } from 'react';
import { useSandboxAuctions } from './hooks/useSandboxAuctions';
import SandboxAuctionCard from './SandboxAuctionCard';
import SandboxCreateModal from './SandboxCreateModal';

interface Props {
  wallet: any;
}

export default function AuctionPlayground({ wallet }: Props) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, mine, bidding
  const { auctions, createAuction, placeBid, buyNow } = useSandboxAuctions(wallet);

  const filteredAuctions = auctions.filter(auction => {
    if (filter === 'mine') return auction.sellerAddress === wallet?.address;
    if (filter === 'bidding') return auction.bids.some(b => b.bidder === wallet?.address);
    return true;
  });

  return (
    <div>
      {/* Header with controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">🏛️ Live Sandbox Auctions</h2>
          <p className="text-sm text-gray-500 mt-1">
            {auctions.length} active auctions • {auctions.reduce((sum, a) => sum + a.bids.length, 0)} total bids
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Create New Auction
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { id: 'all', label: 'All Auctions' },
          { id: 'mine', label: 'My Listings' },
          { id: 'bidding', label: 'I\'m Bidding On' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 font-medium transition relative ${
              filter === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Auction grid */}
      {filteredAuctions.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map(auction => (
            <SandboxAuctionCard
              key={auction.id}
              auction={auction}
              selectedWallet={wallet}
              onPlaceBid={(id, amount) => placeBid(id, amount, wallet)}
              onBuyNow={(id) => buyNow(id, wallet)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No auctions found</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? 'Be the first to create an auction!' 
              : filter === 'mine' 
                ? 'You haven\'t created any auctions yet' 
                : 'You haven\'t bid on any auctions yet'}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
            >
              + Create First Auction
            </button>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <SandboxCreateModal
          selectedWallet={wallet}
          onCreateAuction={createAuction}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Info box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <p className="font-medium text-blue-800 mb-2 flex items-center gap-2">
          <span className="text-xl">🧪</span>
          <span>Sandbox Auction Rules:</span>
        </p>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>You cannot bid on your own auctions (realistic behavior)</li>
          <li>All auctions use TESTUSD (fake test tokens)</li>
          <li>Auctions expire after 7 days (simulated)</li>
          <li>Data is saved in your browser - persists between visits</li>
          <li>Create as many test auctions as you want!</li>
        </ul>
      </div>
    </div>
  );
}
