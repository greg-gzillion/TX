"use client";

import { useState } from 'react';
import WalletSelector from '../components/WalletSelector';
import Link from 'next/link';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>✅ PhoenixPME - Servers Running</h1>
      <p>Frontend: http://localhost:3000</p>
      <p>Backend: <a href="http://localhost:3001/health">http://localhost:3001/health</a></p>

      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>Wallet Connection Test</h3>
      <div className="mt-8 text-center">
         <Link 
          href="/auctions"
           className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
           View Auctions
          </Link>
        </div>        
        {/* Wallet Selector Component */}
        <WalletSelector onWalletChange={setWalletAddress} />
        
        {walletAddress && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '4px' 
          }}>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              <strong>✅ TESTCORE Treasury address:</strong>
            </p>
            <p style={{ 
              fontFamily: 'monospace', 
              fontSize: '0.875rem', 
              wordBreak: 'break-all',
              margin: '0.5rem 0 0 0'
            }}>
              {walletAddress}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
