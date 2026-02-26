'use client';

import { useState, useEffect } from 'react';

const API_URL = 'https://phoenix-api-756y.onrender.com';

export function PriceFeed() {
  const [prices, setPrices] = useState({
    gold: 5183.70,
    silver: 87.38,
    platinum: 2254.00,
    palladium: 1754.00
  });
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch(`${API_URL}/api/prices`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setPrices({
            gold: data.data.gold,
            silver: data.data.silver,
            platinum: data.data.platinum,
            palladium: data.data.palladium
          });
          
          const date = new Date(data.data.createdAt);
          setLastUpdated(date.toLocaleTimeString());
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPrices();
  }, []);

  if (loading) {
    return <div className="bg-white p-6 rounded-xl border shadow-sm animate-pulse h-32"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
      {/* Sandbox banner */}
      <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 mb-4">
        <p className="text-purple-800 text-sm flex items-center">
          <span className="text-xl mr-2">🧪</span>
          <strong>SANDBOX MODE:</strong> Using reference prices from database
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Reference Prices</h3>  {/* Changed from "Live Price Feed" */}
        {lastUpdated && (
          <span className="text-sm text-gray-500">
            Updated: {lastUpdated}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="text-sm text-amber-600 font-medium">GOLD</div>
          <div className="text-2xl font-bold">${prices.gold.toFixed(2)}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 font-medium">SILVER</div>
          <div className="text-2xl font-bold">${prices.silver.toFixed(2)}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="text-sm text-slate-600 font-medium">PLATINUM</div>
          <div className="text-2xl font-bold">${prices.platinum.toFixed(2)}</div>
        </div>
        <div className="bg-zinc-50 p-4 rounded-lg">
          <div className="text-sm text-zinc-600 font-medium">PALLADIUM</div>
          <div className="text-2xl font-bold">${prices.palladium.toFixed(2)}</div>
        </div>
      </div>
      
      {/* Static note */}
      <p className="text-xs text-gray-400 text-center mt-4">
        ⚡ Prices loaded once on page load. Refresh to see latest updates.
      </p>
    </div>
  );
}