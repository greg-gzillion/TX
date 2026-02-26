'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePhoenixEscrow } from '@/lib/contract/phoenix-escrow';
import { useWallet } from '@/hooks/useWallet';

const API_URL = 'https://phoenix-api-756y.onrender.com';
const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

export type CertificationType = {
  isGraded: boolean;
  service?: string;
  grade?: string;
  certNumber?: string;
};

export type CoinDetailsType = {
  country: string;
  mint: string;
  year: string;
  mintage: string;
  isNumismatic: boolean;
  grade: string;
};

export function useAuctionForm() {
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
  
  // Coin-specific
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
      setIsSandbox(sandboxParam === 'true');
    }
  }, []);

  // Upload images to Pinata
  const uploadImagesToPinata = async (imageArray: any[]): Promise<string[]> => {
    const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    if (!pinataJwt) return [];

    const uploadPromises = imageArray.map(async (img) => {
      const response = await fetch(img.src);
      const blob = await response.blob();
      const file = new File([blob], img.name, { type: img.type });

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(PINATA_API_URL, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${pinataJwt}` },
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
        spotPrices: { ...spotPrices, timestamp: new Date().toISOString() },
        estimatedValue,
        created: new Date().toISOString(),
      };

      if (isSandbox) {
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
        
        alert(`🧪 SANDBOX: Test auction created!`);
        router.push('/sandbox?tab=auctions');
        return;
      }

      const startingPriceMicro = (startingPrice * 1_000_000).toString();
      const reservePriceMicro = ((buyNowPrice || startingPrice) * 1_000_000).toString();

      const result = await createAuction(
        itemId,
        JSON.stringify(metadata),
        startingPriceMicro,
        reservePriceMicro,
        24
      );

      alert(`🎉 Auction created!`);
      router.push('/auctions');
      
    } catch (error: any) {
      console.error("❌ Error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState: {
      metalType, formType, weight, weightUnit, purity,
      certification, serialNumber, images, videoUrl,
      coinDetails, startingPrice, buyNowPrice
    },
    setters: {
      setMetalType, setFormType, setWeight, setWeightUnit, setPurity,
      setCertification, setSerialNumber, setImages, setVideoUrl,
      setCoinDetails, setStartingPrice, setBuyNowPrice, setEstimatedValue
    },
    isSandbox,
    isSubmitting,
    spotPrices,
    lastUpdated,
    estimatedValue,
    getCurrentSpotPrice,
    handleSubmit
  };
}
