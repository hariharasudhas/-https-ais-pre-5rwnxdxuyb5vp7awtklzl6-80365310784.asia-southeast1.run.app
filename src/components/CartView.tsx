import React from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  ArrowLeft 
} from 'lucide-react';

interface CartViewProps {
  onRequireAuth: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ onRequireAuth }) => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    cartDiscount,
    cartTotal, 
    setActiveTab 
  } = useStore();
  
  const { isAuthenticated } = useAuth();

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    setActiveTab('checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Your Cart Awaits</h2>
        <p className="text-sm text-neutral-500">
          Sign in to your MR.Premium account to view your saved cart items and place orders.
        </p>
        <button
          onClick={onRequireAuth}
          className="py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] transition-all cursor-pointer shadow-sm"
        >
          Sign In to View Cart
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Your Cart is Empty</h2>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          Explore our marketplace catalog to find fashion, beauty, electronics, and home essentials.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('search')}
            className="py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] transition-all cursor-pointer shadow-sm"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {cart.reduce((acc, i) => acc + i.quantity, 0)} item(s) in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs"
            >
              {/* Product Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Details */}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-bold text-[#b8860b] uppercase tracking-wide">
                    {item.category}
                  </span>
                  {item.brand && (
                    <span className="text-[11px] font-semibold text-neutral-400">
                      • {item.brand}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base leading-snug">
                  {item.name}
                </h3>
                {(item.selectedSize || item.selectedColor) && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-neutral-500 pt-0.5">
                    {item.selectedSize && <span>Size: <strong className="text-neutral-800">{item.selectedSize}</strong></span>}
                    {item.selectedSize && item.selectedColor && <span>•</span>}
                    {item.selectedColor && <span>Color: <strong className="text-neutral-800">{item.selectedColor}</strong></span>}
                  </div>
                )}
                <div className="flex items-baseline justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-base font-extrabold text-neutral-900">
                    ${item.price.toLocaleString()}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-neutral-400 line-through">
                      ${item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-xl px-2 py-1">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-neutral-900 min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-1 text-neutral-600 hover:text-black disabled:opacity-30 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-neutral-900 block">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-neutral-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer mt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-2 text-xs font-bold text-[#b8860b] hover:text-black transition-colors pt-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-6 sticky top-24">
            <h3 className="font-extrabold text-lg text-neutral-900 border-b border-neutral-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-900">${cartSubtotal.toLocaleString()}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Product Savings</span>
                  <span className="font-bold">-${cartDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Delivery</span>
                <span className="font-bold text-emerald-700 uppercase text-xs">FREE</span>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="font-extrabold text-neutral-900 text-base">Total Amount</span>
                <span className="font-black text-2xl text-neutral-900">
                  ${cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa771c] hover:brightness-105 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Badges */}
            <div className="pt-2 border-t border-neutral-100 space-y-2 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#b8860b]" />
                <span>Encrypted 256-bit Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#b8860b]" />
                <span>Instant dispatch with order tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
