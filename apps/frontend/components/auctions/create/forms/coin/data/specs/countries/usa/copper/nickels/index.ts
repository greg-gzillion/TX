import { buffaloNickels } from './buffalo';
import { jeffersonNickels } from './jefferson';
import { warNickels } from './war-nickels-1942-1945';

export const allNickels = [
  ...buffaloNickels,
  ...jeffersonNickels,
  ...warNickels,
];

export const nickelCategories = {
  'Buffalo Nickels (1913-1938)': buffaloNickels,
  'Jefferson Nickels (1938-present)': jeffersonNickels,
  'War Nickels (1942-1945)': warNickels,
};
