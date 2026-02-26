'use client';

interface EstimatedValueDisplayProps {
  estimatedValue: number;
  isSandbox: boolean;
}

export default function EstimatedValueDisplay({ estimatedValue, isSandbox }: EstimatedValueDisplayProps) {
  if (estimatedValue <= 0) return null;

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <div className="flex justify-between items-center">
        <span className="font-medium text-green-800">Estimated Value:</span>
        <span className="text-xl font-bold text-green-700">
          ${estimatedValue.toFixed(2)} {isSandbox ? 'TESTUSD' : 'RLUSD'}
        </span>
      </div>
      <p className="text-xs text-green-600 mt-2">
        Based on calculator with current spot price
      </p>
    </div>
  );
}
