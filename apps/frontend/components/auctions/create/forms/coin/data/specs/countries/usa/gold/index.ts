<<<<<<< HEAD
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
=======
import { cappedBustGold } from './capped-bust-1795-1834';
import { libertyHeadGold } from './liberty-head-1838-1907';
import { indianHeadGold } from './indian-head-1908-1929';
import { saintGaudensGold } from './saint-gaudens-1907-1933';
import { modernGold } from './modern-1986-present';

export const usGoldCoins = {
  'Capped Bust Gold (1795-1834)': cappedBustGold,
  'Liberty Head Gold (1838-1907)': libertyHeadGold,
  'Indian Head Gold (1908-1929)': indianHeadGold,
  'Saint-Gaudens Gold (1907-1933)': saintGaudensGold,
  'Modern Gold (1986-present)': modernGold,
};

export const allUsGold = [
  ...cappedBustGold,
  ...libertyHeadGold,
>>>>>>> acc41d4 (Fix: Complete coin module with all 9 US mints and date filtering)
  ...indianHeadGold,
  ...saintGaudensGold,
  ...modernGold,
];
