export interface YearRange {
  min: number;
  max: number | 'present';
}

export const parseYearRange = (years: string): YearRange => {
  // Handle formats: "1907-1933", "1986-present", "1849-1889"
  if (years.includes('-')) {
    const parts = years.split('-');
    const min = parseInt(parts[0]);
    const max = parts[1].includes('present') ? 'present' : parseInt(parts[1]);
    return { min, max };
  }
  // Single year
  return { min: parseInt(years), max: parseInt(years) };
};

export const isYearInRange = (year: number, range: YearRange): boolean => {
  const max = range.max === 'present' ? new Date().getFullYear() : range.max;
  return year >= range.min && year <= max;
};

export const getCurrentYear = (): number => new Date().getFullYear();

export const generateYearOptions = (minYear: number, maxYear: number | 'present'): number[] => {
  const years = [];
  const max = maxYear === 'present' ? getCurrentYear() : maxYear;
  for (let year = max; year >= minYear; year--) {
    years.push(year);
  }
  return years;
};
