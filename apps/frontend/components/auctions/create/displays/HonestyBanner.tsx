'use client';

interface HonestyBannerProps {
  isSandbox: boolean;
}

export default function HonestyBanner({ isSandbox }: HonestyBannerProps) {
  return (
    <div className="mt-4 bg-blue-50 border border-blue-300 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">⏳</span>
        <span className="font-semibold text-blue-800">Testnet Coming Soon</span>
      </div>
      <p className="text-sm text-blue-700">
        The TX testnet is not yet available. The protocol will begin testing when the testnet launches.
        For now, you can preview the listing form and design your auction.
      </p>
      <div className="mt-3 flex gap-2">
        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
          🧪 Sandbox mode: {isSandbox ? 'Active' : 'Use ?sandbox=true to test'}
        </span>
      </div>
    </div>
  );
}
