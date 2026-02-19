// components/sandbox/TestWalletsPanel.tsx
export function TestWalletsPanel({ selectedWallet }) {
  const wallets = [
    { name: 'Robert', address: 'testcore1xa3...', balance: '5,000,000', color: 'bg-purple-100' },
    { name: 'Alice', address: 'testcore14qk...', balance: '5,000,000', color: 'bg-pink-100' },
    { name: 'Charlie', address: 'testcore1urv...', balance: '5,000,000', color: 'bg-green-100' },
    { name: 'Mike', address: 'testcore1rr8...', balance: '5,000,000', color: 'bg-blue-100' },
    { name: 'Treasury', address: 'testcore19kr...', balance: '0', color: 'bg-gray-100' },
    { name: 'Deployer', address: 'testcore1wvr...', balance: '0', color: 'bg-gray-100' },
    { name: 'CRF', address: 'testcore1m5a...', balance: '0', color: 'bg-gray-100' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">🧪 Test Wallets</h3>
      <p className="text-sm text-gray-600 mb-4">
        Pre-funded wallets for testing. All balances are testnet TESTUSD.
      </p>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {wallets.map((wallet) => (
          <div
            key={wallet.name}
            className={`p-3 rounded-lg border-2 transition ${
              selectedWallet?.name === wallet.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-100 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${wallet.color.replace('bg-', 'bg-')}`} />
                <span className="font-medium">{wallet.name}</span>
              </div>
              <span className="text-sm font-mono">{wallet.balance} TESTUSD</span>
            </div>
            <div className="text-xs text-gray-500 font-mono mt-1">
              {wallet.address}
            </div>
          </div>
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
