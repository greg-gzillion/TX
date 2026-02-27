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
    { name: 'GOLD', price: spotPrices.gold, icon: '🥇', color: 'amber', bg: 'amber-50', text: 'amber-700' },
    { name: 'SILVER', price: spotPrices.silver, icon: '🥈', color: 'gray', bg: 'gray-50', text: 'gray-700' },
    { name: 'PLATINUM', price: spotPrices.platinum, icon: '🔷', color: 'slate', bg: 'slate-50', text: 'slate-700' },
    { name: 'PALLADIUM', price: spotPrices.palladium, icon: '🔶', color: 'zinc', bg: 'zinc-50', text: 'zinc-700' },
  ];

  return (
    <div className="mt-6 mb-8">
      {/* Header with TESTUSD badge and timestamp */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
            🧪 TESTUSD
          </span>
          <span className="text-xs text-gray-500">
            Test tokens only - no real value
          </span>
        </div>
        {lastUpdated && (
          <span className="text-xs text-gray-400">
            Updated: {lastUpdated}
          </span>
        )}
      </div>

      {/* Price cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metals.map((metal) => (
          <div
            key={metal.name}
            className={`bg-${metal.bg} rounded-xl p-4 border border-${metal.color}-200 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{metal.icon}</span>
              <span className={`text-xs font-medium text-${metal.text} uppercase tracking-wider`}>
                {metal.name}
              </span>
            </div>
            <div className={`text-2xl font-bold text-${metal.text}`}>
              ${metal.price.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              per troy oz
            </div>
          </div>
        ))}
      </div>

      {/* Refresh note */}
      <p className="text-xs text-gray-400 text-center mt-4">
        ⚡ Prices loaded from database. Refresh page to update.
      </p>
    </div>
  );
}
