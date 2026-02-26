'use client';

import { useState, useEffect } from 'react';
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

const API_URL = 'https://phoenix-api-756y.onrender.com';
const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

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
  const [isSandbox, setIsSandbox] = useState(false);
  const [spotPrices, setSpotPrices] = useState({
    gold: 5183.70,
    silver: 87.38,
    platinum: 2254.00,
    palladium: 1754.00
  });
  const [lastUpdated, setLastUpdated] = useState('');
  
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
  const [images, setImages] = useState<any[]>([]);  // ImageUploader uses this format
  const [videoUrl, setVideoUrl] = useState<string>('');
  
  // Pricing
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [startingPrice, setStartingPrice] = useState<number>(0);
  const [buyNowPrice, setBuyNowPrice] = useState<number | undefined>(undefined);

  // Fetch real spot prices from API
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/prices`);
        const data = await response.json();
        if (data.success && data.data) {
          setSpotPrices({
            gold: data.data.gold,
            silver: data.data.silver,
            platinum: data.data.platinum,
            palladium: data.data.palladium
          });
          setLastUpdated(new Date(data.data.createdAt).toLocaleString());
        }
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      }
    };
    fetchPrices();
  }, []);

  // Check if we're in sandbox mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsSandbox(urlParams.get('sandbox') === 'true');
  }, []);

  // Handle image change from ImageUploader
  const handleImageChange = (newImages: any[]) => {
    setImages(newImages);
  };

  // Upload images to Pinata
  const uploadImagesToPinata = async (imageArray: any[]): Promise<string[]> => {
    const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    if (!pinataJwt) {
      console.warn('Pinata JWT not configured');
      return [];
    }

    const uploadPromises = imageArray.map(async (img) => {
      // Convert base64 to blob
      const response = await fetch(img.src);
      const blob = await response.blob();
      const file = new File([blob], img.name, { type: img.type });

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(PINATA_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${pinataJwt}`,
          },
          body: formData,
        });
        
        const data = await response.json();
        return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
      } catch (error) {
        console.error('Error uploading to Pinata:', error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.filter(url => url !== null) as string[];
  };

  const handleCertificationChange = (cert: CertificationType) => {
    setCertification(cert);
  };

  // Get current spot price based on metal type
  const getCurrentSpotPrice = () => {
    switch(metalType) {
      case 'Gold': return spotPrices.gold;
      case 'Silver': return spotPrices.silver;
      case 'Platinum': return spotPrices.platinum;
      case 'Palladium': return spotPrices.palladium;
      default: return 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images to Pinata first (if any)
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadImagesToPinata(images);
        console.log(`📸 Uploaded ${imageUrls.length} images to Pinata`);
      }

      // Generate item ID
      const itemId = `${metalType.toLowerCase()}-${Date.now()}`;
      
      // Create metadata with IPFS image URLs
      const metadata = {
        version: "1.0.0",
        schema: "phoenix-pme-auction-v1",
        environment: isSandbox ? "sandbox" : "testnet",
        item: {
          metalType,
          formType,
          weight,
          weightUnit,
          purity: purity.toString(),
          certification: certification.isGraded ? certification : null,
          serialNumber: serialNumber || null,
          images: imageUrls,
          videoUrl: videoUrl || null,
        },
        spotPrices: {
          ...spotPrices,
          timestamp: new Date().toISOString()
        },
        estimatedValue,
        created: new Date().toISOString(),
      };

      if (isSandbox) {
        // SANDBOX MODE - Store in localStorage
        console.log("🧪 SANDBOX: Creating mock auction", {
          itemId,
          metadata,
          startingPrice: `${startingPrice} TESTUSD`,
          buyNowPrice: buyNowPrice ? `${buyNowPrice} TESTUSD` : 'none',
          estimatedValue: `${estimatedValue} TESTUSD`,
          images: imageUrls.length > 0 ? `${imageUrls.length} uploaded to Pinata` : 'none'
        });
        
        // Store in localStorage for sandbox
        const mockAuctions = JSON.parse(localStorage.getItem('mockAuctions') || '[]');
        mockAuctions.push({
          id: Date.now(),
          itemId,
          metadata,
          startingPrice,
          buyNowPrice,
          seller: address,
          createdAt: new Date().toISOString(),
          isSandbox: true,
          imageUrls
        });
        localStorage.setItem('mockAuctions', JSON.stringify(mockAuctions));
        
        alert(`🧪 SANDBOX: Test auction created!\n\nItem: ${metalType} ${formType}\nPrice: ${startingPrice} TESTUSD\nImages: ${imageUrls.length} uploaded to IPFS`);
        
        router.push('/sandbox?tab=auctions');
        return;
      }

      // REAL MODE - Call contract with Pinata URLs in metadata
      const startingPriceUcore = (startingPrice * 1_000_000).toString();
      const reservePriceUcore = ((buyNowPrice || startingPrice) * 1_000_000).toString();

      const result = await createAuction(
        itemId,
        JSON.stringify(metadata),
        startingPriceUcore,
        reservePriceUcore,
        24 // duration hours
      );

      console.log("✅ Auction created:", result);
      alert(`🎉 Auction created!\n\nTX: ${result.transactionHash}\nImages: ${imageUrls.length} uploaded to IPFS`);
      router.push('/auctions');
      
    } catch (error: any) {
      console.error("❌ Error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Sandbox Banner */}
      {isSandbox && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4">
            <p className="text-purple-800 flex items-center">
              <span className="text-2xl mr-3">🧪</span>
              <span className="font-semibold">SANDBOX MODE:</span>
              <span className="ml-2">Creating a TEST auction - no real funds will be used</span>
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Precious Metals Auction</h1>
          <p className="text-gray-600 mt-2">
            {isSandbox 
              ? "🧪 Test listing - no real value" 
              : "List your gold, silver, platinum, or palladium for sale"}
          </p>
          
          {/* Price Banner */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-blue-900">Current Market Prices:</span>
              {lastUpdated && (
                <span className="text-xs text-blue-600">Updated: {lastUpdated}</span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="text-xs text-amber-600 block">GOLD</span>
                <span className="text-lg font-bold">${spotPrices.gold.toFixed(2)}</span>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="text-xs text-gray-600 block">SILVER</span>
                <span className="text-lg font-bold">${spotPrices.silver.toFixed(2)}</span>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="text-xs text-slate-600 block">PLATINUM</span>
                <span className="text-lg font-bold">${spotPrices.platinum.toFixed(2)}</span>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="text-xs text-zinc-600 block">PALLADIUM</span>
                <span className="text-lg font-bold">${spotPrices.palladium.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ⚡ Prices loaded from database. Refresh page to update.
            </p>
          </div>
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
                <PuritySelector 
                  metalType={metalType} 
                  value={purity} 
                  onChange={setPurity} 
                />
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
              
              {/* Image Uploader - FIXED: removed previews prop */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Photos
                </label>
                <ImageUploader 
                  images={images}
                  onChange={handleImageChange}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Max 5 images, 2MB each. First image is the primary thumbnail.
                  {process.env.NEXT_PUBLIC_PINATA_JWT ? ' 📤 Uploading to IPFS via Pinata' : ' ⚠️ Pinata not configured'}
                </p>
              </div>

              {/* Video Option */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Add a YouTube or Vimeo link for a video demonstration
                </p>
              </div>
            </div>
          </section>

          {/* Step 5: Pricing - with real spot price */}
          <section className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Set Your Price</h2>
            <PriceCalculator
              metalType={metalType}
              weight={weight}
              weightUnit={weightUnit}
              purity={purity}
              spotPrice={getCurrentSpotPrice()}
              onPriceUpdate={setEstimatedValue}
            />
          </section>

          {/* Step 6: Auction Settings */}
          <section className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Auction Settings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price ({isSandbox ? 'TESTUSD' : 'CORE'})
                </label>
                <input
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(parseFloat(e.target.value) || 0)}
                  min={isSandbox ? "1" : "10"}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={isSandbox ? "Min 1 TESTUSD" : "Min 10 CORE"}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buy Now Price ({isSandbox ? 'TESTUSD' : 'CORE'}) (Optional)
                </label>
                <input
                  type="number"
                  value={buyNowPrice || ''}
                  onChange={(e) => setBuyNowPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  min={startingPrice + (isSandbox ? 1 : 10)}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Optional instant buy"
                />
              </div>
            </div>
          </section>

          {/* Estimated Value Display */}
          {estimatedValue > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800">Estimated Value:</span>
                <span className="text-xl font-bold text-green-700">
                  ${estimatedValue.toFixed(2)} {isSandbox ? 'TESTUSD' : 'CORE'}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-2">
                Based on calculator with current spot price
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Ready to List</h3>
                <p className="text-sm text-gray-600">
                  {isSandbox ? 'Test listing - no real funds' : 'Your item will be listed for auction'}
                </p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating...' : isSandbox ? 'Create Test Auction' : 'Create Auction'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}