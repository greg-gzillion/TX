import { earlyGold, earlyGoldByType } from './early';
import { classicGold, classicGoldByType } from './classic';
import { indianHeadGold, indianHeadGoldByType } from './indian-head';
import { saintGaudensGold, saintGaudensGoldByType } from './saint-gaudens';
import { modernGold, modernGoldByType } from './modern';

export const usGold = {
  early: earlyGold,
  classic: classicGold,
  indianHead: indianHeadGold,
  saintGaudens: saintGaudensGold,
  modern: modernGold,
};

export const usGoldByCategory = {
  'Early Gold (1795-1834)': earlyGoldByType,
  'Classic Liberty Head (1834-1907)': classicGoldByType,
  'Indian Head (1907-1933)': indianHeadGoldByType,
  'Saint-Gaudens (1907-1933)': saintGaudensGoldByType,
  'Modern Gold (1986-present)': modernGoldByType,
};

export const allUsGold = [
  ...earlyGold,
  ...classicGold,
  ...indianHeadGold,
  ...saintGaudensGold,
  ...modernGold,
];
