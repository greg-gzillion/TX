'use client';
import * as React from "react";

interface MetalSelectorProps {
  value: 'Gold' | 'Silver' | 'Platinum' | 'Palladium' | 'Other';
  onChange: (metal: 'Gold' | 'Silver' | 'Platinum' | 'Palladium' | 'Other') => void;
}

const METAL_OPTIONS = [
  { id: 'gold', label: 'Gold', color: '#FFD700', icon: '🪙', bgColor: 'bg-amber-50', borderColor: 'border-amber-300', selectedBg: 'bg-amber-200' },
  { id: 'silver', label: 'Silver', color: '#C0C0C0', icon: '🥈', bgColor: 'bg-gray-50', borderColor: 'border-gray-300', selectedBg: 'bg-gray-300' },
  { id: 'platinum', label: 'Platinum', color: '#E5E4E2', icon: '⚪', bgColor: 'bg-gray-50', borderColor: 'border-gray-300', selectedBg: 'bg-gray-400' },
  { id: 'palladium', label: 'Palladium', color: '#B4B4B4', icon: '⚫', bgColor: 'bg-gray-50', borderColor: 'border-gray-300', selectedBg: 'bg-gray-500' },
  { id: 'other', label: 'Other', color: '#6B7280', icon: '💎', bgColor: 'bg-purple-50', borderColor: 'border-purple-300', selectedBg: 'bg-purple-300' },
];

export default function MetalSelector({ value, onChange }: MetalSelectorProps) {
  const getButtonClasses = (metalLabel: string, isSelected: boolean) => {
    const metal = METAL_OPTIONS.find(m => m.label === metalLabel);
    
    if (isSelected) {
      return `
        flex flex-col items-center justify-center p-4 rounded-lg border-2 
        ${metal?.selectedBg || 'bg-blue-600'} 
        border-blue-600 
        text-white 
        shadow-lg 
        scale-105 
        transition-all 
        duration-200 
        font-bold
        ring-4 
        ring-blue-300
      `;
    }
    
    return `
      flex flex-col items-center justify-center p-4 rounded-lg border-2 
      ${metal?.bgColor || 'bg-white'} 
      border-gray-200 
      hover:border-blue-400 
      hover:bg-blue-50 
      hover:shadow-md 
      transition-all 
      duration-200 
      text-gray-700
    `;
  };

  return (
    <div className="metal-selector">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Metal Type
      </label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {METAL_OPTIONS.map((metal) => {
          const isSelected = value === metal.label;
          return (
            <button
              key={metal.id}
              type="button"
              onClick={() => onChange(metal.label as any)}
              className={getButtonClasses(metal.label, isSelected)}
              style={{ 
                backgroundColor: isSelected ? metal.color : undefined,
                color: isSelected ? '#000' : undefined
              }}
            >
              <span className="text-2xl mb-1">{metal.icon}</span>
              <span className="text-sm font-medium">{metal.label}</span>
              {isSelected && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}