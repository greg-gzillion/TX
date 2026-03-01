import { usGold, usGoldByCategory, allUsGold } from './gold';
import { usSilver, usSilverByCategory, allUsSilver } from './silver';
// import { usCopper, usCopperByCategory, allUsCopper } from './copper';

export const usaSpecs = {
  gold: {
    byCategory: usGoldByCategory,
    all: allUsGold,
    raw: usGold,
  },
  silver: {
    byCategory: usSilverByCategory,
    all: allUsSilver,
    raw: usSilver,
  },
  // copper: {
  //   byCategory: usCopperByCategory,
  //   all: allUsCopper,
  //   raw: usCopper,
  // },
};

// Helper function to get specs by metal
export const getUsSpecsByMetal = (metal: string) => {
  switch(metal) {
    case 'Gold': return allUsGold;
    case 'Silver': return allUsSilver;
    // case 'Copper': return allUsCopper;
    default: return [];
  }
};

// Helper to get categorized specs by metal
export const getUsCategorizedByMetal = (metal: string) => {
  switch(metal) {
    case 'Gold': return usGoldByCategory;
    case 'Silver': return usSilverByCategory;
    // case 'Copper': return usCopperByCategory;
    default: return {};
  }
};
