// components/AuctionCreator.tsx - UPDATED VERSION
"use client";

import { useState } from "react";
import { AuctionClient } from "@/lib/contracts/auction-client";

export function AuctionCreator() {
  const [itemDescription, setItemDescription] = useState("1 oz Gold Bar");
  const [startingPrice, setStartingPrice] = useState("100");
  const [durationDays, setDurationDays] = useState("7");
  const [loading, setLoading] = useState(false);
  const [auctionId, setAuctionId] = useState<number | null>(null);

  const handleCreate = async () => {
    // SIMPLER VALIDATION - just trim whitespace
    const desc = itemDescription.trim();
    const price = startingPrice.trim();
    const days = durationDays.trim();
    
    if (!desc || !price || !days) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const client = new AuctionClient();
      const id = await client.createAuction(
        desc,
        price,
        parseInt(days)
      );
      setAuctionId(id);
      alert(`✅ Auction created! ID: ${id}`);
      setItemDescription("");
      setStartingPrice("100");
      setDurationDays("7");
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-3">Create Auction</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Item Description</label>
          <input
            type="text"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            placeholder="1 oz Gold Bar"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Starting Price (TEST)</label>
          <input
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Duration (Days)</label>
          <input
            type="number"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
            max="30"
          />
        </div>
        
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Auction"}
        </button>
        
        {auctionId && (
          <p className="text-green-600">Auction ID: {auctionId}</p>
        )}
      </div>
    </div>
  );
}
