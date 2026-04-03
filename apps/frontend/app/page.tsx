"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [prices, setPrices] = useState({
    gold: 5190.7,
    silver: 89.6,
    platinum: 2402.0,
    palladium: 1863.0,
  });
  const [featuredAuctions, setFeaturedAuctions] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://phoenix-api-756y.onrender.com/api/prices",
        );
        const data = await response.json();
        if (data.success && data.data) {
          setPrices({
            gold: data.data.gold,
            silver: data.data.silver,
            platinum: data.data.platinum,
            palladium: data.data.palladium,
          });
        }
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(
          "https://phoenix-api-756y.onrender.com/api/auctions?featured=true",
        );
        const data = await response.json();
        if (data.auctions) {
          setFeaturedAuctions(data.auctions.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch featured auctions:", error);
        setFeaturedAuctions([]);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main content - no background image to simplify */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-4">
          <div className="flex gap-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gold, silver, platinum..."
              className="flex-1 px-4 py-2 border rounded-lg bg-white"
            />
            <button className="bg-amber-500 text-white px-6 rounded-lg hover:bg-amber-600">
              Search
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex justify-center gap-4 mb-4 text-sm">
          <Link
            href="/auctions?metal=gold"
            className="text-gray-700 hover:text-amber-600"
          >
            Gold
          </Link>
          <Link
            href="/auctions?metal=silver"
            className="text-gray-700 hover:text-amber-600"
          >
            Silver
          </Link>
          <Link
            href="/auctions?metal=platinum"
            className="text-gray-700 hover:text-amber-600"
          >
            Platinum
          </Link>
          <Link
            href="/auctions?metal=palladium"
            className="text-gray-700 hover:text-amber-600"
          >
            Palladium
          </Link>
          <Link
            href="/auctions?form=coin"
            className="text-gray-700 hover:text-amber-600"
          >
            Coins
          </Link>
          <Link
            href="/auctions?form=bar"
            className="text-gray-700 hover:text-amber-600"
          >
            Bars
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="max-w-2xl mx-auto mb-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-center text-xs text-yellow-700">
            🧪 Testnet • No real funds
          </div>
        </div>

        {/* Price banner */}
        <div className="max-w-3xl mx-auto mb-6 bg-gray-50 p-3 rounded text-center bg-white border">
          <span className="font-medium">Reference: </span>
          🥇 ${prices.gold.toFixed(2)} • 🥈 ${prices.silver.toFixed(2)} • 🔷 $
          {prices.platinum.toFixed(2)} • 🔶 ${prices.palladium.toFixed(2)}
          <div className="text-xs text-gray-500 mt-1">
            Prices updated manually {mounted && `• Last fetch: ${currentTime}`}
          </div>
        </div>

        {/* Featured auctions */}
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">Featured Auctions</h2>
            <Link href="/auctions" className="text-amber-600">
              View all →
            </Link>
          </div>

          {featuredAuctions.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {featuredAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className="border rounded-lg p-3 bg-white"
                >
                  <div className="h-16 bg-gray-100 rounded mb-2 flex items-center justify-center text-3xl">
                    {auction.metalType === "Gold" && "🥇"}
                    {auction.metalType === "Silver" && "🥈"}
                    {auction.metalType === "Platinum" && "🔷"}
                    {auction.metalType === "Palladium" && "🔶"}
                  </div>
                  <p className="font-medium">{auction.title}</p>
                  <p className="text-xs text-gray-600">
                    {auction.weight} {auction.weightUnit}
                  </p>
                  <p className="text-amber-700 font-bold mt-1">
                    $
                    {auction.currentBid?.toFixed(0) ||
                      auction.startingPrice?.toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No featured auctions yet</p>
              <Link
                href="/auctions/create"
                className="text-amber-600 text-sm mt-2 inline-block"
              >
                Create the first auction →
              </Link>
            </div>
          )}
        </div>

        {/* Date */}
        <p className="text-center text-gray-500 text-xs mt-6">
          March 6, 2026 — TX Testnet Launch
        </p>
      </main>
    </div>
  );
}
