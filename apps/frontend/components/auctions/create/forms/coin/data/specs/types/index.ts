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
  mint?: string;        // Specific mint if applicable
  category?: string;    // For filtering
}

export interface MintData {
  value: string;
  label: string;
  minYear: number;
  maxYear: number | 'present';
  metals?: string[];    // Which metals this mint produced
}

export interface CountrySpecs {
  gold: Record<string, CoinSpec[]>;
  silver: Record<string, CoinSpec[]>;
  copper: Record<string, CoinSpec[]>;
  platinum?: Record<string, CoinSpec[]>;
  palladium?: Record<string, CoinSpec[]>;
}
