'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

declare global {
  interface Window {
    keplr?: any;
    leap?: any;
  }
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [keplrAddress, setKeplrAddress] = useState('');
  const [leapAddress, setLeapAddress] = useState('');
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [prices, setPrices] = useState({
    gold: 5186.70,
    silver: 89.10,
    platinum: 2298.00,
    palladium: 1798.00
  });

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date().toLocaleTimeString());
  }, []);

  // FETCH REAL PRICES FROM API
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://phoenix-api-756y.onrender.com/api/prices');
        const data = await response.json();
        if (data.success && data.data) {
          setPrices({
            gold: data.data.gold,
            silver: data.data.silver,
            platinum: data.data.platinum,
            palladium: data.data.palladium
          });
        }
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      }
    };

    fetchPrices();
    // Optional: Refresh every 5 minutes
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const connectKeplr = async () => {
    try {
      if (!window.keplr) {
        window.open('https://www.keplr.app/download', '_blank');
        return;
      }
      
      await window.keplr.enable('coreum-testnet-1');
      const offlineSigner = window.keplr.getOfflineSigner('coreum-testnet-1');
      const accounts = await offlineSigner.getAccounts();
      setKeplrAddress(accounts[0].address);
    } catch (error) {
      console.error('Keplr connection error:', error);
    }
  };

  const connectLeap = async () => {
    try {
      if (!window.leap) {
        window.open('https://www.leapwallet.io/download', '_blank');
        return;
      }
      
      await window.leap.enable('coreum-testnet-1');
      const offlineSigner = window.leap.getOfflineSigner('coreum-testnet-1');
      const accounts = await offlineSigner.getAccounts();
      setLeapAddress(accounts[0].address);
    } catch (error) {
      console.error('Leap connection error:', error);
    }
  };

  const disconnectKeplr = () => {
    setKeplrAddress('');
  };

  const disconnectLeap = () => {
    setLeapAddress('');
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('/Phoenix-sketch002.png')`,
        backgroundSize: 'contain',
        backgroundPosition: 'top center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Semi-transparent overlay for readability */}
      <div className="bg-white/90 min-h-screen flex flex-col">
        {/* Header with wallet buttons */}
        <div className="border-b p-3 flex justify-between items-center max-w-5xl mx-auto w-full bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <span className="font-bold text-xl">PhoenixPME</span>
            <Link href="/auctions" className="text-gray-600 hover:text-gray-900">Browse</Link>
            <Link href="/create" className="text-gray-600 hover:text-gray-900">Create</Link>
          </div>
          <div className="flex gap-2">
            {keplrAddress ? (
              <div className="flex items-center gap-2">
                <span className="text-sm bg-gray-100 px-3 py-1 rounded">
                  {keplrAddress.slice(0,6)}...{keplrAddress.slice(-4)}
                </span>
                <button 
                  onClick={disconnectKeplr}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button 
                onClick={connectKeplr}
                className="bg-amber-500 text-white px-3 py-1 rounded text-sm hover:bg-amber-600"
              >
                Keplr
              </button>
            )}
            
            {leapAddress ? (
              <div className="flex items-center gap-2">
                <span className="text-sm bg-gray-100 px-3 py-1 rounded">
                  {leapAddress.slice(0,6)}...{leapAddress.slice(-4)}
                </span>
                <button 
                  onClick={disconnectLeap}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button 
                onClick={connectLeap}
                className="bg-amber-500 text-white px-3 py-1 rounded text-sm hover:bg-amber-600"
              >
                Leap
              </button>
            )}
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
          
          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="flex gap-2">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gold, silver, platinum..."
                className="flex-1 px-4 py-2 border rounded-lg bg-white/80"
              />
              <button className="bg-amber-500 text-white px-6 rounded-lg hover:bg-amber-600">Search</button>
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex justify-center gap-4 mb-4 text-sm">
            <Link href="/auctions?metal=gold" className="text-gray-700 hover:text-amber-600">Gold</Link>
            <Link href="/auctions?metal=silver" className="text-gray-700 hover:text-amber-600">Silver</Link>
            <Link href="/auctions?metal=platinum" className="text-gray-700 hover:text-amber-600">Platinum</Link>
            <Link href="/auctions?metal=palladium" className="text-gray-700 hover:text-amber-600">Palladium</Link>
            <Link href="/auctions?form=coin" className="text-gray-700 hover:text-amber-600">Coins</Link>
            <Link href="/auctions?form=bar" className="text-gray-700 hover:text-amber-600">Bars</Link>
          </div>
          
          {/* Disclaimer */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-center text-xs text-yellow-700">
              🧪 Testnet • No real funds
            </div>
          </div>
          
          {/* Price banner - NOW WITH LIVE DATA! */}
          <div className="max-w-3xl mx-auto mb-6 bg-gray-50 p-3 rounded text-center bg-white/80 backdrop-blur-sm">
            <span className="font-medium">Reference: </span>
            🥇 ${prices.gold.toFixed(2)} • 🥈 ${prices.silver.toFixed(2)} • 🔷 ${prices.platinum.toFixed(2)} • 🔶 ${prices.palladium.toFixed(2)}
            <div className="text-xs text-gray-500 mt-1">
              Prices updated manually {mounted && `• Last fetch: ${currentTime}`}
            </div>
          </div>
          
          {/* Featured auctions */}
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Featured Auctions</h2>
              <Link href="/auctions" className="text-amber-600">View all →</Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg p-3 bg-white/80 backdrop-blur-sm">
                  <div className="h-16 bg-gray-100 rounded mb-2 flex items-center justify-center text-3xl">🥇</div>
                  <p className="font-medium">Gold American Eagle</p>
                  <p className="text-xs text-gray-600">1 oz • .9999</p>
                  <p className="text-amber-700 font-bold mt-1">${(prices.gold * 0.55).toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Date */}
          <p className="text-center text-gray-500 text-xs mt-6">March 6, 2026 — TX Testnet Launch</p>
          
        </main>
        
        {/* ICON SECTION - COMPLETELY REMOVED */}
        
      </div>
    </div>
  );
}