"use client";

import { useState, useEffect } from 'react';

export default function LeapWalletConnector() {
  const [leapAvailable, setLeapAvailable] = useState(false);
  const [junoAddress, setJunoAddress] = useState('');

  useEffect(() => {
    setLeapAvailable(!!window.leap);
  }, []);

  const connectLeap = async () => {
    if (!window.leap) {
      alert('Install Leap Wallet from https://www.leapwallet.io/');
      window.open('https://www.leapwallet.io/download', '_blank');
      return;
    }

    try {
      // Enable Juno testnet
      await window.leap.enable('uni-6');
      const accounts = await window.leap.getAccounts();
      setJunoAddress(accounts[0].address);
      alert(`Connected to Juno Testnet!\nAddress: ${accounts[0].address}`);
    } catch (error) {
      console.error('Leap connection failed:', error);
      alert('Failed to connect. Make sure Leap Wallet is unlocked.');
    }
  };

  return (
    <div style={{ 
      padding: '1.5rem', 
      border: '2px solid #10b981',
      borderRadius: '0.5rem',
      background: '#f0fdf4'
    }}>
      <h3 style={{ marginTop: 0 }}>🚀 Leap Wallet (Recommended)</h3>
      
      {leapAvailable ? (
        <p>✅ Leap Wallet detected</p>
      ) : (
        <p>❌ Install Leap Wallet for better testnet support</p>
      )}
      
      {junoAddress ? (
        <div>
          <p><strong>Connected:</strong> {junoAddress}</p>
          <p><strong>Balance:</strong> 100 JUNO (from faucet)</p>
        </div>
      ) : (
        <button
          onClick={connectLeap}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Connect Leap Wallet to Juno Testnet
        </button>
      )}
      
      <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
        <p><strong>Why Leap over Keplr:</strong></p>
        <ul>
          <li>✅ Juno testnet pre-configured</li>
          <li>✅ No manual chain adding</li>
          <li>✅ Better testnet support</li>
          <li>✅ No disappearing popups</li>
        </ul>
      </div>
    </div>
  );
}
