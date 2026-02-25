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
      console.log('Fetching from:', `${API_URL}/api/prices`);
      
      const response = await fetch(`https://cors-anywhere.herokuapp.com/${API_URL}/api/prices`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Price data:', data);
      
      if (data.success) {
        setPrices(data.data);
        setError(null);
      } else {
        throw new Error('API returned success: false');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      
      // Type-safe error handling
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      
      // FALLBACK PRICES - USE THESE WHEN API FAILS
      setPrices({
        gold: 5155.00,
        silver: 87.14,
        platinum: 2165.00,
        palladium: 1762.00
      });
      setError(null); // Clear error so fallback shows
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

  // Use fallback prices even if error (they're set in catch)
  if (!prices) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-3xl mx-auto text-center">
        <p className="text-sm text-red-500">Prices temporarily unavailable</p>
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
        {prices.createdAt && (
          <span className="text-xs text-gray-400">
            {new Date(prices.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500 text-center border-t border-gray-200 pt-2">
        ⓘ Reference prices updated manually. Metal prices fluctuate constantly.
      </div>
    </div>
  );
}
