import { CoinSpec } from "../../../../../../types";

import { mercuryDime } from "./mercury-dime";
import { standingQuarter } from "./standing-quarter";
import { walkingLiberty } from "./walking-liberty";
import { peaceDollar } from "./peace-dollar";

export const early20thSilver = [
  ...mercuryDime,
  ...standingQuarter,
  ...walkingLiberty,
  ...peaceDollar,
];

export const early20thByType = {
  "Mercury Dime (1916-1945)": mercuryDime,
  "Standing Liberty Quarter (1916-1930)": standingQuarter,
  "Walking Liberty Half (1916-1947)": walkingLiberty,
  "Peace Dollar (1921-1935)": peaceDollar,
};
