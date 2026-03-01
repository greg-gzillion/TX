import { CoinSpec } from '../../../types';

// Re-export the CoinSpec type to maintain backward compatibility
export type { CoinSpec };

export interface MintData {
  value: string;
  label: string;
  minYear: number;
  maxYear: number | 'present';
  metals?: string[];
}
