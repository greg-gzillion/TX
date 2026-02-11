// components/AuctionManager.tsx
"use client";

import { useState, useEffect } from "react";
import { AuctionClient, Auction } from "@/lib/contracts/auction-client";

export function AuctionManager() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "my" | "bidding">("all");

  const client = new AuctionClient();
  const userAddress = "testcore1mj58cdfrkc8uyunw2rna3wvkatdjfhd6f6spqd";

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      const allAuctions = await client.listAuctions();
      setAuctions(allAuctions);
    } catch (error) {
      console.error("Error loading auctions:", error);
    }
  };

  const handlePlaceBid = async (auctionId: number) => {
    if (!bidAmount || parseInt(bidAmount) <= 0) {
      alert("Enter valid bid amount");
      return;
    }

    setActionLoading(true);
    try {
      await client.placeBid(auctionId, bidAmount);
      alert(`✅ Bid placed: ${bidAmount} TEST`);
      setBidAmount("");
      await loadAuctions();
    } catch (error: any) {
      alert(`❌ ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndAuction = async (auctionId: number) => {
    if (!confirm("End this auction? Winning bidder will be determined.")) return;

    setActionLoading(true);
    try {
      await client.endAuction(auctionId);
      alert("✅ Auction ended");
      await loadAuctions();
    } catch (error: any) {
      alert(`❌ ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReleaseFunds = async (auctionId: number) => {
    if (!confirm("Release funds to seller?")) return;

    setActionLoading(true);
    try {
      await client.releaseToSeller(auctionId);
      alert("✅ Funds released to seller");
      await loadAuctions();
    } catch (error: any) {
      alert(`❌ ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const getFilteredAuctions = () => {
    switch (activeTab) {
      case "my":
        return auctions.filter(a => a.seller === userAddress);
      case "bidding":
        return auctions.filter(a => a.current_bid?.bidder === userAddress);
      default:
        return auctions;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 bg-white rounded-xl border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Auction Manager</h2>
        <button
          onClick={loadAuctions}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${activeTab === "all" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("all")}
        >
          All Auctions ({auctions.length})
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "my" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("my")}
        >
          My Auctions ({auctions.filter(a => a.seller === userAddress).length})
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "bidding" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("bidding")}
        >
          My Bids ({auctions.filter(a => a.current_bid?.bidder === userAddress).length})
        </button>
      </div>

      {/* Auctions List */}
      <div className="space-y-4">
        {getFilteredAuctions().map((auction) => (
          <div key={auction.id} className="p-4 border rounded-lg hover:border-blue-300">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg">{auction.item_description}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    auction.status === "Active" ? "bg-green-100 text-green-800" :
                    auction.status === "Ended" ? "bg-yellow-100 text-yellow-800" :
                    auction.status === "Completed" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {auction.status}
                  </span>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Auction ID: <span className="font-mono">{auction.id}</span></p>
                    <p className="text-gray-600">Seller: {auction.seller.substring(0, 10)}...</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Starting: <span className="font-bold">{auction.starting_price} TEST</span></p>
                    {auction.current_bid && (
                      <p className="text-gray-600">Current: <span className="font-bold text-green-600">{auction.current_bid.amount} TEST</span></p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t">
              {auction.status === "Active" && (
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Enter bid (min: ${auction.current_bid ? parseInt(auction.current_bid.amount) + 1 : auction.starting_price})`}
                      className="w-full p-2 border rounded"
                      min={auction.current_bid ? parseInt(auction.current_bid.amount) + 1 : auction.starting_price}
                    />
                  </div>
                  <button
                    onClick={() => handlePlaceBid(auction.id)}
                    disabled={actionLoading || !bidAmount}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                  >
                    Place Bid
                  </button>
                  
                  {auction.seller === userAddress && (
                    <button
                      onClick={() => handleEndAuction(auction.id)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                    >
                      End Auction
                    </button>
                  )}
                </div>
              )}

              {auction.status === "Ended" && auction.seller === userAddress && (
                <button
                  onClick={() => handleReleaseFunds(auction.id)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Release Funds to Seller
                </button>
              )}

              <div className="mt-2 text-xs text-gray-500">
                <p>Created: {formatTime(auction.created_at)}</p>
                <p>Ends: {formatTime(auction.end_time)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {getFilteredAuctions().length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No auctions found. Create your first auction above!
        </div>
      )}
    </div>
  );
}
