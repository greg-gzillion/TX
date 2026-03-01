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
    
    if (!selectedCountry) {
      setMintOptions([]);
      setLoading(false);
      return;
    }

    const currentMetal = metalType || 'Gold';
    let mints = mintDatabase[selectedCountry.value]?.[currentMetal] || [];
    
    if (selectedCoin && mints.length > 0) {
      const yearRange = selectedCoin.years;
      let coinMinYear = 0;
      let coinMaxYear = new Date().getFullYear();
      
      if (yearRange.includes('-')) {
        const parts = yearRange.split('-');
        coinMinYear = parseInt(parts[0]);
        coinMaxYear = parts[1].includes('present') 
          ? new Date().getFullYear() 
          : parseInt(parts[1]);
      } else {
        coinMinYear = parseInt(yearRange);
        coinMaxYear = coinMinYear;
      }
      
      mints = mints.filter(mint => {
        const mintMax = mint.maxYear === 'present' 
          ? new Date().getFullYear() 
          : mint.maxYear;
        
        return !(mintMax < coinMinYear || mint.minYear > coinMaxYear);
      });
    }
    
    setMintOptions(mints);
    setLoading(false);
  }, [selectedCountry, metalType, selectedCoin]);

  return { mintOptions, loading };
};
