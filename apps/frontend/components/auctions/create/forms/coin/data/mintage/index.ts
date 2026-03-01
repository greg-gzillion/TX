export interface MintageData {
  total: number;
  byYear?: Record<number, number>;
  byMint?: Record<string, number>;
  notes?: string;
  rarity: 'Common' | 'Scarce' | 'Rare' | 'Extremely Rare' | 'Unique';
  estimatedSurvival?: number;
}

import { earlyGoldMintages } from './early-gold';

export const mintageData: Record<string, MintageData> = {
  ...earlyGoldMintages,
  // More mintage data will be added here
};
