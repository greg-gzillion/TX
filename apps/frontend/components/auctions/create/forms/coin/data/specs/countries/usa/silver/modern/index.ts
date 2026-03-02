import { silverEagles, silverEaglesByType } from './eagle';
import { modernSilverCommemoratives, modernSilverCommemorativesByDecade } from './commemoratives';
import { silverProofSets, silverProofSetsByType } from './proof-sets';

export const modernSilver = [
  ...silverEagles,
  ...modernSilverCommemoratives,
  ...silverProofSets,
];

export const modernSilverByType = {
  'Silver Eagles': silverEaglesByType,
  'Commemoratives by Decade': modernSilverCommemorativesByDecade,
  'Proof Sets': silverProofSetsByType,
};
