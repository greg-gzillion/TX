'use client';

import { useState } from 'react';
import WalletSelector from '../../components/WalletSelector';

export default function TestWalletPage() {
  const [connectedAddress, setConnectedAddress] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Wallet Selector Test</h1>
        
        {connectedAddress && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-green-800 font-medium">✅ Wallet Connected!</p>
            <p className="text-green-700 text-sm font-mono break-all mt-2">
              {connectedAddress}
            </p>
          </div>
        )}
        
        <WalletSelector onConnect={setConnectedAddress} />
        
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="font-semibold text-blue-800 mb-2">Test Instructions:</h2>
          <ol className="list-decimal ml-5 text-blue-700 space-y-1">
            <li>Click "Connect Keplr" button</li>
            <li>Approve connection in Keplr extension</li>
            <li>Your address should appear above</li>
            <li>Click "Disconnect" to test disconnect</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
