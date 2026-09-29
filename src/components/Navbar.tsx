import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore, NavigationTab } from '../context/StoreContext';
import { MrLogo } from './MrLogo';
import { 
  Home, 
  Search, 
  ShoppingBag, 
  Package, 
  User, 
  ShieldCheck, 
  Bell
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const { 
    activeTab, 
    setActiveTab, 
    cartCount, 
    unreadNotificationsCount, 
    setIsNotificationsOpen,
  } = useStore();

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
  };

  const navLinks = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'search' as NavigationTab, label: 'Search', icon: Search },
    { id: 'cart' as NavigationTab, label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { id: 'orders' as NavigationTab, label: 'Orders', icon: Package },
    { id: 'profile' as NavigationTab, label: 'Profile', icon: User },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        
        {/* ================= BRAND LOGO / NAME ================= */}
        <div 
          onClick={() => handleNavClick('home')}
          className="cursor-pointer flex items-center group shrink-0"
          title="MR.Premium Home"
        >
          <MrLogo size="md" />
        </div>

        {/* ================= DESKTOP HORIZONTAL NAVIGATION ================= */}
        {/* Requirement: MR.Premium | Home | Search | Cart | Orders | Profile */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex items-center gap-2 px-3.5 lg:px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'text-neutral-900 bg-neutral-100 border border-neutral-300 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#b8860b] stroke-[2.5]' : 'text-neutral-500'}`} />
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold min-w-[18px] text-center leading-none bg-[#d4af37] text-neutral-900 shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin link for authorized owner/admin only */}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ml-1 ${
                activeTab === 'admin'
                  ? 'text-white bg-neutral-900 shadow-sm'
                  : 'text-[#b8860b] bg-amber-50 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Panel</span>
            </button>
          )}
        </nav>

        {/* ================= DESKTOP RIGHT CONTROLS ================= */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2.5 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#d4af37] text-neutral-900 font-bold text-[9px] flex items-center justify-center shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Auth State */}
          {isAuthenticated && currentUser ? (
            <div 
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 cursor-pointer transition-all"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-[#d4af37]"
              />
              <span className="text-xs font-bold text-neutral-800 truncate max-w-[100px]">
                {currentUser.name.split(' ')[0]}
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="py-2 px-4 rounded-xl font-bold text-xs tracking-wider uppercase text-white bg-neutral-900 hover:bg-[#b8860b] transition-all cursor-pointer shadow-xs"
            >
              Sign In
            </button>
          )}
        </div>

        {/* ================= MOBILE TOP CONTROLS ================= */}
        {/* Requirement: Top: MR.Premium | Search icon | Cart icon | Profile icon */}
        <div className="flex md:hidden items-center gap-2">
          {/* Search Icon */}
          <button
            onClick={() => handleNavClick('search')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'text-[#b8860b] bg-amber-50 border border-amber-200'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
            title="Search"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => handleNavClick('cart')}
            className={`relative p-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'cart'
                ? 'text-[#b8860b] bg-amber-50 border border-amber-200'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
            title="Cart"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#d4af37] text-neutral-900 shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile Icon */}
          <button
            onClick={() => isAuthenticated ? handleNavClick('profile') : onOpenAuth()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'text-[#b8860b] bg-amber-50 border border-amber-200'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
            title="Profile"
            aria-label="Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
};
