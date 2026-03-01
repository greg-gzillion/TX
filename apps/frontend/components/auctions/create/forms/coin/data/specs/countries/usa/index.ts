import { usGoldCoins, allUsGold } from './gold';
import { usSilverCoins, allUsSilver } from './silver';

export const usaSpecs = {
  gold: {
    byCategory: usGoldCoins,
    all: allUsGold,
  },
  silver: {
    byCategory: usSilverCoins,
    all: allUsSilver,
  },
};

export const getUsSpecsByMetal = (metal: string) => {
  switch(metal) {
    case 'Gold': return allUsGold;
    case 'Silver': return allUsSilver;
    default: return [];
  }
};

export const getUsCategorizedByMetal = (metal: string) => {
  switch(metal) {
    case 'Gold': return usGoldCoins;
    case 'Silver': return usSilverCoins;
    default: return {};
  }
};
