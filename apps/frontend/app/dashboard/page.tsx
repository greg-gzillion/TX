"use client";

import { useState, useEffect } from 'react';
import WalletSelector from '@/components/layout/WalletSelector';

import CreateAuctionModal from '@/components/CreateAuctionModal';
import { useWallet } from '@/lib/wallet-context';
import { AuctionList } from '@/components/auctions/AuctionList';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
      {/* Create Auction Modal */}
      <CreateAuctionModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🏛️</span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">PhoenixPME</h1>
                <p className="text-indigo-200 text-sm">Precious Metals Exchange</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isConnected && (
                <>
                  <div className="hidden md:block text-right">
                    <p className="text-sm text-indigo-200">Connected Wallet</p>
                    <p className="font-mono text-sm bg-white/10 px-3 py-1 rounded-full">
                      {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-4)}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
                  >
                    <span className="text-xl">+</span> List Metals
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Wallet & Stats */}
          <div className="lg:col-span-3">
            <div className="sticky top-6 space-y-6">
              {/* Wallet Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Wallet Connection
                </h2>
                <WalletSelector />
                
                {isConnected && (
                  <div className="mt-6 space-y-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-600">Listings</p>
                        <p className="text-xl font-bold text-blue-600">{userStats.listings}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-600">Bids</p>
                        <p className="text-xl font-bold text-green-600">{userStats.bids}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-600">Won</p>
                        <p className="text-xl font-bold text-purple-600">{userStats.won}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filters Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Filter Metals</h3>
                <div className="space-y-3">
                  {[
                    { id: 'all', label: 'All Metals', icon: '💎' },
                    { id: 'gold', label: 'Gold', icon: '🥇' },
                    { id: 'silver', label: 'Silver', icon: '🥈' },
                    { id: 'platinum', label: 'Platinum', icon: '🔷' },
                    { id: 'palladium', label: 'Palladium', icon: '🔶' }
                  ].map((metal) => (
                    <button
                      key={metal.id}
                      onClick={() => setSelectedMetal(metal.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                        selectedMetal === metal.id
                          ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200'
                          : 'hover:bg-gray-50 text-gray-700 border-2 border-transparent'
                      }`}
                    >
                      <span className="text-2xl">{metal.icon}</span>
                      <span className="font-medium">{metal.label}</span>
                    </button>
                  ))}
                </div>

                <h3 className="font-semibold text-gray-800 mt-6 mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="latest">📅 Latest First</option>
                  <option value="ending">⏳ Ending Soon</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💰 Price: High to Low</option>
                  <option value="popular">🔥 Most Bids</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content - Auctions */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Live Auctions</h2>
                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                  {auctionCount} active {auctionCount === 1 ? 'auction' : 'auctions'}
                </span>
              </div>
              <AuctionList metal={selectedMetal} sortBy={sortBy} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
