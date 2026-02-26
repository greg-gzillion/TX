'use client';

interface MetalSelectorProps {
  value: 'Gold' | 'Silver' | 'Platinum' | 'Palladium' | 'Other';
  onChange: (value: 'Gold' | 'Silver' | 'Platinum' | 'Palladium' | 'Other') => void;
}

export default function MetalSelector({ value, onChange }: MetalSelectorProps) {
  const metals = [
    { id: 'Gold', label: 'Gold', icon: '🪙' },
    { id: 'Silver', label: 'Silver', icon: '🥈' },
    { id: 'Platinum', label: 'Platinum', icon: '🔷' },
    { id: 'Palladium', label: 'Palladium', icon: '🔶' },
    { id: 'Other', label: 'Other', icon: '💎' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {metals.map((metal) => (
        <button
          key={metal.id}
          type="button"
          onClick={() => onChange(metal.id as any)}
          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition ${
            value === metal.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <span className="text-xl">{value === metal.id ? '●' : '○'}</span>
          <span className="text-xl">{metal.icon}</span>
          <span className="font-medium">{metal.label}</span>
        </button>
      ))}
    </div>
  );
}
