export interface MintData {
  value: string;
  label: string;
  minYear: number;
  maxYear: number | 'present';
  metals?: string[];
}

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
  mintage?: any;
}

export interface CoinDetails {
  country: string;
  mint: string;
  year: string;
  mintage: string;
  isNumismatic: boolean;
  grade: string;
  overrideYear?: boolean;
  selectedCoin?: CoinSpec | null;
}
