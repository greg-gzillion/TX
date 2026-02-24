'use client';

import { useState, useEffect } from 'react';

const API_URL = 'https://phoenix-api-756y.onrender.com';

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
  const [message, setMessage] = useState({ text: '', type: '' });
  const [fetchError, setFetchError] = useState(false);

  // Load current prices on page load
  useEffect(() => {
    fetchCurrentPrices();
  }, []);

  const fetchCurrentPrices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/prices/latest`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        setCurrentPrices(data.data);
        setFetchError(false);
      }
    } catch (err) {
      console.error('Error fetching prices:', err);
      setFetchError(true);
      setMessage({ 
        text: '❌ Cannot connect to backend. Please check CORS configuration.', 
        type: 'error' 
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    // Validate all fields are filled
    if (!formPrices.gold || !formPrices.silver || !formPrices.platinum || !formPrices.palladium) {
      setMessage({ text: '❌ Please fill in all price fields', type: 'error' });
      setLoading(false);
      return;
    }

    if (!password) {
      setMessage({ text: '❌ Please enter admin password', type: 'error' });
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/admin/prices`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({ 
          password: password,
          gold: parseFloat(formPrices.gold),
          silver: parseFloat(formPrices.silver),
          platinum: parseFloat(formPrices.platinum),
          palladium: parseFloat(formPrices.palladium)
        })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        setMessage({ text: '✅ Prices updated successfully!', type: 'success' });
        setFormPrices({ gold: '', silver: '', platinum: '', palladium: '' });
        // Refresh current prices
        await fetchCurrentPrices();
      } else {
        setMessage({ text: '❌ Failed: ' + (data.error || 'Unknown error'), type: 'error' });
      }
    } catch (err) {
      console.error('Error updating prices:', err);
      setMessage({ 
        text: '❌ Error updating prices. Check CORS configuration.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin: Update Prices</h1>
        
        {/* CORS Warning - Show only if fetch error */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">⚠️ CORS Configuration Issue</p>
            <p className="text-sm text-red-700 mt-1">
              Unable to connect to backend. This is likely a CORS issue. 
              Make sure your backend allows requests from this domain.
            </p>
          </div>
        )}
        
        {/* Current Prices */}
        {currentPrices && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Current Prices</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded">🥇 Gold: <span className="font-bold">${currentPrices.gold}</span></div>
              <div className="p-3 bg-gray-50 rounded">🥈 Silver: <span className="font-bold">${currentPrices.silver}</span></div>
              <div className="p-3 bg-gray-50 rounded">🔷 Platinum: <span className="font-bold">${currentPrices.platinum}</span></div>
              <div className="p-3 bg-gray-50 rounded">🔶 Palladium: <span className="font-bold">${currentPrices.palladium}</span></div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
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
                className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="5230.30"
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
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="87.83"
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
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="2145"
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
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="1717"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {loading ? 'Updating...' : 'Update Prices'}
            </button>
            
            {message.text && (
              <div className={`p-3 rounded text-center ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message.text}
              </div>
            )}
          </form>
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

        <p className="text-xs text-gray-500 mt-4 text-center">
          ⚠️ Admin page - keep this URL secret
        </p>
      </div>
    </div>
  );
}