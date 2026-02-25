// components/features/auctions/CreateAuctionForm/index.tsx
"use client";

import { useState } from "react";
import { usePhoenixEscrow } from "@/lib/contract/phoenix-escrow";
import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "next/navigation";

export default function CreateAuctionForm() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const { createAuction, testusdToUtestusd } = usePhoenixEscrow();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [itemId, setItemId] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [duration, setDuration] = useState("24");
  
  // Derived values
  const startingPriceNum = parseFloat(startingPrice) || 0;
  const reservePriceNum = parseFloat(reservePrice) || 0;
  const collateralRequired = (reservePriceNum * 0.10).toFixed(2);
  const isValid = startingPriceNum > 0 && reservePriceNum > 0 && itemId && description;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    if (!isValid) {
      setError("Please fill in all fields with valid values");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Convert TESTUSD to uTESTUSD (1 TESTUSD = 1,000,000 uTESTUSD)
      const startingUtestusd = testusdToUtestusd(startingPrice);
      const reserveUtestusd = testusdToUtestusd(reservePrice);
      
      console.log("🚀 Creating auction:", {
        itemId,
        description,
        startingPrice: `${startingPrice} TESTUSD (${startingUtestusd} uTESTUSD)`,
        reservePrice: `${reservePrice} TESTUSD (${reserveUtestusd} uTESTUSD)`,
        collateral: `${collateralRequired} TESTUSD (10%)`,
        duration
      });
      
      const result = await createAuction(
        itemId,
        description,
        startingUtestusd,
        reserveUtestusd,
        parseInt(duration)
      );

      console.log("✅ Auction created! TX:", result.transactionHash);
      
      // Show success message
      alert(`🎉 Auction created successfully!\n\nTransaction: ${result.transactionHash}\n\nYour ${collateralRequired} TESTUSD collateral has been locked.`);
      
      // Redirect to auctions page
      router.push("/auctions");
      
    } catch (err: any) {
      console.error("❌ Error creating auction:", err);
      
      // Handle specific error messages
      if (err.message.includes("insufficient funds")) {
        setError(`Insufficient funds. You need at least ${collateralRequired} TESTUSD for collateral.`);
      } else if (err.message.includes("unauthorized")) {
        setError("Please check your wallet connection and try again.");
      } else {
        setError(err.message || "Failed to create auction. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="card bg-yellow-50 p-6 text-center">
        <p className="text-yellow-800 mb-4">Please connect your wallet to create an auction</p>
        <button 
          onClick={() => window.location.href = "/wallet"}
          className="btn btn-primary"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Item ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Item ID / Serial Number
        </label>
        <input
          type="text"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          placeholder="e.g., GOLD-2024-001"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={loading}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Unique identifier for your item (will be visible to buyers)
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your item in detail..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 h-24"
          disabled={loading}
          required
        />
      </div>

      {/* Starting Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Starting Price (TESTUSD)
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={loading}
          required
        />
      </div>

      {/* Reserve Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reserve Price (TESTUSD)
        </label>
        <input
          type="number"
          step="0.01"
          min={startingPrice || "0.01"}
          value={reservePrice}
          onChange={(e) => setReservePrice(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={loading}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Minimum price you're willing to accept (must be ≥ starting price)
        </p>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Auction Duration
        </label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={loading}
        >
          <option value="24">24 Hours</option>
          <option value="48">48 Hours</option>
          <option value="72">72 Hours</option>
          <option value="168">7 Days</option>
        </select>
      </div>

      {/* Collateral Info Card */}
      {reservePriceNum > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">🔒 Collateral Required</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-800">Reserve Price:</span>
              <span className="font-mono">{reservePrice} TESTUSD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Your Collateral (10%):</span>
              <span className="font-mono font-bold">{collateralRequired} TESTUSD</span>
            </div>
            <div className="border-t border-blue-200 my-2 pt-2">
              <div className="flex justify-between font-bold">
                <span className="text-blue-900">Total Locked:</span>
                <span className="font-mono">{(reservePriceNum * 1.10).toFixed(2)} TESTUSD</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Your collateral will be returned when the auction completes successfully
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !isValid}
        className={`w-full py-2 px-4 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'opacity-75 cursor-wait' : ''}`}
      >
        {loading ? 'Creating Auction...' : 'Create Auction'}
      </button>

      {/* Info Text */}
      <p className="text-xs text-center text-gray-500">
        By creating an auction, you agree to lock {collateralRequired || '0'} TESTUSD as collateral
        (10% of reserve price). This will be returned when the auction ends.
      </p>
    </form>
  );
}