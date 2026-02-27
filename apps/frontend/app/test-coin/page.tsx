'use client';

import { useState } from 'react';

export default function TestCoinPage() {
  const [country, setCountry] = useState('');
  const [mint, setMint] = useState('');

  const getMints = () => {
    if (country === 'USA') {
      return ['Philadelphia', 'Denver', 'San Francisco', 'West Point', 'Carson City'];
    }
    if (country === 'Canada') {
      return ['Royal Canadian Mint - Ottawa', 'Royal Canadian Mint - Winnipeg'];
    }
    return [];
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-red-600">🔬 ISOLATED TEST PAGE</h1>
      
      <div className="bg-red-100 border-4 border-red-500 p-4 mb-8">
        <p className="text-lg font-bold">This is a test page - completely separate from your main app!</p>
      </div>

      <div className="space-y-6 border p-6 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-2">Country:</label>
          <select 
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setMint('');
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Select...</option>
            <option value="USA">United States</option>
            <option value="Canada">Canada</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mint:</label>
          <select 
            value={mint}
            onChange={(e) => setMint(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!country}
          >
            <option value="">Select mint...</option>
            {getMints().map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="bg-yellow-100 p-4 rounded">
          <p className="font-mono">
            <strong>Debug:</strong><br/>
            Country: "{country}"<br/>
            Mint options: {getMints().length}<br/>
            Selected mint: "{mint}"
          </p>
        </div>

        <div className="bg-green-50 p-2 text-sm">
          <p>✅ If this dropdown changes when you select different countries, then React IS working.</p>
          <p>❌ If it doesn't change, then something is fundamentally broken.</p>
        </div>
      </div>
    </div>
  );
}
