"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AuctionListProps {
  metal?: string;
  sortBy?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function AuctionList({ metal = 'all', sortBy = 'latest' }: AuctionListProps) {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuctions();
  }, [metal, sortBy]); // Re-fetch when filters change

  const loadAuctions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auctions`);
      const data = await response.json();
      
      // Handle both response formats
      const auctionList = data.data?.auctions || data.auctions || [];
      
      // Apply filters
      let filteredAuctions = [...auctionList];
      
      // Filter by metal
      if (metal !== 'all') {
        filteredAuctions = filteredAuctions.filter(a => 
          a.metal?.toLowerCase() === metal.toLowerCase() ||
          a.description?.toLowerCase().includes(metal.toLowerCase())
        );
      }
      
      // Apply sorting
      switch(sortBy) {
        case 'price-low':
          filteredAuctions.sort((a, b) => (a.currentBid || 0) - (b.currentBid || 0));
          break;
        case 'price-high':
          filteredAuctions.sort((a, b) => (b.currentBid || 0) - (a.currentBid || 0));
          break;
        case 'ending':
          filteredAuctions.sort((a, b) => new Date(a.endsAt || 0).getTime() - new Date(b.endsAt || 0).getTime());
          break;
        case 'popular':
          filteredAuctions.sort((a, b) => (b.bidCount || 0) - (a.bidCount || 0));
          break;
        default: // 'latest'
          filteredAuctions.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }
      
      setAuctions(filteredAuctions);
    } catch (error) {
      console.error("Error loading auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading auctions...</div>;
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No auctions yet. Be the first to create one!</p>
        <Link href="/dashboard/create" className="mt-4 inline-block text-blue-600 hover:underline">
          Create Auction →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction) => (
        <Link key={auction.id} href={`/auctions/${auction.id}`}>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
            {/* Metal Icon */}
            <div className="text-3xl mb-3">
              {auction.metal === 'gold' ? '🥇' :
               auction.metal === 'silver' ? '🥈' :
               auction.metal === 'platinum' ? '🔷' :
               auction.metal === 'palladium' ? '🔶' : '💎'}
            </div>
            
            <h3 className="text-xl font-semibold mb-2 line-clamp-2">
              {auction.item_description || auction.title || 'Untitled Auction'}
            </h3>
            
            <p className="text-gray-600 mb-2">
              Current: {auction.current_bid?.amount || auction.currentBid || auction.startingPrice || 0} TEST
            </p>
            
            <div className="flex justify-between items-center mb-2">
              <span className={`px-2 py-1 rounded text-xs ${
                (auction.status === 'Active' || auction.status === 'active') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100'
              }`}>
                {auction.status || 'Active'}
              </span>
              <span className="text-xs text-gray-500">
                {auction.bidCount || 0} bids
              </span>
            </div>
            
            <p className="text-sm text-gray-500">
              Ends: {new Date(auction.endsAt || auction.end_time || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}