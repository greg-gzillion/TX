import { highReliefGold } from './high-relief';
import { regularSaintGaudens } from './regular';

export const saintGaudensGold = [
  ...highReliefGold,
  ...regularSaintGaudens,
];

export const saintGaudensGoldByType = {
  'High Relief (1907)': highReliefGold,
  'Regular Strike (1907-1933)': regularSaintGaudens,
};
