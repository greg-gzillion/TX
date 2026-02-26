'use client';

interface CoinDetailsFormProps {
  coinDetails: {
    country: string;
    mint: string;
    year: string;
    mintage: string;
    isNumismatic: boolean;
    grade: string;
  };
  onChange: (details: any) => void;
}

export default function CoinDetailsForm({ coinDetails, onChange }: CoinDetailsFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...coinDetails, [field]: value });
  };

  return (
    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
        <span className="text-xl">🪙</span>
        Coin Details
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            value={coinDetails.country}
            onChange={(e) => updateField('country', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select country...</option>
            <option value="USA">United States</option>
            <option value="Canada">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="Mexico">Mexico</option>
            <option value="Australia">Australia</option>
            <option value="South Africa">South Africa</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mint</label>
          <select
            value={coinDetails.mint}
            onChange={(e) => updateField('mint', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select mint...</option>
            <option value="US Mint">US Mint</option>
            <option value="Philadelphia">Philadelphia</option>
            <option value="Denver">Denver</option>
            <option value="San Francisco">San Francisco</option>
            <option value="West Point">West Point</option>
            <option value="Royal Canadian Mint">Royal Canadian Mint</option>
            <option value="Royal Mint">Royal Mint (UK)</option>
            <option value="Perth Mint">Perth Mint</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="text"
            value={coinDetails.year}
            onChange={(e) => updateField('year', e.target.value)}
            placeholder="e.g., 2024"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mintage</label>
          <input
            type="text"
            value={coinDetails.mintage}
            onChange={(e) => updateField('mintage', e.target.value)}
            placeholder="e.g., 1,000,000"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={coinDetails.isNumismatic}
            onChange={(e) => updateField('isNumismatic', e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium">Numismatic / Collectible</span>
        </label>
      </div>

      {coinDetails.isNumismatic && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
          <select
            value={coinDetails.grade}
            onChange={(e) => updateField('grade', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select grade...</option>
            <option value="MS70">MS70 (Perfect)</option>
            <option value="MS69">MS69 (Near Perfect)</option>
            <option value="MS65">MS65</option>
            <option value="MS60">MS60</option>
            <option value="AU">AU (About Uncirculated)</option>
            <option value="XF">XF (Extremely Fine)</option>
            <option value="VF">VF (Very Fine)</option>
          </select>
        </div>
      )}
    </div>
  );
}
