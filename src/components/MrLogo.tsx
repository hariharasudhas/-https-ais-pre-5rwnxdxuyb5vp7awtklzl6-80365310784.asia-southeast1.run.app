import React from 'react';

interface MrLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const MrLogo: React.FC<MrLogoProps> = ({ 
  className = '', 
  size = 'md',
  showTagline = false 
}) => {
  const sizeClasses = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl font-extrabold',
  };

  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Premium Gold & Black Monogram Emblem */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-black via-[#1a1a1a] to-[#2a2a2a] text-[#d4af37] border border-[#d4af37]/40 shadow-sm shrink-0 ${emblemSizes[size]}`}>
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 text-[#d4af37]" fill="none" stroke="currentColor">
          {/* Diamond Frame */}
          <polygon points="50,8 88,50 50,92 12,50" stroke="url(#goldGrad)" strokeWidth="4" fill="rgba(212, 175, 55, 0.12)" />
          {/* Crown */}
          <path d="M30 60 L30 46 L40 52 L50 38 L60 52 L70 46 L70 60 Z" fill="url(#goldGrad)" />
          {/* Monogram MR */}
          <text x="50" y="76" textAnchor="middle" fontSize="14" fontWeight="800" fill="#d4af37" fontFamily="sans-serif">
            MR
          </text>
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5d77f" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#a37618" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline gap-0.5">
          <span className={`tracking-tight text-neutral-900 ${sizeClasses[size]}`}>
            MR.
          </span>
          <span className={`tracking-tight font-extrabold gold-gradient-text ${sizeClasses[size]}`}>
            Premium
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-wider text-neutral-500 uppercase font-medium">
            Exclusive Marketplace
          </span>
        )}
      </div>
    </div>
  );
};
