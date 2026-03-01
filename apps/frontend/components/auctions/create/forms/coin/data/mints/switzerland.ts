import { MintData } from './index';

export const switzerlandMints: Record<string, MintData[]> = {
  'Gold': [
    { value: 'Swissmint - Bern (1855-present)', label: '🇨🇭 Bern Mint (1855-present)', minYear: 1855, maxYear: 'present' },
    { value: 'PAMP Suisse (1977-present)', label: '🇨🇭 PAMP Suisse (1977-present)', minYear: 1977, maxYear: 'present' },
    { value: 'Valcambi (1961-present)', label: '🇨🇭 Valcambi (1961-present)', minYear: 1961, maxYear: 'present' },
  ],
  'Silver': [
    { value: 'Swissmint - Bern (1855-present)', label: '🇨🇭 Bern Mint (1855-present)', minYear: 1855, maxYear: 'present' },
    { value: 'PAMP Suisse (1977-present)', label: '🇨🇭 PAMP Suisse (1977-present)', minYear: 1977, maxYear: 'present' },
    { value: 'Valcambi (1961-present)', label: '🇨🇭 Valcambi (1961-present)', minYear: 1961, maxYear: 'present' },
  ],
  'Platinum': [
    { value: 'PAMP Suisse (1977-present)', label: '🇨🇭 PAMP Suisse', minYear: 1990, maxYear: 'present' },
  ],
};
