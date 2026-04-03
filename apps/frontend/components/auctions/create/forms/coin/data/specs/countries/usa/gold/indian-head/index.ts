import { indianHeadQuarterEagle } from "./quarter-eagle";
import { indianHeadHalfEagle } from "./half-eagle";
import { indianHeadEagle } from "./eagle";

export const indianHeadGold = [
  ...indianHeadQuarterEagle,
  ...indianHeadHalfEagle,
  ...indianHeadEagle,
];

export const indianHeadGoldByType = {
  "Quarter Eagle ($2.50)": indianHeadQuarterEagle,
  "Half Eagle ($5)": indianHeadHalfEagle,
  "Eagle ($10)": indianHeadEagle,
};
