'use client';

import { useState } from 'react';
import MetalSelector from '@/components/shared/forms/inputs/MetalSelector';
import FormTypeSelector from '@/components/shared/forms/inputs/FormTypeSelector';
import WeightInput from '@/components/shared/forms/inputs/WeightInput';
import PuritySelector from '@/components/shared/forms/inputs/PuritySelector';
import { MetalType } from '@/lib/types/metals';

interface Props {
  selectedWallet: any;
  onCreateAuction: (auctionData: any) => void;
  onClose: () => void;
}

export default function SandboxCreateModal({ selectedWallet, onCreateAuction, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    metalType: 'Gold' as MetalType,
    formType: 'coin' as 'coin' | 'round' | 'bar' | 'jewelry' | 'other',
    weight: 1,
    weightUnit: 'troy_oz' as 'troy_oz' | 'grams' | 'ounces',
    purity: 0.999,
    startingPrice: 100,
    buyNowPrice: undefined as number | undefined,
    title: '',
    description: '',
    images: [] as string[],
    coinDetails: {
      country: '',
      mint: '',
      year: '',
      mintage: '',
      isNumismatic: false,
      grade: ''
    }
  });

  const metalIcons = {
    Gold: '🥇',
    Silver: '🥈',
    Platinum: '🔷',
    Palladium: '🔶',
    Copper: '🟤',
    Other: '💎'
  };

  const handleSubmit = () => {
    const defaultTitle = `${metalIcons[formData.metalType]} ${formData.weight} ${formData.metalType} ${formData.formType}`;
    onCreateAuction({
      ...formData,
      title: formData.title || defaultTitle
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Sandbox Auction</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metal Type</label>
              <MetalSelector
                value={formData.metalType}
                onChange={(value) => setFormData({ ...formData, metalType: value })}
              />
            </div>

            <div>
              <FormTypeSelector
                value={formData.formType}
                onChange={(value) => setFormData({ ...formData, formType: value })}
              />
            </div>

            {formData.formType === 'coin' && (
              <div className="p-4 bg-amber-50 rounded-lg">
                <h3 className="font-medium text-amber-800 mb-3">Coin Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Country"
                    value={formData.coinDetails.country}
                    onChange={(e) => setFormData({
                      ...formData,
                      coinDetails: { ...formData.coinDetails, country: e.target.value }
                    })}
                    className="px-3 py-2 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Mint"
                    value={formData.coinDetails.mint}
                    onChange={(e) => setFormData({
                      ...formData,
                      coinDetails: { ...formData.coinDetails, mint: e.target.value }
                    })}
                    className="px-3 py-2 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={formData.coinDetails.year}
                    onChange={(e) => setFormData({
                      ...formData,
                      coinDetails: { ...formData.coinDetails, year: e.target.value }
                    })}
                    className="px-3 py-2 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Mintage"
                    value={formData.coinDetails.mintage}
                    onChange={(e) => setFormData({
                      ...formData,
                      coinDetails: { ...formData.coinDetails, mintage: e.target.value }
                    })}
                    className="px-3 py-2 border rounded-md"
                  />
                </div>
                <label className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    checked={formData.coinDetails.isNumismatic}
                    onChange={(e) => setFormData({
                      ...formData,
                      coinDetails: { ...formData.coinDetails, isNumismatic: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Numismatic / Collectible</span>
                </label>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <WeightInput
              value={formData.weight}
              unit={formData.weightUnit}
              onChange={(value, unit) => setFormData({ ...formData, weight: value, weightUnit: unit })}
              metalType={formData.metalType}
            />

            <PuritySelector
              metalType={formData.metalType}
              value={formData.purity}
              onChange={(value) => setFormData({ ...formData, purity: value })}
              formType={formData.formType}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setStep(1)} className="px-4 py-2 border rounded-lg">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auction Title (optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={`${metalIcons[formData.metalType]} ${formData.weight} ${formData.metalType} ${formData.formType}`}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price (TESTUSD)
              </label>
              <input
                type="number"
                value={formData.startingPrice}
                onChange={(e) => setFormData({ ...formData, startingPrice: parseFloat(e.target.value) || 0 })}
                min="1"
                step="0.01"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buy Now Price (optional)
              </label>
              <input
                type="number"
                value={formData.buyNowPrice || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  buyNowPrice: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                min={formData.startingPrice + 1}
                step="0.01"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Describe your item..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setStep(2)} className="px-4 py-2 border rounded-lg">
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
              >
                Create Sandbox Auction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
