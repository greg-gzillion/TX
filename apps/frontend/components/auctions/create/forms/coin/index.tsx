'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { countryOptions } from './data/countries';
import { gradeOptions } from './data/grades';
import { mintYears } from './data/validation';
import { mintDatabase } from './data/mints';
import { useMintFiltering } from './hooks/useMintFiltering';

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
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedMint, setSelectedMint] = useState<any>(null);
  const [yearOptions, setYearOptions] = useState<any[]>([]);
  const [yearWarning, setYearWarning] = useState<string | null>(null);
  
  const { mintOptions } = useMintFiltering(selectedCountry, metalType);

  // Initialize selectedCountry from props
  useEffect(() => {
    if (coinDetails.country && !selectedCountry) {
      const country = countryOptions.find(c => c.value === coinDetails.country);
      if (country) setSelectedCountry(country);
    }
  }, [coinDetails.country]);

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
    } else {
      setYearOptions([]);
    }
  }, [selectedMint]);

  // Validate year
  useEffect(() => {
    if (selectedMint && coinDetails.year && !coinDetails.overrideYear) {
      const yearNum = parseInt(coinDetails.year);
      const mintInfo = mintYears[selectedMint.value];
      if (mintInfo) {
        const end = mintInfo.end === 'present' ? new Date().getFullYear() : mintInfo.end;
        if (yearNum < mintInfo.start || yearNum > end) {
          setYearWarning(`⚠️ This mint operated from ${mintInfo.start} to ${mintInfo.end}. Year ${yearNum} is outside this range.`);
        } else {
          setYearWarning(null);
        }
      }
    } else {
      setYearWarning(null);
    }
  }, [selectedMint, coinDetails.year, coinDetails.overrideYear]);

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

        {/* Mint Dropdown */}
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
              No mints found for {metalType || 'Gold'} in {selectedCountry.label}
            </p>
          )}
        </div>

        {/* Year Dropdown */}
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
          <p className="text-xs text-gray-500 mt-1 ml-6">
            Numismatic coins have value beyond their metal content (rarity, condition, historical significance)
          </p>
        </div>

        {/* Grade Dropdown */}
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
