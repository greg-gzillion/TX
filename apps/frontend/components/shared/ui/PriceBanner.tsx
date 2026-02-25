'use client';

import { useState, useEffect } from 'react';

const API_URL = 'https://phoenix-api-756y.onrender.com';

interface Prices {
  gold: number;
  silver: number;
  platinum: number;
  palladium: number;
}

export default function PriceBanner() {
  const [prices, setPrices] = useState<Prices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      console.log('🔄 Fetching prices...');
      const response = await fetch(`${API_URL}/api/prices`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Prices received:', data);
      
      if (data.success && data.data) {
        setPrices(data.data);
        setError(null);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('❌ Fetch failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch');
      throw err; // Re-throw so retry mechanism catches it
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  // Small delay to ensure component is mounted
  const timer = setTimeout(() => {
    const fetchWithRetry = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          await fetchPrices();
          return;
        } catch (err) {
          console.log(`Retry ${i + 1}/${retries} failed`);
          if (i === retries - 1) {
            console.error('All retries failed');
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      }
    };

    fetchWithRetry();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, 100); // 100ms delay

  return () => clearTimeout(timer);
}, []);

    fetchWithRetry();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-3xl mx-auto text-center">
        <p className="text-sm text-gray-500">Loading prices...</p>
      </div>
    );
  }

  if (error || !prices) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-3xl mx-auto text-center">
        <p className="text-sm text-red-500">Prices temporarily unavailable</p>
        <p className="text-xs text-gray-400 mt-1">Using latest known values</p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-sm">
          <span className="text-amber-700">🥇 $5187.80</span>
          <span className="text-gray-600">🥈 $89.45</span>
          <span className="text-gray-600">🔷 $2245.00</span>
          <span className="text-gray-600">🔶 $1791.00</span>
        </div>
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
        ⓘ Reference prices updated manually
      </div>
    </div>
  );
}