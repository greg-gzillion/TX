import { CoinSpec } from '../types';
import { parseYearRange, isYearInRange } from './dateHelpers';

export const validateYearAgainstCoin = (
  year: string,
  coin: CoinSpec
): { valid: boolean; warning?: string } => {
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) {
    return { valid: false, warning: 'Invalid year format' };
  }

  const range = parseYearRange(coin.years);
  const max = range.max === 'present' ? new Date().getFullYear() : range.max;

  if (yearNum < range.min || yearNum > max) {
    return {
      valid: false,
      warning: `This coin was only minted from ${range.min} to ${max}`
    };
  }

  return { valid: true };
};

export const validateYearAgainstMint = (
  year: string,
  minYear: number,
  maxYear: number | 'present'
): { valid: boolean; warning?: string } => {
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) {
    return { valid: false, warning: 'Invalid year format' };
  }

  const max = maxYear === 'present' ? new Date().getFullYear() : maxYear;

  if (yearNum < minYear || yearNum > max) {
    return {
      valid: false,
      warning: `This mint operated from ${minYear} to ${max}`
    };
  }

  return { valid: true };
};
