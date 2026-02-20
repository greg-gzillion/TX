'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/ui/Button';

export function ContractTester({ wallet }: { wallet: any }) {
  const [contractAddress, setContractAddress] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');
  const [params, setParams] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testFunctions = [
    { name: 'Create Auction', params: 'itemId, reservePrice, duration' },
    { name: 'Place Bid', params: 'auctionId, amount' },
    { name: 'End Auction', params: 'auctionId' },
    { name: 'Claim Funds', params: 'auctionId' },
  ];

  const handleTest = async () => {
    setLoading(true);
    setResult('');
    
    // Simulate contract interaction
    setTimeout(() => {
      setResult(`✅ Test successful! Function "${selectedFunction}" executed with params: ${params}`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div>
      {/* Add the same sandbox banner */}
      <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 mb-6">
        <p className="text-purple-800 text-sm flex items-center">
          <span className="text-xl mr-2">🧪</span>
          <strong>SANDBOX MODE:</strong> All contract interactions are simulated. 
          <a href="/auctions" className="underline ml-1 font-bold">View real auctions →</a>
        </p>
      </div>

      <h2 className="text-xl font-bold mb-4">📜 Smart Contract Tester</h2>
      <p className="text-gray-600 mb-6">
        Test contract functions with mock data. Real contract deployment coming March 6.
      </p>

      {!wallet ? (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-700">Please select a wallet above to test contracts.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick test buttons */}
          <div>
            <h3 className="font-semibold mb-3">Quick Test Functions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {testFunctions.map((func) => (
                <button
                  key={func.name}
                  onClick={() => {
                    setSelectedFunction(func.name);
                    setParams(`Example: ${func.params}`);
                  }}
                  className="p-3 border rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="font-medium">{func.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{func.params}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual test form */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Manual Test</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contract Address</label>
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="core1... (mock for now)"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Function</label>
                <select
                  value={selectedFunction}
                  onChange={(e) => setSelectedFunction(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select function</option>
                  <option value="create_auction">create_auction</option>
                  <option value="place_bid">place_bid</option>
                  <option value="end_auction">end_auction</option>
                  <option value="claim_winnings">claim_winnings</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Parameters (JSON)</label>
                <textarea
                  value={params}
                  onChange={(e) => setParams(e.target.value)}
                  placeholder='{"itemId": "gold-1", "price": 5000}'
                  rows={4}
                  className="w-full p-2 border rounded-lg font-mono text-sm"
                />
              </div>

              <Button
                onClick={handleTest}
                isLoading={loading}
                variant="primary"
              >
                Execute Test
              </Button>

              {result && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <pre className="text-sm text-green-700 whitespace-pre-wrap">
                    {result}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              ⚙️ This is a mock contract tester. Real contract integration will be available March 6.
              Your selected wallet: <span className="font-mono">{wallet?.address}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}