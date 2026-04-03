import { platinumEagle1oz } from "./platinum-eagle-1oz-1997-present";
import { platinumEagleHalfOz } from "./platinum-eagle-half-oz-1997-2008";
import { platinumEagleQuarterOz } from "./platinum-eagle-quarter-oz-1997-2008";
import { platinumEagleTenthOz } from "./platinum-eagle-tenth-oz-1997-2008";
import { platinumEagleProof } from "./platinum-eagle-proof-1997-present";

export const usPlatinumCoins = {
  "Platinum Eagle 1 oz (1997-present)": platinumEagle1oz,
  "Platinum Eagle 1/2 oz (1997-2008)": platinumEagleHalfOz,
  "Platinum Eagle 1/4 oz (1997-2008)": platinumEagleQuarterOz,
  "Platinum Eagle 1/10 oz (1997-2008)": platinumEagleTenthOz,
  "Platinum Eagle Proof (1997-present)": platinumEagleProof,
};

export const allUsPlatinum = [
  ...platinumEagle1oz,
  ...platinumEagleHalfOz,
  ...platinumEagleQuarterOz,
  ...platinumEagleTenthOz,
  ...platinumEagleProof,
];
