"use client";

// components/auctions/list/AuctionList.tsx
import { useEffect, useState } from 'react';
import { usePhoenixEscrow } from '@/lib/contract/phoenix-escrow';
import AuctionCard from './AuctionCard';

export default function AuctionList() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getActiveAuctions } = usePhoenixEscrow();

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      const data = await getActiveAuctions();
      setAuctions(data);
    } catch (error) {
      console.error('Failed to load auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading auctions...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {auctions.map(auction => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
      {auctions.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No active auctions. Be the first to create one!
        </div>
      )}
    </div>
  );
}