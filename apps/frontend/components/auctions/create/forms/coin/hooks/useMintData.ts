import { useState, useEffect } from 'react';
import { mintDatabase } from '../data/mints';
import { MintData, CoinSpec } from '../types';

export const useMintData = (
  selectedCountry: any,
  metalType?: string,
  selectedCoin?: CoinSpec | null
) => {
  const [mintOptions, setMintOptions] = useState<MintData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (selectedCountry) {
      const currentMetal = metalType || 'Gold';
      let mints = mintDatabase[selectedCountry.value]?.[currentMetal] || [];
      
      // Filter mints based on selected coin's era
      if (selectedCoin && mints.length > 0) {
        // Parse coin years
        const yearRange = selectedCoin.years;
        let coinMinYear = 0;
        let coinMaxYear = 9999;
        
        if (yearRange.includes('-')) {
          const parts = yearRange.split('-');
          coinMinYear = parseInt(parts[0]);
          coinMaxYear = parts[1].includes('present') 
            ? new Date().getFullYear() 
            : parseInt(parts[1]);
        }
        
        // Filter mints that were operating during the coin's era
        mints = mints.filter(mint => {
          const mintMax = mint.maxYear === 'present' 
            ? new Date().getFullYear() 
            : mint.maxYear;
          
          // Check if mint was active during any part of the coin's production
          return !(mintMax < coinMinYear || mint.minYear > coinMaxYear);
        });
      }
      
      setMintOptions(mints);
    } else {
      setMintOptions([]);
    }
    setLoading(false);
  }, [selectedCountry, metalType, selectedCoin]);

  return { mintOptions, loading };
};
