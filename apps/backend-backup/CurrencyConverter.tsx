'use client';

import * as React from 'react';

export type CurrencyType = 'USD' | 'XRP' | 'SOLO' | 'CORE' | 'rUSD';
export type MetalType = 'Gold' | 'Silver' | 'Platinum' | 'Palladium';

export interface ConverterState {
  sourceCurrency: CurrencyType;
  targetCurrency: CurrencyType;
  exchangeRates: Record<CurrencyType, number>;
  lastUpdated: Date;
  autoRefresh: boolean;
}

export interface CurrencyConverterProps {
  metalType: MetalType;
  metalValueUSD: number;
  value: ConverterState;
  onChange: (converter: ConverterState) => void;
}

export default function CurrencyConverter({ 
  metalType, 
  metalValueUSD, 
  value, 
  onChange 
}: CurrencyConverterProps) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Currency Converter</h3>
      <p>With rUSD support</p>
    </div>
  );
}
