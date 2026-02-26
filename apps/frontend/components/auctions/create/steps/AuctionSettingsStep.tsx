'use client';

interface AuctionSettingsStepProps {
  isSandbox: boolean;
  startingPrice: number;
  setStartingPrice: (value: number) => void;
  buyNowPrice: number | undefined;
  setBuyNowPrice: (value: number | undefined) => void;
}

export default function AuctionSettingsStep({
  isSandbox,
  startingPrice,
  setStartingPrice,
  buyNowPrice,
  setBuyNowPrice
}: AuctionSettingsStepProps) {
  return (
    <section className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Auction Settings</h2>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <span className="text-lg">ℹ️</span>
          <span>
            <strong>TX testnet not yet available.</strong> 
            Use <code className="bg-blue-100 px-1">?sandbox=true</code> for sandbox testing.
          </span>
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Starting Price ({isSandbox ? 'TESTUSD' : 'RLUSD'})
            {!isSandbox && <span className="ml-2 text-xs text-blue-500">(Testnet TBD)</span>}
          </label>
          <input
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(parseFloat(e.target.value) || 0)}
            min={isSandbox ? "1" : "10"}
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md ${
              !isSandbox ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
            }`}
            placeholder={isSandbox ? "Min 1 TESTUSD" : "Min 10 RLUSD (Coming Soon)"}
            disabled={!isSandbox}
            required={isSandbox}
          />
          {!isSandbox && (
            <p className="text-xs text-blue-500 mt-1">
              ⏳ RLUSD auctions will be enabled when testnet launches
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buy Now Price ({isSandbox ? 'TESTUSD' : 'RLUSD'}) (Optional)
            {!isSandbox && <span className="ml-2 text-xs text-blue-500">(Testnet TBD)</span>}
          </label>
          <input
            type="number"
            value={buyNowPrice || ''}
            onChange={(e) => setBuyNowPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
            min={startingPrice + (isSandbox ? 1 : 10)}
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md ${
              !isSandbox ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
            }`}
            placeholder="Optional instant buy"
            disabled={!isSandbox}
          />
        </div>
      </div>
    </section>
  );
}
