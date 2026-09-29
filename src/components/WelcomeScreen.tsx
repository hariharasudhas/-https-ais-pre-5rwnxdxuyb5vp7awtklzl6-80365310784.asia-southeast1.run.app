import React from 'react';
import { MrLogo } from './MrLogo';
import { 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag, 
  Star, 
  Truck, 
  Sparkles,
  Zap
} from 'lucide-react';

interface WelcomeScreenProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onExploreClick: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLoginClick,
  onRegisterClick,
  onExploreClick,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-white via-[#f9fafb] to-white">
      {/* Background Subtle Ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full mx-auto text-center space-y-8">
        
        {/* Brand Logo & Name */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-3xl bg-white shadow-md border border-neutral-200/80">
            <MrLogo size="xl" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>The Verified Luxury & Daily Essentials Marketplace</span>
          </div>
        </div>

        {/* Tagline & Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Curated Quality. <br className="hidden sm:inline" />
            <span className="gold-gradient-text">Exceptional Value.</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Welcome to <strong>MR.Premium</strong>, your premier destination for certified luxury fashion, skincare, audio, timepieces, and home living.
          </p>
        </div>

        {/* Action Buttons: Login / Register / Explore */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 max-w-md mx-auto">
          <button
            onClick={onLoginClick}
            className="w-full sm:w-auto flex-1 py-3.5 px-8 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Login to Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onRegisterClick}
            className="w-full sm:w-auto flex-1 py-3.5 px-8 rounded-2xl font-bold text-xs uppercase tracking-wider text-neutral-900 bg-white border-2 border-neutral-900 hover:bg-neutral-100 active:scale-[0.98] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Register Free</span>
          </button>
        </div>

        <div>
          <button
            onClick={onExploreClick}
            className="text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Or browse marketplace catalog without account →
          </button>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-neutral-200">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-amber-50 text-[#b8860b]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900">100% Genuine</h4>
              <p className="text-[11px] text-neutral-500">Certified authentic goods</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900">Express Delivery</h4>
              <p className="text-[11px] text-neutral-500">Fast nationwide tracking</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900">Verified Reviews</h4>
              <p className="text-[11px] text-neutral-500">Trusted by 50,000+ members</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
