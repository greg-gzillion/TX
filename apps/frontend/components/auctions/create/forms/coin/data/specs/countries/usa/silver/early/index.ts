import { CoinSpec } from '../../../../../../types';

import { flowingHairSilver } from './flowing-hair';
import { drapedBustSilver } from './draped-bust';
import { cappedBustSilver } from './capped-bust';

export const earlySilver = [
  ...flowingHairSilver,
  ...drapedBustSilver,
  ...cappedBustSilver,
];

export const earlySilverByType = {
  'Flowing Hair (1794-1795)': flowingHairSilver,
  'Draped Bust (1796-1807)': drapedBustSilver,
  'Capped Bust (1807-1838)': cappedBustSilver,
};
