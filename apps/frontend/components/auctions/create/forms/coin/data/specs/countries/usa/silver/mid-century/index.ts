import { CoinSpec } from "../../../../../../types";

import { rooseveltDime } from "./roosevelt-dime";
import { washingtonQuarter } from "./washington-quarter";
import { franklinHalf } from "./franklin-half";
import { kennedyHalf } from "./kennedy-half";

export const midCenturySilver = [
  ...rooseveltDime,
  ...washingtonQuarter,
  ...franklinHalf,
  ...kennedyHalf,
];

export const midCenturyByType = {
  "Roosevelt Dime (1946-1964)": rooseveltDime,
  "Washington Quarter (1932-1964)": washingtonQuarter,
  "Franklin Half (1948-1963)": franklinHalf,
  "Kennedy Half (1964-1970)": kennedyHalf,
};
