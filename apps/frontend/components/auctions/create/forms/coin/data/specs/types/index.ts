<<<<<<< HEAD
import { CoinSpec } from '../../../types';

// Re-export the CoinSpec type to maintain backward compatibility
export type { CoinSpec };
=======
export interface CoinSpec {
  name: string;
  years: string;
  weight: number;
  purity: number;
  diameter: number;
  thickness: number;
  composition: string;
  designer?: string;
  notes?: string;
  mint?: string;
  category?: string;
}

export interface MintData {
  value: string;
  label: string;
  minYear: number;
  maxYear: number | 'present';
  metals?: string[];
}
>>>>>>> acc41d4 (Fix: Complete coin module with all 9 US mints and date filtering)
