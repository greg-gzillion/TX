import { usaMints } from './usa';
<<<<<<< HEAD
import { canadaMints } from './canada';
import { ukMints } from './uk';
import { russiaMints } from './russia';
import { mexicoMints } from './mexico';
import { australiaMints } from './australia';
import { austriaMints } from './austria';
import { southAfricaMints } from './southafrica';
import { switzerlandMints } from './switzerland';
import { germanyMints } from './germany';
import { chinaMints } from './china';
import { otherMints } from './other';

export const mintDatabase: Record<string, Record<string, any[]>> = {
  'USA': usaMints,
  'Canada': canadaMints,
  'UK': ukMints,
  'Russia': russiaMints,
  'Mexico': mexicoMints,
  'Australia': australiaMints,
  'Austria': austriaMints,
  'South Africa': southAfricaMints,
  'Switzerland': switzerlandMints,
  'Germany': germanyMints,
  'China': chinaMints,
  'Other': otherMints,
=======

export const mintDatabase: Record<string, Record<string, any[]>> = {
  'USA': usaMints,
>>>>>>> acc41d4 (Fix: Complete coin module with all 9 US mints and date filtering)
};
