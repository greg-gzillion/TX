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
<<<<<<< HEAD
=======
  mintage?: any;
>>>>>>> acc41d4 (Fix: Complete coin module with all 9 US mints and date filtering)
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
