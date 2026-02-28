'use client';

import { useState, useEffect } from 'react';

interface PriceCalculatorProps {
  metalType: string;
  weight: number;
  weightUnit: 'troy_oz' | 'grams' | 'ounces';
  purity: number;
  spotPrice: number;
  onPriceUpdate: (value: number) => void;
}

export default function PriceCalculator({
  metalType,
  weight,
  weightUnit,
  purity,
  spotPrice,
  onPriceUpdate
}: PriceCalculatorProps) {
  const [premiumPercent, setPremiumPercent] = useState<number>(5);

  // Convert to troy oz
  const convertToTroyOz = (): number => {
    switch (weightUnit) {
      case 'troy_oz': return weight;
      case 'grams': return weight / 31.1035;
      case 'ounces': return weight / 1.09714;
      default: return weight;
    }
  };

  // Calculate prices
  const calculatePrices = () => {
    const troyOz = convertToTroyOz();
    const pureMetalValue = troyOz * spotPrice;
    const actualMetalValue = pureMetalValue * purity;
    const premiumValue = actualMetalValue * (premiumPercent / 100);
    const totalValue = actualMetalValue + premiumValue;
    
    return {
      pureMetalValue,
      actualMetalValue,
      premiumValue,
      totalValue
    };
  };

  useEffect(() => {
    const prices = calculatePrices();
    onPriceUpdate(prices.totalValue);
  }, [spotPrice, premiumPercent, weight, weightUnit, purity]);

  const prices = calculatePrices();
  const troyOz = convertToTroyOz();

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold text-gray-900">Pricing Calculator</h3>
      
      {/* Spot Price Display */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-900">Spot Price:</span>
          <span className="text-lg font-bold text-blue-700">${spotPrice.toFixed(2)}</span>
        </div>
        <p className="text-xs text-blue-600 mt-1">per troy ounce</p>
      </div>

      {/* Simple Premium Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Premium (%)
        </label>
        <input
          type="number"
          value={premiumPercent}
          onChange={(e) => setPremiumPercent(parseFloat(e.target.value) || 0)}
          min="-20"
          max="100"
          step="0.5"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter premium percentage (typical: 2-15%)
        </p>
      </div>

      {/* Price Breakdown */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2 text-sm">Breakdown</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Metal value:</span>
            <span className="font-medium">${prices.actualMetalValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Premium ({premiumPercent}%):</span>
            <span className="font-medium text-green-600">+${prices.premiumValue.toFixed(2)}</span>
          </div>
          <div className="border-t pt-1 mt-1">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-blue-600">${prices.totalValue.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {troyOz.toFixed(4)} oz × ${spotPrice.toFixed(2)} × {purity}
        </p>
      </div>
    </div>
  );
}
