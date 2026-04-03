import { goldEagle1oz } from "./1oz";
import { goldEagleHalfOz } from "./half-oz";
import { goldEagleQuarterOz } from "./quarter-oz";
import { goldEagleTenthOz } from "./tenth-oz";

export const goldEagles = [
  ...goldEagle1oz,
  ...goldEagleHalfOz,
  ...goldEagleQuarterOz,
  ...goldEagleTenthOz,
];

export const goldEaglesBySize = {
  "1 oz": goldEagle1oz,
  "1/2 oz": goldEagleHalfOz,
  "1/4 oz": goldEagleQuarterOz,
  "1/10 oz": goldEagleTenthOz,
};
