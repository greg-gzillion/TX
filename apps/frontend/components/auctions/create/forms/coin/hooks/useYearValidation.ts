import { useState, useEffect } from 'react';
import { CoinSpec, MintData } from '../types';
import { validateYearAgainstCoin, validateYearAgainstMint } from '../utils';

export const useYearValidation = (
  selectedCoin: CoinSpec | null,
  selectedMint: MintData | null,
  year: string
) => {
  const [yearWarning, setYearWarning] = useState<string | null>(null);

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
      }
    }
  }, [selectedCoin, selectedMint, year]);

  return { yearWarning, setYearWarning };
};
