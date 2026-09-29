import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore, NavigationTab } from '../context/StoreContext';
import { 
  Home, 
  Search, 
  ShoppingBag, 
  Package, 
  User, 
  ShieldCheck 
} from 'lucide-react';

interface BottomNavProps {
  onOpenAuth: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenAuth }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { activeTab, setActiveTab, cartCount } = useStore();

  const handleNavClick = (tab: NavigationTab) => {
    if (tab === 'profile' && !isAuthenticated) {
      onOpenAuth();
      return;
    }
    setActiveTab(tab);
  };

  const navItems = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'search' as NavigationTab, label: 'Search', icon: Search },
    { id: 'cart' as NavigationTab, label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { id: 'orders' as NavigationTab, label: 'Orders', icon: Package },
    { id: 'profile' as NavigationTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-lg px-2 py-1.5 transition-all">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#b8860b] font-bold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#d4af37] text-neutral-900 shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#d4af37] mt-0.5" />
              )}
            </button>
          );
        })}

        {/* Owner console link if admin */}
        {isAdmin && (
          <button
            onClick={() => handleNavClick('admin')}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'text-neutral-900 font-bold'
                : 'text-[#b8860b]'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">
              Owner
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
