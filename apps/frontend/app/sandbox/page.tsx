'use client';

import { useState, useEffect } from 'react';
import { WalletSelector } from '@/components/features/sandbox/WalletSelector';
import { TestWalletsPanel } from '@/components/features/sandbox/TestWalletsPanel';
import { AuctionPlayground } from '@/components/features/sandbox/AuctionPlayground';
import { PriceFeed } from '@/components/features/sandbox/PriceFeed';
import { ContractTester } from '@/components/features/sandbox/ContractTester';
import UniversalWalletV2 from '@/components/UniversalWalletV2';

// Define the Wallet type - MATCH TestWallet interface
interface Wallet {
  id: string;           
  name: string;
  address: string;
  balance: string;
  walletName?: string;
  walletIcon?: string;
}

export default function SandboxPage() {
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [activeTab, setActiveTab] = useState('auctions');
  const [mounted, setMounted] = useState(false);
  const [useUniversalWallet, setUseUniversalWallet] = useState(false);

  // Handle hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Warning Banner */}
      <div className="bg-red-600 text-white p-4 text-center font-bold text-lg shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="text-3xl">🧪</span>
          <span>PHOENIXPME DEVELOPER SANDBOX - TESTNET ENVIRONMENT - NO REAL VALUE</span>
          <span className="text-3xl">🧪</span>
        </div>
      </div>
      
      {/* Secondary Warning */}
      <div className="bg-red-100 border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <p className="text-red-800 text-center flex items-center justify-center gap-2">
            <span className="text-xl">⚠️</span>
            <span className="font-semibold">EXPERIMENTAL SOFTWARE:</span>
            All transactions are on testnet. Do not send real funds. For testing only.
            <span className="text-xl">⚠️</span>
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Developer Playground
          </h1>
          <p className="text-gray-600 text-lg">
            Experiment with auctions, test smart contracts, and explore the platform.
            All tokens are testnet only - <span className="font-semibold text-red-600">no real value</span>.
          </p>
        </div>

        {/* Price Feed */}
        <div className="mb-8 transform hover:scale-102 transition-transform">
          <PriceFeed />
        </div>

        {/* Wallet Type Toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setUseUniversalWallet(false)}
              className={`px-4 py-2 rounded-md transition ${
                !useUniversalWallet 
                  ? 'bg-white shadow-sm text-amber-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Simple Wallet
            </button>
            <button
              onClick={() => setUseUniversalWallet(true)}
              className={`px-4 py-2 rounded-md transition ${
                useUniversalWallet 
                  ? 'bg-white shadow-sm text-amber-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Universal Wallet (Multi-Chain)
            </button>
          </div>
        </div>

        {/* Wallet Connection Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Connect Wallet
            </h2>
            
            {useUniversalWallet ? (
              <UniversalWalletV2 onConnect={(wallet) => {
                console.log('Connected wallet:', wallet);
                setSelectedWallet(wallet);
              }} />
            ) : (
              <WalletSelector onSelect={(wallet) => setSelectedWallet(wallet)} />
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Test Wallets
            </h2>
            <TestWalletsPanel 
              selectedWallet={selectedWallet} 
              onSelectWallet={setSelectedWallet}
            />
          </div>
        </div>
        
        {/* Main Playground Area */}
        {selectedWallet ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b bg-gray-50">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('auctions')}
                  className={`px-8 py-4 font-medium text-lg transition-all relative ${
                    activeTab === 'auctions' 
                      ? 'text-blue-600 bg-white' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">🏛️</span>
                    Auction Playground
                  </span>
                  {activeTab === 'auctions' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('contracts')}
                  className={`px-8 py-4 font-medium text-lg transition-all relative ${
                    activeTab === 'contracts' 
                      ? 'text-blue-600 bg-white' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">📜</span>
                    Contract Tester
                  </span>
                  {activeTab === 'contracts' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'auctions' && (
                <div className="animate-fadeIn">
                  <AuctionPlayground wallet={selectedWallet} />
                </div>
              )}
              {activeTab === 'contracts' && (
                <div className="animate-fadeIn">
                  <ContractTester wallet={selectedWallet} />
                </div>
              )}
            </div>
          </div>
        ) : (
          // Prompt to select wallet
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-blue-200">
            <div className="text-8xl mb-4 animate-bounce">👆</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Select a Wallet to Begin
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Choose a wallet from the panels above to start testing auctions and smart contracts
            </p>
          </div>
        )}
        
        {/* Footer Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <p className="font-medium flex items-center gap-2">
            <span className="text-xl">🔬</span>
            <span>About this Sandbox:</span>
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-yellow-700">
            <li>All transactions occur on the Coreum testnet</li>
            <li>Test tokens have no real-world value</li>
            <li>Smart contracts are experimental and may change</li>
            <li>Use this environment to learn and experiment safely</li>
            <li>Report bugs and issues to help improve the platform</li>
          </ul>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}