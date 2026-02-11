'use client';

import { useState } from 'react';

export default function WalletConnector() {
  const [connected, setConnected] = useState(false);
  const [phase7, setPhase7] = useState(false);

  const connectWallet = () => {
    setConnected(true);
    alert('Wallet connected (Phase 7)');
  };

  const activatePhase7 = () => {
    setPhase7(true);
    alert('🚀 Phase 7: Blockchain Mode Activated!\n\nNext: Connect Leap wallet to Coreum testnet');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-bold text-gray-900 mb-3">Phase 7: Blockchain Integration</h3>
        
        {connected ? (
          <div className="space-y-3">
            <p className="text-green-600">✅ Wallet Connected</p>
            <p className="text-sm text-gray-600">
              Ready for Coreum blockchain integration
            </p>
            {!phase7 && (
              <button
                onClick={activatePhase7}
                className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg"
              >
                Activate Phase 7
              </button>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-3">Connect to start blockchain phase</p>
            <button
              onClick={connectWallet}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Connect for Phase 7
            </button>
          </div>
        )}
      </div>

      {phase7 && (
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <h4 className="font-bold text-green-800 mb-2">🚀 Phase 7 Active</h4>
          <p className="text-sm text-green-700 mb-3">
            Blockchain mode enabled. Next steps:
          </p>
          <ol className="text-sm text-green-600 ml-4 list-decimal space-y-1">
            <li>Switch Leap wallet to Coreum testnet</li>
            <li>Get test tokens from faucet</li>
            <li>Deploy smart contract</li>
            <li>Create first on-chain auction</li>
          </ol>
        </div>
      )}
    </div>
  );
}
