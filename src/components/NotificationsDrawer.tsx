import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Bell, Package, Tag, Info, Check } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const { 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    notifications, 
    markAsRead,
    setActiveTab
  } = useStore();

  if (!isNotificationsOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-[#b8860b]" />;
      case 'promo':
        return <Tag className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsNotificationsOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-[#b8860b]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-neutral-900 text-base">
                  Notifications
                </h3>
                <span className="text-[11px] text-neutral-500 font-medium">
                  Order updates & marketplace alerts
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-2 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markAsRead(notif.id);
                    if (notif.type === 'order') {
                      setIsNotificationsOpen(false);
                      setActiveTab('orders');
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-neutral-50 border-neutral-200 opacity-80'
                      : 'bg-amber-50/40 border-[#d4af37]/60 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white border border-neutral-200 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed mb-2">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 px-4">
                <Bell className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                <p className="text-xs text-neutral-500">No new notifications.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-100 bg-neutral-50 text-center">
            <span className="text-[11px] text-neutral-400 font-medium">
              MR.Premium • Verified Marketplace Alerts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
