'use client';

interface PhoenixIconProps {
  className?: string;
}

export default function PhoenixIcon({ className = "" }: PhoenixIconProps) {
  return (
    <div className={`phoenix-container ${className}`}>
      <svg 
        width="120" 
        height="120" 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xl"
      >
        {/* Phoenix Body - Gradient */}
        <defs>
          <linearGradient id="phoenixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Phoenix Shape - Stylized */}
        <path 
          d="M60 20 L75 45 L60 70 L45 45 L60 20" 
          fill="url(#phoenixGradient)" 
          filter="url(#glow)"
          className="phoenix-flame"
        />
        
        {/* Wings */}
        <path 
          d="M40 35 L20 20 L30 40 L40 35" 
          fill="#F59E0B" 
          opacity="0.8"
          className="phoenix-flame" 
          style={{ animationDelay: '0.2s' }}
        />
        <path 
          d="M80 35 L100 20 L90 40 L80 35" 
          fill="#F59E0B" 
          opacity="0.8"
          className="phoenix-flame" 
          style={{ animationDelay: '0.3s' }}
        />
        
        {/* Tail Feathers */}
        <path 
          d="M55 70 L50 90 L60 95 L70 90 L65 70" 
          fill="#D97706" 
          opacity="0.9"
          className="phoenix-flame" 
          style={{ animationDelay: '0.4s' }}
        />
        
        {/* Head/Crest */}
        <circle 
          cx="60" 
          cy="35" 
          r="8" 
          fill="#FBBF24" 
          filter="url(#glow)"
        />
        <circle 
          cx="57" 
          cy="32" 
          r="2" 
          fill="white" 
        />
        <circle 
          cx="63" 
          cy="32" 
          r="2" 
          fill="white" 
        />
        <circle 
          cx="60" 
          cy="38" 
          r="1.5" 
          fill="#B45309" 
        />
      </svg>
    </div>
  );
}
