export interface CoinSpec {
  name: string;
  years: string;
  weight: number;      // in grams
  purity: number;       // as decimal (0.900 = 90%)
  diameter: number;     // in mm
  thickness: number;    // in mm
  composition: string;
  designer?: string;
  notes?: string;
}

export interface MintData {
  value: string;
  label: string;
  minYear: number;
  maxYear: number | 'present';
}
