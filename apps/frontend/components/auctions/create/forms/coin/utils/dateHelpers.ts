export const parseYearRange = (yearRange: string): { min: number; max: number | 'present' } => {
  if (yearRange.includes('present')) {
    const [min] = yearRange.split('-').map(s => parseInt(s.trim()));
    return { min, max: 'present' };
  }
  
  const [min, max] = yearRange.split('-').map(s => parseInt(s.trim()));
  return { min, max };
};

export const isYearInRange = (year: string, min: number, max: number | 'present'): boolean => {
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) return false;
  
  if (max === 'present') {
    return yearNum >= min;
  }
  
  return yearNum >= min && yearNum <= max;
};

// Keep existing functions if they're used elsewhere
export const validateYearAgainstCoin = (year: string, coin: any) => {
  return { valid: true };
};

export const validateYearAgainstMint = (year: string, minYear: number, maxYear: number | 'present') => {
  return { valid: true };
};
