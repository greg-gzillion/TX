'use client';

import { useState } from 'react';

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
  const [customMint, setCustomMint] = useState('');

  const updateField = (field: string, value: any) => {
    onChange({ ...coinDetails, [field]: value });
  };

  // Get mints based on selected country
  const getMintOptions = () => {
    switch(coinDetails.country) {
      case 'USA':
        return [
          { value: 'Philadelphia', label: 'Philadelphia (P) - 1792-present' },
          { value: 'Denver', label: 'Denver (D) - 1906-present' },
          { value: 'San Francisco', label: 'San Francisco (S) - 1854-present' },
          { value: 'West Point', label: 'West Point (W) - 1988-present' },
          { value: 'Carson City', label: 'Carson City (CC) - 1870-1893' },
          { value: 'Charlotte', label: 'Charlotte (C) - 1838-1861' },
          { value: 'Dahlonega', label: 'Dahlonega (D) - 1838-1861' },
          { value: 'New Orleans', label: 'New Orleans (O) - 1838-1909' },
          { value: 'Manila', label: 'Manila (M) - 1920-1922, 1925-1941' },
          { value: 'Other US Mint', label: 'Other US Mint / Private' }
        ];
      
      case 'Canada':
        return [
          { value: 'Royal Canadian Mint', label: 'Royal Canadian Mint - Ottawa' },
          { value: 'Royal Canadian Mint', label: 'Royal Canadian Mint - Winnipeg' },
          { value: 'Other', label: 'Other Canadian Mint' }
        ];
      
      case 'UK':
        return [
          { value: 'Royal Mint', label: 'Royal Mint - London' },
          { value: 'Royal Mint', label: 'Royal Mint - Llantrisant' },
          { value: 'Other', label: 'Other UK Mint' }
        ];
      
      case 'Mexico':
        return [
          { value: 'Mexico Mint', label: 'Casa de Moneda de México' },
          { value: 'Other', label: 'Other Mexican Mint' }
        ];
      
      case 'Australia':
        return [
          { value: 'Perth Mint', label: 'Perth Mint' },
          { value: 'Royal Australian Mint', label: 'Royal Australian Mint - Canberra' },
          { value: 'Other', label: 'Other Australian Mint' }
        ];
      
      case 'Austria':
        return [
          { value: 'Austrian Mint', label: 'Münze Österreich' },
          { value: 'Other', label: 'Other Austrian Mint' }
        ];
      
      case 'South Africa':
        return [
          { value: 'South African Mint', label: 'South African Mint' },
          { value: 'Other', label: 'Other South African Mint' }
        ];
      
      case 'Switzerland':
        return [
          { value: 'Swissmint', label: 'Swissmint - Bern' },
          { value: 'PAMP Suisse', label: 'PAMP Suisse' },
          { value: 'Other', label: 'Other Swiss Mint' }
        ];
      
      default:
        return [
          { value: 'US Mint', label: 'US Mint' },
          { value: 'Royal Canadian Mint', label: 'Royal Canadian Mint' },
          { value: 'Royal Mint', label: 'Royal Mint (UK)' },
          { value: 'Perth Mint', label: 'Perth Mint' },
          { value: 'Mexico Mint', label: 'Mexico Mint' },
          { value: 'Other', label: 'Other Mint' }
        ];
    }
  };

  const handleCustomMintAdd = () => {
    if (customMint.trim()) {
      updateField('mint', customMint.trim());
      setCustomMint('');
    }
  };

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
            Country of Origin
          </label>
          <select
            value={coinDetails.country}
            onChange={(e) => {
              updateField('country', e.target.value);
              updateField('mint', ''); // Reset mint when country changes
            }}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select country...</option>
            <option value="USA">United States</option>
            <option value="Canada">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="Mexico">Mexico</option>
            <option value="China">China</option>
            <option value="Australia">Australia</option>
            <option value="Austria">Austria</option>
            <option value="South Africa">South Africa</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Mint - Dynamic based on country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mint
          </label>
          <select
            value={coinDetails.mint}
            onChange={(e) => updateField('mint', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            disabled={!coinDetails.country}
          >
            <option value="">Select mint...</option>
            {getMintOptions().map((mint) => (
              <option key={mint.value} value={mint.value}>
                {mint.label}
              </option>
            ))}
          </select>
          
          {/* Custom mint input */}
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={customMint}
              onChange={(e) => setCustomMint(e.target.value)}
              placeholder="Or enter custom mint"
              className="flex-1 px-3 py-1 text-sm border rounded-md"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCustomMintAdd();
                }
              }}
            />
            <button
              type="button"
              onClick={handleCustomMintAdd}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
            >
              Add
            </button>
          </div>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="text"
            value={coinDetails.year}
            onChange={(e) => updateField('year', e.target.value)}
            placeholder="e.g., 2024, 1986, 1879-CC"
            className="w-full px-3 py-2 border rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Include mint mark if applicable (e.g., 2024-P, 1883-CC)
          </p>
        </div>

        {/* Mintage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mintage <span className="text-xs text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            value={coinDetails.mintage}
            onChange={(e) => updateField('mintage', e.target.value)}
            placeholder="e.g., 1,000,000"
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
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

      {/* Helper text with examples */}
      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
        <p>💡 Examples of US Mint marks:</p>
        <ul className="grid grid-cols-2 gap-1 mt-1">
          <li>• P: Philadelphia (1793-present)</li>
          <li>• D: Denver (1906-present)</li>
          <li>• S: San Francisco (1854-present)</li>
          <li>• W: West Point (1988-present)</li>
          <li>• CC: Carson City (1870-1893)</li>
          <li>• O: New Orleans (1838-1909)</li>
          <li>• C: Charlotte (1838-1861)</li>
          <li>• D: Dahlonega (1838-1861)</li>
        </ul>
      </div>
    </div>
  );
}