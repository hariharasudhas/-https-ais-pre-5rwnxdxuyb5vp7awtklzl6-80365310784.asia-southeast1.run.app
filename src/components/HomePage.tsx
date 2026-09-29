import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { MrLogo } from './MrLogo';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Sparkles, 
  Flame, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones
} from 'lucide-react';

interface HomePageProps {
  onRequireAuth: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onRequireAuth }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { 
    customerProducts, 
    categories,
    setSearchQuery, 
    setSelectedCategory, 
    setActiveTab,
    cartCount
  } = useStore();

  const featuredProducts = customerProducts.filter(p => p.featured);
  const popularProducts = customerProducts.filter(p => p.popular);
  const newArrivals = customerProducts.filter(p => p.newArrival);

  const handleOpenSearch = (initialQuery?: string) => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery);
    }
    setActiveTab('search');
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveTab('search');
  };

  return (
    <div className="w-full pb-16 space-y-10 bg-[#f9fafb]">
      {/* ================= HERO & TOP SECTION ================= */}
      <section className="bg-white border-b border-neutral-200/80 pt-4 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Bar: MR.Premium Brand | Search Bar | Cart Icon | Profile Icon */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Brand Title */}
            <div className="flex items-center justify-between">
              <MrLogo size="lg" showTagline />
              {/* Mobile Quick Action Icons */}
              <div className="flex items-center gap-2 md:hidden">
                <button
                  onClick={() => setActiveTab('cart')}
                  className="relative p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37] text-black shadow">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => isAuthenticated ? setActiveTab('profile') : onRequireAuth()}
                  className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
                  aria-label="Profile"
                >
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Prominent Search Bar on Home Page */}
            <div className="flex-1 max-w-2xl">
              <div 
                onClick={() => handleOpenSearch()}
                className="group flex items-center w-full px-4 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-300 hover:border-[#d4af37] transition-all cursor-pointer shadow-sm"
              >
                <Search className="w-5 h-5 text-neutral-500 group-hover:text-[#b8860b] transition-colors shrink-0" />
                <span className="ml-3 text-sm text-neutral-500 font-medium select-none truncate">
                  Search products, categories, or brands...
                </span>
                <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-lg bg-white text-neutral-700 shadow-sm border border-neutral-200 shrink-0">
                  Search
                </span>
              </div>
            </div>

            {/* Desktop Cart and Profile Icons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setActiveTab('cart')}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-sm transition-all border border-neutral-200 cursor-pointer"
                title="Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#b8860b]" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#d4af37] text-neutral-900 shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => isAuthenticated ? setActiveTab('profile') : onRequireAuth()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm transition-all cursor-pointer shadow-sm"
                title="Profile"
              >
                <User className="w-4 h-4 text-[#f5d77f]" />
                <span>{isAuthenticated && currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}</span>
              </button>
            </div>
          </div>

          {/* Welcome Message Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white shadow-xl relative overflow-hidden">
            {/* Subtle Gold Glow Backgrounds */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/15 rounded-full blur-[90px] pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5d77f] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Marketplace</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {isAuthenticated && currentUser ? (
                  <>Welcome back, <span className="gold-gradient-text">{currentUser.name}</span></>
                ) : (
                  <>Welcome to <span className="gold-gradient-text">MR.Premium</span></>
                )}
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 max-w-2xl font-light">
                Explore thousands of verified premium products across fashion, beauty, electronics, and home essentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      {/* Categories should be dynamically manageable by the owner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
              Browse Categories
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Curated collections updated daily
            </p>
          </div>
          <button
            onClick={() => handleCategorySelect('All')}
            className="text-xs sm:text-sm font-bold text-[#b8860b] hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid / Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat.name)}
              className="group flex flex-col items-center p-3 rounded-2xl bg-white border border-neutral-200/80 hover:border-[#d4af37] hover:shadow-lg transition-all cursor-pointer text-center"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-neutral-100 mb-2 border border-neutral-200 group-hover:scale-105 transition-transform">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold text-neutral-800 group-hover:text-[#b8860b] transition-colors line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5">
                Explore →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-[#b8860b] border border-amber-200">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                Featured Products
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                Handpicked top selections with highest savings
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenSearch()}
            className="text-xs sm:text-sm font-bold text-[#b8860b] hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRequireAuth={onRequireAuth}
            />
          ))}
        </div>
      </section>

      {/* ================= POPULAR PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                Popular Products
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                Trending purchases across our members
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenSearch()}
            className="text-xs sm:text-sm font-bold text-[#b8860b] hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRequireAuth={onRequireAuth}
            />
          ))}
        </div>
      </section>

      {/* ================= NEW ARRIVALS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                New Arrivals
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                Fresh additions just landed in inventory
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenSearch()}
            className="text-xs sm:text-sm font-bold text-[#b8860b] hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(newArrivals.length > 0 ? newArrivals : customerProducts).slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRequireAuth={onRequireAuth}
            />
          ))}
        </div>
      </section>

      {/* ================= MARKETPLACE VALUE PROPOSITIONS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-[#b8860b]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 text-sm">Express Shipping</h4>
              <p className="text-xs text-neutral-500">Fast delivery nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 text-sm">100% Genuine</h4>
              <p className="text-xs text-neutral-500">Authentic certified products</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 text-sm">30-Day Returns</h4>
              <p className="text-xs text-neutral-500">Easy refunds & exchanges</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 text-sm">Dedicated Support</h4>
              <p className="text-xs text-neutral-500">24/7 client assistance</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
