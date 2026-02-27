'use client';

import { useState } from 'react';

interface PuritySelectorProps {
  metalType: string;
  value: number;
  onChange: (value: number) => void;
}

export default function PuritySelector({ metalType, value, onChange }: PuritySelectorProps) {
  const [isCustom, setIsCustom] = useState(false);
  
  const purities = [
    { value: 0.9999, label: '.9999', desc: 'Four Nines Fine' },
    { value: 0.999, label: '.999', desc: 'Three Nines Fine' },
    { value: 0.995, label: '.995', desc: 'Canadian Gold' },
    { value: 0.9167, label: '.9167', desc: '22 Karat' },
    { value: 0.750, label: '.750', desc: '18 Karat' },
    { value: 0.585, label: '.585', desc: '14 Karat' },
    { value: 0.417, label: '.417', desc: '10 Karat' },
  ];

  const handlePuritySelect = (purityValue: number) => {
    onChange(purityValue);
    setIsCustom(false);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Metal Purity</label>
      
      <div className="grid grid-cols-2 gap-2">
        {purities.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => handlePuritySelect(p.value)}
            className={`flex items-center gap-2 p-2 rounded-lg border ${
              !isCustom && Math.abs(value - p.value) < 0.0001
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-lg">{!isCustom && Math.abs(value - p.value) < 0.0001 ? '●' : '○'}</span>
            <div className="text-left">
              <div className="font-mono font-medium">{p.label}</div>
              <div className="text-xs text-gray-500">{p.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setIsCustom(!isCustom)}
          className={`flex items-center gap-2 p-2 rounded-lg border w-full ${
            isCustom ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="text-lg">{isCustom ? '●' : '○'}</span>
          <span className="font-medium">Custom Purity</span>
        </button>
        
        {isCustom && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="number"
              value={value}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              min="0"
              max="1"
              step="0.001"
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              = {(value * 100).toFixed(2)}% pure
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
