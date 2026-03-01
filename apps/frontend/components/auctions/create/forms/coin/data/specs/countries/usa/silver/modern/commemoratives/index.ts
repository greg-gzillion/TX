import { commemoratives1980s } from './1980s';
import { commemoratives1990s } from './1990s';
import { commemoratives2000s } from './2000s';
import { commemoratives2010s } from './2010s';
import { commemoratives2020s } from './2020s';

export const modernSilverCommemoratives = [
  ...commemoratives1980s,
  ...commemoratives1990s,
  ...commemoratives2000s,
  ...commemoratives2010s,
  ...commemoratives2020s,
];

export const modernSilverCommemorativesByDecade = {
  '1980s': commemoratives1980s,
  '1990s': commemoratives1990s,
  '2000s': commemoratives2000s,
  '2010s': commemoratives2010s,
  '2020s': commemoratives2020s,
};
