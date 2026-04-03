import { goldEagles, goldEaglesBySize } from "./eagles";
import { goldBuffalo } from "./buffalo";
import { firstSpouse2007 } from "./first-spouse/2007";
// Import other first spouse years as needed

export const modernGold = [
  ...goldEagles,
  ...goldBuffalo,
  ...firstSpouse2007,
  // Add other first spouse years
];

export const modernGoldByType = {
  "American Gold Eagles": goldEaglesBySize,
  "Gold Buffalo": goldBuffalo,
  "First Spouse (2007)": firstSpouse2007,
};
