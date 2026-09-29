import React from 'react';
import { Order } from '../types';
import { MrLogo } from './MrLogo';
import { CheckCircle2, ShieldCheck, ArrowRight, Eye, Sparkles } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewOrders,
  onContinueShopping,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl my-auto p-6 md:p-8 rounded-3xl bg-white border border-neutral-200 shadow-2xl text-center">
        {/* Animated Celebration Icon */}
        <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-10 h-10 animate-pulse" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
          </div>
        </div>

        {/* Brand */}
        <div className="flex justify-center mb-3">
          <MrLogo size="sm" />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-1">
          Order Placed Successfully!
        </h2>

        <p className="text-xs uppercase tracking-wider text-[#b8860b] font-bold mb-6">
          Order ID: <span className="font-mono text-neutral-900">{order.id}</span>
        </p>

        {/* Order Details Receipt Box */}
        <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-left mb-6 space-y-3">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-200">
            <span className="text-neutral-500">Customer:</span>
            <span className="text-neutral-900 font-bold">{order.customerName}</span>
          </div>

          <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-200">
            <span className="text-neutral-500">Shipping Address:</span>
            <span className="text-neutral-900 font-semibold truncate max-w-[260px]">{order.address}, {order.city}</span>
          </div>

          <div className="space-y-1.5 py-1">
            <span className="text-[11px] text-neutral-500 block font-bold uppercase tracking-wider">Ordered Items:</span>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs text-neutral-800">
                <span className="truncate max-w-[280px]">{item.quantity}x {item.name}</span>
                <span className="font-bold">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-wider font-bold text-neutral-700">Total Amount</span>
            <span className="text-xl font-black text-neutral-900">
              ${order.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-neutral-600 mb-6 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
          <ShieldCheck className="w-4 h-4 text-[#b8860b]" />
          <span>We've received your order and will notify you when it ships.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onViewOrders}
            className="w-full sm:flex-1 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View My Orders</span>
          </button>

          <button
            onClick={onContinueShopping}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-100 transition-all cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
