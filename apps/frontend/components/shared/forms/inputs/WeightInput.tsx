'use client';

import { useState, useEffect } from 'react';

interface WeightInputProps {
  value: number;
  unit: 'troy_oz' | 'grams' | 'ounces';
  onChange: (value: number, unit: 'troy_oz' | 'grams' | 'ounces') => void;
  metalType?: string;
}

export default function WeightInput({ value, unit, onChange, metalType }: WeightInputProps) {
  const [selectedCommon, setSelectedCommon] = useState<string | null>(null);

  // Define which units are appropriate for each metal
  const getAvailableUnits = () => {
    const allUnits = [
      { id: 'troy_oz', label: 'oz t', full: 'Troy Ounces', metals: ['Gold', 'Silver', 'Platinum', 'Palladium'] },
      { id: 'grams', label: 'g', full: 'Grams', metals: ['Gold', 'Silver', 'Platinum', 'Palladium', 'Copper', 'Other'] },
      { id: 'ounces', label: 'oz', full: 'Avoirdupois Ounces', metals: ['Copper', 'Other'] },
    ];

    return allUnits.map(u => ({
      ...u,
      available: !metalType || u.metals.includes(metalType)
    }));
  };

  const units = getAvailableUnits();

  const commonWeights = [
    { oz: 1, g: 31.1, label: "1 oz" },
    { oz: 5, g: 155.5, label: "5 oz" },
    { oz: 10, g: 311.0, label: "10 oz" },
    { oz: 100, g: 3110.3, label: "100 oz" },
  ];

  const commonGramWeights = [
    { g: 1, oz: 0.032, label: "1 g" },
    { g: 10, oz: 0.32, label: "10 g" },
    { g: 100, oz: 3.21, label: "100 g" },
    { g: 1000, oz: 32.15, label: "1000 g" },
  ];

  // Auto-switch to an available unit if current unit becomes unavailable
  useEffect(() => {
    if (metalType) {
      const currentUnitAvailable = units.find(u => u.id === unit)?.available;
      if (!currentUnitAvailable) {
        // Switch to first available unit
        const firstAvailable = units.find(u => u.available);
        if (firstAvailable) {
          handleUnitChange(firstAvailable.id as any);
        }
      }
    }
  }, [metalType, unit]);

  const handleUnitChange = (newUnit: 'troy_oz' | 'grams' | 'ounces') => {
    let newValue = value;
    
    // Convert value when switching units
    if (unit === 'troy_oz' && newUnit === 'grams') {
      newValue = value * 31.1035;
    } else if (unit === 'troy_oz' && newUnit === 'ounces') {
      newValue = value * 1.09714;
    } else if (unit === 'grams' && newUnit === 'troy_oz') {
      newValue = value / 31.1035;
    } else if (unit === 'grams' && newUnit === 'ounces') {
      newValue = value / 28.3495;
    } else if (unit === 'ounces' && newUnit === 'troy_oz') {
      newValue = value / 1.09714;
    } else if (unit === 'ounces' && newUnit === 'grams') {
      newValue = value * 28.3495;
    }
    
    onChange(parseFloat(newValue.toFixed(4)), newUnit);
    setSelectedCommon(null);
  };

  const selectCommonWeight = (oz: number, g: number, label: string) => {
    setSelectedCommon(label);
    if (unit === 'troy_oz') {
      onChange(oz, unit);
    } else if (unit === 'grams') {
      onChange(g, unit);
    } else {
      onChange(oz, 'troy_oz');
    }
  };

  const selectCommonGram = (g: number, oz: number, label: string) => {
    setSelectedCommon(label);
    if (unit === 'grams') {
      onChange(g, unit);
    } else if (unit === 'troy_oz') {
      onChange(oz, unit);
    } else {
      onChange(oz, 'troy_oz');
    }
  };

  const isWeightSelected = (targetValue: number, targetUnit: 'troy_oz' | 'grams') => {
    if (unit === targetUnit && Math.abs(value - targetValue) < 0.1) {
      return true;
    }
    if (targetUnit === 'troy_oz' && unit === 'grams') {
      return Math.abs(value - targetValue * 31.1035) < 1;
    }
    if (targetUnit === 'grams' && unit === 'troy_oz') {
      return Math.abs(value - targetValue / 31.1035) < 0.01;
    }
    return false;
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Weight {metalType && <span className="text-xs text-gray-500">({metalType})</span>}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              onChange(parseFloat(e.target.value) || 0, unit);
              setSelectedCommon(null);
            }}
            step="0.0001"
            min="0"
            className="w-32 px-3 py-2 border border-gray-300 rounded-md"
          />
          <div className="flex gap-1">
            {units.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => u.available && handleUnitChange(u.id as any)}
                disabled={!u.available}
                className={`px-3 py-2 rounded-md border flex items-center gap-1 ${
                  !u.available
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : unit === u.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                }`}
                title={!u.available ? `${u.full} not typically used for ${metalType}` : ''}
              >
                <span className="text-lg">
                  {u.available ? (unit === u.id ? '●' : '○') : '○'}
                </span>
                {u.label}
              </button>
            ))}
          </div>
        </div>
        {metalType === 'Silver' && (
          <p className="text-xs text-amber-600 mt-1">
            💡 Troy ounces (oz t) are standard for silver. Avoirdupois ounces (oz) are grayed out.
          </p>
        )}
        {metalType === 'Copper' && (
          <p className="text-xs text-amber-600 mt-1">
            💡 Avoirdupois ounces (oz) and grams are common for copper. Troy ounces (oz t) are grayed out.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-2">Troy Ounces</p>
          <p className="text-lg font-mono">{(unit === 'troy_oz' ? value : 
            unit === 'grams' ? value / 31.1035 : value / 1.09714).toFixed(4)} oz t</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2">Grams</p>
          <p className="text-lg font-mono">{(unit === 'grams' ? value : 
            unit === 'troy_oz' ? value * 31.1035 : value * 28.3495).toFixed(4)} g</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2">Common Weights</p>
        <div className="flex flex-wrap gap-2">
          {commonWeights.map((w) => {
            const isSelected = selectedCommon === w.label || isWeightSelected(w.oz, 'troy_oz');
            return (
              <button
                key={w.label}
                type="button"
                onClick={() => selectCommonWeight(w.oz, w.g, w.label)}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="text-xs">{isSelected ? '●' : '○'}</span>
                {w.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2">Common Grams</p>
        <div className="flex flex-wrap gap-2">
          {commonGramWeights.map((w) => {
            const isSelected = selectedCommon === w.label || isWeightSelected(w.g, 'grams');
            return (
              <button
                key={w.label}
                type="button"
                onClick={() => selectCommonGram(w.g, w.oz, w.label)}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="text-xs">{isSelected ? '●' : '○'}</span>
                {w.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
