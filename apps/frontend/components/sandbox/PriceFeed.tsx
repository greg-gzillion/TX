'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function PriceFeed() {
  const [prices, setPrices] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const data = await api.getPrices();
        setPrices(data);
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Price Feed</h3>
        <span className="text-xs text-gray-500">
          Updated: {prices?.lastUpdated ? new Date(prices.lastUpdated).toLocaleTimeString() : '...'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-amber-50 p-3 rounded-lg">
          <div className="text-sm text-amber-600">GOLD</div>
          <div className="text-xl font-bold">${prices?.gold?.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">SILVER</div>
          <div className="text-xl font-bold">${prices?.silver?.toLocaleString()}</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="text-sm text-slate-600">PLATINUM</div>
          <div className="text-xl font-bold">${prices?.platinum?.toLocaleString()}</div>
        </div>
        <div className="bg-zinc-50 p-3 rounded-lg">
          <div className="text-sm text-zinc-600">PALLADIUM</div>
          <div className="text-xl font-bold">${prices?.palladium?.toLocaleString()}</div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        * Real-time prices from Kitco API via Render backend
      </p>
    </div>
  );
}
