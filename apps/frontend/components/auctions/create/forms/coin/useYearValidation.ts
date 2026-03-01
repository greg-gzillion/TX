import { useState, useEffect } from 'react';
import { CoinSpec, MintData } from '../types';

export const useYearValidation = (
  selectedCoin: CoinSpec | null,
  selectedMint: MintData | null,
  year: string
) => {
  const [yearWarning, setYearWarning] = useState<string | null>(null);
  const [validYears, setValidYears] = useState<string[]>([]);

  useEffect(() => {
    setYearWarning(null);
    
    if (!selectedCoin) {
      setValidYears([]);
      return;
    }

    // Parse coin's manufacturing years
    const yearRange = selectedCoin.years;
    let minCoinYear = 0;
    let maxCoinYear = new Date().getFullYear();
    
    if (yearRange.includes('-')) {
      const parts = yearRange.split('-');
      minCoinYear = parseInt(parts[0]);
      maxCoinYear = parts[1].includes('present') 
        ? new Date().getFullYear() 
        : parseInt(parts[1]);
    } else {
      minCoinYear = parseInt(yearRange);
      maxCoinYear = minCoinYear;
    }

    // Get mint's operating years
    let minMintYear = minCoinYear;
    let maxMintYear = maxCoinYear;

    if (selectedMint) {
      minMintYear = Math.max(minCoinYear, selectedMint.minYear);
      const mintMax = selectedMint.maxYear === 'present' 
        ? new Date().getFullYear() 
        : selectedMint.maxYear;
      maxMintYear = Math.min(maxCoinYear, mintMax);
    }

    // Generate valid years (newest first)
    const years = [];
    for (let year = maxMintYear; year >= minMintYear; year--) {
      years.push(year.toString());
    }
    setValidYears(years);

    // Check if selected year is valid
    if (year) {
      const yearNum = parseInt(year);
      if (yearNum < minMintYear || yearNum > maxMintYear) {
        setYearWarning(`⚠️ This coin was only manufactured from ${minMintYear} to ${maxMintYear}`);
      }
    }
  }, [selectedCoin, selectedMint, year]);

  return { yearWarning, validYears, setYearWarning };
};
