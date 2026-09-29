import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MrLogo } from './MrLogo';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const { login, register, resetPasswordRequest } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickOwnerFill = () => {
    setEmail('hariharasudhaselvakumar25@gmail.com');
    setPassword('Admin123!');
    setMode('login');
    setError(null);
  };

  const handleQuickCustomerFill = () => {
    setEmail('customer@mrpremium.com');
    setPassword('Customer123!');
    setMode('login');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (result.success) {
          onSuccess();
        } else {
          setError(result.error || 'Login failed. Please check your credentials.');
        }
      } else if (mode === 'register') {
        const result = await register({
          name,
          email,
          phone,
          password,
          confirmPassword,
        });
        if (result.success) {
          onSuccess();
        } else {
          setError(result.error || 'Registration failed. Please check your inputs.');
        }
      } else if (mode === 'forgot') {
        const res = await resetPasswordRequest(email);
        if (res.success) {
          setInfoMessage(res.message);
        } else {
          setError(res.message);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md my-auto rounded-3xl bg-white border border-neutral-200 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <MrLogo size="md" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            {mode === 'login' ? 'Sign in to MR.Premium' : mode === 'register' ? 'Create Your Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-neutral-500">
            {mode === 'login' 
              ? 'Access your cart, order tracking, and exclusive discounts' 
              : mode === 'register' 
              ? 'Join millions shopping verified premium quality products' 
              : 'Enter your email to recover your credentials'
            }
          </p>
        </div>

        {/* Quick Demo Credentials Helpers */}
        {mode === 'login' && (
          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
              <span>Quick Login Options</span>
              <span className="text-[#b8860b]">One-Click</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickOwnerFill}
                className="py-1.5 px-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#f5d77f]" />
                <span>Owner Login</span>
              </button>
              <button
                type="button"
                onClick={handleQuickCustomerFill}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>Customer Login</span>
              </button>
            </div>
          </div>
        )}

        {/* Error / Info Alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                Full Name *
              </label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                Phone Number *
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Password *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-xs text-[#b8860b] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                Confirm Password *
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'login' ? (
              <>
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'register' ? (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <span>Send Reset Instructions</span>
            )}
          </button>
        </form>

        {/* Footer Mode Switch */}
        <div className="pt-2 text-center text-xs text-neutral-500 border-t border-neutral-100">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className="font-bold text-[#b8860b] hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className="font-bold text-[#b8860b] hover:underline cursor-pointer"
              >
                Sign In Instead
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
