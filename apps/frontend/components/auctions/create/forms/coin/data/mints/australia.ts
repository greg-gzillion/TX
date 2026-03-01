import { MintData } from '../../types';

export const australiaMints: Record<string, MintData[]> = {
  'Gold': [
    { value: 'Perth Mint (1899-present)', label: '🇦🇺 Perth Mint', minYear: 1899, maxYear: 'present' },
    { value: 'Royal Australian Mint - Canberra (1965-present)', label: '🇦🇺 Canberra', minYear: 1965, maxYear: 'present' },
    { value: 'Sydney Mint (1855-1926)', label: '🇦🇺 Sydney Mint', minYear: 1855, maxYear: 1926 },
    { value: 'Melbourne Mint (1872-1927)', label: '🇦🇺 Melbourne Mint', minYear: 1872, maxYear: 1927 },
  ],
  'Silver': [
    { value: 'Perth Mint (1899-present)', label: '🇦🇺 Perth Mint', minYear: 1899, maxYear: 'present' },
    { value: 'Royal Australian Mint - Canberra (1965-present)', label: '🇦🇺 Canberra', minYear: 1965, maxYear: 'present' },
  ],
  'Platinum': [
    { value: 'Perth Mint (1899-present)', label: '🇦🇺 Perth Mint', minYear: 1988, maxYear: 'present' },
  ],
};
