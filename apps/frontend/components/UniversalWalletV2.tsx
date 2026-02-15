"use client";

import { useState, useEffect } from 'react';

export default function UniversalWalletV2() {
  const [address, setAddress] = useState<string>('');
  const [detectedWallets, setDetectedWallets] = useState<any[]>([]);

  useEffect(() => {
    // Detect available wallets
    const wallets = [];
    
    if (window.leap) wallets.push({ 
      name: 'Leap', 
      icon: '🦘',
      connect: async () => {
        try {
          await window.leap.enable('your-chain-id');
          const accounts = await window.leap.getAccounts();
          setAddress(accounts[0].address);
        } catch (error) {
          console.error('Leap error:', error);
        }
      }
    });
    
    if (window.keplr) wallets.push({ 
      name: 'Keplr', 
      icon: '🔷',
      connect: async () => {
        try {
          await window.keplr.enable('your-chain-id');
          const accounts = await window.keplr.getAccounts();
          setAddress(accounts[0].address);
        } catch (error) {
          console.error('Keplr error:', error);
        }
      }
    });
    
    // MetaMask/EVMs
    if (window.ethereum) wallets.push({ 
      name: 'MetaMask', 
      icon: '🦊',
      connect: async () => {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          setAddress(accounts[0]);
        } catch (error) {
          console.error('MetaMask error:', error);
        }
      }
    });
    
    // XUMM (XRPL)
    if (window.xumm) wallets.push({ 
      name: 'XUMM', 
      icon: '💎',
      connect: async () => {
        alert('XUMM connection would go here');
      }
    });
    
    setDetectedWallets(wallets);
  }, []);

  const connectManual = () => {
    const addr = prompt('Enter any wallet address (any chain):');
    if (addr) {
      setAddress(addr);
      alert(`Manual address set: ${addr}\nChain detection would happen on first transaction.`);
    }
  };

  return (
    <div style={{ padding: '1.5rem', border: '2px solid #8b5cf6', borderRadius: '0.5rem' }}>
      <h3 style={{ marginTop: 0, color: '#8b5cf6' }}>🔗 Universal Wallet Connector</h3>
      
      <div style={{ margin: '1rem 0' }}>
        <p><strong>Auto-detected Wallets:</strong> {detectedWallets.length}</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '0.5rem',
        margin: '1rem 0'
      }}>
        {detectedWallets.map((wallet, i) => (
          <button
            key={i}
            onClick={wallet.connect}
            style={{
              padding: '0.75rem',
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{wallet.icon}</span>
            <span>{wallet.name}</span>
          </button>
        ))}
        
        {/* Manual entry */}
        <button
          onClick={connectManual}
          style={{
            padding: '0.75rem',
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>⌨️</span>
          <span>Manual Entry</span>
        </button>
      </div>

      {address ? (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#dcfce7',
          border: '1px solid #22c55e',
          borderRadius: '0.25rem'
        }}>
          <p><strong>✅ Connected:</strong></p>
          <code style={{ 
            display: 'block', 
            margin: '0.5rem 0',
            padding: '0.5rem',
            background: 'white',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            wordBreak: 'break-all'
          }}>
            {address}
          </code>
          <button
            onClick={() => setAddress('')}
            style={{
              padding: '0.25rem 0.5rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              fontSize: '0.75rem'
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '0.25rem',
          fontSize: '0.875rem'
        }}>
          <p><strong>No wallet detected?</strong></p>
          <ul>
            <li>Make sure extension is installed and unlocked</li>
            <li>Try refreshing the page</li>
            <li>Use "Manual Entry" to test without extension</li>
          </ul>
        </div>
      )}
    </div>
  );
}
