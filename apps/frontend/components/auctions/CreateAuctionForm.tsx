'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePhoenixEscrow } from '@/lib/contract/phoenix-escrow';
import { useWallet } from '@/hooks/useWallet';
import MetalSelector from '@/components/shared/forms/inputs/MetalSelector';
import FormTypeSelector from '@/components/shared/forms/inputs/FormTypeSelector';
import WeightInput from '@/components/shared/forms/inputs/WeightInput';
import PuritySelector from '@/components/shared/forms/inputs/PuritySelector';
import CertificationInput from '@/components/shared/forms/inputs/CertificationInput';
import SerialNumberInput from '@/components/shared/forms/inputs/SerialNumberInput';
import ImageUploader from '@/components/shared/forms/inputs/ImageUploader';
import PriceCalculator from '@/components/shared/forms/inputs/PriceCalculator';

type CertificationType = {
  isGraded: boolean;
  service?: string;
  grade?: string;
  certNumber?: string;
};

export default function CreateAuctionForm() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const { createAuction } = usePhoenixEscrow();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Basic Info
  const [metalType, setMetalType] = useState<'Gold' | 'Silver' | 'Platinum' | 'Palladium' | 'Other'>('Gold');
  const [formType, setFormType] = useState<'coin' | 'round' | 'bar' | 'jewelry' | 'other'>('coin');
  
  // Weight & Purity
  const [weight, setWeight] = useState<number>(1);
  const [weightUnit, setWeightUnit] = useState<'troy_oz' | 'grams' | 'ounces'>('troy_oz');
  const [purity, setPurity] = useState<number>(0.999);
  
  // Certification
  const [certification, setCertification] = useState<CertificationType>({
    isGraded: false,
    service: undefined,
    grade: undefined,
    certNumber: undefined,
  });
  
  // Details
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [images, setImages] = useState<any[]>([]);
  
  // Pricing
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [startingPrice, setStartingPrice] = useState<number>(0);
  const [buyNowPrice, setBuyNowPrice] = useState<number | undefined>(undefined);

  const handleCertificationChange = (cert: CertificationType) => {
    setCertification(cert);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate item ID
      const itemId = `${metalType.toLowerCase()}-${Date.now()}`;
      
      // Create metadata
      const metadata = {
        version: "1.0.0",
        schema: "phoenix-pme-auction-v1",
        item: {
          metalType,
          formType,
          weight,
          weightUnit,
          purity: purity.toString(),
          certification: certification.isGraded ? certification : null,
          serialNumber: serialNumber || null,
        },
        created: new Date().toISOString(),
      };

      // Calculate prices in ucore (1 CORE = 1,000,000 ucore)
      const startingPriceUcore = (startingPrice * 1_000_000).toString();
      const reservePriceUcore = ((buyNowPrice || startingPrice) * 1_000_000).toString();

      // Call contract
      const result = await createAuction(
        itemId,
        JSON.stringify(metadata),
        startingPriceUcore,
        reservePriceUcore,
        24 // duration hours
      );

      console.log("Auction created:", result);
      alert(`✅ Auction created! TX: ${result.transactionHash}`);
      router.push('/auctions');
      
    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Precious Metals Auction</h1>
          <p className="text-gray-600 mt-2">List your gold, silver, platinum, or palladium for sale</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Info */}
          <section className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">1. Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Metal Type</label>
                <MetalSelector value={metalType} onChange={setMetalType} />
              </div>
              <div>
                <FormTypeSelector value={formType} onChange={setFormType} />
              </div>
            </div>
          </section>

          {/* Step 2: Weight & Purity */}
          <section className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">2. Weight & Purity</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <WeightInput
                  value={weight}
                  unit={weightUnit}
                  onChange={(newValue, newUnit) => {
                    setWeight(newValue);
                    setWeightUnit(newUnit);
                  }}
                />
              </div>
              <div>
                <PuritySelector metalType={metalType} value={purity} onChange={setPurity} />
              </div>
            </div>
          </section>

          {/* Step 3: Certification */}
          <section className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">3. Certification & Grading</h2>
            <CertificationInput
              value={certification}
              onChange={handleCertificationChange}
            />
          </section>

          {/* Step 4: Details & Photos */}
          <section className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">4. Details & Photos</h2>
            <div className="space-y-6">
              <div>
                <SerialNumberInput value={serialNumber} onChange={setSerialNumber} />
              </div>
              <div>
                <ImageUploader images={images} onChange={setImages} />
              </div>
            </div>
          </section>

          {/* Step 5: Pricing */}
          <section className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Set Your Price</h2>
            <PriceCalculator
              metalType={metalType}
              weight={weight}
              weightUnit={weightUnit}
              purity={purity}
              onPriceUpdate={setEstimatedValue}
            />
          </section>

          {/* Step 6: Auction Settings */}
          <section className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Auction Settings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Starting Price (CORE)</label>
                <input
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(parseFloat(e.target.value) || 0)}
                  min="10"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Minimum 10 CORE"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buy Now Price (Optional)</label>
                <input
                  type="number"
                  value={buyNowPrice || ''}
                  onChange={(e) => setBuyNowPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  min={startingPrice + 1}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Optional instant buy"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ready to List</h3>
                <p className="text-gray-600">Your item will be listed for auction</p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Auction Listing'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}