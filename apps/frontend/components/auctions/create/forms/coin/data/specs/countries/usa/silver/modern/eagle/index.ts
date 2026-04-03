import { silverEagleBullion } from "./bullion";
import { silverEagleProof } from "./proof";
import { silverEagleBurnished } from "./burnished";

export const silverEagles = [
  ...silverEagleBullion,
  ...silverEagleProof,
  ...silverEagleBurnished,
];

export const silverEaglesByType = {
  "Bullion Strike": silverEagleBullion,
  Proof: silverEagleProof,
  Burnished: silverEagleBurnished,
};
