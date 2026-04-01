'use client';

import { useState } from 'react';

interface PuritySelectorProps {
  metalType: string;
  value: number;
  onChange: (value: number) => void;
  formType?: 'coin' | 'round' | 'bar' | 'jewelry' | 'other'; // Add form type
}

export default function PuritySelector({ metalType, value, onChange, formType }: PuritySelectorProps) {
  const [isCustom, setIsCustom] = useState(false);
  
  // Get comprehensive purity options based on metal type AND form type
  const getPurityOptions = () => {
    // For ROUNDS and BARS (bullion) - only show modern bullion purities
    if (formType === 'round' || formType === 'bar') {
      switch(metalType) {
        case 'Gold':
          return [
            { value: 0.9999, label: '.9999', desc: 'Four Nines Fine (bullion)' },
            { value: 0.999, label: '.999', desc: 'Three Nines Fine (bullion)' },
            { value: 0.995, label: '.995', desc: 'Investment Grade' },
          ];
        case 'Silver':
          return [
            { value: 0.9999, label: '.9999', desc: 'Four Nines Fine (bullion bars)' },
            { value: 0.999, label: '.999', desc: 'Three Nines Fine (bullion rounds)' },
          ];
        case 'Platinum':
          return [
            { value: 0.9995, label: '.9995', desc: 'Four Nines Fine (bullion)' },
            { value: 0.999, label: '.999', desc: 'Three Nines Fine' },
          ];
        case 'Palladium':
          return [
            { value: 0.9995, label: '.9995', desc: 'Four Nines Fine (bullion)' },
            { value: 0.999, label: '.999', desc: 'Three Nines Fine' },
          ];
        case 'Copper':
          return [
            { value: 0.999, label: '.999', desc: 'Pure Copper (bullion rounds/bars)' },
          ];
        default:
          return [];
      }
    }

    // For COINS (numismatic) - show ALL historical purities
    if (formType === 'coin') {
      switch(metalType) {
        case 'Gold':
          return [
            { value: 0.9999, label: '.9999', desc: 'Four Nines Fine (24K bullion)' },
            { value: 0.999, label: '.999', desc: 'Three Nines Fine' },
            { value: 0.995, label: '.995', desc: 'Canadian Gold (maple leaf)' },
            { value: 0.986, label: '.986', desc: 'Crown Gold (British sovereign)' },
            { value: 0.9167, label: '.9167', desc: '22 Karat (US Gold Eagles)' },
            { value: 0.900, label: '.900', desc: '90% Gold (US Gold coins pre-1933)' },
            { value: 0.850, label: '.850', desc: '85% Gold (European coins)' },
            { value: 0.750, label: '.750', desc: '18 Karat (jewelry, some coins)' },
            { value: 0.585, label: '.585', desc: '14 Karat (jewelry, some coins)' },
            { value: 0.417, label: '.417', desc: '10 Karat (jewelry, some coins)' },
            { value: 0.375, label: '.375', desc: '9 Karat (UK jewelry)' },
          ];
        
        case 'Silver':
          return [
            { value: 0.9999, label: '.9999', desc: 'Four Nines Fine (bullion coins)' },
            { value: 0.999, label: '.999', desc: 'Three Nines Fine (Britannia)' },
            { value: 0.986, label: '.986', desc: 'Britannia Silver (old standard)' },
            { value: 0.958, label: '.958', desc: 'Britannia Silver (modern)' },
            { value: 0.925, label: '.925', desc: 'Sterling Silver (coinage, jewelry)' },
            { value: 0.900, label: '.900', desc: '90% Silver (US coins: Morgan, Peace, Mercury)' },
            { value: 0.835, label: '.835', desc: 'European Silver (Netherlands, Sweden)' },
            { value: 0.830, label: '.830', desc: 'German Silver' },
            { value: 0.800, label: '.800', desc: '80% Silver (European coins, some jewelry)' },
            { value: 0.720, label: '.720', desc: '72% Silver (British pre-1920 coins)' },
            { value: 0.500, label: '.500', desc: '50% Silver (US half dollars 1965-1970)' },
            { value: 0.400, label: '.400', desc: '40% Silver (US Kennedy halves 1965-1970)' },
            { value: 0.350, label: '.350', desc: '35% Silver (US Jefferson nickels 1942-1945)' },
          ];
        
        case 'Platinum':
          return [
            { value: 0.9995, label: '.9995', desc: 'Four Nines Fine (modern bullion)' },
            { value: 0.999, label: '.999', desc: 'Three Nines Fine' },
            { value: 0.950, label: '.950', desc: '95% Platinum (Russian imperial, some coins)' },
            { value: 0.900, label: '.900', desc: '90% Platinum (older coins)' },
            { value: 0.850, label: '.850', desc: '85% Platinum (some coins)' },
          ];
        
        case 'Palladium':
          return [
            { value: 0.9995, label: '.9995', desc: 'Four Nines Fine (modern bullion)' },
            { value: 0.999, label: '.999', desc: 'Three Nines Fine' },
            { value: 0.950, label: '.950', desc: '95% Palladium (US Eagles)' },
            { value: 0.500, label: '.500', desc: '50% Palladium (older industrial)' },
          ];
        
        case 'Copper':
          return [
            { value: 0.999, label: '.999', desc: 'Pure Copper (bullion coins)' },
            { value: 0.950, label: '.950', desc: '95% Copper (early US large cents, Indian Heads)' },
            { value: 0.900, label: '.900', desc: '90% Copper/10% Nickel (clad layers)' },
            { value: 0.880, label: '.880', desc: '88% Copper/12% Nickel (modern clad)' },
            { value: 0.750, label: '.750', desc: '75% Copper/25% Nickel (Jefferson nickels)' },
            { value: 0.600, label: '.600', desc: '60% Copper/40% Silver (clad proofs)' },
            { value: 0.025, label: '.025', desc: '2.5% Copper/97.5% Zinc (modern pennies)' },
          ];
        
        default:
          return [];
      }
    }

    // For JEWELRY and OTHER - show relevant options
    if (formType === 'jewelry') {
      switch(metalType) {
        case 'Gold':
          return [
            { value: 0.999, label: '.999', desc: '24K Fine Gold' },
            { value: 0.9167, label: '.9167', desc: '22 Karat' },
            { value: 0.750, label: '.750', desc: '18 Karat' },
            { value: 0.585, label: '.585', desc: '14 Karat' },
            { value: 0.417, label: '.417', desc: '10 Karat' },
            { value: 0.375, label: '.375', desc: '9 Karat' },
          ];
        case 'Silver':
          return [
            { value: 0.999, label: '.999', desc: 'Fine Silver' },
            { value: 0.925, label: '.925', desc: 'Sterling Silver' },
            { value: 0.800, label: '.800', desc: '80% Silver' },
          ];
        default:
          return [];
      }
    }

    return [];
  };

  const purities = getPurityOptions();

  const handlePuritySelect = (purityValue: number) => {
    onChange(purityValue);
    setIsCustom(false);
  };

  // Don't show anything if no options (shouldn't happen)
  if (purities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {formType === 'round' || formType === 'bar' ? 'Bullion Purity' : 'Purity / Composition'} ({metalType})
        {formType === 'round' && <span className="ml-2 text-xs text-blue-600">(Bullion Rounds)</span>}
        {formType === 'coin' && <span className="ml-2 text-xs text-amber-600">(Numismatic Coins)</span>}
      </label>
      
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
          <span className="font-medium">Custom Composition</span>
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
