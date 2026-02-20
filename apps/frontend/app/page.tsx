'use client';

import { useState, useEffect } from 'react';
import { NavBar } from '@/components/shared/ui/NavBar';
import { FilterTabs } from '@/components/shared/ui/FilterTabs';
import { AuctionCard } from '@/components/shared/ui/AuctionCard';
import { Button } from '@/components/shared/ui/Button';
import { api } from '@/lib/api';
import { TrendingUp, TrendingDown, Clock, Users, DollarSign } from 'lucide-react';
import { Auction, PriceData } from '@/types/auction';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const pricesData = await api.getPrices();
        setPrices(pricesData);
        
        // Mock auctions with real prices - using testcore addresses
        setAuctions([
          {
            id: 1,
            title: '1oz Gold Bar - 999.9 Fine',
            currentBid: pricesData.gold,
            timeLeft: '2h 15m',
            bids: 12,
            metal: 'gold',
            seller: 'testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen',
            premium: '+2.5%',
          },
          {
            id: 2,
            title: '10oz Silver Bar',
            currentBid: pricesData.silver * 10,
            timeLeft: '1d 3h',
            bids: 8,
            metal: 'silver',
            seller: 'testcore14qkw9fplr9xplfl5qwz8rr8f3uxhja8yuf0z6l',
            premium: '+1.8%',
          },
          {
            id: 3,
            title: '1oz Platinum Bar',
            currentBid: pricesData.platinum,
            timeLeft: '3h 45m',
            bids: 5,
            metal: 'platinum',
            seller: 'testcore1urvw6ta906qphvvrmcuwwxy3z2fqns56er2agu',
            premium: '+3.2%',
          },
          {
            id: 4,
            title: '1oz Palladium Bar',
            currentBid: pricesData.palladium,
            timeLeft: '4h 20m',
            bids: 3,
            metal: 'palladium',
            seller: 'testcore1rr8knhdwc9uthxh3fazt3k4keuqtycctzcvd3c',
            premium: '-0.5%',
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
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Banks freeze accounts for "suspicious activity"</span>
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

              {/* March 6 Countdown */}
              <div className="mt-4 pt-4 border-t border-amber-200">
                <div className="bg-amber-100 rounded-lg p-3 text-center">
                  <p className="text-amber-800 font-bold flex items-center justify-center gap-2">
                    <span className="text-xl">🚀</span>
                    Coming March 6, 2026
                    <span className="text-xl">🚀</span>
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Live on TX blockchain testnet
                  </p>
                  <div className="text-xs text-amber-600 mt-2">
                    {Math.ceil((new Date('2026-03-06') - new Date()) / (1000 * 60 * 60 * 24))} days to go
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Prices Banner */}
        {prices && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-t-xl p-4 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-2xl">💰</span> Live Spot Prices
                </h2>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  Updated: {new Date(prices.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-b-xl shadow-lg p-4 border border-gray-200">
              {/* Gold */}
              <div className="text-center p-3 hover:bg-amber-50 rounded-lg transition cursor-pointer" onClick={() => setActiveTab('gold')}>
                <div className="text-3xl mb-2">🥇</div>
                <div className="font-bold text-amber-600">GOLD</div>
                <div className="text-xl font-bold">${prices.gold.toLocaleString()}</div>
                <div className="text-sm text-green-600 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +2.6%
                </div>
              </div>
              
              {/* Silver */}
              <div className="text-center p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer" onClick={() => setActiveTab('silver')}>
                <div className="text-3xl mb-2">🥈</div>
                <div className="font-bold text-gray-600">SILVER</div>
                <div className="text-xl font-bold">${prices.silver.toLocaleString()}</div>
                <div className="text-sm text-green-600 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +6.3%
                </div>
              </div>
              
              {/* Platinum */}
              <div className="text-center p-3 hover:bg-slate-50 rounded-lg transition cursor-pointer" onClick={() => setActiveTab('platinum')}>
                <div className="text-3xl mb-2">🔷</div>
                <div className="font-bold text-slate-600">PLATINUM</div>
                <div className="text-xl font-bold">${prices.platinum.toLocaleString()}</div>
                <div className="text-sm text-green-600 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +4.5%
                </div>
              </div>
              
              {/* Palladium */}
              <div className="text-center p-3 hover:bg-zinc-50 rounded-lg transition cursor-pointer" onClick={() => setActiveTab('palladium')}>
                <div className="text-3xl mb-2">🔶</div>
                <div className="font-bold text-zinc-600">PALLADIUM</div>
                <div className="text-xl font-bold">${prices.palladium.toLocaleString()}</div>
                <div className="text-sm text-red-600 flex items-center justify-center gap-1">
                  <TrendingDown className="w-3 h-3" /> -0.5%
                </div>
              </div>
            </div>
          </div>
        )}

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