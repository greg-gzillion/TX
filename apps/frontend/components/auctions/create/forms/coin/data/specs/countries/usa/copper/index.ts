import { halfCents } from './half-cents';
import { largeCents } from './large-cents';
import { indianHeadCents } from './indian-head';
import { lincolnCents } from './lincoln';
import { allNickels as nickels } from './nickels';

export const usCopperCoins = {
  'Half Cents (1793-1857)': halfCents,
  'Large Cents (1793-1857)': largeCents,
  'Indian Head Cents (1859-1909)': indianHeadCents,
  'Lincoln Cents (1909-present)': lincolnCents,
  'Nickels (1866-present)': nickels,
};

export const allUsCopper = [
  ...halfCents,
  ...largeCents,
  ...indianHeadCents,
  ...lincolnCents,
  ...nickels,
];
