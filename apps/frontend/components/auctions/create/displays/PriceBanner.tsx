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
  return (
    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <span className="font-medium text-blue-900">Current Market Prices:</span>
        {lastUpdated && (
          <span className="text-xs text-blue-600">Updated: {lastUpdated}</span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
        <div className="bg-white p-2 rounded shadow-sm">
          <span className="text-xs text-amber-600 block">GOLD</span>
          <span className="text-lg font-bold">${spotPrices.gold.toFixed(2)}</span>
        </div>
        <div className="bg-white p-2 rounded shadow-sm">
          <span className="text-xs text-gray-600 block">SILVER</span>
          <span className="text-lg font-bold">${spotPrices.silver.toFixed(2)}</span>
        </div>
        <div className="bg-white p-2 rounded shadow-sm">
          <span className="text-xs text-slate-600 block">PLATINUM</span>
          <span className="text-lg font-bold">${spotPrices.platinum.toFixed(2)}</span>
        </div>
        <div className="bg-white p-2 rounded shadow-sm">
          <span className="text-xs text-zinc-600 block">PALLADIUM</span>
          <span className="text-lg font-bold">${spotPrices.palladium.toFixed(2)}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        ⚡ Prices loaded from database. Refresh page to update.
      </p>
    </div>
  );
}
