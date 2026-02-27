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
  metalType?: string; // Pass the selected metal type from parent
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
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

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
    
    // Validate after update
    if (field === 'mint' || field === 'country') {
      validateSelection(metalType, coinDetails.country, value);
    }
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
        mintage: ''
      };
      onChange(newDetails);
      setShowCustomCountry(false);
      setValidationWarning(null);
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
      setValidationWarning(null);
    }
  };

  const handleCustomCountryAdd = () => {
    if (customCountry.trim()) {
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
      setValidationWarning(null);
    }
  };

  const handleMintChange = (selectedValue: string) => {
    if (selectedValue === 'custom') {
      setShowCustomMint(true);
    } else if (selectedValue) {
      updateField('mint', selectedValue);
      setShowCustomMint(false);
      validateSelection(metalType, coinDetails.country, selectedValue);
    }
  };

  const handleCustomMintAdd = () => {
    if (customMint.trim()) {
      updateField('mint', customMint.trim());
      setCustomMint('');
      setShowCustomMint(false);
      validateSelection(metalType, coinDetails.country, customMint.trim());
    }
  };

  // VALIDATION FUNCTION - Checks if mint ever produced this metal
  const validateSelection = (metal?: string, country?: string, mint?: string) => {
    if (!metal || !country || !mint) return;
    
    // Historical database of which mints produced which metals
    const metalMintHistory: Record<string, Record<string, string[]>> = {
      'USA': {
        'Gold': ['Philadelphia', 'Denver', 'San Francisco', 'West Point', 'New Orleans', 'Carson City', 'Charlotte', 'Dahlonega'],
        'Silver': ['Philadelphia', 'Denver', 'San Francisco', 'West Point', 'New Orleans', 'Carson City'],
        'Platinum': ['Philadelphia', 'West Point'], // Only P and W made platinum eagles
        'Palladium': ['West Point'], // Only W makes palladium eagles
        'Copper': ['Philadelphia', 'Denver', 'San Francisco']
      },
      'Russia': {
        'Gold': ['Saint Petersburg Mint (СПБ)', 'Moscow Mint (ММД)', 'Ekaterinburg Mint (ЕМ)'],
        'Silver': ['Saint Petersburg Mint (СПБ)', 'Moscow Mint (ММД)', 'Ekaterinburg Mint (ЕМ)', 'Suzun Mint (СУЗУН)'],
        'Platinum': ['Saint Petersburg Mint (СПБ)'], // Only СПБ made imperial platinum
        'Palladium': [], // Russia never made palladium coins historically
        'Copper': ['Saint Petersburg Mint (СПБ)', 'Moscow Mint (ММД)', 'Ekaterinburg Mint (ЕМ)', 'Suzun Mint (СУЗУН)']
      },
      'Canada': {
        'Gold': ['Royal Canadian Mint - Ottawa', 'Royal Canadian Mint - Winnipeg'],
        'Silver': ['Royal Canadian Mint - Ottawa', 'Royal Canadian Mint - Winnipeg'],
        'Platinum': ['Royal Canadian Mint - Ottawa'], // Platinum only from Ottawa
        'Palladium': ['Royal Canadian Mint - Ottawa'], // Palladium only from Ottawa
        'Copper': ['Royal Canadian Mint - Ottawa', 'Royal Canadian Mint - Winnipeg']
      },
      'UK': {
        'Gold': ['Royal Mint - London', 'Royal Mint - Llantrisant'],
        'Silver': ['Royal Mint - London', 'Royal Mint - Llantrisant'],
        'Platinum': ['Royal Mint - Llantrisant'], // Modern platinum from Llantrisant
        'Palladium': ['Royal Mint - Llantrisant'], // Modern palladium from Llantrisant
        'Copper': ['Royal Mint - London', 'Royal Mint - Llantrisant']
      }
    };

    // Check if this mint ever produced this metal
    const countryData = metalMintHistory[country];
    if (countryData) {
      const validMints = countryData[metal as keyof typeof countryData];
      if (validMints && !validMints.includes(mint)) {
        setValidationWarning(`Warning: ${mint} may not have produced ${metal} coins. Please verify this is correct.`);
      } else {
        setValidationWarning(null);
      }
    }
  };

  // Get mints for selected country - FILTERED BY METAL TYPE
  const getMintsForCountry = () => {
    if (!coinDetails.country || coinDetails.country === 'Other' || coinDetails.country === 'custom') {
      return [];
    }

    // Base mint lists by country
    const allMints: Record<string, string[]> = {
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
        'Warsaw Mint (ВМ) - 1815-1915',
        'Helsinki Mint (СБ) - 1860-1917',
        'Tiflis Mint (ТФ) - 1804-1833'
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
        'Mexico Mint (Casa de Moneda) - 1535-present'
      ],
      'Australia': [
        'Perth Mint (1899-present)',
        'Royal Australian Mint - Canberra (1965-present)'
      ],
      'Austria': [
        'Austrian Mint (Münze Österreich) - 1489-present'
      ],
      'South Africa': [
        'South African Mint - 1892-present'
      ],
      'Switzerland': [
        'Swissmint - Bern (1855-present)',
        'PAMP Suisse (1977-present)'
      ],
      'Germany': [
        'Berlin Mint (A) - 1280-present',
        'Hamburg Mint (J) - 834-present',
        'Munich Mint (D) - 1158-present',
        'Stuttgart Mint (F) - 1374-present',
        'Karlsruhe Mint (G) - 1827-present',
        'Dresden Mint (E) - 1556-present',
        'Frankfurt Mint (C) - 1405-present'
      ],
      'China': [
        'China Mint - Beijing',
        'China Mint - Shanghai',
        'China Mint - Shenzhen',
        'China Mint - Shenyang'
      ]
    };

    // If no metal type, return all mints
    if (!metalType) return allMints[coinDetails.country] || [];

    // Metal-specific mint filtering
    const metalMintMap: Record<string, Record<string, string[]>> = {
      'USA': {
        'Platinum': ['Philadelphia (P)', 'West Point (W)'], // Only P and W made platinum
        'Palladium': ['West Point (W)'], // Only W made palladium
        'Gold': allMints['USA'], // All US mints made gold
        'Silver': allMints['USA'], // All US mints made silver
        'Copper': ['Philadelphia (P)', 'Denver (D)', 'San Francisco (S)'] // Only P,D,S made copper coins
      },
      'Russia': {
        'Platinum': ['Saint Petersburg Mint (СПБ)'], // Only СПБ made imperial platinum
        'Palladium': [], // Russia never made palladium coins
        'Gold': allMints['Russia'],
        'Silver': allMints['Russia'],
        'Copper': allMints['Russia']
      }
    };

    // Get filtered mints for this metal, or return all if no filter exists
    const countryFilter = metalMintMap[coinDetails.country];
    if (countryFilter && countryFilter[metalType]) {
      // Filter the full mint list to only include those that match the metal-specific entries
      return allMints[coinDetails.country].filter(mint => 
        countryFilter[metalType].some(validMint => mint.includes(validMint))
      );
    }

    return allMints[coinDetails.country] || [];
  };

  const currentMints = getMintsForCountry();

  return (
    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
        <span className="text-xl">🪙</span>
        Coin Details
        {metalType && <span className="text-sm font-normal text-gray-600 ml-2">({metalType})</span>}
      </h3>
      
      {/* Validation Warning */}
      {validationWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800">
          ⚠️ {validationWarning}
        </div>
      )}
      
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
              <option value="China">China</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Germany">Germany</option>
              <option value="South Africa">South Africa</option>
              <option value="Switzerland">Switzerland</option>
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

        {/* Mint - FILTERED BY METAL TYPE AND COUNTRY */}
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
                
                {/* Context hints */}
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-blue-600">
                    Showing mints for {coinDetails.country} {metalType && `that produced ${metalType}`}
                  </p>
                  {metalType === 'Platinum' && coinDetails.country === 'USA' && (
                    <p className="text-xs text-amber-600">
                      💡 Platinum Eagles were only minted at Philadelphia (P) and West Point (W)
                    </p>
                  )}
                  {metalType === 'Palladium' && coinDetails.country === 'USA' && (
                    <p className="text-xs text-amber-600">
                      💡 Palladium Eagles are only minted at West Point (W)
                    </p>
                  )}
                  {metalType === 'Platinum' && coinDetails.country === 'Russia' && (
                    <p className="text-xs text-amber-600">
                      💡 Russian imperial platinum was only minted at Saint Petersburg (СПБ)
                    </p>
                  )}
                </div>
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
            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500">
              {!coinDetails.country ? 'Select a country first' : 'Select "Other" or custom country for custom mint'}
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
            value={localYear}
            onChange={handleYearChange}
            placeholder="e.g., 1832, 1895, 1993"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Include mint mark if applicable (e.g., 1832-CПБ)
          </p>
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
