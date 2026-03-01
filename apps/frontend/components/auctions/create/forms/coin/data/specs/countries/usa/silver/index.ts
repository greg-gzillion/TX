import { flowingHairSilver } from './flowing-hair-1794-1795';
import { drapedBustSilver } from './draped-bust-1796-1807';
import { cappedBustSilver } from './capped-bust-1807-1838';
import { seatedLibertySilver } from './seated-liberty-1837-1891';
import { barberSilver } from './barber-1892-1916';
import { mercuryDime } from './mercury-dime-1916-1945';
import { standingQuarter } from './standing-quarter-1916-1930';
import { walkingLiberty } from './walking-liberty-1916-1947';
import { rooseveltDime } from './roosevelt-dime-1946-1964';
import { washingtonQuarter } from './washington-quarter-1932-1964';
import { franklinHalf } from './franklin-half-1948-1963';
import { kennedyHalf90 } from './kennedy-half-1964';
import { kennedyHalf40 } from './kennedy-half-40percent-1965-1970';
import { silverEagleBullion } from './american-silver-eagle-bullion-1986-present';
import { silverProofEagle } from './silver-proof-eagle-1986-present';
import { proofSets } from './proof-sets-1992-present';
import { silverCommemoratives } from './commemoratives-1982-present';

export const usSilverCoins = {
  'Flowing Hair Silver (1794-1795)': flowingHairSilver,
  'Draped Bust Silver (1796-1807)': drapedBustSilver,
  'Capped Bust Silver (1807-1838)': cappedBustSilver,
  'Seated Liberty Silver (1837-1891)': seatedLibertySilver,
  'Barber Silver (1892-1916)': barberSilver,
  'Mercury Dime (1916-1945)': mercuryDime,
  'Standing Liberty Quarter (1916-1930)': standingQuarter,
  'Walking Liberty Half (1916-1947)': walkingLiberty,
  'Roosevelt Dime (1946-1964)': rooseveltDime,
  'Washington Quarter (1932-1964)': washingtonQuarter,
  'Franklin Half (1948-1963)': franklinHalf,
  'Kennedy Half 90% (1964)': kennedyHalf90,
  'Kennedy Half 40% (1965-1970)': kennedyHalf40,
  'Silver Eagle Bullion (1986-present)': silverEagleBullion,
  'Silver Proof Eagle (1986-present)': silverProofEagle,
  '90% Modern Proof Sets (1992-present)': proofSets,
  'Silver Commemoratives (1982-present)': silverCommemoratives,
};

export const allUsSilver = [
  ...flowingHairSilver,
  ...drapedBustSilver,
  ...cappedBustSilver,
  ...seatedLibertySilver,
  ...barberSilver,
  ...mercuryDime,
  ...standingQuarter,
  ...walkingLiberty,
  ...rooseveltDime,
  ...washingtonQuarter,
  ...franklinHalf,
  ...kennedyHalf90,
  ...kennedyHalf40,
  ...silverEagleBullion,
  ...silverProofEagle,
  ...proofSets,
  ...silverCommemoratives,
];
