'use client';

import { useState, useEffect } from 'react';
import { walletService } from '@/lib/wallet-service';

const ALL_WALLETS = [
  { id: 'keplr', name: 'Keplr Wallet', icon: '🔷', description: 'Coreum Recommended', recommended: true },
  { id: 'leap', name: 'Leap Wallet', icon: '🦘', description: 'Cosmos (Coreum issues)', disabled: true },
  { id: 'xumm', name: 'XUMM Wallet', icon: '💎', description: 'XRPL Settlement', disabled: true },
  { id: 'ledger', name: 'Ledger', icon: '🔐', description: 'Hardware Security', disabled: true },
  { id: 'trezor', name: 'Trezor', icon: '🛡️', description: 'Hardware Wallet', disabled: true },
  { id: 'wc', name: 'WalletConnect', icon: '🔗', description: 'Multi-chain', disabled: true },
];

export default function WalletSelector() {
  const [selectedWallet, setSelectedWallet] = useState<string | null>('keplr');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('Not connected');
  const [error, setError] = useState<string>('');
  const [phase7Active, setPhase7Active] = useState(false);

  useEffect(() => {
    // Auto-detect Keplr
    if (typeof window !== 'undefined' && window.keplr) {
      console.log('✅ Keplr wallet detected');
    } else {
      console.log('⚠️ Keplr not detected - install from https://www.keplr.app/');
    }
  }, []);

  const handleConnect = async () => {
    if (!selectedWallet) {
      setError('Please select Keplr wallet');
      return;
    }

    setIsConnecting(true);
    setError('');
    
    try {
      console.log(`Connecting to ${selectedWallet}...`);
      const state = await walletService.connect(selectedWallet);
      
      setAddress(state.address || '');
      setIsConnected(true);
      setBalance(state.balance);
      
      console.log('✅ Connection successful');
      
    } catch (error: any) {
      console.error('❌ Connection failed:', error);
      setError(error.message);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleActivatePhase7 = () => {
    if (!isConnected) {
      setError('Please connect Keplr wallet first');
      return;
    }
    
    setPhase7Active(true);
    alert(`🚀 Phase 7: Blockchain Mode Activated!\n\nWallet: ${address}\nBalance: ${balance}\n\nReady for smart contract deployment!`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Connect to Coreum Testnet</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">Phase 7</span>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        {!isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">💡 Use Keplr for Coreum Testnet</p>
              <p className="text-blue-600 text-sm mt-1">
                Keplr has built-in Coreum support. Install from{' '}
                <a href="https://www.keplr.app/" target="_blank" className="underline">keplr.app</a>
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ALL_WALLETS.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => !wallet.disabled && setSelectedWallet(wallet.id)}
                  disabled={wallet.disabled}
                  className={`p-4 border rounded-lg text-center transition ${
                    selectedWallet === wallet.id
                      ? 'border-blue-500 bg-blue-50'
                      : wallet.disabled
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{wallet.icon}</div>
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{wallet.description}</div>
                  {wallet.recommended && (
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Recommended</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleConnect}
              disabled={isConnecting || !selectedWallet}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {isConnecting ? 'Connecting Keplr...' : 'Connect Keplr Wallet'}
            </button>
            
            <div className="text-sm text-gray-500 text-center">
              <p>Make sure Keplr is installed and you're logged into Coreum Testnet</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-800 font-medium">✅ Connected to Keplr</p>
                  <p className="text-green-600 text-sm mt-1 font-mono break-all">{address}</p>
                </div>
                <button
                  onClick={() => {
                    walletService.disconnect();
                    setIsConnected(false);
                    setAddress('');
                    setBalance('Not connected');
                    setPhase7Active(false);
                  }}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Disconnect
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Network</p>
                <p className="font-medium">Coreum Testnet</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Balance</p>
                <p className="font-medium">{balance}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                <strong>✅ Real blockchain balance.</strong> No more hardcoded "1000 TEST".
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className={`bg-white p-6 rounded-xl border shadow-sm ${!isConnected ? 'opacity-50' : ''}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phase 7: Smart Contract Deployment</h3>
        
        <button
          onClick={handleActivatePhase7}
          disabled={!isConnected}
          className={`w-full py-3 font-semibold rounded-lg transition ${
            isConnected 
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {phase7Active ? '🚀 Phase 7 Active - Ready to Deploy' : 'Activate Contract Deployment'}
        </button>
        
        {phase7Active && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Phase 7 Ready:</h4>
            <ol className="text-sm text-blue-700 space-y-2 ml-4 list-decimal">
              <li>Keplr connected to Coreum testnet ✓</li>
              <li>Real balance showing ✓</li>
              <li>Now deploy Phoenix Escrow contract</li>
              <li>Connect frontend to contract</li>
              <li>Start on-chain precious metals trading</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
