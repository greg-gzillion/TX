'use client';

import { useEffect } from 'react';

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
  useEffect(() => {
    console.log('🔵 CoinDetailsForm rendered with country:', coinDetails.country);
  });

  const updateField = (field: string, value: any) => {
    console.log(`✏️ Updating ${field} to:`, value);
    const newDetails = { ...coinDetails, [field]: value };
    console.log('   New details:', JSON.stringify(newDetails));
    onChange(newDetails);
  };

  const handleCountryChange = (newCountry: string) => {
    console.log('🌍 Country changed to:', newCountry);
    // Update country AND reset mint in one atomic update
    const newDetails = { 
      ...coinDetails, 
      country: newCountry,
      mint: '' // Reset mint
    };
    console.log('   Atomic update:', JSON.stringify(newDetails));
    onChange(newDetails);
  };

  const mintLists: Record<string, string[]> = {
    'USA': [
      'Philadelphia (P) - 1792-present',
      'Denver (D) - 1906-present',
      'San Francisco (S) - 1854-present',
      'West Point (W) - 1988-present',
      'Carson City (CC) - 1870-1893',
      'Charlotte (C) - 1838-1861',
      'Dahlonega (D) - 1838-1861',
      'New Orleans (O) - 1838-1909'
    ],
    'Canada': [
      'Royal Canadian Mint - Ottawa (1908-present)',
      'Royal Canadian Mint - Winnipeg (1976-present)'
    ],
    'UK': [
      'Royal Mint - London (886-1975)',
      'Royal Mint - Llantrisant (1968-present)'
    ],
    'Mexico': [
      'Casa de Moneda de México (1535-present)'
    ],
    'Australia': [
      'Perth Mint (1899-present)',
      'Royal Australian Mint - Canberra (1965-present)'
    ],
    'Austria': [
      'Austrian Mint (1489-present)'
    ],
    'South Africa': [
      'South African Mint (1892-present)'
    ],
    'Switzerland': [
      'Swissmint - Bern (1855-present)',
      'PAMP Suisse (1977-present)'
    ]
  };

  const currentMints = coinDetails.country ? mintLists[coinDetails.country] || [] : [];
  console.log('📋 Current mints for', coinDetails.country || 'none', ':', currentMints.length);

  return (
    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
        <span className="text-xl">🪙</span>
        Coin Details
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Country of Origin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country of Origin <span className="text-red-500">*</span>
          </label>
          <select
            value={coinDetails.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="">Select country...</option>
            <option value="USA">United States</option>
            <option value="Canada">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="Mexico">Mexico</option>
            <option value="Australia">Australia</option>
            <option value="Austria">Austria</option>
            <option value="South Africa">South Africa</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Mint - shows options based on country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mint {coinDetails.country && <span className="text-red-500">*</span>}
          </label>
          {coinDetails.country ? (
            <select
              value={coinDetails.mint}
              onChange={(e) => updateField('mint', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="">Select mint...</option>
              {currentMints.map((mint) => (
                <option key={mint} value={mint}>
                  {mint}
                </option>
              ))}
            </select>
          ) : (
            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500">
              Select a country first
            </div>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={coinDetails.year}
            onChange={(e) => updateField('year', e.target.value)}
            placeholder="e.g., 2024, 1986, 1879-CC"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Include mint mark if applicable (e.g., 2024-P, 1883-CC)
          </p>
        </div>

        {/* Mintage (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mintage <span className="text-xs text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            value={coinDetails.mintage}
            onChange={(e) => updateField('mintage', e.target.value)}
            placeholder="e.g., 1,000,000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Numismatic checkbox */}
      <div className="mt-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={coinDetails.isNumismatic}
            onChange={(e) => updateField('isNumismatic', e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">
            This is a numismatic / collectible coin
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-6">
          Numismatic coins have value beyond their metal content (rarity, condition, historical significance)
        </p>
      </div>

      {/* Grade (if numismatic) */}
      {coinDetails.isNumismatic && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade / Condition
          </label>
          <select
            value={coinDetails.grade}
            onChange={(e) => updateField('grade', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select grade...</option>
            <option value="MS70">MS70 (Perfect)</option>
            <option value="MS69">MS69 (Near Perfect)</option>
            <option value="MS68">MS68</option>
            <option value="MS67">MS67</option>
            <option value="MS66">MS66</option>
            <option value="MS65">MS65</option>
            <option value="MS64">MS64</option>
            <option value="MS63">MS63</option>
            <option value="MS62">MS62</option>
            <option value="MS61">MS61</option>
            <option value="MS60">MS60</option>
            <option value="AU">AU (About Uncirculated)</option>
            <option value="XF">XF (Extremely Fine)</option>
            <option value="VF">VF (Very Fine)</option>
            <option value="F">F (Fine)</option>
            <option value="VG">VG (Very Good)</option>
            <option value="G">G (Good)</option>
          </select>
        </div>
      )}

      {/* Helper text */}
      {coinDetails.country === 'USA' && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <p>💡 Examples of valuable US coins:</p>
          <ul className="grid grid-cols-2 gap-1 mt-1">
            <li>• 1909-S VDB Lincoln Cent</li>
            <li>• 1916-D Mercury Dime</li>
            <li>• 1933 Saint-Gaudens $20</li>
            <li>• 1955 Double Die Lincoln</li>
            <li>• 1970-S Small Date Cent</li>
            <li>• 1995-W Silver Eagle</li>
          </ul>
        </div>
      )}
    </div>
  );
}
