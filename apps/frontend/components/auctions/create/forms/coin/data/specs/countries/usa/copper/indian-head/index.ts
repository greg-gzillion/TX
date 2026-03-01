import { CoinSpec } from '@/components/auctions/create/forms/coin/types';

export const indianHeadCents: CoinSpec[] = [
  {
    name: 'Indian Head Cent (Copper-Nickel)',
    years: '1859-1864',
    weight: 4.67,
    purity: 0.880,
    diameter: 19,
    thickness: 1.5,
    composition: '88% Copper, 12% Nickel',
    designer: 'James B. Longacre',
    category: 'Indian Head Cents'
  },
  {
    name: 'Indian Head Cent (Bronze)',
    years: '1864-1909',
    weight: 3.11,
    purity: 0.950,
    diameter: 19,
    thickness: 1.5,
    composition: '95% Copper, 5% Tin & Zinc',
    category: 'Indian Head Cents'
  }
];
