'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MetalSelector from '@/components/shared/forms/inputs/MetalSelector';
import FormTypeSelector from '@/components/shared/forms/inputs/FormTypeSelector';
import WeightInput from '@/components/shared/forms/inputs/WeightInput';
import PuritySelector from '@/components/shared/forms/inputs/PuritySelector';
import CertificationInput from '@/components/shared/forms/inputs/CertificationInput';
import SerialNumberInput from '@/components/shared/forms/inputs/SerialNumberInput';
import ImageUploader from '@/components/shared/forms/inputs/ImageUploader';
import PriceCalculator from '@/components/shared/forms/inputs/PriceCalculator';
import { usePhoenixEscrow } from '@/lib/contract/phoenix-escrow';
import { useWallet } from '@/hooks/useWallet';

// Define the exact type that CertificationInput expects
type CertificationType = {
  isGraded: boolean;
  service?: string;
  grade?: string;
  certNumber?: string;
};

export default function CreateAuctionForm() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const { createAuction, coreToUcore } = usePhoenixEscrow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  // Handler that matches CertificationInput's onChange type
  const handleCertificationChange = (cert: CertificationType) => {
    setCertification(cert);
  };

  // Calculate collateral (10% of reserve price)
  const reservePrice = buyNowPrice || startingPrice;
  const collateralRequired = reservePrice * 0.10;
  const totalRequired = reservePrice + collateralRequired;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    if (startingPrice < 10) {
      setError("Starting price must be at least 10 CORE");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Generate unique item ID
      const timestamp = Date.now();
      const serialSuffix = serialNumber ? serialNumber.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 20) : 'nosn';
      const itemId = `${metalType.toLowerCase()}-${formType}-${timestamp}-${serialSuffix}`;

      // 2. Upload images to IPFS/Arweave (you'll need to implement this)
      // const uploadedImages = await uploadImages(images);
      
      // 3. Create rich metadata JSON
      const metadata = {
        version: "1.0.0",
        schema: "phoenix-pme-auction-v1",
        item: {
          metalType,
          formType,
          weight,
          weightUnit,
          purity: purity.toString(),
          certification: certification.isGraded ? {
            service: certification.service,
            grade: certification.grade,
            certNumber: certification.certNumber
          } : null,
          serialNumber: serialNumber || null,
          // imageUrls: uploadedImages, // Uncomment when image upload is implemented
        },
        pricing: {
          estimatedValueUSD: estimatedValue,
          spotPriceAtCreation: null, // You could capture this from PriceCalculator
        },
        created: new Date().toISOString(),
      };

      // 4. Stringify metadata for contract storage
      const description = JSON.stringify(metadata, null, 2);
      
      // 5. Convert CORE to ucore (1 CORE = 1,000,000 ucore)
      const startingPriceUcore = coreToUcore(startingPrice.toString());
      const reservePriceUcore = coreToUcore(reservePrice.toString());

      console.log("🚀 Creating auction with metadata:", metadata);
      console.log("💰 Pricing:", {
        startingPrice: `${startingPrice} CORE (${startingPriceUcore} ucore)`,
        reservePrice: `${reservePrice} CORE (${reservePriceUcore} ucore)`,
        collateral: `${collateralRequired.toFixed(2)} CORE (10%)`,
        totalLocked: `${totalRequired.toFixed(2)} CORE`
      });

      // 6. Call the contract
      const result = await createAuction(
        itemId,
        description,
        startingPriceUcore,
        reservePriceUcore,
        24 // Default duration (you could add this to form)
      );

      console.log("✅ Auction created! TX:", result.transactionHash);

      // 7. Store draft in localStorage for backup
      const auctionDraft = {
        ...metadata,
        transactionHash: result.transactionHash,
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        auctionId: null, // We'll need to query this
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(`auction_${timestamp}`, JSON.stringify(auctionDraft));

      // 8. Show success message with details
      alert(`🎉 AUCTION CREATED SUCCESSFULLY!
      
━━━━━━━━━━━━━━━━━━━━━
📦 ITEM: ${metalType} ${formType}
⚖️ WEIGHT: ${weight} ${weightUnit}
💎 PURITY: ${purity * 100}%
💰 STARTING: ${startingPrice} CORE
🎯 RESERVE: ${reservePrice} CORE
🔒 COLLATERAL: ${collateralRequired.toFixed(2)} CORE (locked)
━━━━━━━━━━━━━━━━━━━━━
🔗 TX: ${result.transactionHash.slice(0, 10)}...${result.transactionHash.slice(-6)}

Your collateral will be returned when the auction completes.`);

      // 9. Redirect to auctions page
      router.push('/auctions');
      
    } catch (err: any) {
      console.error("❌ Error creating auction:", err);
      
      // Handle specific errors
      if (err.message.includes('insufficient funds')) {
        setError(`Insufficient funds. You need at least ${totalRequired.toFixed(2)} CORE (${startingPrice} CORE bid + ${collateralRequired.toFixed(2)} CORE collateral)`);
      } else if (err.message.includes('unauthorized')) {
        setError('Wallet connection lost. Please reconnect and try again.');
      } else {
        setError(err.message || 'Failed to create auction. Please try again.');
      }
    } finally {
      setLoading(false);
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
          {/* YOUR EXISTING FORM SECTIONS - ALL PERFECTLY INTACT */}
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
                  weight={weight}
                  unit={weightUnit}
                  onWeightChange={setWeight}
                  onUnitChange={setWeightUnit}
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
                <ImageUploader 
                  images={images} 
                  onChange={setImages} 
                />
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
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buy Now Price (CORE)</label>
                <input
                  type="number"
                  value={buyNowPrice || ''}
                  onChange={(e) => setBuyNowPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  min={startingPrice + 1}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Optional instant buy"
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          {/* Collateral Info Card */}
          {startingPrice > 0 && (
            <section className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">🔒 Collateral Required (10%)</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-800">Reserve Price:</span>
                  <span className="font-mono font-medium">{reservePrice.toFixed(2)} CORE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-800">Your Collateral (10%):</span>
                  <span className="font-mono font-medium text-blue-900">{collateralRequired.toFixed(2)} CORE</span>
                </div>
                <div className="border-t border-blue-200 my-2 pt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-blue-900">Total Locked:</span>
                    <span className="font-mono">{totalRequired.toFixed(2)} CORE</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Your collateral will be returned when the auction completes successfully or if you cancel before bids.
                </p>
              </div>
            </section>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Wallet Connection Warning */}
          {!isConnected && (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                Please connect your wallet to create an auction
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ready to List</h3>
                <p className="text-gray-600">
                  {loading ? 'Creating your auction...' : 'Your item will be listed for auction'}
                </p>
              </div>
              <button
                type="submit"
                disabled={loading || !isConnected}
                className={`px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Auction...
                  </span>
                ) : (
                  'Create Auction Listing'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}