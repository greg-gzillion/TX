'use client';

interface PriceBannerProps {
  spotPrices: {
    gold: number;
    silver: number;
    platinum: number;
    palladium: number;
  };
  lastUpdated: string;
}

export default function PriceBanner({ spotPrices, lastUpdated }: PriceBannerProps) {
  const metals = [
    { name: 'GOLD', price: spotPrices.gold, icon: '🥇', color: 'amber' },
    { name: 'SILVER', price: spotPrices.silver, icon: '🥈', color: 'gray' },
    { name: 'PLATINUM', price: spotPrices.platinum, icon: '🔷', color: 'slate' },
    { name: 'PALLADIUM', price: spotPrices.palladium, icon: '🔶', color: 'zinc' },
  ];

  return (
    <div className="mt-4 mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header bar */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
            🧪 TESTUSD
          </span>
          <span className="text-xs text-gray-500">
            Test tokens only
          </span>
        </div>
        {lastUpdated && (
          <span className="text-xs text-gray-400">
            {lastUpdated}
          </span>
        )}
      </div>

      {/* Price row - horizontal compact */}
      <div className="p-3 grid grid-cols-4 gap-2">
        {metals.map((metal) => (
          <div key={metal.name} className="text-center">
            <div className="text-xs text-gray-500 mb-1">{metal.name}</div>
            <div className={`text-base font-bold text-${metal.color}-600`}>
              ${metal.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="bg-gray-50 px-4 py-1 border-t border-gray-200 text-right">
        <span className="text-xs text-gray-400">⚡ from database</span>
      </div>
    </div>
  );
}
