import { libertyHeadGold } from "./liberty-head";
import { goldDollar } from "./gold-dollar";

export const classicGold = [...libertyHeadGold, ...goldDollar];

export const classicGoldByType = {
  "Liberty Head (1839-1908)": libertyHeadGold,
  "Gold Dollars (1849-1889)": goldDollar,
};
