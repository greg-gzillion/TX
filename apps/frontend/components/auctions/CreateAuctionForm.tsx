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

type CoinDetailsType = {
  country: string;
  mint: string;
  year: string;
  mintage: string;
  isNumismatic: boolean;
  grade: string;
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
  const [images, setImages] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  
  // Coin-specific fields
  const [coinDetails, setCoinDetails] = useState<CoinDetailsType>({
    country: '',
    mint: '',
    year: '',
    mintage: '',
    isNumismatic: false,
    grade: ''
  });
  
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
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sandboxParam = params.get('sandbox');
      
      if (sandboxParam === 'true') {
        console.log('🔴 Setting sandbox mode to TRUE');
        setIsSandbox(true);
      } else {
        console.log('🔴 Setting sandbox mode to FALSE');
        setIsSandbox(false);
      }
    }
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
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadImagesToPinata(images);
        console.log(`📸 Uploaded ${imageUrls.length} images to Pinata`);
      }

      const itemId = `${metalType.toLowerCase()}-${Date.now()}`;
      
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
          ...(formType === 'coin' && { coinDetails }),
        },
        spotPrices: {
          ...spotPrices,
          timestamp: new Date().toISOString()
        },
        estimatedValue,
        created: new Date().toISOString(),
      };

      if (isSandbox) {
        console.log("🧪 SANDBOX: Creating mock auction", {
          itemId,
          metadata,
          startingPrice: `${startingPrice} TESTUSD`,
          buyNowPrice: buyNowPrice ? `${buyNowPrice} TESTUSD` : 'none',
          estimatedValue: `${estimatedValue} TESTUSD`,
          images: imageUrls.length > 0 ? `${imageUrls.length} uploaded to Pinata` : 'none'
        });
        
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

      // REAL MODE - RLUSD on TX blockchain
      const startingPriceMicro = (startingPrice * 1_000_000).toString();
      const reservePriceMicro = ((buyNowPrice || startingPrice) * 1_000_000).toString();

      const result = await createAuction(
        itemId,
        JSON.stringify(metadata),
        startingPriceMicro,
        reservePriceMicro,
        24
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
            <p className="text-xs text-purple-600 mt-2 border-t border-purple-200 pt-2">
              All prices shown in TESTUSD
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
              : "Design your listing for the TX blockchain"}
          </p>
          
          {/* Honesty Banner */}
          <div className="mt-4 bg-blue-50 border border-blue-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⏳</span>
              <span className="font-semibold text-blue-800">Testnet Coming Soon</span>
            </div>
            <p className="text-sm text-blue-700">
              The TX testnet is not yet available. The protocol will begin testing when the testnet launches.
              For now, you can preview the listing form and design your auction.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                🧪 Sandbox mode: {isSandbox ? 'Active' : 'Use ?sandbox=true to test'}
              </span>
            </div>
          </div>
          
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
                <MetalSelector 
                  value={metalType} 
                  onChange={setMetalType} 
                />
              </div>
              <div>
                <FormTypeSelector 
                  value={formType} 
                  onChange={setFormType} 
                />
              </div>
            </div>

            {/* Coin-specific fields */}
            {formType === 'coin' && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">🪙</span>
                  Coin Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Country of Origin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country of Origin
                    </label>
                    <select
                      value={coinDetails.country}
                      onChange={(e) => setCoinDetails({...coinDetails, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select country...</option>
                      <option value="USA">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Mexico">Mexico</option>
                      <option value="China">China</option>
                      <option value="Australia">Australia</option>
                      <option value="Austria">Austria</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Mint */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mint
                    </label>
                    <select
                      value={coinDetails.mint}
                      onChange={(e) => setCoinDetails({...coinDetails, mint: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select mint...</option>
                      <option value="US Mint">US Mint</option>
                      <option value="Philadelphia">Philadelphia</option>
                      <option value="Denver">Denver</option>
                      <option value="San Francisco">San Francisco</option>
                      <option value="West Point">West Point</option>
                      <option value="Royal Canadian Mint">Royal Canadian Mint</option>
                      <option value="Royal Mint">Royal Mint (UK)</option>
                      <option value="Perth Mint">Perth Mint</option>
                      <option value="Mexico Mint">Mexico Mint</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      value={coinDetails.year}
                      onChange={(e) => setCoinDetails({...coinDetails, year: e.target.value})}
                      placeholder="e.g., 2024, 1986"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Mintage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mintage <span className="text-xs text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={coinDetails.mintage}
                      onChange={(e) => setCoinDetails({...coinDetails, mintage: e.target.value})}
                      placeholder="e.g., 1,000,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Numismatic checkbox */}
                <div className="mt-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={coinDetails.isNumismatic}
                      onChange={(e) => setCoinDetails({...coinDetails, isNumismatic: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      This is a numismatic / collectible coin
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Numismatic coins have value beyond their metal content (rarity, condition, historical significance)
                  </p>
                </div>

                {/* Grade (if numismatic) */}
                {coinDetails.isNumismatic && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade / Condition
                    </label>
                    <select
                      value={coinDetails.grade}
                      onChange={(e) => setCoinDetails({...coinDetails, grade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select grade...</option>
                      <option value="MS70">MS70 (Perfect)</option>
                      <option value="MS69">MS69 (Near Perfect)</option>
                      <option value="MS68">MS68</option>
                      <option value="MS67">MS67</option>
                      <option value="MS66">MS66</option>
                      <option value="MS65">MS65</option>
                      <option value="MS64">MS64</option>
                      <option value="MS63">MS63</option>
                      <option value="MS62">MS62</option>
                      <option value="MS61">MS61</option>
                      <option value="MS60">MS60</option>
                      <option value="AU">AU (About Uncirculated)</option>
                      <option value="XF">XF (Extremely Fine)</option>
                      <option value="VF">VF (Very Fine)</option>
                      <option value="F">F (Fine)</option>
                      <option value="VG">VG (Very Good)</option>
                      <option value="G">G (Good)</option>
                    </select>
                  </div>
                )}

                {/* Helper text */}
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  <p>💡 Examples of numismatic coins:</p>
                  <ul className="list-disc ml-4 mt-1">
                    <li>1909-S VDB Lincoln Cent (rare date)</li>
                    <li>1933 Saint-Gaudens Double Eagle (ultra rare)</li>
                    <li>1995-W American Silver Eagle (proof)</li>
                    <li>High-grade MS70 modern coins</li>
                  </ul>
                </div>
              </div>
            )}
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
              
              {/* Image Uploader */}
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

          {/* Step 5: Pricing */}
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
            
            {/* Status Banner */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <span className="text-lg">ℹ️</span>
                <span>
                  <strong>TX testnet not yet available.</strong> 
                  Use <code className="bg-blue-100 px-1">?sandbox=true</code> for sandbox testing.
                </span>
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price ({isSandbox ? 'TESTUSD' : 'RLUSD'})
                  {!isSandbox && <span className="ml-2 text-xs text-blue-500">(Testnet TBD)</span>}
                </label>
                <input
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(parseFloat(e.target.value) || 0)}
                  min={isSandbox ? "1" : "10"}
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-md ${
                    !isSandbox ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                  placeholder={isSandbox ? "Min 1 TESTUSD" : "Min 10 RLUSD (Coming Soon)"}
                  disabled={!isSandbox}
                  required={isSandbox}
                />
                {!isSandbox && (
                  <p className="text-xs text-blue-500 mt-1">
                    ⏳ RLUSD auctions will be enabled when testnet launches
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buy Now Price ({isSandbox ? 'TESTUSD' : 'RLUSD'}) (Optional)
                  {!isSandbox && <span className="ml-2 text-xs text-blue-500">(Testnet TBD)</span>}
                </label>
                <input
                  type="number"
                  value={buyNowPrice || ''}
                  onChange={(e) => setBuyNowPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  min={startingPrice + (isSandbox ? 1 : 10)}
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-md ${
                    !isSandbox ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                  placeholder="Optional instant buy"
                  disabled={!isSandbox}
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
                  ${estimatedValue.toFixed(2)} {isSandbox ? 'TESTUSD' : 'RLUSD'}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-2">
                Based on calculator with current spot price
              </p>
            </div>
          )}

          {/* Estimated Fees Display */}
          {estimatedValue > 0 && !isSandbox && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">💰 Estimated Fees</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Your asking price:</span>
                  <span className="font-medium">${estimatedValue.toFixed(2)} RLUSD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform fee (1.1%):</span>
                  <span className="font-medium text-amber-600">-${(estimatedValue * 0.011).toFixed(2)} RLUSD</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>You receive:</span>
                    <span className="text-green-600">${(estimatedValue * 0.989).toFixed(2)} RLUSD</span>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  <span className="font-medium">🔒 Collateral:</span> 10% (${(estimatedValue * 0.1).toFixed(2)} RLUSD) locked, returned after successful sale
                </div>
              </div>
            </div>
          )}

          {/* Sandbox mode fee note */}
          {estimatedValue > 0 && isSandbox && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-700">
              🧪 Sandbox mode - no real fees apply
            </div>
          )}

          {/* Submit Button */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Ready to List</h3>
                <p className="text-sm text-gray-600">
                  {isSandbox 
                    ? 'Test listing - no real funds' 
                    : 'Testnet coming soon. Use sandbox mode for testing.'}
                </p>
              </div>
              {!isSandbox ? (
                <div className="px-8 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed">
                  Testnet Pending
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Test Auction'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}