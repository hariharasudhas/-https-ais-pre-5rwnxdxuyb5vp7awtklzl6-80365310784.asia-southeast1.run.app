import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Product, ProductStatus, Order, OrderStatus } from '../types';
import { getUsers } from '../services/db';
import { MrLogo } from './MrLogo';
import { formatPrice, calculateDiscountPercent, formatDiscountText } from '../utils/format';
import { 
  Plus, 
  Package, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Edit3, 
  Trash2, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  EyeOff, 
  ArrowLeft, 
  Search, 
  Boxes, 
  DollarSign, 
  Clock, 
  ShieldAlert, 
  LogOut, 
  FolderPlus,
  RefreshCw,
  SlidersHorizontal,
  Lock,
  Mail
} from 'lucide-react';

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PRESET_COLORS = ['Pink', 'Black', 'White', 'Blue', 'Red', 'Green', 'Gold', 'Silver', 'Yellow'];

export const AdminPanel: React.FC = () => {
  const { isAdmin, currentUser, logout, ownerLogin } = useAuth();
  const { 
    products, 
    addProduct, 
    updateProduct, 
    updateStock, 
    deleteProduct, 
    categories, 
    addCategory,
    allOrders, 
    updateOrderStatus, 
    setActiveTab 
  } = useStore();

  // Owner Login Form State
  const [ownerEmail, setOwnerEmail] = useState('owner@mrpremium.com');
  const [ownerPassword, setOwnerPassword] = useState('admin123');
  const [ownerLoginError, setOwnerLoginError] = useState<string | null>(null);
  const [isOwnerLoggingIn, setIsOwnerLoggingIn] = useState(false);

  // Active view: 'dashboard' | 'add-product' | 'my-products' | 'orders' | 'customers' | 'payments'
  const [activeView, setActiveView] = useState<'dashboard' | 'add-product' | 'my-products' | 'orders' | 'customers' | 'payments'>('dashboard');

  // Success Toast Banner
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State for Add / Edit Product
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Fashion');
  const [formBrand, setFormBrand] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | ''>(999);
  const [formSellingPrice, setFormSellingPrice] = useState<number | ''>(699);
  const [formStock, setFormStock] = useState<number | ''>(20);
  const [formSizes, setFormSizes] = useState<string[]>(['M', 'L']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [formColors, setFormColors] = useState<string[]>(['Pink', 'Black']);
  const [customColorInput, setCustomColorInput] = useState('');
  const [formStatus, setFormStatus] = useState<ProductStatus>('Available');
  const [manualStatusOverride, setManualStatusOverride] = useState(false);
  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);

  // Quick Stock Update Modal
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [quickStockValue, setQuickStockValue] = useState<number>(0);

  // Delete Confirmation Modal
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  // New Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Filters for My Products
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStatusFilter, setProductStatusFilter] = useState('All');

  // Customer Registry
  const registeredUsers = getUsers();
  const [customerSearch, setCustomerSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const handleOwnerLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerLoginError(null);
    setIsOwnerLoggingIn(true);
    const res = await ownerLogin(ownerEmail, ownerPassword);
    setIsOwnerLoggingIn(false);
    if (!res.success) {
      setOwnerLoginError(res.error || 'Failed to authenticate owner credentials.');
    } else {
      setActiveView('dashboard');
    }
  };

  // SECURE OWNER LOGIN SCREEN (Spec Section 1)
  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 bg-[#f9fafb]">
        <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200 shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          {/* Brand & Emblem */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <MrLogo size="lg" showTagline />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-[#f5d77f] text-[10px] font-black uppercase tracking-widest mt-2">
              <Lock className="w-3 h-3" />
              <span>Owner Access Only</span>
            </div>
            <h2 className="text-2xl font-black text-neutral-900 pt-1">
              Owner Login
            </h2>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Sign in with your verified store owner credentials to access the <strong>MR.Premium Owner Dashboard</strong> and manage inventory.
            </p>
          </div>

          {/* Customer Warning if logged in as customer */}
          {currentUser && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Currently Signed in as Customer</span>
              </p>
              <p className="text-neutral-600 text-[11px]">
                Active account: <strong>{currentUser.email}</strong>. Customers cannot access product management. Enter owner credentials below to elevate to Owner.
              </p>
            </div>
          )}

          {/* Error Banner */}
          {ownerLoginError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{ownerLoginError}</span>
            </div>
          )}

          {/* Owner Login Form */}
          <form onSubmit={handleOwnerLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Owner Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5" />
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="owner@mrpremium.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5" />
                <input
                  type="password"
                  required
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Quick Demo Helper */}
            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600 flex items-center justify-between">
              <span>Demo Owner: <strong>owner@mrpremium.com</strong></span>
              <button
                type="button"
                onClick={() => {
                  setOwnerEmail('owner@mrpremium.com');
                  setOwnerPassword('admin123');
                  setOwnerLoginError(null);
                }}
                className="text-[#b8860b] hover:text-black font-bold cursor-pointer hover:underline"
              >
                Auto-fill
              </button>
            </div>

            <button
              type="submit"
              disabled={isOwnerLoggingIn}
              className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isOwnerLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Owner...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Return to Customer Home */}
          <div className="pt-2 text-center border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="text-xs text-neutral-500 hover:text-neutral-900 font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Store</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Aggregates
  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.status === 'Available' && p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock <= 0 || p.status === 'Out of Stock').length;
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(o => o.status === 'Pending').length;
  const totalSales = allOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);

  // Reset form for Add Product
  const resetFormForAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDescription('');
    setFormCategory(categories[0]?.name || 'Fashion');
    setFormBrand('');
    setFormOriginalPrice('');
    setFormSellingPrice('');
    setFormStock(20);
    setFormSizes([]);
    setFormColors([]);
    setFormStatus('Available');
    setManualStatusOverride(false);
    setFormImages([]);
    setImageUrlInput('');
    setFormErrors({});
  };

  const handleOpenAddProduct = () => {
    resetFormForAdd();
    setActiveView('add-product');
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormDescription(p.description);
    setFormCategory(p.category);
    setFormBrand(p.brand || '');
    setFormOriginalPrice(p.originalPrice);
    setFormSellingPrice(p.discountPrice || p.sellingPrice || p.originalPrice);
    setFormStock(p.stock);
    setFormSizes(p.sizes || []);
    setFormColors(p.colors || []);
    setFormStatus(p.status || (p.stock > 0 ? 'Available' : 'Out of Stock'));
    setManualStatusOverride(p.status === 'Hidden');
    setFormImages(p.images && p.images.length > 0 ? [...p.images] : []);
    setImageUrlInput('');
    setFormErrors({});
    setActiveView('add-product');
  };

  // Automatically calculate discount percentage in real-time
  const calculatedDiscount = (typeof formOriginalPrice === 'number' && typeof formSellingPrice === 'number' && formOriginalPrice > formSellingPrice)
    ? calculateDiscountPercent(formOriginalPrice, formSellingPrice)
    : 0;

  // Handle stock change with automatic status determination
  const handleStockChange = (val: number | '') => {
    setFormStock(val);
    if (!manualStatusOverride) {
      if (typeof val === 'number') {
        setFormStatus(val > 0 ? 'Available' : 'Out of Stock');
      }
    }
  };

  // Image Upload handler (multiple files from device)
  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  // Replace image at specific index
  const handleReplaceImageClick = (idx: number) => {
    setReplaceTargetIndex(idx);
    replaceFileInputRef.current?.click();
  };

  const handleDeviceReplaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replaceTargetIndex === null) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const newImg = reader.result as string;
        setFormImages(prev => prev.map((img, idx) => idx === replaceTargetIndex ? newImg : img));
        setReplaceTargetIndex(null);
      }
    };
    reader.readAsDataURL(file);

    if (e.target) e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setFormImages(prev => [...prev, url]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== index));
  };

  // Variant helpers
  const toggleSize = (s: string) => {
    setFormSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const addCustomSize = () => {
    const val = customSizeInput.trim().toUpperCase();
    if (val && !formSizes.includes(val)) {
      setFormSizes(prev => [...prev, val]);
      setCustomSizeInput('');
    }
  };

  const toggleColor = (c: string) => {
    setFormColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const addCustomColor = () => {
    const val = customColorInput.trim();
    if (val && !formColors.includes(val)) {
      setFormColors(prev => [...prev, val]);
      setCustomColorInput('');
    }
  };

  // Handle Save (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formName.trim()) errors.name = 'Product name is required';
    if (!formDescription.trim()) errors.description = 'Product description is required';
    if (!formCategory.trim()) errors.category = 'Category is required';
    if (formSellingPrice === '' || Number(formSellingPrice) <= 0) errors.sellingPrice = 'Enter a valid selling price';
    if (formStock === '' || Number(formStock) < 0) errors.stock = 'Enter a valid stock quantity';
    if (formImages.length === 0) errors.images = 'Please upload at least one product image';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const sellPrice = Number(formSellingPrice);
    const origPrice = formOriginalPrice !== '' && Number(formOriginalPrice) > 0 
      ? Number(formOriginalPrice) 
      : sellPrice;
    const discountPct = origPrice > sellPrice ? calculateDiscountPercent(origPrice, sellPrice) : 0;
    const stockQty = Number(formStock);

    // Final status check
    const finalStatus: ProductStatus = formStatus === 'Hidden' 
      ? 'Hidden' 
      : (stockQty > 0 ? 'Available' : 'Out of Stock');

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: formName.trim(),
        description: formDescription.trim(),
        category: formCategory,
        brand: formBrand.trim() || 'MR.Premium',
        originalPrice: origPrice,
        discountPrice: sellPrice,
        sellingPrice: sellPrice,
        discountPercent: discountPct,
        discount: discountPct,
        stock: stockQty,
        sizes: formSizes,
        colors: formColors,
        status: finalStatus,
        images: formImages,
      });
      setSuccessToast('Product Updated Successfully ✓');
    } else {
      addProduct({
        name: formName.trim(),
        description: formDescription.trim(),
        category: formCategory,
        brand: formBrand.trim() || 'MR.Premium',
        originalPrice: origPrice,
        discountPrice: sellPrice,
        sellingPrice: sellPrice,
        discountPercent: discountPct,
        discount: discountPct,
        stock: stockQty,
        sizes: formSizes,
        colors: formColors,
        status: finalStatus,
        images: formImages,
        rating: 5.0,
        reviewsCount: 1,
        featured: true,
        popular: true,
        newArrival: true,
      });
      setSuccessToast('Product Added Successfully ✓');
    }

    setTimeout(() => setSuccessToast(null), 3500);
    setActiveView('my-products');
  };

  // Quick Stock Update Action
  const handleQuickStockSave = () => {
    if (!stockModalProduct) return;
    updateStock(stockModalProduct.id, quickStockValue);
    setSuccessToast(`Stock for "${stockModalProduct.name}" updated to ${quickStockValue} ✓`);
    setTimeout(() => setSuccessToast(null), 2500);
    setStockModalProduct(null);
  };

  // Delete Action
  const handleConfirmDelete = () => {
    if (!deleteConfirmProduct) return;
    deleteProduct(deleteConfirmProduct.id);
    setSuccessToast('Product Deleted Successfully ✓');
    setTimeout(() => setSuccessToast(null), 2500);
    setDeleteConfirmProduct(null);
  };

  // New Category Creation
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory({
      name: newCategoryName.trim(),
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      itemCount: 0
    });
    setFormCategory(newCategoryName.trim());
    setNewCategoryName('');
    setIsCategoryModalOpen(false);
  };

  // Filtered Products for My Products view
  const filteredProducts = products.filter(p => {
    const matchesSearch = !productSearch || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase())) ||
      (p.productId && p.productId.toLowerCase().includes(productSearch.toLowerCase()));

    const matchesCat = productCategoryFilter === 'All' || p.category.toLowerCase() === productCategoryFilter.toLowerCase();
    const matchesStatus = productStatusFilter === 'All' || p.status === productStatusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="w-full min-h-[calc(100vh-140px)] pb-16 bg-[#f9fafb]">
      
      {/* Top Header Bar */}
      <section className="bg-white border-b border-neutral-200/80 sticky top-16 md:top-20 z-30 shadow-xs py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MrLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-neutral-900 text-[#f5d77f]">
                  Owner Portal
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
                  MR.Premium Owner Dashboard
                </h1>
              </div>
              <p className="text-xs text-neutral-500">
                Connected Owner: <strong className="text-neutral-800">{currentUser?.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-300 hover:border-black text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Customer Store</span>
            </button>

            <button
              onClick={() => {
                logout();
                setActiveTab('home');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-bold transition-colors cursor-pointer"
              title="Logout Owner Session"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Navigation Buttons:
            + Add Product | My Products | Orders | Customers | Payments */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 pt-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'dashboard'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={handleOpenAddProduct}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'add-product'
                ? 'bg-[#d4af37] text-neutral-900 shadow-sm'
                : 'bg-amber-50 text-[#b8860b] border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Product</span>
          </button>

          <button
            onClick={() => setActiveView('my-products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'my-products'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveView('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'orders'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({allOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveView('customers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'customers'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({registeredUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveView('payments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'payments'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payments</span>
          </button>
        </div>
      </section>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {/* ================= 1. OWNER DASHBOARD VIEW ================= */}
        {activeView === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">
                MR.Premium Owner Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                Real-time inventory metrics, order fulfillment, and business summary
              </p>
            </div>

            {/* Dashboard cards requested:
                * Total Products
                * Available Products
                * Out of Stock
                * Total Orders
                * Pending Orders
                * Total Sales */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Products</span>
                  <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                    <Boxes className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-neutral-900">{totalProducts}</p>
                <span className="text-[10px] text-neutral-400 block">{categories.length} categories</span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Available</span>
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-emerald-700">{availableProducts}</p>
                <span className="text-[10px] text-emerald-600 font-semibold block">In Stock</span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Out of Stock</span>
                  <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-red-600">{outOfStockProducts}</p>
                <span className="text-[10px] text-red-500 font-semibold block">Restock Needed</span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Orders</span>
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-neutral-900">{totalOrders}</p>
                <span className="text-[10px] text-neutral-400 block">All time</span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Pending Orders</span>
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-amber-600">{pendingOrders}</p>
                <span className="text-[10px] text-amber-600 font-semibold block">Action required</span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Sales</span>
                  <div className="p-1.5 rounded-lg bg-amber-50 text-[#b8860b]">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-black text-neutral-900">{formatPrice(totalSales)}</p>
                <span className="text-[10px] text-emerald-600 font-bold block">Gross revenue</span>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div 
                onClick={handleOpenAddProduct}
                className="p-6 rounded-3xl bg-neutral-900 text-white shadow-sm hover:shadow-lg cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#d4af37] text-neutral-900 flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h3 className="font-black text-lg mb-1">+ Add New Product</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Upload images from device, set original price, selling price, automatic discount calculation, stock, sizes, and colors.
                  </p>
                </div>
                <span className="text-xs font-extrabold text-[#f5d77f] mt-4 flex items-center gap-1">
                  Launch Add Product Form →
                </span>
              </div>

              <div 
                onClick={() => setActiveView('my-products')}
                className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs hover:border-[#d4af37] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#b8860b] flex items-center justify-center mb-4">
                    <Package className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-neutral-900 mb-1">My Products</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Manage all products added by Owner. Edit descriptions, delete items, or update stock with immediate customer synchronization.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#b8860b] mt-4 flex items-center gap-1">
                  Open My Products ({products.length}) →
                </span>
              </div>

              <div 
                onClick={() => setActiveView('orders')}
                className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs hover:border-[#d4af37] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-neutral-900 mb-1">Customer Orders</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Review incoming customer transactions, customer delivery details, and change fulfillment status in real-time.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600 mt-4 flex items-center gap-1">
                  Fulfill Orders ({allOrders.length}) →
                </span>
              </div>
            </div>

            {/* Quick Live Preview of Owner's Catalog */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-neutral-900">
                  Recently Managed Inventory
                </h3>
                <button
                  onClick={() => setActiveView('my-products')}
                  className="text-xs font-bold text-[#b8860b] hover:text-black cursor-pointer"
                >
                  View All {products.length} Products →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.slice(0, 4).map((p) => {
                  const discountPct = p.discountPercent || calculateDiscountPercent(p.originalPrice, p.discountPrice || p.sellingPrice || p.originalPrice);
                  return (
                    <div key={p.id} className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex items-center gap-3">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80'}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-neutral-900 truncate">{p.name}</h4>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-black text-neutral-900">{formatPrice(p.discountPrice || p.sellingPrice || p.originalPrice)}</span>
                          {discountPct > 0 && (
                            <span className="text-[10px] font-bold text-emerald-700">{discountPct}% OFF</span>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold ${p.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                          Stock: {p.stock}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. ADD / EDIT PRODUCT PAGE ================= */}
        {activeView === 'add-product' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <h2 className="text-2xl font-black text-neutral-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs text-neutral-500">
                  {editingProduct 
                    ? 'Modify product specifications, images, pricing, or stock. Changes apply to the store instantly.' 
                    : 'Fill out the form below to publish a new product to MR.Premium.'
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveView('my-products')}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Back to My Products
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* SECTION: PRODUCT IMAGE (Section 3 of spec) */}
              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
                      <span>Upload Product Images</span>
                      <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-xs text-neutral-500">
                      The first image will be used as the main product image.
                    </p>
                  </div>

                  {formErrors.images && (
                    <span className="text-xs font-bold text-red-600">{formErrors.images}</span>
                  )}
                </div>

                {/* Previews Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-neutral-200 bg-neutral-100 shadow-xs">
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      
                      {/* Action Overlays */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleReplaceImageClick(idx)}
                          className="p-1.5 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Replace Image"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                          title="Remove Image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {idx === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-black bg-neutral-900 text-[#f5d77f] shadow">
                          Main Image
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Device File Upload Trigger */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-neutral-300 hover:border-[#d4af37] bg-neutral-50 hover:bg-amber-50/40 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors"
                  >
                    <Upload className="w-6 h-6 text-[#b8860b] mb-1.5" />
                    <span className="text-xs font-bold text-neutral-900">Select Image</span>
                    <span className="text-[10px] text-neutral-400">From Device</span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDeviceImageUpload}
                  className="hidden"
                />

                <input
                  ref={replaceFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleDeviceReplaceUpload}
                  className="hidden"
                />

                {/* Additional Web URL input */}
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Or paste external image URL (https://...)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-xs text-neutral-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-800 cursor-pointer"
                  >
                    Add Image
                  </button>
                </div>
              </div>

              {/* SECTION: PRODUCT INFORMATION (Section 4 of spec) */}
              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
                <h3 className="font-black text-sm text-neutral-900 uppercase tracking-wide">
                  Product Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Enter product name (e.g. Women Floral Kurti)"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none"
                    />
                    {formErrors.name && <span className="text-xs text-red-600 font-bold">{formErrors.name}</span>}
                  </div>

                  {/* Product Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Product Description *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Enter product description (e.g. Comfortable cotton floral kurti suitable for daily wear.)"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none resize-none leading-relaxed"
                    />
                    {formErrors.description && <span className="text-xs text-red-600 font-bold">{formErrors.description}</span>}
                  </div>

                  {/* Category */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                        Category *
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="text-xs font-bold text-[#b8860b] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Create Category</span>
                      </button>
                    </div>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none bg-white cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Brand (optional)
                    </label>
                    <input
                      type="text"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      placeholder="Enter brand name (e.g. MR.Premium)"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: PRICE DETAILS (Section 5 of spec) */}
              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
                <h3 className="font-black text-sm text-neutral-900 uppercase tracking-wide">
                  Price Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  {/* Original Price */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Original Price (₹)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-neutral-400 font-bold">₹</span>
                      <input
                        type="number"
                        min="1"
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="999"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Selling Price */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Selling Price (₹) *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-neutral-400 font-bold">₹</span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formSellingPrice}
                        onChange={(e) => setFormSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="699"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm font-bold text-neutral-900 outline-none"
                      />
                    </div>
                    {formErrors.sellingPrice && <span className="text-xs text-red-600 font-bold">{formErrors.sellingPrice}</span>}
                  </div>

                  {/* Automatically Calculated Discount */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Discount (Auto-calculated)
                    </label>
                    <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <span className="text-xs text-neutral-600 font-semibold">Savings</span>
                      <span className="text-sm font-black text-[#b8860b]">
                        {calculatedDiscount > 0 ? `${calculatedDiscount}% OFF` : '0% OFF'}
                      </span>
                    </div>
                  </div>
                </div>

                {calculatedDiscount > 0 && typeof formOriginalPrice === 'number' && typeof formSellingPrice === 'number' && (
                  <p className="text-xs text-emerald-700 font-semibold">
                    Customer saves ₹{formOriginalPrice - formSellingPrice} ({calculatedDiscount}% OFF) on this item.
                  </p>
                )}
              </div>

              {/* SECTION: STOCK DETAILS (Section 6 of spec) */}
              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
                <h3 className="font-black text-sm text-neutral-900 uppercase tracking-wide">
                  Stock Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formStock}
                      onChange={(e) => handleStockChange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="20"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm font-bold text-neutral-900 outline-none"
                    />
                    {formErrors.stock && <span className="text-xs text-red-600 font-bold">{formErrors.stock}</span>}
                  </div>

                  {/* Stock Status */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Stock Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => {
                        setFormStatus(e.target.value as ProductStatus);
                        setManualStatusOverride(true);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm font-bold text-neutral-900 outline-none bg-white cursor-pointer"
                    >
                      <option value="Available">Available (In Stock)</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="Hidden">Hidden (Owner Only)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION: PRODUCT VARIANTS (Section 7 of spec) */}
              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-5">
                <h3 className="font-black text-sm text-neutral-900 uppercase tracking-wide">
                  Product Variants
                </h3>

                {/* Size Variants */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Size (Select multiple)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_SIZES.map((sz) => {
                      const isSelected = formSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => toggleSize(sz)}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Size Addition */}
                  <div className="flex items-center gap-2 pt-1 max-w-sm">
                    <input
                      type="text"
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                      placeholder="Add custom size (e.g. Free Size, 42mm)"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 outline-none"
                    />
                    <button
                      type="button"
                      onClick={addCustomSize}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold cursor-pointer"
                    >
                      Add Size
                    </button>
                  </div>
                </div>

                {/* Color Variants */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Color (Select multiple)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((clr) => {
                      const isSelected = formColors.includes(clr);
                      return (
                        <button
                          key={clr}
                          type="button"
                          onClick={() => toggleColor(clr)}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#d4af37] text-neutral-900 shadow-sm ring-2 ring-[#d4af37]'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
                          }`}
                        >
                          {clr}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Color Addition */}
                  <div className="flex items-center gap-2 pt-1 max-w-sm">
                    <input
                      type="text"
                      value={customColorInput}
                      onChange={(e) => setCustomColorInput(e.target.value)}
                      placeholder="Add custom color (e.g. Navy, Rose Gold)"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 outline-none"
                    />
                    <button
                      type="button"
                      onClick={addCustomColor}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold cursor-pointer"
                    >
                      Add Color
                    </button>
                  </div>
                </div>
              </div>

              {/* Large Submit Button (Section 8 of spec) */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 hover:bg-[#b8860b] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-5 h-5 stroke-[3]" />
                  <span>{editingProduct ? 'Save Changes' : 'Add Product'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ================= 3. MY PRODUCTS PAGE (Section 9 of spec) ================= */}
        {activeView === 'my-products' && (
          <div className="space-y-6 animate-fadeIn pb-12">
            
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-neutral-900">
                  My Products ({filteredProducts.length})
                </h2>
                <p className="text-xs text-neutral-500">
                  Active products catalog managed by the Owner. Changes reflect immediately on customer Home and Search.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] transition-all cursor-pointer shadow-sm self-start md:self-auto"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Product</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search by name, brand, or Product ID..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-800 outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={productStatusFilter}
                  onChange={(e) => setProductStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-800 outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid:
                Each product card should show:
                * Product Image
                * Product Name
                * Category
                * Selling Price (e.g. ₹699)
                * Original Price ₹999
                * 30% OFF
                * Stock: 20
                * Status: Available
                Buttons:
                * Edit
                * Delete
                * Update Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const sellPrice = product.discountPrice || product.sellingPrice || product.originalPrice;
                const origPrice = product.originalPrice || sellPrice;
                const discountPct = product.discountPercent || (origPrice > sellPrice ? calculateDiscountPercent(origPrice, sellPrice) : 0);
                const isOut = product.stock <= 0 || product.status === 'Out of Stock';
                const isHidden = product.status === 'Hidden';

                return (
                  <div
                    key={product.id}
                    className="p-5 rounded-3xl bg-white border border-neutral-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Product Image */}
                      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-100 mb-3 border border-neutral-200">
                        <img
                          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Status Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          {isHidden ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-neutral-900 text-white shadow">
                              <EyeOff className="w-3 h-3" />
                              <span>Hidden</span>
                            </span>
                          ) : isOut ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-600 text-white shadow">
                              <AlertCircle className="w-3 h-3" />
                              <span>Out of Stock</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Available</span>
                            </span>
                          )}
                        </div>

                        {/* Category Badge */}
                        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-neutral-800 shadow border border-neutral-200">
                          {product.category}
                        </div>
                      </div>

                      {/* Product Name & Brand */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-neutral-500">
                          <span className="font-bold text-[#b8860b]">{product.brand || 'MR.Premium'}</span>
                          <span className="font-mono text-[10px]">{product.productId || product.id}</span>
                        </div>

                        <h3 className="font-black text-sm text-neutral-900 line-clamp-1">
                          {product.name}
                        </h3>

                        {/* Price Details */}
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-base font-black text-neutral-900">
                            {formatPrice(sellPrice)}
                          </span>
                          {origPrice > sellPrice && (
                            <span className="text-xs text-neutral-400 line-through">
                              Original Price {formatPrice(origPrice)}
                            </span>
                          )}
                          {discountPct > 0 && (
                            <span className="text-xs font-black text-emerald-700">
                              {discountPct}% OFF
                            </span>
                          )}
                        </div>

                        {/* Stock & Status Line */}
                        <div className="flex items-center justify-between pt-2 text-xs">
                          <span className="font-extrabold text-neutral-800">
                            Stock: <strong className="text-neutral-900">{product.stock}</strong>
                          </span>
                          <span className={`font-black ${isOut ? 'text-red-600' : isHidden ? 'text-neutral-500' : 'text-emerald-700'}`}>
                            Status: {product.status || (product.stock > 0 ? 'Available' : 'Out of Stock')}
                          </span>
                        </div>

                        {/* Variants pill if configured */}
                        {(product.sizes && product.sizes.length > 0 || product.colors && product.colors.length > 0) && (
                          <div className="pt-1.5 flex flex-wrap gap-1 text-[10px] text-neutral-500">
                            {product.sizes && product.sizes.length > 0 && (
                              <span className="bg-neutral-100 px-2 py-0.5 rounded-md">
                                Sizes: {product.sizes.join(', ')}
                              </span>
                            )}
                            {product.colors && product.colors.length > 0 && (
                              <span className="bg-neutral-100 px-2 py-0.5 rounded-md">
                                Colors: {product.colors.join(', ')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons required:
                        Edit | Delete | Update Stock */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setStockModalProduct(product);
                          setQuickStockValue(product.stock);
                        }}
                        className="flex-1 py-2 px-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        Update Stock
                      </button>

                      <button
                        onClick={() => handleOpenEditProduct(product)}
                        className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-[#b8860b] text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmProduct(product)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8 space-y-4">
                <Package className="w-10 h-10 text-neutral-300 mx-auto" />
                <h3 className="text-lg font-bold text-neutral-800">No products match your filter</h3>
                <p className="text-xs text-neutral-500">Try adjusting your search criteria or add a new product.</p>
                <button
                  onClick={handleOpenAddProduct}
                  className="py-2.5 px-6 rounded-xl font-bold text-xs uppercase text-white bg-neutral-900 hover:bg-[#b8860b]"
                >
                  + Add Product
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= 4. ORDERS VIEW ================= */}
        {activeView === 'orders' && (
          <div className="space-y-6 animate-fadeIn pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-neutral-900">
                  Customer Orders ({allOrders.length})
                </h2>
                <p className="text-xs text-neutral-500">
                  Manage orders, customer delivery addresses, and change fulfillment status in real-time
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 outline-none w-64 bg-white"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Address</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {allOrders
                      .filter(o => 
                        !orderSearch || 
                        o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                        o.customerName.toLowerCase().includes(orderSearch.toLowerCase())
                      )
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-black text-neutral-900">
                            #{order.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-neutral-900">{order.customerName}</p>
                            <p className="text-[11px] text-neutral-500">{order.customerPhone}</p>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-600 max-w-xs truncate">
                            {order.address}, {order.city}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-neutral-700">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                          </td>
                          <td className="py-3.5 px-4 font-black text-neutral-900 text-sm">
                            {formatPrice(order.total)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              order.status === 'Delivered' 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : order.status === 'Shipped'
                                ? 'bg-purple-50 text-purple-700'
                                : order.status === 'Packed'
                                ? 'bg-amber-50 text-[#b8860b]'
                                : order.status === 'Cancelled'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="bg-white border border-neutral-300 rounded-lg px-2 py-1 text-xs font-semibold text-neutral-800 focus:border-[#d4af37] outline-none cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. CUSTOMERS VIEW ================= */}
        {activeView === 'customers' && (
          <div className="space-y-6 animate-fadeIn pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-neutral-900">
                  Registered Customers ({registeredUsers.length})
                </h2>
                <p className="text-xs text-neutral-500">
                  Customer directory with verified accounts and total order engagement
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search customers..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 outline-none w-64 bg-white"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Customer Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Orders Placed</th>
                      <th className="py-3.5 px-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {registeredUsers
                      .filter(u => 
                        !customerSearch || 
                        u.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
                        u.email.toLowerCase().includes(customerSearch.toLowerCase())
                      )
                      .map((u) => {
                        const userOrderCount = allOrders.filter(o => o.userId === u.id).length;
                        return (
                          <tr key={u.id} className="hover:bg-neutral-50/60 transition-colors">
                            <td className="py-3.5 px-4 flex items-center gap-3">
                              <img
                                src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                                alt={u.name}
                                className="w-8 h-8 rounded-full object-cover border border-neutral-200 shrink-0"
                              />
                              <span className="font-bold text-neutral-900">{u.name}</span>
                            </td>
                            <td className="py-3.5 px-4 text-neutral-600">{u.email}</td>
                            <td className="py-3.5 px-4 text-neutral-600">{u.phone || 'N/A'}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                u.role === 'admin' ? 'bg-neutral-900 text-[#f5d77f]' : 'bg-neutral-100 text-neutral-700'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-neutral-900">{userOrderCount} orders</td>
                            <td className="py-3.5 px-4 text-neutral-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. PAYMENTS VIEW ================= */}
        {activeView === 'payments' && (
          <div className="space-y-6 animate-fadeIn pb-12">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">
                Payment & Settlement Summary
              </h2>
              <p className="text-xs text-neutral-500">
                Processed transactions, gateway statuses, and automated receipts
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Gross Sales Volume</span>
                <p className="text-3xl font-black text-neutral-900">{formatPrice(totalSales)}</p>
                <span className="text-xs text-emerald-600 font-bold">100% Verified settlements</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Average Order Value</span>
                <p className="text-3xl font-black text-neutral-900">
                  {totalOrders > 0 ? formatPrice(Math.round(totalSales / totalOrders)) : '₹0'}
                </p>
                <span className="text-xs text-neutral-500">Per transaction</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Payment Gateway</span>
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-extrabold text-neutral-900 text-lg">Active (Secure)</span>
                </div>
                <span className="text-xs text-neutral-500">UPI, Card, NetBanking & COD enabled</span>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-neutral-100">
                <h3 className="font-extrabold text-base text-neutral-900">Recent Payment Records</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {allOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50/60">
                        <td className="py-3 px-4 font-bold text-neutral-900">#{order.id}</td>
                        <td className="py-3 px-4 text-neutral-700">{order.customerName}</td>
                        <td className="py-3 px-4 text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-black text-neutral-900">{formatPrice(order.total)}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= MODAL: QUICK UPDATE STOCK ================= */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white border border-neutral-200 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setStockModalProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-base text-neutral-900">
              Update Stock Quantity
            </h3>
            <p className="text-xs text-neutral-500 line-clamp-1">
              {stockModalProduct.name}
            </p>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                Available Units in Inventory
              </label>
              <input
                type="number"
                min="0"
                value={quickStockValue}
                onChange={(e) => setQuickStockValue(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-lg font-black text-neutral-900 outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStockModalProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleQuickStockSave}
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-[#b8860b] text-white text-xs font-bold cursor-pointer"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION (Section 11 of spec) ================= */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-neutral-200 p-6 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-neutral-900">
              Delete Product?
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to delete this product?
              <br />
              <strong className="text-neutral-900 font-bold">"{deleteConfirmProduct.name}"</strong>
              <br />
              This will remove the product permanently from the database, Home page, Search page, and all catalog listings.
            </p>

            <div className="flex justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE CATEGORY ================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white border border-neutral-200 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-base text-neutral-900">
              Create New Category
            </h3>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Ethnic Wear / Footwear"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-[#b8860b] text-white text-xs font-bold cursor-pointer"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
