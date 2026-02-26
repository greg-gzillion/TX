'use client';

interface FeeDisplayProps {
  estimatedValue: number;
  isSandbox: boolean;
}

export default function FeeDisplay({ estimatedValue, isSandbox }: FeeDisplayProps) {
  if (estimatedValue <= 0) return null;

  if (isSandbox) {
    return (
      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-700">
        🧪 Sandbox mode - no real fees apply
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-3">💰 Estimated Fees</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Your asking price:</span>
          <span className="font-medium">${estimatedValue.toFixed(2)} RLUSD</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Platform fee (1.1%):</span>
          <span className="font-medium text-amber-600">-${(estimatedValue * 0.011).toFixed(2)} RLUSD</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>You receive:</span>
            <span className="text-green-600">${(estimatedValue * 0.989).toFixed(2)} RLUSD</span>
          </div>
        </div>
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <span className="font-medium">🔒 Collateral:</span> 10% (${(estimatedValue * 0.1).toFixed(2)} RLUSD) locked, returned after successful sale
        </div>
      </div>
    </div>
  );
}
