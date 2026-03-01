import { MintageData } from './index';

export const earlyGoldMintages: Record<string, MintageData> = {
  'Capped Bust Gold $2.50 (Quarter Eagle)': {
    total: 192000,
    byYear: {
      1796: 963,
      1797: 427,
      1802: 3035,
      1804: 3265,
      1805: 1493,
      1806: 1568,
      1807: 668
    },
    rarity: 'Rare',
    estimatedSurvival: 2000,
    notes: 'Extremely rare in mint state'
  },
  'Capped Bust Gold $5 (Half Eagle)': {
    total: 334576,
    byYear: {
      1795: 7446,
      1796: 6196,
      1797: 3419,
      1798: 24467,
      1799: 74512,
      1800: 37528,
      1802: 53099,
      1803: 33506,
      1804: 30198,
      1805: 33083,
      1806: 96477
    },
    rarity: 'Scarce',
    estimatedSurvival: 5000,
    notes: 'Key date: 1795 with eagle on reverse'
  },
  'Capped Bust Gold $10 (Eagle)': {
    total: 13271,
    byYear: {
      1795: 5583,
      1796: 4418,
      1797: 3270
    },
    rarity: 'Extremely Rare',
    estimatedSurvival: 400,
    notes: '1804 eagle is one of the rarest US coins'
  },
  'Turban Head Gold $2.50': {
    total: 2710,
    byYear: { 1808: 2710 },
    rarity: 'Extremely Rare',
    estimatedSurvival: 150,
    notes: 'One-year type, extremely rare'
  }
};
