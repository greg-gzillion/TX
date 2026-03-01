import { CoinSpec } from '../../../../../../types';
import { goldCommemoratives } from './commemoratives';

export const modernGold: CoinSpec[] = [
  {
    name: 'American Gold Eagle (1 oz)',
    years: '1986-present',
    weight: 33.931,
    purity: 0.9167,
    diameter: 32.7,
    thickness: 2.87,
    composition: '91.67% Gold, 3% Silver, 5.33% Copper',
    designer: 'Augustus Saint-Gaudens (obverse), Miley Busiek (reverse)',
    category: 'Modern Gold'
  },
  {
    name: 'American Gold Eagle (1/2 oz)',
    years: '1986-present',
    weight: 16.966,
    purity: 0.9167,
    diameter: 27.0,
    thickness: 2.15,
    composition: '91.67% Gold, 3% Silver, 5.33% Copper',
    category: 'Modern Gold'
  },
  {
    name: 'American Gold Eagle (1/4 oz)',
    years: '1986-present',
    weight: 8.483,
    purity: 0.9167,
    diameter: 22.0,
    thickness: 1.78,
    composition: '91.67% Gold, 3% Silver, 5.33% Copper',
    category: 'Modern Gold'
  },
  {
    name: 'American Gold Eagle (1/10 oz)',
    years: '1986-present',
    weight: 3.393,
    purity: 0.9167,
    diameter: 16.5,
    thickness: 1.19,
    composition: '91.67% Gold, 3% Silver, 5.33% Copper',
    category: 'Modern Gold'
  },
  {
    name: 'American Gold Buffalo (1 oz)',
    years: '2006-present',
    weight: 33.931,
    purity: 0.9999,
    diameter: 32.7,
    thickness: 2.95,
    composition: '99.99% Gold',
    designer: 'James Earle Fraser',
    category: 'Modern Gold'
  },
  ...goldCommemoratives
];
