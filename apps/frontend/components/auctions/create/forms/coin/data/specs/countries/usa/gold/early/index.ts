import { cappedBustGold } from "./capped-bust";
import { turbanHeadGold } from "./turban-head";

export const earlyGold = [...cappedBustGold, ...turbanHeadGold];

export const earlyGoldByType = {
  "Capped Bust (1795-1807)": cappedBustGold,
  "Turban Head (1808)": turbanHeadGold,
};
