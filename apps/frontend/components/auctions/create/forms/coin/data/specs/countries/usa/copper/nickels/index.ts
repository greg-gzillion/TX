import { shieldNickels } from './shield-nickels-1866-1883';
import { libertyHeadNickels } from './liberty-head-nickels-1883-1913';
import { buffaloNickels } from './buffalo-nickels-1913-1938';
import { jeffersonNickels } from './jefferson-nickels-1938-present';
import { warNickels } from './war-nickels-1942-1945';

export const allNickels = [
  ...shieldNickels,
  ...libertyHeadNickels,
  ...buffaloNickels,
  ...jeffersonNickels,
  ...warNickels,
];

export const nickelCategories = {
  'Shield Nickels (1866-1883)': shieldNickels,
  'Liberty Head Nickels (1883-1913)': libertyHeadNickels,
  'Buffalo Nickels (1913-1938)': buffaloNickels,
  'Jefferson Nickels (1938-present)': jeffersonNickels,
  'War Nickels (1942-1945)': warNickels,
};
