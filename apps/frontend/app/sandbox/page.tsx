'use client';

import { useState } from 'react';
import { WalletSelector } from '@/components/sandbox/WalletSelector';
import { TestWalletsPanel } from '@/components/sandbox/TestWalletsPanel';
import { AuctionPlayground } from '@/components/sandbox/AuctionPlayground';
import { PriceFeed } from '@/components/sandbox/PriceFeed';
import { ContractTester } from '@/components/sandbox/ContractTester';

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