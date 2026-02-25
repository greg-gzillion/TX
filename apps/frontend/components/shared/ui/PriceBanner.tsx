'use client';

import { useState, useEffect } from 'react';

const API_URL = 'https://phoenix-api-756y.onrender.com';

export default function PriceBanner() {
  const [prices, setPrices] = useState(null);
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
        setError('Invalid API response' as string);
      }
    } catch (err) {
      console.error('❌ API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  if (!prices) return <div className="text-center p-4">No prices</div>;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <span className="font-medium">Reference:</span>
        <span>🥇 ${prices.gold}</span>
        <span>🥈 ${prices.silver}</span>
        <span>🔷 ${prices.platinum}</span>
        <span>🔶 ${prices.palladium}</span>
      </div>
    </div>
  );
}
