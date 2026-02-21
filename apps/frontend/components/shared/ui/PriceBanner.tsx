// components/shared/ui/PriceBanner.tsx
export default function PriceBanner() {
  // Reference prices - update manually when needed
  const prices = {
    gold: 5105.90,
    silver: 84.52,
    platinum: 2157.00,
    palladium: 1743.00,
    lastUpdated: "Feb 21, 2026"
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200 text-xs py-1.5">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex space-x-4 text-gray-600">
          <span>🥇 Gold ${prices.gold}</span>
          <span>🥈 Silver ${prices.silver}</span>
          <span>🔷 Platinum ${prices.platinum}</span>
          <span>🔶 Palladium ${prices.palladium}</span>
        </div>
        <span className="text-gray-400">
          Ref prices {prices.lastUpdated}
        </span>
      </div>
    </div>
  );
}
