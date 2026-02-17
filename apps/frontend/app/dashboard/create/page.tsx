"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateAuctionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    metal: 'gold',
    purity: '999.9',
    weight: '1',
    weightUnit: 'troy oz',
    startingPrice: '',
    duration: '7',
    description: '',
    condition: 'New',
    certified: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send to backend
    console.log('Creating auction:', formData);
    // Redirect back to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Create New Auction</h1>
          <p className="text-gray-600 mt-2">List your precious metals for sale</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Metal Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metal Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['gold', 'silver', 'platinum', 'palladium'].map((metal) => (
                <button
                  key={metal}
                  type="button"
                  onClick={() => setFormData({...formData, metal})}
                  className={`p-4 rounded-lg border-2 transition ${
                    formData.metal === metal
                      ? metal === 'gold' ? 'border-yellow-500 bg-yellow-50' :
                        metal === 'silver' ? 'border-gray-400 bg-gray-50' :
                        metal === 'platinum' ? 'border-blue-400 bg-blue-50' :
                        'border-orange-400 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {metal === 'gold' ? '🥇' :
                     metal === 'silver' ? '🥈' :
                     metal === 'platinum' ? '🔷' : '🔶'}
                  </div>
                  <div className="font-medium capitalize">{metal}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Purity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purity
              </label>
              <select
                value={formData.purity}
                onChange={(e) => setFormData({...formData, purity: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="999.9">999.9 (24K)</option>
                <option value="999">999 (24K)</option>
                <option value="995">995 (23K)</option>
                <option value="916">916 (22K)</option>
                <option value="900">900 (21.6K)</option>
                <option value="750">750 (18K)</option>
                <option value="585">585 (14K)</option>
                <option value="417">417 (10K)</option>
                <option value="375">375 (9K)</option>
              </select>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  step="0.01"
                  min="0.01"
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={formData.weightUnit}
                  onChange={(e) => setFormData({...formData, weightUnit: e.target.value})}
                  className="w-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="troy oz">troy oz</option>
                  <option value="gram">gram</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            {/* Starting Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price (TESTUSD)
              </label>
              <input
                type="number"
                value={formData.startingPrice}
                onChange={(e) => setFormData({...formData, startingPrice: e.target.value})}
                min="1"
                step="1"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (days)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="5">5 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="New">New</option>
                <option value="Mint">Mint</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            {/* Certified */}
            <div className="flex items-center">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.certified}
                  onChange={(e) => setFormData({...formData, certified: e.target.checked})}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="text-sm text-gray-700">Certified / Graded</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your item (condition, provenance, any notable features...)"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Create Auction
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
