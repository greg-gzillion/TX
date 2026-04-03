import { CoinSpec } from "../../../../../../types";

import { barberDimes } from "./dimes";
import { barberQuarters } from "./quarters";
import { barberHalves } from "./halves";

export const barberSilver = [
  ...barberDimes,
  ...barberQuarters,
  ...barberHalves,
];

export const barberByType = {
  "Dimes (1892-1916)": barberDimes,
  "Quarters (1892-1916)": barberQuarters,
  "Halves (1892-1915)": barberHalves,
};
