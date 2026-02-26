'use client';

interface WeightInputProps {
  value: number;
  unit: 'troy_oz' | 'grams' | 'ounces';
  onChange: (value: number, unit: 'troy_oz' | 'grams' | 'ounces') => void;
}

export default function WeightInput({ value, unit, onChange }: WeightInputProps) {
  const units = [
    { id: 'troy_oz', label: 'oz t', full: 'Troy Ounces' },
    { id: 'grams', label: 'g', full: 'Grams' },
    { id: 'ounces', label: 'oz', full: 'Avoirdupois Ounces' },
  ];

  const commonWeights = [
    { oz: 1, g: 31.1 },
    { oz: 5, g: 155.5 },
    { oz: 10, g: 311.0 },
    { oz: 100, g: 3110.3 },
  ];

  const commonGramWeights = [
    { g: 1, oz: 0.032 },
    { g: 10, oz: 0.32 },
    { g: 100, oz: 3.21 },
    { g: 1000, oz: 32.15 },
  ];

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
  };

  const selectCommonWeight = (oz: number, g: number) => {
    if (unit === 'troy_oz') onChange(oz, unit);
    else if (unit === 'grams') onChange(g, unit);
    else onChange(oz, 'troy_oz'); // default to troy oz for ounces unit
  };

  const selectCommonGram = (g: number, oz: number) => {
    if (unit === 'grams') onChange(g, unit);
    else if (unit === 'troy_oz') onChange(oz, unit);
    else onChange(oz, 'troy_oz');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0, unit)}
            step="0.0001"
            min="0"
            className="w-32 px-3 py-2 border border-gray-300 rounded-md"
          />
          <div className="flex gap-1">
            {units.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleUnitChange(u.id as any)}
                className={`px-3 py-2 rounded-md border ${
                  unit === u.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{unit === u.id ? '●' : '○'}</span>
                {u.label}
              </button>
            ))}
          </div>
        </div>
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
          {commonWeights.map((w) => (
            <button
              key={w.oz}
              type="button"
              onClick={() => selectCommonWeight(w.oz, w.g)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              {w.oz} oz
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2">Common Grams</p>
        <div className="flex flex-wrap gap-2">
          {commonGramWeights.map((w) => (
            <button
              key={w.g}
              type="button"
              onClick={() => selectCommonGram(w.g, w.oz)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              {w.g} g
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}