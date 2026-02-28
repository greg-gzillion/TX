'use client';

interface PriceBannerProps {
  spotPrices: {
    gold: number;
    silver: number;
    platinum: number;
    palladium: number;
  };
  lastUpdated: string;
}

export default function PriceBanner({ spotPrices, lastUpdated }: PriceBannerProps) {
  return (
    <div style={{
      marginTop: '1rem',
      marginBottom: '1.5rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '0.5rem 1rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            backgroundColor: '#f3e8ff',
            color: '#6b21a8',
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            🧪 TESTUSD
          </span>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Test tokens only
          </span>
        </div>
        {lastUpdated && (
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            {lastUpdated}
          </span>
        )}
      </div>

      {/* Price row - USING FLEXBOX (guaranteed horizontal) */}
      <div style={{
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Gold */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#d97706' }}>
            ${spotPrices.gold.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            🥇 GOLD
          </div>
        </div>

        <div style={{ width: '1px', height: '2rem', backgroundColor: '#e5e7eb', margin: '0 0.5rem' }}></div>

        {/* Silver */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4b5563' }}>
            ${spotPrices.silver.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            🥈 SILVER
          </div>
        </div>

        <div style={{ width: '1px', height: '2rem', backgroundColor: '#e5e7eb', margin: '0 0.5rem' }}></div>

        {/* Platinum */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#475569' }}>
            ${spotPrices.platinum.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            🔷 PLATINUM
          </div>
        </div>

        <div style={{ width: '1px', height: '2rem', backgroundColor: '#e5e7eb', margin: '0 0.5rem' }}></div>

        {/* Palladium */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#52525b' }}>
            ${spotPrices.palladium.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            🔶 PALLADIUM
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '0.25rem 1rem',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'right'
      }}>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>⚡ from database</span>
      </div>
    </div>
  );
}
