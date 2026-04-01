"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/components/layout/NavBar';
import BidForm from '@/components/auctions/bid/BidForm';
import { useWallet } from '@/hooks/useWallet';
import { PhoenixEscrowClient } from '@/lib/contract/phoenix-escrow';
import { Clock, User, Tag, Package, Shield, Award } from 'lucide-react';

interface Auction {
  id: number;
  seller: string;
  starting_price: string;
  reserve_price: string;
  current_bid: string | null;
  current_bidder: string | null;
  end_time: number;
  status: string;
  description: string;
  metadata?: {
    item: {
      metalType: string;
      formType: string;
      weight: number;
      weightUnit: string;
      purity: string;
      certification?: {
        service?: string;
        grade?: string;
        certNumber?: string;
      } | null;
      serialNumber?: string;
    };
  };
}

export default function AuctionDetailPage() {
  const params = useParams();
  const auctionId = Number(params.id);
  const { address, isConnected, client } = useWallet();
  
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  // Fetch auction data
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        
        // TEMPORARY: Mock data until contract is live
        // TODO: Replace with real contract call after March 6
        const mockAuction: Auction = {
          id: auctionId,
          seller: 'testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen',
          starting_price: '5000',
          reserve_price: '5100',
          current_bid: auctionId === 1 ? '5050' : null,
          current_bidder: auctionId === 1 ? 'testcore14qkw9fplr9xplfl5qwz8rr8f3uxhja8yuf0z6l' : null,
          end_time: Date.now() + 86400000, // 24 hours from now
          status: 'Active',
          description: JSON.stringify({
            version: "1.0.0",
            schema: "phoenix-pme-auction-v1",
            item: {
              metalType: auctionId === 1 ? 'Gold' : auctionId === 2 ? 'Silver' : 'Platinum',
              formType: 'bar',
              weight: 1,
              weightUnit: 'troy_oz',
              purity: '0.9999',
              certification: null,
              serialNumber: auctionId === 1 ? 'GOLD-2024-001' : undefined,
            }
          })
        };

        // Parse metadata
        const metadata = JSON.parse(mockAuction.description);
        mockAuction.metadata = metadata;
        
        setAuction(mockAuction);
      } catch (err: any) {
        console.error('Failed to fetch auction:', err);
        setError(err.message || 'Could not load auction');
      } finally {
        setLoading(false);
      }
    };

    if (auctionId) {
      fetchAuction();
    }
  }, [auctionId]);

  // Countdown timer
  useEffect(() => {
    if (!auction) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = auction.end_time - now;

      if (diff <= 0) {
        setTimeLeft('Ended');
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading auction details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Auction Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'This auction may have ended or been removed.'}</p>
          <Link
            href="/auctions"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Browse Auctions
          </Link>
        </div>
      </div>
    );
  }

  const metadata = auction.metadata?.item;
  const currentBid = auction.current_bid 
    ? (parseInt(auction.current_bid) / 1_000_000).toFixed(2)
    : null;
  const startingPrice = (parseInt(auction.starting_price) / 1_000_000).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/auctions"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back to auctions
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left column - Item details */}
          <div className="md:col-span-2 space-y-6">
            {/* Title and status */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {metadata?.metalType} {metadata?.formType}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Seller: {auction.seller.slice(0, 10)}...{auction.seller.slice(-6)}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  auction.status === 'Active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {auction.status}
                </span>
              </div>

              {/* Countdown timer */}
              {auction.status === 'Active' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-amber-700">Time remaining</p>
                    <p className="text-xl font-bold text-amber-800">{timeLeft}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Item specifications */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Metal Type</p>
                    <p className="font-medium">{metadata?.metalType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Form</p>
                    <p className="font-medium capitalize">{metadata?.formType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{metadata?.weight} {metadata?.weightUnit}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Purity</p>
                    <p className="font-medium">{metadata?.purity ? (parseFloat(metadata.purity) * 100).toFixed(1) : 'N/A'}%</p>
                  </div>
                  {metadata?.serialNumber && (
                    <div>
                      <p className="text-sm text-gray-500">Serial Number</p>
                      <p className="font-medium">{metadata.serialNumber}</p>
                    </div>
                  )}
                  {metadata?.certification && (
                    <div>
                      <p className="text-sm text-gray-500">Certification</p>
                      <p className="font-medium">{metadata.certification.service} {metadata.certification.grade}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {auction.description && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700">{auction.description}</p>
              </div>
            )}
          </div>

          {/* Right column - Bidding */}
          <div className="space-y-6">
            {/* Current bid */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Auction Details</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Starting price:</span>
                  <span className="font-medium">{startingPrice} CORE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reserve price:</span>
                  <span className="font-medium">{(parseInt(auction.reserve_price) / 1_000_000).toFixed(2)} CORE</span>
                </div>
                {currentBid ? (
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-semibold">Current bid:</span>
                      <span className="text-2xl font-bold text-amber-600">{currentBid} CORE</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      by {auction.current_bidder?.slice(0, 8)}...
                    </p>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <p className="text-gray-500 italic">No bids yet</p>
                  </div>
                )}
              </div>

              {/* Bid form */}
              {auction.status === 'Active' && (
                <BidForm
                  auctionId={auction.id}
                  currentBid={currentBid || undefined}
                  startingPrice={startingPrice}
                />
              )}

              {auction.status !== 'Active' && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">This auction has ended</p>
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Trust & Safety</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>10% buyer collateral protects seller</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Reputation tracked with TRUST tokens</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span>1.1% fee to Community Reserve Fund</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}