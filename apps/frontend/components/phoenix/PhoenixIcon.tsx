'use client';

interface PhoenixIconProps {
  className?: string;
  size?: number;
  showBackground?: boolean;
}

export default function PhoenixIcon({ 
  className = "", 
  size = 32,
  showBackground = true 
}: PhoenixIconProps) {
  
  const icon = (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={!showBackground ? className : ""}
    >
      {/* Phoenix body - simplified geometric shape */}
      <path 
        d="M16 6 L22 13 L16 22 L10 13 L16 6" 
        fill="url(#phoenixGradient)" 
      />
      
      {/* Head */}
      <circle cx="16" cy="12" r="3" fill="#FBBF24" />
      
      {/* Eye */}
      <circle cx="15" cy="11" r="0.8" fill="white" />
      <circle cx="17" cy="11" r="0.8" fill="white" />
      <circle cx="16" cy="11.5" r="0.4" fill="#92400E" />
      
      {/* Beak */}
      <polygon points="16 13 18 14 14 14" fill="#D97706" />
      
      {/* Wings - simplified */}
      <path 
        d="M10 10 L6 6 L8 11 L10 10" 
        fill="#F59E0B" 
        opacity="0.8" 
      />
      <path 
        d="M22 10 L26 6 L24 11 L22 10" 
        fill="#F59E0B" 
        opacity="0.8" 
      />
      
      {/* Tail/Flame */}
      <path 
        d="M14 21 L12 26 L16 23 L20 26 L18 21" 
        fill="#F59E0B" 
        opacity="0.9" 
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="phoenixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (showBackground) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="bg-amber-100 p-2 rounded-full shadow-sm">
          {icon}
        </div>
      </div>
    );
  }

  return icon;
}
