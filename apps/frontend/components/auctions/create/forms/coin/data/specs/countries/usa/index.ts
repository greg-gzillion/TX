import { usGoldCoins, allUsGold } from './gold';
import { usSilverCoins, allUsSilver } from './silver';
import { usPlatinumCoins, allUsPlatinum } from './platinum';
import { usPalladiumCoins, allUsPalladium } from './palladium';

export const usaSpecs = {
  gold: {
    byCategory: usGoldCoins,
    all: allUsGold,
  },
  silver: {
    byCategory: usSilverCoins,
    all: allUsSilver,
  },
  platinum: {
    byCategory: usPlatinumCoins,
    all: allUsPlatinum,
  },
  palladium: {
    byCategory: usPalladiumCoins,
    all: allUsPalladium,
  },
};

export const getUsSpecsByMetal = (metal: string) => {
  switch(metal) {
    case 'Gold': return allUsGold;
    case 'Silver': return allUsSilver;
    case 'Platinum': return allUsPlatinum;
    case 'Palladium': return allUsPalladium;
    default: return [];
  }
};

export const getUsCategorizedByMetal = (metal: string) => {
  switch(metal) {
    case 'Gold': return usGoldCoins;
    case 'Silver': return usSilverCoins;
    case 'Platinum': return usPlatinumCoins;
    case 'Palladium': return usPalladiumCoins;
    default: return {};
  }
};
