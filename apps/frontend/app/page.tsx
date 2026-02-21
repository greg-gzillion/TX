'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/layout/NavBar';
import { FilterTabs } from '@/components/shared/ui/FilterTabs';
import AuctionCard from '@/components/auctions/list/AuctionCard';
import { Button } from '@/components/shared/ui/Button';
import { TrendingUp, TrendingDown, Clock, Users, DollarSign } from 'lucide-react';
import { Auction } from '@/types/auction';

// Static reference prices - updated manually when market closes
const REFERENCE_PRICES = {
  gold: 5105.90,
  silver: 84.52,
  platinum: 2157.00,
  palladium: 1743.00,
  lastUpdated: "February 20, 2026"
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Mock auctions with reference prices
        setAuctions([
          {
            id: 1,
            title: '1oz Gold Bar - 999.9 Fine',
            currentBid: REFERENCE_PRICES.gold,
            timeLeft: '2h 15m',
            bids: 12,
            metal: 'gold',
            seller: 'testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen',
          },
          {
            id: 2,
            title: '10oz Silver Bar',
            currentBid: REFERENCE_PRICES.silver * 10,
            timeLeft: '1d 3h',
            bids: 8,
            metal: 'silver',
            seller: 'testcore14qkw9fplr9xplfl5qwz8rr8f3uxhja8yuf0z6l',
          },
          {
            id: 3,
            title: '1oz Platinum Bar',
            currentBid: REFERENCE_PRICES.platinum,
            timeLeft: '3h 45m',
            bids: 5,
            metal: 'platinum',
            seller: 'testcore1urvw6ta906qphvvrmcuwwxy3z2fqns56er2agu',
          },
          {
            id: 4,
            title: '1oz Palladium Bar',
            currentBid: REFERENCE_PRICES.palladium,
            timeLeft: '4h 20m',
            bids: 3,
            metal: 'palladium',
            seller: 'testcore1rr8knhdwc9uthxh3fazt3k4keuqtycctzcvd3c',
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

  // Calculate market stats
  const totalBids = auctions.reduce((sum, a) => sum + a.bids, 0);
  const activeAuctions = auctions.length;
  const totalVolume = auctions.reduce((sum, a) => sum + a.currentBid, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PhoenixPME...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TESTNET DISCLAIMER */}
        <div className="bg-red-100 border-4 border-red-500 rounded-lg p-4 mb-8">
          <p className="text-red-800 text-lg font-bold flex items-center justify-center">
            <span className="text-2xl mr-2">⚠️</span>
            TESTNET BETA - NO REAL VALUE
            <span className="text-2xl ml-2">⚠️</span>
          </p>
          <p className="text-red-700 text-center mt-2">
            This is experimental software. All transactions are on testnet.
            Do not send real funds. For testing purposes only.
          </p>
        </div>

        {/* Hero Section with Why PhoenixPME card */}
        <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
          {/* Left side - Hero text */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trade Precious Metals
              <span className="block text-xl text-amber-600 mt-2">Decentralized • Trustless • Community Owned</span>
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto md:mx-0">
              Buy and sell gold, silver, platinum, and palladium directly with other users.
              No middlemen, no hidden fees, just pure peer-to-peer trading on the TX blockchain.
            </p>
          </div>

          {/* Right side - "Why PhoenixPME?" card */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 shadow-lg p-6">
            <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center gap-2">
              <span className="text-3xl">🔥</span> Why PhoenixPME?
            </h2>
            
            <div className="space-y-4">
              {/* Problem */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <span className="text-red-500">⚠️</span> The Problem
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Dealers offer <span className="font-bold text-red-600">$10-15 BELOW spot</span> for constitutional silver</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>eBay takes <span className="font-bold text-red-600">15%</span> of your sale</span>
                  </li>
                </ul>
              </div>

              {/* Solution */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <span className="text-green-500">✅</span> Our Solution
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Trade at fair market prices (<span className="font-bold text-green-600">1.1% fee</span>)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Smart contract escrow <span className="font-bold text-green-600">(no one can freeze)</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Both parties post collateral <span className="font-bold text-green-600">(trust through code)</span></span>
                  </li>
                </ul>
              </div>

              {/* Launch Date - Removed countdown */}
              <div className="mt-4 pt-4 border-t border-amber-200">
                <div className="bg-amber-100 rounded-lg p-3 text-center">
                  <p className="text-amber-800 font-bold">
                    Launching March 6, 2026 on TX blockchain
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reference Prices Banner */}
        <div className="mb-8">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700">Reference Prices:</span>
                <span className="text-amber-700">🥇 Gold ${REFERENCE_PRICES.gold}</span>
                <span className="text-gray-600">🥈 Silver ${REFERENCE_PRICES.silver}</span>
                <span className="text-gray-600">🔷 Platinum ${REFERENCE_PRICES.platinum}</span>
                <span className="text-gray-600">🔶 Palladium ${REFERENCE_PRICES.palladium}</span>
              </div>
              <span className="text-xs text-gray-500">
                Market close • {REFERENCE_PRICES.lastUpdated}
              </span>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">24h Volume</p>
                <p className="text-lg font-bold">${totalVolume.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Auctions</p>
                <p className="text-lg font-bold">{activeAuctions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Bids</p>
                <p className="text-lg font-bold">{totalBids}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ending Today</p>
                <p className="text-lg font-bold">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Auction Grid */}
        {filteredAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map(auction => (
              <AuctionCard key={auction.id} {...auction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 mb-4">No auctions found for this metal type</p>
            <Button variant="gold" href="/auctions/create">
              Create First Auction
            </Button>
          </div>
        )}

        {/* Create Auction CTA */}
        <div className="mt-12 text-center">
          <Button variant="gold" size="lg" href="/auctions/create">
            Create Your First Auction
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            No listing fees • 1.1% final value fee goes to Community Reserve Fund
          </p>
        </div>
      </main>
    </div>
  );
}