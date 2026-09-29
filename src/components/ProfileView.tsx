import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  ShoppingBag, 
  LogOut, 
  ShieldCheck, 
  Edit3, 
  Check, 
  X,
  CreditCard,
  Sparkles,
  KeyRound
} from 'lucide-react';

interface ProfileViewProps {
  onRequireAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onRequireAuth }) => {
  const { currentUser, isAuthenticated, isAdmin, logout, updateProfile } = useAuth();
  const { setActiveTab, userOrders, cartCount } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editAddress, setEditAddress] = useState(currentUser?.address || '');
  const [editCity, setEditCity] = useState(currentUser?.city || '');
  const [editState, setEditState] = useState(currentUser?.state || '');
  const [editPincode, setEditPincode] = useState(currentUser?.pincode || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200 flex items-center justify-center mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Sign in to your account</h2>
        <p className="text-sm text-neutral-500">
          Manage your delivery addresses, track orders, and view member privileges.
        </p>
        <button
          onClick={onRequireAuth}
          className="py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] transition-all cursor-pointer shadow-sm"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      address: editAddress.trim(),
      city: editCity.trim(),
      state: editState.trim(),
      pincode: editPincode.trim(),
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#d4af37] shadow-sm"
            />
            {isAdmin && (
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-neutral-900 text-[#f5d77f] border-2 border-white shadow">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-neutral-900">
                {currentUser.name}
              </h1>
              {isAdmin ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-neutral-900 text-[#f5d77f]">
                  Owner / Admin
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-[#b8860b] border border-amber-200">
                  Customer
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500">{currentUser.email}</p>
            <p className="text-xs text-neutral-400">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditName(currentUser.name);
              setEditPhone(currentUser.phone);
              setEditAddress(currentUser.address || '');
              setEditCity(currentUser.city || '');
              setEditState(currentUser.state || '');
              setEditPincode(currentUser.pincode || '');
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-300 hover:border-black text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => {
              logout();
              setActiveTab('home');
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile details updated successfully!</span>
        </div>
      )}

      {/* Account Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveTab('orders')}
          className="p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-[#d4af37] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-neutral-500 font-medium">Orders Placed</span>
            <p className="text-2xl font-black text-neutral-900">{userOrders.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-[#b8860b]">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('cart')}
          className="p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-[#d4af37] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-neutral-500 font-medium">Items in Cart</span>
            <p className="text-2xl font-black text-neutral-900">{cartCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {isAdmin ? (
          <div 
            onClick={() => setActiveTab('admin')}
            className="p-5 rounded-2xl bg-neutral-900 text-white shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs text-[#f5d77f] font-bold">Owner Access</span>
              <p className="text-sm font-bold">Manage Products & Orders →</p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-800 text-[#d4af37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setActiveTab('search')}
            className="p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-[#d4af37] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs text-neutral-500 font-medium">Exclusive Deals</span>
              <p className="text-sm font-bold text-neutral-900">Browse Catalog →</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        )}
      </div>

      {/* Profile Details Information Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-6">
        <h3 className="font-extrabold text-lg text-neutral-900 border-b border-neutral-100 pb-3">
          Account Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#b8860b] mt-0.5 shrink-0" />
            <div>
              <span className="text-xs text-neutral-400 font-medium block">Email Address</span>
              <span className="font-semibold text-neutral-900">{currentUser.email}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-[#b8860b] mt-0.5 shrink-0" />
            <div>
              <span className="text-xs text-neutral-400 font-medium block">Phone Number</span>
              <span className="font-semibold text-neutral-900">{currentUser.phone || 'Not set'}</span>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#b8860b] mt-0.5 shrink-0" />
            <div>
              <span className="text-xs text-neutral-400 font-medium block">Default Shipping Address</span>
              <span className="font-semibold text-neutral-900">
                {currentUser.address 
                  ? `${currentUser.address}, ${currentUser.city || ''} ${currentUser.state || ''} ${currentUser.pincode || ''}`
                  : 'No address added yet. Click "Edit Profile" above to configure your shipping address.'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Portal Link */}
      <div className="pt-2 pb-4 text-center">
        <button
          onClick={() => setActiveTab('admin')}
          className="text-xs text-neutral-400 hover:text-neutral-700 font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <span>{isAdmin ? 'Go to MR.Premium Owner Dashboard →' : 'MR.Premium Store Owner Portal Access →'}</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-lg my-auto rounded-3xl bg-white border border-neutral-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-neutral-900">
              Edit Profile Information
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                  Street Address
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Street and house / apartment number"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-neutral-900 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-xs text-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-xs text-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Pincode</label>
                  <input
                    type="text"
                    value={editPincode}
                    onChange={(e) => setEditPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-xs text-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] transition-all cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
