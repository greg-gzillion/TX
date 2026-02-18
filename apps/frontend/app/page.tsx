'use client';

import { useState, useEffect } from 'react';
import { NavBar } from '@/components/ui/NavBar';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { AuctionCard } from '@/components/ui/AuctionCard';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [auctions, setAuctions] = useState([]);
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const pricesData = await api.getPrices();
        setPrices(pricesData);
        
        // Mock auctions with real prices
        setAuctions([
          {
            id: 1,
            title: '1oz Gold Bar - 999.9 Fine',
            currentBid: pricesData.gold,
            timeLeft: '2h 15m',
            bids: 12,
            metal: 'gold',
          },
          {
            id: 2,
            title: '10oz Silver Bar',
            currentBid: pricesData.silver * 10,
            timeLeft: '1d 3h',
            bids: 8,
            metal: 'silver',
          },
          {
            id: 3,
            title: '1oz Platinum Bar',
            currentBid: pricesData.platinum,
            timeLeft: '3h 45m',
            bids: 5,
            metal: 'platinum',
          },
          {
            id: 4,
            title: '1oz Palladium Bar',
            currentBid: pricesData.palladium,
            timeLeft: '4h 20m',
            bids: 3,
            metal: 'palladium',
          }
        ]);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredAuctions = activeTab === 'all' 
    ? auctions 
    : auctions.filter(a => a.metal === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Prices Banner */}
        {prices && (
          <div className="mb-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg p-4 text-white">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <span className="font-semibold">Live Spot Prices:</span>
              <div className="flex gap-6 flex-wrap">
                <span>🥇 Gold: ${prices.gold.toLocaleString()}</span>
                <span>🥈 Silver: ${prices.silver.toLocaleString()}</span>
                <span>🔷 Platinum: ${prices.platinum.toLocaleString()}</span>
                <span>🔶 Palladium: ${prices.palladium.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-8">
          <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map(auction => (
            <AuctionCard key={auction.id} {...auction} />
          ))}
        </div>
      </main>
    </div>
  );
}
