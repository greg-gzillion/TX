"use client";

// components/auctions/list/AuctionList.tsx
import { useEffect, useState } from "react";
import { usePhoenixEscrow, Auction } from "@/lib/contract/phoenix-escrow";
import AuctionCard from "./AuctionCard";

export default function AuctionList() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const { getActiveAuctions } = usePhoenixEscrow();

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      const data = await getActiveAuctions();
      // Just set the data directly - no transformation needed!
      setAuctions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load auctions:", error);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading precious metal auctions...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
      {auctions.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          <p className="text-lg">No active metal auctions</p>
          <p className="text-sm mt-2">
            Be the first to list gold, silver, platinum, or palladium!
          </p>
        </div>
      )}
    </div>
  );
}
