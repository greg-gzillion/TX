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
    overrideYear?: boolean;
  };
  onChange: (details: any) => void;
  metalType?: string;
}

export default function CoinDetailsForm({ coinDetails, onChange, metalType }: CoinDetailsFormProps) {
  const [customCountry, setCustomCountry] = useState('');
  const [customMint, setCustomMint] = useState('');
  const [showCustomCountry, setShowCustomCountry] = useState(false);
  const [showCustomMint, setShowCustomMint] = useState(false);
  const [localYear, setLocalYear] = useState(coinDetails.year || '');
  const [localMintage, setLocalMintage] = useState(coinDetails.mintage || '');
  const [yearTimeout, setYearTimeout] = useState<NodeJS.Timeout | null>(null);
  const [mintageTimeout, setMintageTimeout] = useState<NodeJS.Timeout | null>(null);
  const [yearWarning, setYearWarning] = useState<string | null>(null);

  // Mint operating years database
  const mintYears: Record<string, { start: number; end: number | 'present' }> = {
    // US Mints
    'Philadelphia (P) - 1792-present': { start: 1792, end: 'present' },
    'Denver (D) - 1906-present': { start: 1906, end: 'present' },
    'San Francisco (S) - 1854-present': { start: 1854, end: 'present' },
    'West Point (W) - 1988-present': { start: 1988, end: 'present' },
    'Carson City (CC) - 1870-1893': { start: 1870, end: 1893 },
    'Charlotte (C) - 1838-1861': { start: 1838, end: 1861 },
    'Dahlonega (D) - 1838-1861': { start: 1838, end: 1861 },
    'New Orleans (O) - 1838-1909': { start: 1838, end: 1909 },
    'Manila (M) - 1920-1922, 1925-1941': { start: 1920, end: 1941 },
    
    // Russian Mints
    'Saint Petersburg Mint (СПБ) - 1724-present': { start: 1724, end: 'present' },
    'Moscow Mint (ММД) - 1942-present': { start: 1942, end: 'present' },
    'Ekaterinburg Mint (ЕМ) - 1725-1876': { start: 1725, end: 1876 },
    'Suzun Mint (СУЗУН) - 1766-1847': { start: 1766, end: 1847 },
    
    // Canadian Mints
    'Royal Canadian Mint - Ottawa (1908-present)': { start: 1908, end: 'present' },
    'Royal Canadian Mint - Winnipeg (1976-present)': { start: 1976, end: 'present' },
    
    // UK Mints
    'Royal Mint - London (886-1975)': { start: 886, end: 1975 },
    'Royal Mint - Llantrisant (1968-present)': { start: 1968, end: 'present' },
  };

  // Validate year against mint operating years
  useEffect(() => {
    if (coinDetails.mint && localYear) {
      const yearNum = parseInt(localYear);
      if (!isNaN(yearNum)) {
        const mintInfo = mintYears[coinDetails.mint];
        if (mintInfo && !coinDetails.overrideYear) {
          const end = mintInfo.end === 'present' ? new Date().getFullYear() : mintInfo.end;
          if (yearNum < mintInfo.start || yearNum > end) {
            setYearWarning(`⚠️ ${coinDetails.mint} operated from ${mintInfo.start} to ${mintInfo.end}. Year ${yearNum} is outside this range.`);
          } else {
            setYearWarning(null);
          }
        } else {
          setYearWarning(null);
        }
      } else {
        setYearWarning(null);
      }
    } else {
      setYearWarning(null);
    }
  }, [coinDetails.mint, localYear, coinDetails.overrideYear]);

  // Sync local state with props
  useEffect(() => {
    setLocalYear(coinDetails.year || '');
  }, [coinDetails.year]);

  useEffect(() => {
    setLocalMintage(coinDetails.mintage || '');
  }, [coinDetails.mintage]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (yearTimeout) clearTimeout(yearTimeout);
      if (mintageTimeout) clearTimeout(mintageTimeout);
    };
  }, [yearTimeout, mintageTimeout]);

  const updateField = (field: string, value: any) => {
    const newDetails = { ...coinDetails, [field]: value };
    onChange(newDetails);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalYear(value);
    if (yearTimeout) clearTimeout(yearTimeout);
    const timeout = setTimeout(() => updateField('year', value), 500);
    setYearTimeout(timeout);
  };

  const handleMintageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalMintage(value);
    if (mintageTimeout) clearTimeout(mintageTimeout);
    const timeout = setTimeout(() => updateField('mintage', value), 500);
    setMintageTimeout(timeout);
  };

  const handleCountryChange = (selectedValue: string) => {
    if (selectedValue === 'custom') {
      setShowCustomCountry(true);
    } else if (selectedValue === 'Other') {
      const newDetails = { 
        ...coinDetails, 
        country: 'Other',
        mint: '',
        year: '',
        mintage: '',
        overrideYear: false
      };
      onChange(newDetails);
      setShowCustomCountry(false);
      setYearWarning(null);
    } else if (selectedValue) {
      const newDetails = { 
        ...coinDetails, 
        country: selectedValue,
        mint: '',
        year: '',
        mintage: '',
        overrideYear: false
      };
      onChange(newDetails);
      setShowCustomCountry(false);
      setYearWarning(null);
    }
  };

  const handleCustomCountryAdd = () => {
    if (customCountry.trim()) {
      const newDetails = { 
        ...coinDetails, 
        country: customCountry.trim(),
        mint: '',
        year: '',
        mintage: '',
        overrideYear: false
      };
      onChange(newDetails);
      setCustomCountry('');
      setShowCustomCountry(false);
      setYearWarning(null);
    }
  };

  const handleMintChange = (selectedValue: string) => {
    if (selectedValue === 'custom') {
      setShowCustomMint(true);
    } else if (selectedValue) {
      updateField('mint', selectedValue);
      setShowCustomMint(false);
      setYearWarning(null);
    }
  };

  const handleCustomMintAdd = () => {
    if (customMint.trim()) {
      updateField('mint', customMint.trim());
      setCustomMint('');
      setShowCustomMint(false);
      setYearWarning(null);
    }
  };

  const handleOverrideYear = () => {
    updateField('overrideYear', true);
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
      'New Orleans (O) - 1838-1909',
      'Manila (M) - 1920-1922, 1925-1941'
    ],
    'Russia': [
      'Saint Petersburg Mint (СПБ) - 1724-present',
      'Moscow Mint (ММД) - 1942-present',
      'Ekaterinburg Mint (ЕМ) - 1725-1876',
      'Suzun Mint (СУЗУН) - 1766-1847',
    ],
    'Canada': [
      'Royal Canadian Mint - Ottawa (1908-present)',
      'Royal Canadian Mint - Winnipeg (1976-present)'
    ],
    'UK': [
      'Royal Mint - London (886-1975)',
      'Royal Mint - Llantrisant (1968-present)'
    ],
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
        {coinDetails.overrideYear && <span className="text-xs text-amber-600 ml-2">(date override active)</span>}
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
              <option value="Russia">Russia</option>
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
              <>
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
                <p className="text-xs text-blue-600 mt-1">
                  Showing mints for {coinDetails.country}
                </p>
              </>
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
            <div className="px-3 py-2 bg-blue-50 border border-blue-300 rounded-md text-blue-700">
              <p className="text-sm font-medium">💡 Select a country above first</p>
              <p className="text-xs mt-1">Then you'll see the mints for that country</p>
            </div>
          )}
        </div>

        {/* Year with validation and override */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={localYear}
            onChange={handleYearChange}
            placeholder="e.g., 1832, 1895, 1993"
            className={`w-full px-3 py-2 border rounded-md ${
              yearWarning && !coinDetails.overrideYear ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {yearWarning && !coinDetails.overrideYear && (
            <div className="mt-2">
              <p className="text-xs text-red-600 mb-2">{yearWarning}</p>
              <button
                type="button"
                onClick={handleOverrideYear}
                className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded hover:bg-amber-200"
              >
                This is correct - override validation
              </button>
            </div>
          )}
          {yearWarning && coinDetails.overrideYear && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠️ You've overridden the date validation. Please add explanation in description.
            </p>
          )}
          {!yearWarning && (
            <p className="text-xs text-gray-500 mt-1">
              Include mint mark if applicable (e.g., 1832-CПБ)
            </p>
          )}
        </div>

        {/* Mintage */}
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
    </div>
  );
}
