'use client';

import { useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/layout/NavBar';
import { Button } from '@/components/shared/ui/Button';
import { Search } from 'lucide-react';
import PriceBanner from '@/components/shared/ui/PriceBanner';
import PhoenixIcon from '@/components/phoenix/PhoenixIcon';
import UniversalWalletV2 from '@/components/UniversalWalletV2';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      {/* Main content - perfectly centered */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Hero Section - Centered with Phoenix */}
        <div className="text-center mb-12">
          {/* Animated Phoenix Icon */}
          <div className="flex justify-center mb-6">
            <PhoenixIcon />
          </div>
          
          {/* Main Title with Gradient */}
          <h1 className="text-5xl md:text-6xl font-bold mb-3">
            <span className="phoenix-gradient-text">Phoenix</span>
            <span className="text-gray-900">PME</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-amber-600 font-semibold mb-3">
            Precious Metal Exchange
          </p>
          
          {/* Tagline */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Direct peer-to-peer. No middlemen. No hidden fees.
          </p>
          
          {/* Eagle accents */}
          <div className="flex justify-center gap-2 mt-4">
            <span className="phoenix-flame text-2xl" style={{ animationDelay: '0.1s' }}>🦅</span>
            <span className="phoenix-flame text-2xl" style={{ animationDelay: '0.3s' }}>🦅</span>
            <span className="phoenix-flame text-2xl" style={{ animationDelay: '0.5s' }}>🦅</span>
          </div>
        </div>

        {/* Search Bar - Centered */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for gold, silver, platinum..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <Button variant="gold" className="px-6 whitespace-nowrap">
              Search
            </Button>
          </div>
          
          {/* Quick Categories - Centered */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-gray-600">
            <Link href="/auctions?metal=gold" className="hover:text-amber-600 transition">Gold</Link>
            <Link href="/auctions?metal=silver" className="hover:text-amber-600 transition">Silver</Link>
            <Link href="/auctions?metal=platinum" className="hover:text-amber-600 transition">Platinum</Link>
            <Link href="/auctions?metal=palladium" className="hover:text-amber-600 transition">Palladium</Link>
            <Link href="/auctions?form=coin" className="hover:text-amber-600 transition">Coins</Link>
            <Link href="/auctions?form=bar" className="hover:text-amber-600 transition">Bars</Link>
          </div>
        </div>

        {/* Disclaimer - Centered */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧪</span>
              <div>
                <p className="text-yellow-800 font-semibold text-sm">TESTNET CONCEPT — NOT YET ACTIVE</p>
                <p className="text-yellow-700 text-xs mt-1">
                  Experimental testnet software. No real funds. Open source code.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Cards - Centered Grid */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Traditional Platforms */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏛️</span>
                <h3 className="text-xl font-bold">Traditional Platforms</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold">•</span>
                  <span>10-15% fees — gone forever</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold">•</span>
                  <span>Fees are higher to cover costs and pay shareholders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold">•</span>
                  <span>Users have no ability to direct decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold">•</span>
                  <span>Centralized entities have final authority</span>
                </li>
              </ul>
            </div>

            {/* PhoenixPME */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚙️</span>
                <h3 className="text-xl font-bold text-amber-900">PhoenixPME</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>10% collateral — <span className="font-semibold">returned</span> upon successful completion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>1.1% fees to <span className="font-semibold">Community Reserve Fund</span> — predominately user controlled</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Users accumulate <span className="font-semibold">voting weight</span> to direct CRF utilization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>48-hour buyer verification period</span>
                </li>
              </ul>
            </div>

          </div> {/* Closes grid */}
        </div> {/* Closes comparison container */}

        {/* Tagline - Centered */}
        <div className="max-w-2xl mx-auto text-center mb-12 border-t border-b border-gray-200 py-6">
          <p className="text-xl">
            <span className="line-through text-gray-400 mr-2">10% fees?</span>
            <span className="font-semibold text-amber-600">10% collateral — returned.</span>
          </p>
        </div>

        {/* PHNX & Reputation - Centered */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-bold mb-6 text-center">How Participation is Recorded</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🪙</span>
                </div>
                <p className="font-semibold mb-1">PHNX Governance</p>
                <p className="text-sm text-gray-600">0.9 to buyer • 0.1 developer</p>
                <p className="text-xs text-gray-400 mt-2">No cash value</p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">⭐</span>
                </div>
                <p className="font-semibold mb-1">TRUST / DONT TRUST</p>
                <p className="text-sm text-gray-600">Permanent on-chain reputation</p>
                <p className="text-xs text-gray-400 mt-2">Amendable only under extenuating circumstances</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Banner - Centered */}
        <div className="max-w-3xl mx-auto mb-12">
          <PriceBanner />
        </div>

        {/* Universal Wallet - Multi-Chain Support */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-xl font-semibold mb-4 text-center">Connect Your Wallet</h2>
          <UniversalWalletV2 onConnect={(wallet) => {
            console.log('Connected wallet:', wallet);
            // Store wallet in context/state when implemented
          }} />
        </div>

        {/* Featured Auctions - Centered */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Featured Auctions</h2>
            <Link href="/auctions" className="text-amber-600 text-sm hover:underline">
              View all →
            </Link>
          </div>
          
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-2">🚀 First auctions go live March 6, 2026</p>
            <p className="text-2xl mb-2">🥇 Gold • 🥈 Silver • 🔷 Platinum • 🔶 Palladium</p>
            <p className="text-sm text-gray-400">Be the first to create an auction</p>
          </div>
        </div>

        {/* Detailed Protocol Explanation - Centered */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white border-2 border-amber-200 rounded-xl p-8">
            
            {/* Section Header */}
            <div className="text-center mb-8">
              <div className="inline-block bg-amber-100 rounded-full px-4 py-1 text-sm font-semibold text-amber-800 mb-3">
                HOW THE PROTOCOL WORKS
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Built on Trust, Enforced by Code</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The PhoenixPME protocol is an experimental concept built on the TX blockchain ecosystem, 
                leveraging Coreum's infrastructure and Sologenic's asset tokenization expertise.
              </p>
            </div>

            {/* Process Steps - Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-700 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">10% Collateral (Both Parties)</h3>
                    <p className="text-gray-600 text-sm">
                      Sellers and buyers each post <span className="font-semibold">10% collateral</span>. Both have skin in the game.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-700 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Funds Held in Escrow</h3>
                    <p className="text-gray-600 text-sm">
                      All funds locked in smart contract escrow. No one can touch them.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-700 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">48-Hour Buyer Verification</h3>
                    <p className="text-gray-600 text-sm">
                      Buyer has 48 hours to inspect after delivery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Step 4 - Collateral Returned + PHNX */}
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-700 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Collateral Returned + PHNX</h3>
                    <p className="text-gray-600 text-sm">
                      10% collateral <span className="font-semibold">returned</span> + 0.9 PHNX voting weight to buyer, 
                      0.1 PHNX voting weight to developer
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Voting weight only - No cash value</p>
                  </div>
                </div>

                {/* Step 5 - TRUST / DONT TRUST */}
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-700 font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">TRUST / DONT TRUST</h3>
                    <p className="text-gray-600 text-sm">
                      Permanent reputation tokens issued based on outcome.
                    </p>
                  </div>
                </div>

                {/* Step 6 - Permanent Record */}
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-700 font-bold">6</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Permanent Record</h3>
                    <p className="text-gray-600 text-sm">
                      On-chain history follows you forever. Never erased.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TX Blockchain Context */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-4">
              <div className="flex items-start gap-4">
                <div className="bg-amber-200 rounded-lg p-2">
                  <span className="text-2xl">🔷</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Built on the TX Blockchain Ecosystem</h3>
                  <p className="text-gray-700 text-sm">
                    An experimental concept built on the TX blockchain — the merger of Coreum and Sologenic.
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 border-t border-gray-200 pt-4">
                ⚠️ Experimental concept. No guarantees. PHNX, TRUST, and DONT TRUST have no cash value and are non-transferable.
              </p>
            </div>
          </div>
        </div>

        {/* CTA - Centered */}
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            🚀 Be Part of the First Wave
          </h2>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">
            Join the first community of peer-to-peer precious metals traders.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="gold" size="lg" href="/auctions/create" className="text-base">
              Create Auction (March 6)
            </Button>
            <Button variant="outline" size="lg" href="/auctions" className="text-base">
              View Demo Auctions
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            🔥 March 6, 2026 — TX testnet launch. Be ready.
          </p>
        </div>

      </main>
    </div>
  );
}