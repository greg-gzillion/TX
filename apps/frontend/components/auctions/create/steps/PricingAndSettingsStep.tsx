"use client";

import PriceCalculator from "@/components/shared/forms/inputs/PriceCalculator";

interface PricingAndSettingsStepProps {
  metalType: string;
  weight: number;
  weightUnit: "troy_oz" | "grams" | "ounces";
  purity: number;
  spotPrice: number;
  onPriceUpdate: (value: number) => void;
  startingPrice: number;
  setStartingPrice: (value: number) => void;
  buyNowPrice: number | undefined;
  setBuyNowPrice: (value: number | undefined) => void;
}

export default function PricingAndSettingsStep({
  metalType,
  weight,
  weightUnit,
  purity,
  spotPrice,
  onPriceUpdate,
  startingPrice,
  setStartingPrice,
  buyNowPrice,
  setBuyNowPrice,
}: PricingAndSettingsStepProps) {
  return (
    <section className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        5. Pricing & Auction Settings
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column - Price Calculator */}
        <div>
          <PriceCalculator
            metalType={metalType}
            weight={weight}
            weightUnit={weightUnit}
            purity={purity}
            spotPrice={spotPrice}
            onPriceUpdate={onPriceUpdate}
          />
        </div>

        {/* Right column - Auction Settings */}
        <div className="space-y-4">
          {/* Status Banner */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <span className="text-lg">ℹ️</span>
              <span>
                <strong>Development Mode:</strong> All prices in TESTUSD.
              </span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Starting Price (TESTUSD)
            </label>
            <input
              type="number"
              value={startingPrice}
              onChange={(e) =>
                setStartingPrice(parseFloat(e.target.value) || 0)
              }
              min="1"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Optional instant buy"
            />
          </div>

          <p className="text-xs text-gray-500 mt-4">
            ⚡ TESTUSD are test tokens with no real value. For testing only.
          </p>
        </div>
      </div>
    </section>
  );
}
