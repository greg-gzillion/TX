import { CoinSpec } from '../types';
import { parseYearRange, isYearInRange } from './dateHelpers';

export const validateYearAgainstCoin = (
  year: string,
  coin: CoinSpec | null
): { valid: boolean; warning?: string } => {
  if (!coin || !year) return { valid: true };
  
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) return { valid: true };
  
  const range = parseYearRange(coin.years);
  if (!isYearInRange(yearNum, range)) {
    const max = range.max === 'present' ? 'present' : range.max;
    return { 
      valid: false, 
      warning: `⚠️ This coin was only minted from ${range.min} to ${max}` 
    };
  }
  
  return { valid: true };
};

export const validateYearAgainstMint = (
  year: string,
  mintMin: number,
  mintMax: number | 'present'
): { valid: boolean; warning?: string } => {
  if (!year) return { valid: true };
  
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) return { valid: true };
  
  const max = mintMax === 'present' ? new Date().getFullYear() : mintMax;
  if (yearNum < mintMin || yearNum > max) {
    return { 
      valid: false, 
      warning: `⚠️ This mint operated from ${mintMin} to ${mintMax === 'present' ? 'present' : mintMax}` 
    };
  }
  
  return { valid: true };
};
