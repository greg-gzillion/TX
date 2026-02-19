'use client';

import { useState, useEffect } from 'react';
import { crfService } from '../lib/crf-service';

export default function CRFBalance() {
  const [balance, setBalance] = useState(crfService.getBalance());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Update every 30 seconds or when transactions occur
    const interval = setInterval(() => {
      setBalance(crfService.getBalance());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Community Reserve Fund</h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
          1.1% Fee
        </span>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900">
          {crfService.formatRLUSD(balance.totalFees)} RLUSD
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Total fees collected from {balance.transactionCount} transactions
        </p>
      </div>

      <div className="text-xs text-gray-400 mb-3">
        Last updated: {balance.lastUpdated.toLocaleString()}
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        {showDetails ? 'Hide' : 'Show'} transaction history
      </button>

      {showDetails && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {balance.transactions.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No transactions yet</p>
          ) : (
            balance.transactions.map((tx) => (
              <div key={tx.id} className="text-xs border-b pb-2">
                <div className="flex justify-between">
                  <span className="font-medium">Auction: {tx.auctionId}</span>
                  <span className={tx.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                    {tx.status}
                  </span>
                </div>
                <div className="text-gray-600">
                  Fee: {crfService.formatRLUSD(tx.feeAmount)} RLUSD
                </div>
                <div className="text-gray-400">
                  {tx.timestamp.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 1.1% of every transaction is automatically added to the Community Reserve Fund.
          Funds are managed by the DAO for future community initiatives.
        </p>
      </div>
    </div>
  );
}