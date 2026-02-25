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
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      console.log('🔍 Testing API directly...');
      const response = await fetch(`${API_URL}/api/prices`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      console.log('✅ API Response:', data);
      
      if (data.success && data.data) {
        setPrices(data.data);
        setError(null);
      } else {
        setError('Invalid API response');
      }
    } catch (err) {
      console.error('❌ API Error:', err);
      // Type-safe error handling
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-3xl mx-auto text-center">
        <p className="text-sm text-gray-500">Loading reference prices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-3xl mx-auto text-center">
        <p className="text-sm text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!prices) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-3xl mx-auto text-center">
        <p className="text-sm text-gray-500">No price data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <span className="font-medium text-gray-700">Reference:</span>
        <span className="text-amber-700 font-semibold">🥇 ${prices.gold?.toFixed(2)}</span>
        <span className="text-gray-600">🥈 ${prices.silver?.toFixed(2)}</span>
        <span className="text-gray-600">🔷 ${prices.platinum?.toFixed(2)}</span>
        <span className="text-gray-600">🔶 ${prices.palladium?.toFixed(2)}</span>
      </div>
      <div className="mt-2 text-xs text-gray-500 text-center border-t border-gray-200 pt-2">
        ⓘ Reference prices updated manually. Metal prices fluctuate constantly.
      </div>
    </div>
  );
}