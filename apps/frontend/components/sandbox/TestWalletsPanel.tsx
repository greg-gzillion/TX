'use client';

interface TestWalletsPanelProps {
  selectedWallet: any;
  onSelectWallet: (wallet: any) => void;
}

export function TestWalletsPanel({ selectedWallet, onSelectWallet }: TestWalletsPanelProps) {
  const wallets = [
    { name: 'Robert', address: 'testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen', balance: '5,000,000', color: 'bg-purple-100' },
    { name: 'Alice', address: 'testcore14qkw9fplr9xplfl5qwz8rr8f3uxhja8yuf0z6l', balance: '5,000,000', color: 'bg-pink-100' },
    { name: 'Charlie', address: 'testcore1urvw6ta906qphvvrmcuwwxy3z2fqns56er2agu', balance: '5,000,000', color: 'bg-green-100' },
    { name: 'Mike', address: 'testcore1rr8knhdwc9uthxh3fazt3k4keuqtycctzcvd3c', balance: '5,000,000', color: 'bg-blue-100' },
    { name: 'Treasury', address: 'testcore19krrq7dtfck53dla2us9lxlmmzxg7d9wa6qkdm', balance: '0', color: 'bg-gray-100' },
    { name: 'Deployer', address: 'testcore1wvrwgqjqfu7t9qzz3h05384ltjtnzfqlrytkmj', balance: '0', color: 'bg-gray-100' },
    { name: 'CRF', address: 'testcore1m5adn3k68tk4zqmujpnstmp9r933jafzu44tnv', balance: '0', color: 'bg-gray-100' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">🧪 Test Wallets</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click a wallet to select it for testing
      </p>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {wallets.map((wallet) => (
          <button
            key={wallet.name}
            onClick={() => onSelectWallet(wallet)}
            className={`w-full text-left p-3 rounded-lg border-2 transition ${
              selectedWallet?.name === wallet.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-100 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${wallet.color}`} />
                <span className="font-medium">{wallet.name}</span>
              </div>
              <span className="text-sm font-mono">{wallet.balance} TESTUSD</span>
            </div>
            <div className="text-xs text-gray-500 font-mono mt-1">
              {wallet.address.slice(0, 12)}...
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p className="text-xs text-yellow-700">
          ⚠️ Testnet tokens only - no real value. Reset daily.
        </p>
      </div>
    </div>
  );
}