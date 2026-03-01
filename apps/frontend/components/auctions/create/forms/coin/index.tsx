'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { countryOptions } from './data/countries';
import { gradeOptions } from './data/grades';
import { CoinDetails } from './types';
import { useMintData, useCoinData, useYearValidation } from './hooks';
import { CoinTypeSelector } from './components';

interface CoinDetailsFormProps {
  coinDetails: CoinDetails;
  onChange: (details: any) => void;
  metalType?: string;
}

export default function CoinDetailsForm({ coinDetails, onChange, metalType }: CoinDetailsFormProps) {
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedMint, setSelectedMint] = useState<any>(null);
  
<<<<<<< HEAD
  // Coin data hook
  const {
    coinCategories,
    coinOptions,
    activeCategory,
    selectedCoin,
    handleCategoryClick,
    handleCoinSelect
  } = useCoinData(selectedCountry, metalType);
  
  // Mint data hook
  const { mintOptions } = useMintData(selectedCountry, metalType, selectedCoin);
  
  // Year validation hook
  const { yearWarning } = useYearValidation(selectedCoin, selectedMint, coinDetails.year);
=======
  const { coinCategories, coinOptions, activeCategory, selectedCoin, handleCategoryClick, handleCoinSelect } = useCoinData(selectedCountry, metalType);
  
  // ✅ FIXED: Pass selectedCoin to useMintData
  const { mintOptions } = useMintData(selectedCountry, metalType, selectedCoin);
  
  const { yearWarning, validYears } = useYearValidation(selectedCoin, selectedMint, coinDetails.year);
>>>>>>> acc41d4 (Fix: Complete coin module with all 9 US mints and date filtering)

  // Initialize selectedCountry from props
  useEffect(() => {
    if (coinDetails.country && !selectedCountry) {
      const country = countryOptions.find(c => c.value === coinDetails.country);
      if (country) setSelectedCountry(country);
    }
  }, [coinDetails.country]);

  // Update parent when coin is selected
  useEffect(() => {
    if (selectedCoin) {
      onChange({ ...coinDetails, selectedCoin });
    }
  }, [selectedCoin]);

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
    onChange({ 
      ...coinDetails, 
      mint: selected?.value || '', 
      year: '' 
    });
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

  const handleOverrideYear = () => {
    onChange({ ...coinDetails, overrideYear: true });
  };

  return (
    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
        <span className="text-xl">🪙</span>
        Coin Details
        {coinDetails.overrideYear && <span className="text-xs text-amber-600 ml-2">(date override active)</span>}
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

        {/* Coin Type Selector */}
        {selectedCountry?.value === 'USA' && metalType && Object.keys(coinCategories).length > 0 && (
          <CoinTypeSelector
            coinCategories={coinCategories}
            coinOptions={coinOptions}
            activeCategory={activeCategory}
            selectedCoin={selectedCoin}
            onCategoryClick={handleCategoryClick}
            onCoinSelect={handleCoinSelect}
          />
        )}

        {/* Mint Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mint {selectedCountry && <span className="text-red-500">*</span>}
          </label>
          <Select
            options={mintOptions}
            value={mintOptions.find((m: any) => m.value === coinDetails.mint)}
            onChange={handleMintChange}
            placeholder={selectedCountry ? "Select mint..." : "Select a country first"}
            isDisabled={!selectedCountry}
            isSearchable
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {selectedCoin && mintOptions.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {mintOptions.length} mint(s) operational during this coin's era
            </p>
          )}
        </div>

<<<<<<< HEAD
        {/* Year Dropdown - Based on COIN years, not mint years */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Year <span className="text-red-500">*</span>
  </label>
  <Select
    options={selectedCoin ? (() => {
      // Parse the coin's year range
      const yearRange = selectedCoin.years;
      let minYear = 0;
      let maxYear = new Date().getFullYear();
      
      if (yearRange.includes('-')) {
        const parts = yearRange.split('-');
        minYear = parseInt(parts[0]);
        maxYear = parts[1].includes('present') 
          ? new Date().getFullYear() 
          : parseInt(parts[1]);
      } else {
        minYear = parseInt(yearRange);
        maxYear = minYear;
      }
      
      // Generate years from MAX to MIN (newest first)
      const years = [];
      for (let year = maxYear; year >= minYear; year--) {
        years.push({ value: year.toString(), label: year.toString() });
      }
      return years;
    })() : []}
    value={coinDetails.year ? { value: coinDetails.year, label: coinDetails.year } : null}
    onChange={handleYearChange}
    placeholder={selectedCoin ? "Select year..." : "Select a coin type first"}
    isDisabled={!selectedCoin}
    isSearchable
    className="react-select-container"
    classNamePrefix="react-select"
  />
  {selectedCoin && (
    <p className="text-xs text-gray-500 mt-1">
      Coin years: {selectedCoin.years}
    </p>
  )}
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
      ⚠️ You've overridden the date validation. Add explanation in description.
    </p>
  )}
</div>
=======
        {/* Year Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <Select
            options={validYears.map(year => ({ value: year, label: year }))}
            value={coinDetails.year ? { value: coinDetails.year, label: coinDetails.year } : null}
            onChange={handleYearChange}
            placeholder={selectedCoin ? "Select year..." : "Select a coin first"}
            isDisabled={!selectedCoin || validYears.length === 0}
            isSearchable
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {selectedCoin && validYears.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Valid years: {validYears[validYears.length-1]} - {validYears[0]}
            </p>
          )}
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
        </div>
>>>>>>> acc41d4 (Fix: Complete coin module with all 9 US mints and date filtering)

        {/* Mintage */}
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
        </div>

        {/* Grade Dropdown */}
        {coinDetails.isNumismatic && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade / Condition
            </label>
            <Select
              options={gradeOptions}
              value={gradeOptions.flatMap(g => g.options).find((g: any) => g.value === coinDetails.grade)}
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
