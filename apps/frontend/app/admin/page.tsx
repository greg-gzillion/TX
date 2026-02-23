'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [formPrices, setFormPrices] = useState({
    gold: '',
    silver: '',
    platinum: '',
    palladium: ''
  });
  const [currentPrices, setCurrentPrices] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load current prices on page load
  useEffect(() => {
    fetch('http://localhost:3001/api/admin/prices/latest')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCurrentPrices(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const res = await fetch('http://localhost:3001/api/admin/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formPrices, password })
      });
      
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Prices updated!');
        setFormPrices({ gold: '', silver: '', platinum: '', palladium: '' });
        // Refresh current prices
        const updated = await fetch('http://localhost:3001/api/admin/prices/latest').then(r => r.json());
        setCurrentPrices(updated);
      } else {
        setMessage('❌ Failed: ' + data.error);
      }
    } catch (err) {
      setMessage('❌ Error updating prices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin: Update Prices</h1>
        
        {/* Current Prices */}
        {currentPrices && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Current Prices</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>🥇 Gold: ${currentPrices.gold}</div>
              <div>🥈 Silver: ${currentPrices.silver}</div>
              <div>🔷 Platinum: ${currentPrices.platinum}</div>
              <div>🔶 Palladium: ${currentPrices.palladium}</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Last updated: {new Date(currentPrices.createdAt).toLocaleString()}
            </p>
          </div>
        )}
        
        {/* Update Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Update Prices</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Gold ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formPrices.gold}
                  onChange={(e) => setFormPrices({ ...formPrices, gold: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Silver ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formPrices.silver}
                  onChange={(e) => setFormPrices({ ...formPrices, silver: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Platinum ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formPrices.platinum}
                  onChange={(e) => setFormPrices({ ...formPrices, platinum: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Palladium ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formPrices.palladium}
                  onChange={(e) => setFormPrices({ ...formPrices, palladium: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : 'Update Prices'}
            </button>
            
            {message && (
              <div className="p-3 bg-gray-100 rounded text-center">
                {message}
              </div>
            )}
          </form>
        </div>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          ⚠️ Admin page - keep this URL secret
        </p>
      </div>
    </div>
{/* Price Disclaimer */}
<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <p className="text-sm text-blue-800 font-medium mb-1">
    ⓘ About Reference Prices
  </p>
  <p className="text-xs text-blue-700">
    These reference prices are updated manually by the admin. 
    Metal prices fluctuate constantly during market hours. 
    The prices shown are a snapshot at the time of last update 
    and may not reflect current market conditions.
  </p>
  <p className="text-xs text-blue-600 mt-2">
    Last manual update: {currentPrices ? new Date(currentPrices.createdAt).toLocaleString() : 'Never'}
  </p>
</div>
);
}