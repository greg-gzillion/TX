import { MintData } from './index';

export const canadaMints: Record<string, MintData[]> = {
  'Gold': [
    { value: 'Royal Canadian Mint - Ottawa (1908-present)', label: '🇨🇦 Ottawa (1908-present)', minYear: 1908, maxYear: 'present' },
    { value: 'Royal Canadian Mint - Winnipeg (1976-present)', label: '🇨🇦 Winnipeg (1976-present)', minYear: 1976, maxYear: 'present' },
  ],
  'Silver': [
    { value: 'Royal Canadian Mint - Ottawa (1908-present)', label: '🇨🇦 Ottawa (1908-present)', minYear: 1908, maxYear: 'present' },
    { value: 'Royal Canadian Mint - Winnipeg (1976-present)', label: '🇨🇦 Winnipeg (1976-present)', minYear: 1976, maxYear: 'present' },
  ],
  'Platinum': [
    { value: 'Royal Canadian Mint - Ottawa (1908-present)', label: '🇨🇦 Ottawa (1988-present)', minYear: 1988, maxYear: 'present' },
  ],
  'Palladium': [
    { value: 'Royal Canadian Mint - Ottawa (1908-present)', label: '🇨🇦 Ottawa (2005-present)', minYear: 2005, maxYear: 'present' },
  ],
  'Copper': [
    { value: 'Royal Canadian Mint - Ottawa (1908-present)', label: '🇨🇦 Ottawa', minYear: 1908, maxYear: 'present' },
  ],
};
