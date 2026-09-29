import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HomePage } from './components/HomePage';
import { SearchView } from './components/SearchView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { OrdersView } from './components/OrdersView';
import { ProfileView } from './components/ProfileView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';

function MainAppContent() {
  const { isLoading } = useAuth();
  const { 
    activeTab, 
    setActiveTab, 
    lastPlacedOrder, 
    clearLastPlacedOrder 
  } = useStore();

  // Auth modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('login');

  const handleOpenLogin = () => {
    setAuthModalInitialMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthModalInitialMode('register');
    setIsAuthModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          <span className="font-extrabold text-sm tracking-widest uppercase text-neutral-900">
            MR.Premium
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-neutral-900 flex flex-col justify-between selection:bg-[#d4af37]/30 selection:text-[#855e0a]">
      {/* ================= FIXED TOP NAVIGATION BAR AT TOP OF EVERY MAIN PAGE ================= */}
      {/* Shows: MR.Premium | Home | Search | Cart | Orders | Profile */}
      <Navbar onOpenAuth={handleOpenLogin} />

      {/* ================= MAIN ROUTED CONTENT CONTAINER (pt-16 md:pt-20 ensures no overlap) ================= */}
      <main className="flex-1 pt-16 md:pt-20 pb-20 md:pb-12">
        {/* / -> Welcome */}
        {activeTab === 'welcome' && (
          <WelcomeScreen
            onLoginClick={handleOpenLogin}
            onRegisterClick={handleOpenRegister}
            onExploreClick={() => setActiveTab('home')}
          />
        )}

        {/* /home -> Home Dashboard */}
        {activeTab === 'home' && (
          <HomePage onRequireAuth={handleOpenLogin} />
        )}

        {/* /search -> Dedicated Search Page */}
        {activeTab === 'search' && (
          <SearchView onRequireAuth={handleOpenLogin} />
        )}

        {/* /cart -> Cart View */}
        {activeTab === 'cart' && (
          <CartView onRequireAuth={handleOpenLogin} />
        )}

        {/* /checkout -> Checkout View */}
        {activeTab === 'checkout' && (
          <CheckoutView onOrderCompleted={() => {}} />
        )}

        {/* /orders -> Orders View */}
        {activeTab === 'orders' && (
          <OrdersView onRequireAuth={handleOpenLogin} />
        )}

        {/* /profile -> Profile View */}
        {activeTab === 'profile' && (
          <ProfileView onRequireAuth={handleOpenLogin} />
        )}

        {/* /admin -> Owner / Admin Panel */}
        {activeTab === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {/* Mobile Bottom Navigation: Home | Search | Cart | Orders | Profile */}
      <BottomNav onOpenAuth={handleOpenLogin} />

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalInitialMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setActiveTab('home');
        }}
      />

      <ProductDetailModal onRequireAuth={handleOpenLogin} />

      <OrderSuccessModal
        order={lastPlacedOrder}
        onClose={clearLastPlacedOrder}
        onViewOrders={() => {
          clearLastPlacedOrder();
          setActiveTab('orders');
        }}
        onContinueShopping={() => {
          clearLastPlacedOrder();
          setActiveTab('search');
        }}
      />

      <NotificationsDrawer />

      <FirebaseConfigModal />

      {/* Desktop Marketplace Footer */}
      <footer className="hidden md:block py-8 border-t border-neutral-200 bg-white text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-extrabold text-neutral-800 tracking-wide">
            MR.Premium Marketplace • 2026
          </span>
          <div className="flex items-center gap-6 text-[12px] font-medium text-neutral-600">
            <span>Verified Authenticity</span>
            <span>Express Courier Tracking</span>
            <span>Secure 256-bit Checkout</span>
            <span>30-Day Hassle-Free Returns</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="font-bold text-neutral-700 hover:text-black underline cursor-pointer"
            >
              Owner Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <MainAppContent />
      </StoreProvider>
    </AuthProvider>
  );
}
