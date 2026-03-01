import { earlySilver, earlySilverByType } from './early';
import { seatedLibertySilver, seatedLibertyByType } from './seated-liberty';
import { barberSilver, barberByType } from './barber';
import { early20thSilver, early20thByType } from './early-20th';
import { midCenturySilver, midCenturyByType } from './mid-century';
import { modernSilver, modernSilverByType } from './modern';

export const usSilver = {
  early: earlySilver,
  seatedLiberty: seatedLibertySilver,
  barber: barberSilver,
  early20th: early20thSilver,
  midCentury: midCenturySilver,
  modern: modernSilver,
};

export const usSilverByCategory = {
  'Early Silver (1794-1838)': earlySilverByType,
  'Seated Liberty (1837-1891)': seatedLibertyByType,
  'Barber Coinage (1892-1916)': barberByType,
  'Early 20th Century (1916-1947)': early20thByType,
  'Mid-Century (1932-1970)': midCenturyByType,
  'Modern Silver (1986-present)': modernSilverByType,
};

export const allUsSilver = [
  ...earlySilver,
  ...seatedLibertySilver,
  ...barberSilver,
  ...early20thSilver,
  ...midCenturySilver,
  ...modernSilver,
];
