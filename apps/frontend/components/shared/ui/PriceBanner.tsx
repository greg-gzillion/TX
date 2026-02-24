'use client';

import { useState, useEffect } from 'react';

const API_URL = 'https://phoenix-api-756y.onrender.com';

interface Prices {
  gold: number;
  silver: number;
  platinum: number;
  palladium: number;
  createdAt?: string;
}

export default function PriceBanner() {
  const [prices, setPrices] = useState<Prices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrices();
    // Refresh every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/prices`);
      const data = await response.json();
      
      if (data.success) {
        setPrices(data.data);
        setError(null);
      } else {
        setError('Failed to load prices');
      }
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError('Cannot connect to price server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 border-b border-gray-200 text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          Loading reference prices...
        </div>
      </div>
    );
  }

  if (error || !prices) {
    return (
      <div className="bg-gray-50 border-b border-gray-200 text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 text-center text-red-400">
          {error || 'Prices unavailable'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 text-xs py-1.5">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex space-x-4 text-gray-600">
          <span>🥇 Gold ${prices.gold?.toFixed(2)}</span>
          <span>🥈 Silver ${prices.silver?.toFixed(2)}</span>
          <span>🔷 Platinum ${prices.platinum?.toFixed(2)}</span>
          <span>🔶 Palladium ${prices.palladium?.toFixed(2)}</span>
        </div>
        <span className="text-gray-400">
          Ref prices {prices.createdAt ? new Date(prices.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      </div>
    </div>
  );
}
