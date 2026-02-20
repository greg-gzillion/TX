'use client';

import { useState } from 'react';
import { WalletSelector } from '@/components/features/sandbox/WalletSelector';
import { TestWalletsPanel } from '@/components/features/sandbox/TestWalletsPanel';
import { AuctionPlayground } from '@/components/features/sandbox/AuctionPlayground';
import { PriceFeed } from '@/components/features/sandbox/PriceFeed';
import { ContractTester } from '@/components/features/sandbox/ContractTester';
// Add to app/page.tsx and app/sandbox/page.tsx
<div className="bg-red-100 border-4 border-red-500 rounded-lg p-4 mb-6">
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
export default function SandboxPage() {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [activeTab, setActiveTab] = useState('auctions');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 text-center">
        🧪 PhoenixPME Developer Sandbox - Testnet Environment - No Real Value
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Developer Playground</h1>
        <p className="text-gray-600 mb-8">
          Experiment with auctions, test smart contracts, and explore the platform.
          All tokens are testnet only - no real value.
        </p>

        <PriceFeed />

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <WalletSelector onSelect={setSelectedWallet} />
          <TestWalletsPanel 
            selectedWallet={selectedWallet} 
            onSelectWallet={setSelectedWallet}
          />
        </div>
				{/* Hero Section - WITH NEW SIDEBAR */}
<div className="mb-8">
  <div className="grid md:grid-cols-2 gap-8 items-start">
    {/* Left side - Existing hero text */}
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

    {/* Right side - NEW "Why PhoenixPME?" card */}
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
</div>
        {selectedWallet && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="border-b flex">
              <button
                onClick={() => setActiveTab('auctions')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'auctions' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500'
                }`}
              >
                🏛️ Auction Playground
              </button>
              <button
                onClick={() => setActiveTab('contracts')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'contracts' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500'
                }`}
              >
                📜 Contract Tester
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'auctions' && (
                <AuctionPlayground wallet={selectedWallet} />
              )}
              {activeTab === 'contracts' && (
                <ContractTester wallet={selectedWallet} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
