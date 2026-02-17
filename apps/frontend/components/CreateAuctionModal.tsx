"use client";

import { useState } from 'react';

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateAuctionModal({ isOpen, onClose }: CreateAuctionModalProps) {
  const [step, setStep] = useState(1);
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating auction:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create New Auction</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">
              ✕
            </button>
          </div>
          <p className="text-indigo-100 mt-1">List your precious metals for sale</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Metal Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Metal
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'gold', name: 'Gold', icon: '🥇', color: 'yellow' },
                { id: 'silver', name: 'Silver', icon: '🥈', color: 'gray' },
                { id: 'platinum', name: 'Platinum', icon: '🔷', color: 'blue' },
                { id: 'palladium', name: 'Palladium', icon: '🔶', color: 'orange' }
              ].map((metal) => (
                <button
                  key={metal.id}
                  type="button"
                  onClick={() => setFormData({...formData, metal: metal.id})}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.metal === metal.id
                      ? metal.color === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
                        metal.color === 'gray' ? 'border-gray-400 bg-gray-50' :
                        metal.color === 'blue' ? 'border-blue-400 bg-blue-50' :
                        'border-orange-400 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{metal.icon}</div>
                  <div className="font-medium capitalize">{metal.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purity
              </label>
              <select
                value={formData.purity}
                onChange={(e) => setFormData({...formData, purity: e.target.value})}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="999.9">999.9 (24K)</option>
                <option value="999">999 (24K)</option>
                <option value="995">995 (23K)</option>
                <option value="916">916 (22K)</option>
                <option value="750">750 (18K)</option>
              </select>
            </div>

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
                  className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={formData.weightUnit}
                  onChange={(e) => setFormData({...formData, weightUnit: e.target.value})}
                  className="w-24 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="troy oz">t oz</option>
                  <option value="gram">g</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price (TESTUSD)
              </label>
              <input
                type="number"
                value={formData.startingPrice}
                onChange={(e) => setFormData({...formData, startingPrice: e.target.value})}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="5">5 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your item's condition, provenance, etc..."
            />
          </div>

          {/* Options */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.certified}
                onChange={(e) => setFormData({...formData, certified: e.target.checked})}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <span className="text-sm text-gray-700">Certified / Graded</span>
            </label>

            <select
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
              className="p-2 border rounded-lg text-sm"
            >
              <option value="New">New</option>
              <option value="Mint">Mint</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Create Auction
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
