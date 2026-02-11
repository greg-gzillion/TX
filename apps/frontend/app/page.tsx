"use client";

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>✅ PhoenixPME - Servers Running</h1>
      <p>Frontend: http://localhost:3000</p>
      <p>Backend: <a href="http://localhost:3001/health">http://localhost:3001/health</a></p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>Wallet Connection Test</h3>
        <button onClick={() => alert('Wallet connection will go here')}>
          Test Wallet Button
        </button>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Your Juno address: juno1mj58cdfrkc8uyunw2rna3wvkatdjfhd6lwtu0m
        </p>
      </div>
    </div>
  );
}
