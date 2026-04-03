import { cappedBustGold } from "./capped-bust-1795-1834";
import { libertyHeadGold } from "./liberty-head-1838-1907";
import { indianHeadGold } from "./indian-head-1908-1929";
import { saintGaudensGold } from "./saint-gaudens-1907-1933";
import { modernGold } from "./modern-1986-present";

export const usGoldCoins = {
  "Capped Bust Gold (1795-1834)": cappedBustGold,
  "Liberty Head Gold (1838-1907)": libertyHeadGold,
  "Indian Head Gold (1908-1929)": indianHeadGold,
  "Saint-Gaudens Gold (1907-1933)": saintGaudensGold,
  "Modern Gold (1986-present)": modernGold,
};

export const allUsGold = [
  ...cappedBustGold,
  ...libertyHeadGold,
  ...indianHeadGold,
  ...saintGaudensGold,
  ...modernGold,
];
