import { CoinSpec } from '../../../../../../types';

import { seatedLibertyDimes } from './dimes';
import { seatedLibertyQuarters } from './quarters';
import { seatedLibertyHalves } from './halves';
import { seatedLibertyDollars } from './dollars';

export const seatedLibertySilver = [
  ...seatedLibertyDimes,
  ...seatedLibertyQuarters,
  ...seatedLibertyHalves,
  ...seatedLibertyDollars,
];

export const seatedLibertyByType = {
  'Dimes (1837-1891)': seatedLibertyDimes,
  'Quarters (1838-1891)': seatedLibertyQuarters,
  'Halves (1839-1891)': seatedLibertyHalves,
  'Dollars (1840-1873)': seatedLibertyDollars,
};
