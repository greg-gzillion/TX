import { MintData } from './index';

export const ukMints: Record<string, MintData[]> = {
  'Gold': [
    { value: 'Royal Mint - London (886-1975)', label: '🇬🇧 London (886-1975)', minYear: 886, maxYear: 1975 },
    { value: 'Royal Mint - Llantrisant (1968-present)', label: '🇬🇧 Llantrisant (1968-present)', minYear: 1968, maxYear: 'present' },
    { value: 'Royal Mint - Tower Hill (1809-1975)', label: '🇬🇧 Tower Hill (1809-1975)', minYear: 1809, maxYear: 1975 },
  ],
  'Silver': [
    { value: 'Royal Mint - London (886-1975)', label: '🇬🇧 London (886-1975)', minYear: 886, maxYear: 1975 },
    { value: 'Royal Mint - Llantrisant (1968-present)', label: '🇬🇧 Llantrisant (1968-present)', minYear: 1968, maxYear: 'present' },
    { value: 'Birmingham Mint (1850-2003)', label: '🇬🇧 Birmingham Mint (1850-2003)', minYear: 1850, maxYear: 2003 },
  ],
  'Platinum': [
    { value: 'Royal Mint - Llantrisant (1968-present)', label: '🇬🇧 Llantrisant', minYear: 1990, maxYear: 'present' },
  ],
  'Copper': [
    { value: 'Royal Mint - London (886-1975)', label: '🇬🇧 London', minYear: 886, maxYear: 1975 },
    { value: 'Royal Mint - Llantrisant (1968-present)', label: '🇬🇧 Llantrisant', minYear: 1968, maxYear: 'present' },
  ],
};
