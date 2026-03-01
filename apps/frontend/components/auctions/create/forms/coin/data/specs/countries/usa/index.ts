<<<<<<< HEAD
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
=======
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

>>>>>>> acc41d4 (Fix: Complete coin module with all 9 US mints and date filtering)
export const getUsSpecsByMetal = (metal: string) => {
  switch(metal) {
    case 'Gold': return allUsGold;
    case 'Silver': return allUsSilver;
<<<<<<< HEAD
    // case 'Copper': return allUsCopper;
=======
>>>>>>> acc41d4 (Fix: Complete coin module with all 9 US mints and date filtering)
    default: return [];
  }
};

<<<<<<< HEAD
// Helper to get categorized specs by metal
export const getUsCategorizedByMetal = (metal: string) => {
  switch(metal) {
    case 'Gold': return usGoldByCategory;
    case 'Silver': return usSilverByCategory;
    // case 'Copper': return usCopperByCategory;
=======
export const getUsCategorizedByMetal = (metal: string) => {
  switch(metal) {
    case 'Gold': return usGoldCoins;
    case 'Silver': return usSilverCoins;
>>>>>>> acc41d4 (Fix: Complete coin module with all 9 US mints and date filtering)
    default: return {};
  }
};
