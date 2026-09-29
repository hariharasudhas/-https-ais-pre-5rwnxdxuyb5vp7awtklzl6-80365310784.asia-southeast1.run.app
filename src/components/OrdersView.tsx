import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';
import { 
  Package, 
  Calendar, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  X,
  ShoppingBag
} from 'lucide-react';

interface OrdersViewProps {
  onRequireAuth: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ onRequireAuth }) => {
  const { userOrders, setActiveTab } = useStore();
  const { isAuthenticated } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200 flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Sign in to view orders</h2>
        <p className="text-sm text-neutral-500">
          Access your purchase history, live tracking, and digital invoices.
        </p>
        <button
          onClick={onRequireAuth}
          className="py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] transition-all cursor-pointer shadow-sm"
        >
          Sign In
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'Packed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-[#b8860b] border border-amber-200">
            <Package className="w-3.5 h-3.5" />
            <span>Packed</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Truck className="w-3.5 h-3.5" />
            <span>Shipped</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 border border-neutral-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            View order details, delivery progress, and past purchases
          </p>
        </div>

        <button
          onClick={() => setActiveTab('search')}
          className="text-xs sm:text-sm font-bold text-[#b8860b] hover:text-black transition-colors cursor-pointer"
        >
          Browse Marketplace →
        </button>
      </div>

      {userOrders.length === 0 ? (
        <div className="max-w-md mx-auto py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900">
            No orders placed yet
          </h3>
          <p className="text-sm text-neutral-500">
            Your completed purchases will appear here with live shipping tracking.
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
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 hover:border-[#d4af37] shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-neutral-900 text-base">
                      Order #{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-neutral-500 block">Total</span>
                  <span className="text-lg font-black text-neutral-900">
                    ${order.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items summary preview */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="relative group shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover border border-neutral-200"
                        title={`${item.name} (x${item.quantity})`}
                      />
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-neutral-900 text-white shadow">
                        {item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="pl-2">
                    <span className="text-xs font-semibold text-neutral-600 block">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Delivery to {order.address}, {order.city}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#b8860b]">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-white border border-neutral-200 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            {/* Close */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-neutral-900">
                  Order #{selectedOrder.id}
                </h3>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <p className="text-xs text-neutral-500">
                Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Purchased Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-neutral-100">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border border-neutral-200 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-bold text-neutral-900">{item.name}</p>
                        <p className="text-[11px] text-neutral-500">Qty: {item.quantity} × ${item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-neutral-900">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1 text-xs">
              <h5 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                Shipping Address
              </h5>
              <p className="font-semibold text-neutral-800">{selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
              <p className="text-neutral-600">{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
            </div>

            {/* Financial Summary */}
            <div className="pt-2 border-t border-neutral-200 space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>${selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-${selectedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline font-black text-neutral-900 text-base">
                <span>Total Paid</span>
                <span>${selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] transition-all cursor-pointer shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
