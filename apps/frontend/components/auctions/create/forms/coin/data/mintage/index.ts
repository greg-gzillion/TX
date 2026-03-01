export interface MintageData {
  total: number;
  byYear?: Record<number, number>;
  byMint?: Record<string, number>;
  notes?: string;
  rarity: 'Common' | 'Scarce' | 'Rare' | 'Extremely Rare' | 'Unique';
  estimatedSurvival?: number;
}

import { earlyGoldMintages } from './early-gold';
import { classicGoldMintages } from './classic-gold';
import { indianHeadGoldMintages, saintGaudensGoldMintages } from './indian-head-gold';
import { modernGoldMintages } from './modern-gold';
import { earlySilverMintages } from './early-silver';
import { seatedLibertySilverMintages } from './seated-liberty-silver';
import { barberSilverMintages } from './barber-silver';
import { early20thSilverMintages } from './early-20th-silver';
import { midCenturySilverMintages } from './mid-century-silver';
import { modernSilverMintages } from './modern-silver';

export const mintageData: Record<string, MintageData> = {
  ...earlyGoldMintages,
  ...classicGoldMintages,
  ...indianHeadGoldMintages,
  ...saintGaudensGoldMintages,
  ...modernGoldMintages,
  ...earlySilverMintages,
  ...seatedLibertySilverMintages,
  ...barberSilverMintages,
  ...early20thSilverMintages,
  ...midCenturySilverMintages,
  ...modernSilverMintages,
};
