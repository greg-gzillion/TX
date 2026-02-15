'use client';

import { useState, useEffect } from 'react';
import { feeCollector } from '../lib/fee-collector';

export default function FeeDisplay() {
  const [total, setTotal] = useState(feeCollector.getTotalAccumulated());
  const [showDetails, setShowDetails] = useState(false);
  const [fees, setFees] = useState(feeCollector.getAllFees());

  // Update every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTotal(feeCollector.getTotalAccumulated());
      setFees(feeCollector.getAllFees());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Insurance Pool Accumulator</h3>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
          1.1% Fee
        </span>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900">
          {feeCollector.formatRLUSD(total)} RLUSD
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Accumulated for future Insurance Module
        </p>
      </div>

      <div className="text-xs text-gray-400 mb-3">
        {fees.length} transactions processed
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
      >
        {showDetails ? 'Hide' : 'Show'} transaction log
      </button>

      {showDetails && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {fees.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No fees collected yet</p>
          ) : (
            fees.map((fee) => (
              <div key={fee.id} className="text-xs border-b pb-2">
                <div className="flex justify-between">
                  <span className="font-medium">Auction: {fee.auctionId}</span>
                  <span className="text-purple-600">+{feeCollector.formatRLUSD(fee.feeAmount)}</span>
                </div>
                <div className="text-gray-500">
                  {fee.timestamp.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <p className="text-xs text-purple-700">
          💡 <strong>Future Insurance Module:</strong> These fees will fund a separate insurance program
          where metal owners can buy policies. Developer receives 10% stake + 10% of fees when launched.
        </p>
      </div>
    </div>
  );
}