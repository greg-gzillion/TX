export interface YearRange {
  min: number;
  max: number | 'present';
}

export const parseYearRange = (years: string): YearRange => {
  if (years.includes('-')) {
    const parts = years.split('-');
    return {
      min: parseInt(parts[0]),
      max: parts[1].includes('present') ? 'present' : parseInt(parts[1])
    };
  } else {
    const year = parseInt(years);
    return { min: year, max: year };
  }
};

export const isYearInRange = (year: number, range: YearRange): boolean => {
  const max = range.max === 'present' ? new Date().getFullYear() : range.max;
  return year >= range.min && year <= max;
};

export const getYearRange = (years: string): YearRange => {
  return parseYearRange(years);
};
