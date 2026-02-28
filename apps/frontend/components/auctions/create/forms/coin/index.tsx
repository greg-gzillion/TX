'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';

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

// Country options with flags
const countryOptions = [
  { value: 'USA', label: '🇺🇸 United States' },
  { value: 'Canada', label: '🇨🇦 Canada' },
  { value: 'UK', label: '🇬🇧 United Kingdom' },
  { value: 'Russia', label: '🇷🇺 Russia' },
  { value: 'Mexico', label: '🇲🇽 Mexico' },
  { value: 'Australia', label: '🇦🇺 Australia' },
  { value: 'Austria', label: '🇦🇹 Austria' },
  { value: 'South Africa', label: '🇿🇦 South Africa' },
  { value: 'Switzerland', label: '🇨🇭 Switzerland' },
  { value: 'Germany', label: '🇩🇪 Germany' },
  { value: 'China', label: '🇨🇳 China' },
  { value: 'Other', label: '🌍 Other' },
];

// Mint database with metal compatibility and operating years
const mintDatabase: Record<string, Record<string, Array<{ value: string; label: string; minYear: number; maxYear: number | 'present' }>>> = {
  'USA': {
    'Gold': [
      { value: 'Philadelphia (P) - 1792-present', label: '🇺🇸 Philadelphia (P)', minYear: 1792, maxYear: 'present' },
      { value: 'Denver (D) - 1906-present', label: '🇺🇸 Denver (D)', minYear: 1906, maxYear: 'present' },
      { value: 'San Francisco (S) - 1854-present', label: '🇺🇸 San Francisco (S)', minYear: 1854, maxYear: 'present' },
      { value: 'West Point (W) - 1988-present', label: '🇺🇸 West Point (W)', minYear: 1988, maxYear: 'present' },
      { value: 'Carson City (CC) - 1870-1893', label: '🇺🇸 Carson City (CC)', minYear: 1870, maxYear: 1893 },
      { value: 'Charlotte (C) - 1838-1861', label: '🇺🇸 Charlotte (C)', minYear: 1838, maxYear: 1861 },
      { value: 'Dahlonega (D) - 1838-1861', label: '🇺🇸 Dahlonega (D)', minYear: 1838, maxYear: 1861 },
      { value: 'New Orleans (O) - 1838-1909', label: '🇺🇸 New Orleans (O)', minYear: 1838, maxYear: 1909 },
    ],
    'Silver': [
      { value: 'Philadelphia (P) - 1792-present', label: '🇺🇸 Philadelphia (P)', minYear: 1792, maxYear: 'present' },
      { value: 'Denver (D) - 1906-present', label: '🇺🇸 Denver (D)', minYear: 1906, maxYear: 'present' },
      { value: 'San Francisco (S) - 1854-present', label: '🇺🇸 San Francisco (S)', minYear: 1854, maxYear: 'present' },
      { value: 'Carson City (CC) - 1870-1893', label: '🇺🇸 Carson City (CC)', minYear: 1870, maxYear: 1893 },
      { value: 'New Orleans (O) - 1838-1909', label: '🇺🇸 New Orleans (O)', minYear: 1838, maxYear: 1909 },
    ],
    'Platinum': [
      { value: 'Philadelphia (P) - 1792-present', label: '🇺🇸 Philadelphia (P)', minYear: 1997, maxYear: 'present' },
      { value: 'West Point (W) - 1988-present', label: '🇺🇸 West Point (W)', minYear: 1997, maxYear: 'present' },
    ],
    'Palladium': [
      { value: 'West Point (W) - 1988-present', label: '🇺🇸 West Point (W)', minYear: 2017, maxYear: 'present' },
    ],
    'Copper': [
      { value: 'Philadelphia (P) - 1792-present', label: '🇺🇸 Philadelphia (P)', minYear: 1792, maxYear: 'present' },
      { value: 'Denver (D) - 1906-present', label: '🇺🇸 Denver (D)', minYear: 1906, maxYear: 'present' },
    ],
  },
  'Russia': {
    'Platinum': [
      { value: 'Saint Petersburg Mint (СПБ) - 1724-present', label: '🇷🇺 Saint Petersburg (СПБ)', minYear: 1828, maxYear: 1845 },
    ],
    'Gold': [
      { value: 'Saint Petersburg Mint (СПБ) - 1724-present', label: '🇷🇺 Saint Petersburg (СПБ)', minYear: 1724, maxYear: 'present' },
      { value: 'Moscow Mint (ММД) - 1942-present', label: '🇷🇺 Moscow (ММД)', minYear: 1942, maxYear: 'present' },
    ],
    'Silver': [
      { value: 'Saint Petersburg Mint (СПБ) - 1724-present', label: '🇷🇺 Saint Petersburg (СПБ)', minYear: 1724, maxYear: 'present' },
      { value: 'Moscow Mint (ММД) - 1942-present', label: '🇷🇺 Moscow (ММД)', minYear: 1942, maxYear: 'present' },
    ],
  },
  'Canada': {
    'Gold': [
      { value: 'Royal Canadian Mint - Ottawa (1908-present)', label: '🇨🇦 Ottawa', minYear: 1908, maxYear: 'present' },
      { value: 'Royal Canadian Mint - Winnipeg (1976-present)', label: '🇨🇦 Winnipeg', minYear: 1976, maxYear: 'present' },
    ],
    'Silver': [
      { value: 'Royal Canadian Mint - Ottawa (1908-present)', label: '🇨🇦 Ottawa', minYear: 1908, maxYear: 'present' },
      { value: 'Royal Canadian Mint - Winnipeg (1976-present)', label: '🇨🇦 Winnipeg', minYear: 1976, maxYear: 'present' },
    ],
  },
  'UK': {
    'Gold': [
      { value: 'Royal Mint - London (886-1975)', label: '🇬🇧 London', minYear: 886, maxYear: 1975 },
      { value: 'Royal Mint - Llantrisant (1968-present)', label: '🇬🇧 Llantrisant', minYear: 1968, maxYear: 'present' },
    ],
  },
};

// Grade options with categories
const gradeOptions = [
  {
    label: '🏆 Mint State (Uncirculated)',
    options: [
      { value: 'MS70', label: 'MS70 - Perfect' },
      { value: 'MS69', label: 'MS69 - Near Perfect' },
      { value: 'MS68', label: 'MS68 - Superb Gem' },
      { value: 'MS67', label: 'MS67 - Gem' },
      { value: 'MS66', label: 'MS66 - Choice Gem' },
      { value: 'MS65', label: 'MS65 - Choice' },
      { value: 'MS64', label: 'MS64 - Very Choice' },
      { value: 'MS63', label: 'MS63 - Choice' },
      { value: 'MS62', label: 'MS62 - Uncirculated' },
      { value: 'MS61', label: 'MS61 - Uncirculated' },
      { value: 'MS60', label: 'MS60 - Uncirculated' },
    ]
  },
  {
    label: '⭐ About Uncirculated',
    options: [
      { value: 'AU58', label: 'AU58 - Very Choice' },
      { value: 'AU55', label: 'AU55 - Choice' },
      { value: 'AU53', label: 'AU53 - About Uncirculated' },
      { value: 'AU50', label: 'AU50 - About Uncirculated' },
    ]
  },
  {
    label: '🔍 Extremely Fine',
    options: [
      { value: 'XF45', label: 'XF45 - Choice' },
      { value: 'XF40', label: 'XF40 - Extremely Fine' },
    ]
  },
  {
    label: '📜 Very Fine',
    options: [
      { value: 'VF35', label: 'VF35 - Choice' },
      { value: 'VF30', label: 'VF30 - Very Fine' },
      { value: 'VF25', label: 'VF25 - Very Fine' },
      { value: 'VF20', label: 'VF20 - Very Fine' },
    ]
  },
  {
    label: '📖 Fine',
    options: [
      { value: 'F15', label: 'F15 - Choice' },
      { value: 'F12', label: 'F12 - Fine' },
    ]
  },
];

export default function CoinDetailsForm({ coinDetails, onChange, metalType }: CoinDetailsFormProps) {
  const [mintOptions, setMintOptions] = useState<any[]>([]);
  const [yearOptions, setYearOptions] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedMint, setSelectedMint] = useState<any>(null);

  // Update mint options when country or metal type changes
  useEffect(() => {
    if (selectedCountry && metalType) {
      const mints = mintDatabase[selectedCountry.value]?.[metalType] || [];
      setMintOptions(mints);
      
      // Reset mint selection
      setSelectedMint(null);
      onChange({ ...coinDetails, mint: '', year: '' });
      setYearOptions([]);
    }
  }, [selectedCountry, metalType]);

  // Update year options when mint changes
  useEffect(() => {
    if (selectedMint) {
      const years = [];
      const currentYear = new Date().getFullYear();
      const minYear = selectedMint.minYear;
      const maxYear = selectedMint.maxYear === 'present' ? currentYear : selectedMint.maxYear;
      
      for (let year = minYear; year <= maxYear; year++) {
        years.push({ value: year.toString(), label: year.toString() });
      }
      
      setYearOptions(years);
    }
  }, [selectedMint]);

  const handleCountryChange = (selected: any) => {
    setSelectedCountry(selected);
    onChange({ 
      ...coinDetails, 
      country: selected?.value || '',
      mint: '',
      year: '' 
    });
  };

  const handleMintChange = (selected: any) => {
    setSelectedMint(selected);
    onChange({ ...coinDetails, mint: selected?.value || '', year: '' });
  };

  const handleYearChange = (selected: any) => {
    onChange({ ...coinDetails, year: selected?.value || '' });
  };

  const handleMintageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...coinDetails, mintage: e.target.value });
  };

  const handleNumismaticChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...coinDetails, isNumismatic: e.target.checked });
  };

  const handleGradeChange = (selected: any) => {
    onChange({ ...coinDetails, grade: selected?.value || '' });
  };

  return (
    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
        <span className="text-xl">🪙</span>
        Coin Details
      </h3>
      
      <div className="space-y-4">
        {/* Country Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country of Origin <span className="text-red-500">*</span>
          </label>
          <Select
            options={countryOptions}
            value={countryOptions.find(c => c.value === coinDetails.country)}
            onChange={handleCountryChange}
            placeholder="Search or select country..."
            isSearchable
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {/* Mint Dropdown - Dynamic based on country + metal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mint {selectedCountry && <span className="text-red-500">*</span>}
          </label>
          <Select
            options={mintOptions}
            value={mintOptions.find(m => m.value === coinDetails.mint)}
            onChange={handleMintChange}
            placeholder={selectedCountry ? "Select mint..." : "Select a country first"}
            isDisabled={!selectedCountry}
            isSearchable
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {selectedCountry && mintOptions.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">
              No mints found for {metalType} in {selectedCountry.label}
            </p>
          )}
        </div>

        {/* Year Dropdown - Dynamic based on mint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <Select
            options={yearOptions}
            value={yearOptions.find(y => y.value === coinDetails.year)}
            onChange={handleYearChange}
            placeholder={selectedMint ? "Select year..." : "Select a mint first"}
            isDisabled={!selectedMint}
            isSearchable
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {selectedMint && (
            <p className="text-xs text-gray-500 mt-1">
              Range: {selectedMint.minYear} - {selectedMint.maxYear === 'present' ? 'present' : selectedMint.maxYear}
            </p>
          )}
        </div>

        {/* Mintage (manual input) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mintage <span className="text-xs text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            value={coinDetails.mintage || ''}
            onChange={handleMintageChange}
            placeholder="e.g., 1,000,000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Numismatic checkbox */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={coinDetails.isNumismatic}
              onChange={handleNumismaticChange}
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

        {/* Grade Dropdown - Only if numismatic */}
        {coinDetails.isNumismatic && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade / Condition
            </label>
            <Select
              options={gradeOptions}
              value={gradeOptions.flatMap(g => g.options).find(g => g.value === coinDetails.grade)}
              onChange={handleGradeChange}
              placeholder="Select grade..."
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        )}
      </div>
    </div>
  );
}
