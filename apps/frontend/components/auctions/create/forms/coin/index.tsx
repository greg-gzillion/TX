'use client';

import { useState, useEffect } from 'react';

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
  const [customCountry, setCustomCountry] = useState('');
  const [customMint, setCustomMint] = useState('');
  const [showCustomCountry, setShowCustomCountry] = useState(false);
  const [showCustomMint, setShowCustomMint] = useState(false);
  
  // Local state for text inputs to prevent re-render issues
  const [localYear, setLocalYear] = useState(coinDetails.year || '');
  const [localMintage, setLocalMintage] = useState(coinDetails.mintage || '');

  // Sync local state with props when they change from outside
  useEffect(() => {
    setLocalYear(coinDetails.year || '');
  }, [coinDetails.year]);

  useEffect(() => {
    setLocalMintage(coinDetails.mintage || '');
  }, [coinDetails.mintage]);

  const updateField = (field: string, value: any) => {
    console.log(`Updating ${field} to:`, value);
    const newDetails = { ...coinDetails, [field]: value };
    onChange(newDetails);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalYear(value); // Update local state immediately
    
    // Clear any pending timeout
    if (yearTimeout) clearTimeout(yearTimeout);
    
    // Set new timeout to update parent
    const timeout = setTimeout(() => {
      updateField('year', value);
    }, 500);
    
    setYearTimeout(timeout);
  };

  const handleMintageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalMintage(value); // Update local state immediately
    
    // Clear any pending timeout
    if (mintageTimeout) clearTimeout(mintageTimeout);
    
    // Set new timeout to update parent
    const timeout = setTimeout(() => {
      updateField('mintage', value);
    }, 500);
    
    setMintageTimeout(timeout);
  };

  // Store timeouts for cleanup
  const [yearTimeout, setYearTimeout] = useState<NodeJS.Timeout | null>(null);
  const [mintageTimeout, setMintageTimeout] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (yearTimeout) clearTimeout(yearTimeout);
      if (mintageTimeout) clearTimeout(mintageTimeout);
    };
  }, [yearTimeout, mintageTimeout]);

  const handleCountryChange = (selectedValue: string) => {
    console.log('Country selected:', selectedValue);
    
    if (selectedValue === 'custom') {
      setShowCustomCountry(true);
    } else if (selectedValue === 'Other') {
      const newDetails = { 
        ...coinDetails, 
        country: 'Other',
        mint: '',
        year: '',
        mintage: ''
      };
      onChange(newDetails);
      setShowCustomCountry(false);
    } else if (selectedValue) {
      const newDetails = { 
        ...coinDetails, 
        country: selectedValue,
        mint: '',
        year: '',
        mintage: ''
      };
      onChange(newDetails);
      setShowCustomCountry(false);
    }
  };

  const handleCustomCountryAdd = () => {
    if (customCountry.trim()) {
      console.log('Adding custom country:', customCountry.trim());
      const newDetails = { 
        ...coinDetails, 
        country: customCountry.trim(),
        mint: '',
        year: '',
        mintage: ''
      };
      onChange(newDetails);
      setCustomCountry('');
      setShowCustomCountry(false);
    }
  };

  const handleMintChange = (selectedValue: string) => {
    console.log('Mint selected:', selectedValue);
    
    if (selectedValue === 'custom') {
      setShowCustomMint(true);
    } else if (selectedValue) {
      updateField('mint', selectedValue);
      setShowCustomMint(false);
    }
  };

  const handleCustomMintAdd = () => {
    if (customMint.trim()) {
      updateField('mint', customMint.trim());
      setCustomMint('');
      setShowCustomMint(false);
    }
  };

  // Mint lists by country
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
    ],
    'Germany': [
      'Berlin Mint (1280-present)',
      'Hamburg Mint (834-present)',
      'Munich Mint (1158-present)',
      'Stuttgart Mint (1374-present)',
      'Karlsruhe Mint (1827-present)',
      'Dresden Mint (1556-present)',
      'Frankfurt Mint (1405-present)'
    ]
  };

  const currentMints = coinDetails.country && 
    coinDetails.country !== 'Other' && 
    coinDetails.country !== 'custom' 
    ? mintLists[coinDetails.country] || [] 
    : [];

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
          
          {!showCustomCountry ? (
            <select
              value={coinDetails.country === 'Other' || coinDetails.country === 'custom' ? '' : coinDetails.country}
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
              <option value="Germany">Germany</option>
              <option value="Other">Other</option>
              <option value="custom">➕ Add custom country...</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                placeholder="Enter country name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCustomCountryAdd();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleCustomCountryAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomCountry(false);
                  setCustomCountry('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Mint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mint {coinDetails.country && coinDetails.country !== 'Other' && <span className="text-red-500">*</span>}
          </label>
          
          {coinDetails.country && coinDetails.country !== 'Other' ? (
            !showCustomMint ? (
              <select
                value={coinDetails.mint}
                onChange={(e) => handleMintChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="">Select mint...</option>
                {currentMints.map((mint) => (
                  <option key={mint} value={mint}>
                    {mint}
                  </option>
                ))}
                <option value="custom">➕ Add custom mint...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customMint}
                  onChange={(e) => setCustomMint(e.target.value)}
                  placeholder="Enter mint name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  autoFocus
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomMint(false);
                    setCustomMint('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )
          ) : (
            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500">
              {!coinDetails.country ? 'Select a country first' : 'Select "Other" or custom country for custom mint'}
            </div>
          )}
        </div>

        {/* Year - FIXED: Using local state */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={localYear}
            onChange={handleYearChange}
            placeholder="e.g., 2024, 1986, 1879-CC, 1909-S"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Include mint mark if applicable (e.g., 2024-P, 1883-CC)
          </p>
        </div>

        {/* Mintage - FIXED: Using local state */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mintage <span className="text-xs text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            value={localMintage}
            onChange={handleMintageChange}
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
            checked={coinDetails.isNumismatic || false}
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
            value={coinDetails.grade || ''}
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
