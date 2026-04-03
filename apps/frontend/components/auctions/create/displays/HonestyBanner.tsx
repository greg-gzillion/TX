"use client";

export default function HonestyBanner() {
  return (
    <div className="mt-4 bg-blue-50 border border-blue-300 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🧪</span>
        <span className="font-semibold text-blue-800">
          Development Environment
        </span>
      </div>
      <p className="text-sm text-blue-700">
        All prices are in TESTUSD (test tokens with no real value). This is for
        testing and development only.
      </p>
      <div className="mt-3">
        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
          🧪 TESTUSD - Test tokens only
        </span>
      </div>
    </div>
  );
}
