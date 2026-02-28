'use client';

interface FeeDisplayProps {
  estimatedValue: number;
}

export default function FeeDisplay({ estimatedValue }: FeeDisplayProps) {
  if (estimatedValue <= 0) return null;

  const yourFee = estimatedValue * 0.011;
  const ebayFee = estimatedValue * 0.10;
  const savings = ebayFee - yourFee;

  return (
    <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
      <h4 className="flex items-center gap-2 text-lg font-bold text-amber-900 mb-3">
        💰 Estimated Fees (TESTUSD)
      </h4>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Your asking price:</span>
          <span className="font-mono font-bold text-lg">${estimatedValue.toFixed(2)} TESTUSD</span>
        </div>
        
        <div className="flex justify-between items-center text-red-600">
          <span>Platform fee (1.1%):</span>
          <span className="font-mono font-bold">-$${yourFee.toFixed(2)} TESTUSD</span>
        </div>
        
        <div className="pt-2 border-t-2 border-amber-300">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">You receive:</span>
            <span className="font-mono font-bold text-2xl text-green-600">
              ${(estimatedValue - yourFee).toFixed(2)} TESTUSD
            </span>
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-xl">🔒</span>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Collateral: 10% (${(estimatedValue * 0.1).toFixed(2)} TESTUSD)
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Locked during sale, returned to you after buyer confirms receipt
              </p>
            </div>
          </div>
        </div>
      </div>
	<div className="mt-4 p-3 bg-white rounded-lg border border-amber-200">
        <p className="text-xs text-gray-600">
          💡 <strong>Compare to eBay:</strong> Same item would cost you ${ebayFee.toFixed(2)} in fees (10%). 
          You save <span className="font-bold text-green-600">${savings.toFixed(2)}</span> by using PhoenixPME! <span className="text-xl" role="img" aria-label="mind blown">🤯</span>
        </p>
      </div>
    </div>
  );
}
