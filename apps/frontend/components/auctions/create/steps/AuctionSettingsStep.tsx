"use client";

interface AuctionSettingsStepProps {
  startingPrice: number;
  setStartingPrice: (value: number) => void;
  buyNowPrice: number | undefined;
  setBuyNowPrice: (value: number | undefined) => void;
}

export default function AuctionSettingsStep({
  startingPrice,
  setStartingPrice,
  buyNowPrice,
  setBuyNowPrice,
}: AuctionSettingsStepProps) {
  return (
    <section className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        6. Auction Settings
      </h2>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <span className="text-lg">🧪</span>
          <span>
            <strong>Development Mode:</strong> All prices in TESTUSD (test
            tokens only).
          </span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Starting Price (TESTUSD)
          </label>
          <input
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(parseFloat(e.target.value) || 0)}
            min="1"
            step="0.01"
            className="w-full px-3 py-2 border rounded-md bg-white"
            placeholder="Min 1 TESTUSD"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buy Now Price (TESTUSD) (Optional)
          </label>
          <input
            type="number"
            value={buyNowPrice || ""}
            onChange={(e) =>
              setBuyNowPrice(
                e.target.value ? parseFloat(e.target.value) : undefined,
              )
            }
            min={startingPrice + 1}
            step="0.01"
            className="w-full px-3 py-2 border rounded-md bg-white"
            placeholder="Optional instant buy"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        ⚡ TESTUSD are test tokens with no real value. For testing only.
      </p>
    </section>
  );
}
