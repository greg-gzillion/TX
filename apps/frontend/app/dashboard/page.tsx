"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WalletSelector from '@/components/wallet/WalletSelector';
import { useWallet } from '@/lib/wallet-context';
import { AuctionList } from '@/components/auctions/list/AuctionList';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function DashboardPage() {
  const [selectedMetal, setSelectedMetal] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [auctionCount, setAuctionCount] = useState(0);
  
  const { walletAddress, isConnected } = useWallet();

  // Fetch auction count
  useEffect(() => {
    const fetchAuctionCount = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auctions`);
        const data = await response.json();
        const auctions = data.data?.auctions || data.auctions || [];
        setAuctionCount(auctions.length);
      } catch (error) {
        console.error('Error fetching auction count:', error);
      }
    };

    fetchAuctionCount();
  }, []);

  // Mock user stats (replace with real data later)
  const userStats = {
    listings: isConnected ? 3 : 0,
    bids: isConnected ? 7 : 0,
    won: isConnected ? 1 : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <div className="flex items-center space-x-4">
              <WalletSelector />
              <Link
                href="/auctions/create"
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Create Auction
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">My Listings</p>
            <p className="text-3xl font-bold text-gray-900">{userStats.listings}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Active Bids</p>
            <p className="text-3xl font-bold text-gray-900">{userStats.bids}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Won Auctions</p>
            <p className="text-3xl font-bold text-gray-900">{userStats.won}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Auctions</p>
            <p className="text-3xl font-bold text-gray-900">{auctionCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Metals</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="platinum">Platinum</option>
              <option value="palladium">Palladium</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="latest">Latest</option>
              <option value="ending-soon">Ending Soon</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Auction List */}
        <AuctionList metal={selectedMetal} sortBy={sortBy} />
      </main>
    </div>
  );
}
