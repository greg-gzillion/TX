'use client';

import { useState } from 'react';

export default function MintTest() {
  const [country, setCountry] = useState('');
  const [mint, setMint] = useState('');

  // Simple mint mapping
  const mintOptions = {
    'USA': ['Philadelphia', 'Denver', 'San Francisco', 'West Point'],
    'Canada': ['Royal Canadian Mint - Ottawa', 'Royal Canadian Mint - Winnipeg'],
    'UK': ['Royal Mint - London', 'Royal Mint - Llantrisant']
  };

  const currentMints = country ? mintOptions[country as keyof typeof mintOptions] || [] : [];

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: 'red', fontSize: '32px', marginBottom: '20px' }}>
        🧪 SIMPLE MINT TEST
      </h1>
      
      <div style={{ marginBottom: '30px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
        <p><strong>Current country:</strong> "{country}"</p>
        <p><strong>Available mints:</strong> {currentMints.length}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Select Country:
        </label>
        <select 
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setMint('');
          }}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        >
          <option value="">-- Choose a country --</option>
          <option value="USA">United States</option>
          <option value="Canada">Canada</option>
          <option value="UK">United Kingdom</option>
        </select>
      </div>

      {country && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Select Mint:
          </label>
          <select 
            value={mint}
            onChange={(e) => setMint(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          >
            <option value="">-- Choose a mint --</option>
            {currentMints.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', background: '#e0e0e0', borderRadius: '8px' }}>
        <p><strong>Selected:</strong> {country} / {mint || 'none'}</p>
      </div>
    </div>
  );
}
