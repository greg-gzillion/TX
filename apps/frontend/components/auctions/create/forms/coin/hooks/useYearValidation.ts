import { useState, useEffect } from 'react';
import { CoinSpec, MintData } from '../types';
<<<<<<< HEAD
import { validateYearAgainstCoin, validateYearAgainstMint } from '../utils';
=======
>>>>>>> acc41d4 (Fix: Complete coin module with all 9 US mints and date filtering)

export const useYearValidation = (
  selectedCoin: CoinSpec | null,
  selectedMint: MintData | null,
  year: string
) => {
  const [yearWarning, setYearWarning] = useState<string | null>(null);
<<<<<<< HEAD

  useEffect(() => {
    // Reset warning first
    setYearWarning(null);
    
    if (!year) return;
    
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return;
    
    // Check against coin first (more specific)
    if (selectedCoin) {
      const coinResult = validateYearAgainstCoin(year, selectedCoin);
      if (!coinResult.valid) {
        setYearWarning(coinResult.warning || null);
        return;
      }
    }
    
    // Then check against mint
    if (selectedMint) {
      const mintResult = validateYearAgainstMint(year, selectedMint.minYear, selectedMint.maxYear);
      if (!mintResult.valid) {
        setYearWarning(mintResult.warning || null);
=======
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
>>>>>>> acc41d4 (Fix: Complete coin module with all 9 US mints and date filtering)
      }
    }
  }, [selectedCoin, selectedMint, year]);

<<<<<<< HEAD
  return { yearWarning, setYearWarning };
=======
  return { yearWarning, validYears, setYearWarning };
>>>>>>> acc41d4 (Fix: Complete coin module with all 9 US mints and date filtering)
};
