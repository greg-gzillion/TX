'use client';

import { useState } from 'react';
import WalletSelector from '@/components/shared/layout/WalletSelector';
import { Button } from '@/components/shared/ui/Button';
import { Copy, ExternalLink, RefreshCw } from 'lucide-react';

export default function TestWalletPage() {
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (connectedAddress) {
      navigator.clipboard.writeText(connectedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const viewOnExplorer = () => {
    if (connectedAddress) {
      window.open(`https://explorer.coreum.com/account/${connectedAddress}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Wallet Connection Test</h1>
          <p className="text-gray-600">Test and verify your wallet integration</p>
        </div>

        {/* Status Card */}
        {connectedAddress && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-semibold">Connected Successfully</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConnectedAddress('')}
              >
                Disconnect
              </Button>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <p className="text-sm text-gray-500 mb-1">Wallet Address</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono text-gray-800 break-all bg-gray-50 p-2 rounded">
                  {connectedAddress}
                </code>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    title="Copy address"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={viewOnExplorer}
                    title="View on explorer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mt-2">✓ Copied to clipboard!</p>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600">Network</p>
                <p className="font-medium">Coreum Testnet</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600">Chain ID</p>
                <p className="font-medium">coreum-testnet-1</p>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            Wallet Connection
          </h2>
          <WalletSelector onConnect={setConnectedAddress} />
        </div>

        {/* Test Instructions */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
          <h2 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Test Instructions
          </h2>
          <ol className="list-decimal ml-5 text-amber-700 space-y-2">
            <li>Click "Connect Keplr" or "Connect Leap" button above</li>
            <li>Approve the connection in your wallet extension</li>
            <li>Your wallet address will appear with full details</li>
            <li>Test the copy and explorer buttons</li>
            <li>Click "Disconnect" to test disconnection</li>
            <li>Refresh the page to verify persistence</li>
          </ol>
          
          <div className="mt-4 p-3 bg-amber-100/50 rounded-lg">
            <p className="text-sm text-amber-800">
              <span className="font-bold">Note:</span> This test page validates that wallet 
              integration works correctly before using in main features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}