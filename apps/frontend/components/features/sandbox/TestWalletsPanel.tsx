'use client';

import { useState } from 'react';

interface TestWallet {
  id: string;
  name: string;
  address: string;
  balance: string;
}

interface TestWalletsPanelProps {
  selectedWallet: TestWallet | null;
  onSelectWallet: (wallet: TestWallet) => void;
}

const API_URL = 'https://phoenix-api-756y.onrender.com';

// Simple random address generator for demo mode
const generateRandomAddress = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = 40;
  let result = 'testcore1';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export function TestWalletsPanel({ selectedWallet, onSelectWallet }: TestWalletsPanelProps) {
  const [wallets, setWallets] = useState<TestWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useDemoMode, setUseDemoMode] = useState(true); // Toggle between demo and real

  const createTestWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (useDemoMode) {
        // DEMO MODE: Create fake wallet (no backend needed)
        const newWallet = {
          id: Date.now().toString(),
          name: `User Wallet ${wallets.length + 1}`,
          address: generateRandomAddress(),
          balance: '10,000 FAKE',
        };
        setWallets(prev => [...prev, newWallet]);
        onSelectWallet(newWallet);
      } else {
        // REAL MODE: Create actual testnet wallet via backend
        const response = await fetch(`${API_URL}/api/sandbox/wallets/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        
        if (data.success) {
          const newWallet = {
            id: data.wallet.id,
            name: data.wallet.name,
            address: data.wallet.address,
            balance: data.wallet.balance,
          };
          setWallets(prev => [...prev, newWallet]);
          onSelectWallet(newWallet);
        } else {
          setError('Failed to create wallet');
        }
      }
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError('Network error - check backend');
    } finally {
      setLoading(false);
    }
  };

  const fundWallet = async (address: string) => {
    if (useDemoMode) {
      // DEMO MODE: Just update the balance in UI
      setWallets(prev => prev.map(w => 
        w.address === address 
          ? { ...w, balance: '10,000 FAKE' } 
          : w
      ));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/sandbox/wallets/fund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      
      if (response.ok) {
        setWallets(prev => prev.map(w => 
          w.address === address 
            ? { ...w, balance: '10,000 TESTUSD' } 
            : w
        ));
      }
    } catch (err) {
      console.error('Error funding wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      {/* Sandbox banner with mode toggle */}
      <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <p className="text-purple-800 text-sm flex items-center">
            <span className="text-xl mr-2">🧪</span>
            <strong>SANDBOX MODE:</strong> {useDemoMode ? 'Demo' : 'Real'} test wallets.
          </p>
          <button
            onClick={() => setUseDemoMode(!useDemoMode)}
            className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded hover:bg-purple-300"
          >
            Switch to {useDemoMode ? 'Real' : 'Demo'} Mode
          </button>
        </div>
        <a href="/auctions/create" className="text-purple-700 text-xs underline block mt-1">
          Connect real wallet →
        </a>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">🧪 Test Wallets</h3>
        <button
          onClick={createTestWallet}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-sm font-medium"
        >
          {loading ? 'Creating...' : '+ Create New Test Wallet'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {wallets.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-gray-500 mb-2">No test wallets yet</p>
          <p className="text-sm text-gray-400">
            Click the button above to create your first test wallet
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="border rounded-lg p-3 hover:border-blue-300 transition">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectWallet(wallet)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      selectedWallet?.address === wallet.address
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Select
                  </button>
                  <span className="font-medium">{wallet.name}</span>
                </div>
                <span className="text-sm font-mono bg-green-50 px-2 py-1 rounded">
                  {wallet.balance}
                </span>
              </div>
              <div className="text-xs text-gray-500 font-mono break-all mb-2">
                {wallet.address}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fundWallet(wallet.address)}
                  disabled={loading}
                  className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded hover:bg-amber-200"
                >
                  💰 Get Test Funds
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(wallet.address);
                    alert('Address copied!');
                  }}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
                >
                  📋 Copy Address
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p className="text-xs text-yellow-700">
          ⚠️ {useDemoMode ? 'Demo mode - fake wallets only' : 'Testnet tokens only - no real value'}. 
          Wallets are stored in your browser.
        </p>
        <p className="text-xs text-yellow-600 mt-1">
          {useDemoMode 
            ? 'Demo wallets work offline - perfect for testing UI' 
            : 'Each wallet is a REAL testnet address. Use "Get Test Funds" to claim from faucet.'}
        </p>
      </div>
    </div>
  );
}