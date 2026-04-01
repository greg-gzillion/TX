import { useState, useEffect } from 'react';
import { CoinSpec, MintData } from '@/components/auctions/create/forms/coin/types';

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

    let minMintYear = minCoinYear;
    let maxMintYear = maxCoinYear;

    if (selectedMint) {
      minMintYear = Math.max(minCoinYear, selectedMint.minYear);
      const mintMax = selectedMint.maxYear === 'present' 
        ? new Date().getFullYear() 
        : selectedMint.maxYear;
      maxMintYear = Math.min(maxCoinYear, mintMax);
    }

    const years = [];
    for (let year = maxMintYear; year >= minMintYear; year--) {
      years.push(year.toString());
    }
    setValidYears(years);

    if (year) {
      const yearNum = parseInt(year);
      if (yearNum < minMintYear || yearNum > maxMintYear) {
        setYearWarning(`⚠️ This coin was only manufactured from ${minMintYear} to ${maxMintYear}`);
      }
    }
  }, [selectedCoin, selectedMint, year]);

  return { yearWarning, validYears, setYearWarning };
};
