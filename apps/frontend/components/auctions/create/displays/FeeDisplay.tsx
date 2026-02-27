'use client';

interface FeeDisplayProps {
  estimatedValue: number;
}

export default function FeeDisplay({ estimatedValue }: FeeDisplayProps) {
  if (estimatedValue <= 0) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-3">💰 Estimated Fees (TESTUSD)</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Your asking price:</span>
          <span className="font-medium">${estimatedValue.toFixed(2)} TESTUSD</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Platform fee (1.1%):</span>
          <span className="font-medium text-amber-600">-${(estimatedValue * 0.011).toFixed(2)} TESTUSD</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>You receive:</span>
            <span className="text-green-600">${(estimatedValue * 0.989).toFixed(2)} TESTUSD</span>
          </div>
        </div>
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <span className="font-medium">🔒 Collateral:</span> 10% (${(estimatedValue * 0.1).toFixed(2)} TESTUSD) locked, returned after successful sale
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3 border-t pt-2">
        ⚡ TESTUSD are test tokens with no real value. For testing only.
      </p>
    </div>
  );
}