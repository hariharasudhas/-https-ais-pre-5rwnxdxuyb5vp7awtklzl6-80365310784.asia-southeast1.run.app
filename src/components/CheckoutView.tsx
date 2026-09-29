import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Lock, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

interface CheckoutViewProps {
  onOrderCompleted?: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onOrderCompleted }) => {
  const { currentUser } = useAuth();
  const { 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartTotal, 
    placeOrder, 
    setActiveTab 
  } = useStore();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [state, setState] = useState(currentUser?.state || '');
  const [pincode, setPincode] = useState(currentUser?.pincode || '');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'upi'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Your cart is empty</h2>
        <p className="text-sm text-neutral-500">
          Add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => setActiveTab('search')}
          className="py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] transition-all cursor-pointer shadow-sm"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setErrorMessage('Please fill in your Full Name, Email, Phone Number, and Street Address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await placeOrder({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim() || 'Standard Delivery',
        state: state.trim() || 'Domestic',
        pincode: pincode.trim() || '10001',
        paymentMethod: paymentMethod === 'card' ? 'Online Payment / Card' : paymentMethod === 'upi' ? 'UPI / NetBanking' : 'Cash on Delivery'
      });
      onOrderCompleted?.();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('cart')}
          className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
          title="Back to Cart"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Please enter your delivery details and confirm payment
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Delivery and Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Section */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#b8860b]" />
              <span>Delivery Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, suite, unit, building, floor, street"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Pincode"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#b8860b]" />
              <span>Payment Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                  paymentMethod === 'card'
                    ? 'border-[#d4af37] bg-amber-50/50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <CreditCard className="w-6 h-6 text-[#b8860b]" />
                <span className="text-xs font-bold text-neutral-900">Credit / Debit Card</span>
                <span className="text-[10px] text-neutral-500">Visa, Mastercard, Amex</span>
              </div>

              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                  paymentMethod === 'upi'
                    ? 'border-[#d4af37] bg-amber-50/50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <Lock className="w-6 h-6 text-[#b8860b]" />
                <span className="text-xs font-bold text-neutral-900">UPI / NetBanking</span>
                <span className="text-[10px] text-neutral-500">Instant direct transfer</span>
              </div>

              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                  paymentMethod === 'cod'
                    ? 'border-[#d4af37] bg-amber-50/50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <Truck className="w-6 h-6 text-[#b8860b]" />
                <span className="text-xs font-bold text-neutral-900">Cash on Delivery</span>
                <span className="text-[10px] text-neutral-500">Pay when delivered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Details & Total */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-6 sticky top-24">
            <h3 className="font-extrabold text-lg text-neutral-900 border-b border-neutral-100 pb-3">
              Order Details
            </h3>

            {/* Items summary */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Qty: {item.quantity} × ${item.price.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-neutral-900">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-900">${cartSubtotal.toLocaleString()}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-bold">-${cartDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-bold text-emerald-700 uppercase">FREE</span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="font-extrabold text-neutral-900 text-sm">Total Amount</span>
                <span className="font-black text-2xl text-neutral-900">
                  ${cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa771c] hover:brightness-105 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order (${cartTotal.toLocaleString()})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
