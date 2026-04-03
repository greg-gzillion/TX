"use client";

import { useState, useEffect } from "react";

export interface SandboxAuction {
  id: string;
  title: string;
  description: string;
  metalType: "Gold" | "Silver" | "Platinum" | "Palladium" | "Copper" | "Other";
  formType: "coin" | "round" | "bar" | "jewelry" | "other";
  weight: number;
  weightUnit: "troy_oz" | "grams" | "ounces";
  purity: number;
  startingPrice: number;
  currentBid: number;
  buyNowPrice?: number;
  sellerAddress: string;
  sellerName: string;
  bids: Array<{
    bidder: string;
    amount: number;
    timestamp: Date;
  }>;
  images: string[];
  year?: string;
  mint?: string;
  country?: string;
  grade?: string;
  isNumismatic: boolean;
  createdAt: Date;
  endsAt: Date;
}

export function useSandboxAuctions(selectedWallet: any) {
  const [auctions, setAuctions] = useState<SandboxAuction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load auctions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sandbox_auctions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const withDates = parsed.map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt),
          endsAt: new Date(a.endsAt),
          bids: a.bids.map((b: any) => ({
            ...b,
            timestamp: new Date(b.timestamp),
          })),
        }));
        setAuctions(withDates);
      } catch (e) {
        console.error("Failed to parse stored auctions", e);
      }
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever auctions change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("sandbox_auctions", JSON.stringify(auctions));
    }
  }, [auctions, loading]);

  // Create a new auction (matches your real form data)
  const createAuction = (auctionData: any) => {
    const newAuction: SandboxAuction = {
      id: `auction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title:
        auctionData.title ||
        `${auctionData.weight} ${auctionData.metalType} ${auctionData.formType}`,
      description: auctionData.description || "",
      metalType: auctionData.metalType,
      formType: auctionData.formType,
      weight: auctionData.weight,
      weightUnit: auctionData.weightUnit,
      purity: auctionData.purity,
      startingPrice: auctionData.startingPrice,
      currentBid: auctionData.startingPrice,
      buyNowPrice: auctionData.buyNowPrice,
      sellerAddress: selectedWallet?.address || "sandbox_seller",
      sellerName: selectedWallet?.name || "Sandbox Seller",
      bids: [],
      images: auctionData.images || [],
      year: auctionData.coinDetails?.year,
      mint: auctionData.coinDetails?.mint,
      country: auctionData.coinDetails?.country,
      grade: auctionData.coinDetails?.grade,
      isNumismatic: auctionData.coinDetails?.isNumismatic || false,
      createdAt: new Date(),
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    setAuctions((prev) => [newAuction, ...prev]);
    return newAuction;
  };

  // Place a bid
  const placeBid = (auctionId: string, amount: number, bidderWallet: any) => {
    // Can't bid on your own auction
    const auction = auctions.find((a) => a.id === auctionId);
    if (auction?.sellerAddress === bidderWallet?.address) {
      return { success: false, error: "Cannot bid on your own auction" };
    }

    // Bid must be higher than current bid
    if (amount <= (auction?.currentBid || 0)) {
      return { success: false, error: "Bid must be higher than current bid" };
    }

    setAuctions((prev) =>
      prev.map((a) => {
        if (a.id === auctionId) {
          return {
            ...a,
            currentBid: amount,
            bids: [
              ...a.bids,
              {
                bidder: bidderWallet?.address || "unknown",
                amount,
                timestamp: new Date(),
              },
            ],
          };
        }
        return a;
      }),
    );

    return { success: true };
  };

  // Buy now
  const buyNow = (auctionId: string, buyerWallet: any) => {
    const auction = auctions.find((a) => a.id === auctionId);
    if (auction?.sellerAddress === buyerWallet?.address) {
      return { success: false, error: "Cannot buy your own auction" };
    }

    if (!auction?.buyNowPrice) {
      return { success: false, error: "No buy now price set" };
    }

    // In sandbox, just mark as ended
    setAuctions((prev) =>
      prev.map((a) =>
        a.id === auctionId
          ? {
              ...a,
              currentBid: a.buyNowPrice || a.currentBid,
              endsAt: new Date(),
            }
          : a,
      ),
    );

    return { success: true };
  };

  // Delete auction (for sandbox cleanup)
  const deleteAuction = (auctionId: string) => {
    setAuctions((prev) => prev.filter((a) => a.id !== auctionId));
  };

  // Reset all auctions (clear localStorage)
  const resetAll = () => {
    localStorage.removeItem("sandbox_auctions");
    setAuctions([]);
  };

  return {
    auctions,
    loading,
    createAuction,
    placeBid,
    buyNow,
    deleteAuction,
    resetAll,
  };
}
