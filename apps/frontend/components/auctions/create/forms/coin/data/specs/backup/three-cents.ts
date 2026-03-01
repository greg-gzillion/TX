import { CoinSpec } from '../../../types';

export const threeCentSilver: CoinSpec[] = [
  {
    name: 'Three Cent Silver (Type 1)',
    years: '1851-1853',
    weight: 0.8,
    purity: 0.750,
    diameter: 14,
    thickness: 0.6,
    composition: '75% Silver, 25% Copper',
    designer: 'James B. Longacre',
    notes: 'Star on obverse, no outline'
  },
  {
    name: 'Three Cent Silver (Type 2)',
    years: '1854-1858',
    weight: 0.75,
    purity: 0.900,
    diameter: 14,
    thickness: 0.6,
    composition: '90% Silver, 10% Copper',
    notes: 'Three outlines around star'
  },
  {
    name: 'Three Cent Silver (Type 3)',
    years: '1859-1873',
    weight: 0.75,
    purity: 0.900,
    diameter: 14,
    thickness: 0.6,
    composition: '90% Silver, 10% Copper',
    notes: 'Two outlines around star'
  },
];
