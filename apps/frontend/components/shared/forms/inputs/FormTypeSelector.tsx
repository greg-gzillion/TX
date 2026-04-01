'use client';

interface FormTypeSelectorProps {
  value: 'coin' | 'round' | 'bar' | 'jewelry' | 'other';
  onChange: (value: 'coin' | 'round' | 'bar' | 'jewelry' | 'other') => void;
}

export default function FormTypeSelector({ value, onChange }: FormTypeSelectorProps) {
  const types = [
    { id: 'coin', label: 'Coin(s)', icon: '🪙', desc: 'Government minted coins' },
    { id: 'round', label: 'Round(s)', icon: '⭕', desc: 'Private mint rounds' },
    { id: 'bar', label: 'Bar(s)', icon: '⬜', desc: 'Bullion bars' },
    { id: 'jewelry', label: 'Jewelry', icon: '💎', desc: 'Rings, chains, items' },
    { id: 'other', label: 'Other', icon: '📦', desc: 'Scrap, unique items' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {types.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => onChange(type.id as any)}
          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition ${
            value === type.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <span className="text-xl">{value === type.id ? '●' : '○'}</span>
          <span className="text-2xl">{type.icon}</span>
          <div className="text-left">
            <div className="font-medium">{type.label}</div>
            <div className="text-xs text-gray-500">{type.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}