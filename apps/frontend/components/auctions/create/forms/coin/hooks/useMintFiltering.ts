import { useState, useEffect } from 'react';
import { mintDatabase } from '../data/mints';
import { MintData } from '../data/mints';

export function useMintFiltering(selectedCountry: any, metalType?: string) {
  const [mintOptions, setMintOptions] = useState<MintData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (selectedCountry) {
      const currentMetal = metalType || 'Gold';
      const mints = mintDatabase[selectedCountry.value]?.[currentMetal] || [];
      setMintOptions(mints);
    } else {
      setMintOptions([]);
    }
    setLoading(false);
  }, [selectedCountry, metalType]);

  return { mintOptions, loading };
}
