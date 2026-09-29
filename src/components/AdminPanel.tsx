import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Product, ProductStatus, Order, OrderStatus, User } from '../types';
import { getUsers } from '../services/db';
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
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Search, 
  Filter, 
  Boxes, 
  DollarSign,
  Tag,
  ShieldCheck,
  ShieldAlert,
  Save,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { isAdmin, currentUser } = useAuth();
  const { 
    products, 
    addProduct, 
    updateProduct, 
    updateStock, 
    deleteProduct, 
    categories, 
    allOrders, 
    updateOrderStatus, 
    setActiveTab 
  } = useStore();

  // Active view: 'dashboard' | 'add-product' | 'my-products' | 'orders' | 'customers' | 'payments'
  const [activeView, setActiveView] = useState<'dashboard' | 'add-product' | 'my-products' | 'orders' | 'customers' | 'payments'>('dashboard');

  // Success Notification Banner
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State for Add / Edit Product
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Fashion');
  const [formBrand, setFormBrand] = useState('MR.Premium');
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | ''>(120);
  const [formSellingPrice, setFormSellingPrice] = useState<number | ''>(99);
  const [formDiscount, setFormDiscount] = useState<number | ''>(18);
  const [formStock, setFormStock] = useState<number | ''>(15);
  const [formSizes, setFormSizes] = useState<string[]>(['M', 'L']);
  const [newSizeInput, setNewSizeInput] = useState('');
  const [formColors, setFormColors] = useState<string[]>(['Gold', 'Black']);
  const [newColorInput, setNewColorInput] = useState('');
  const [formStatus, setFormStatus] = useState<ProductStatus>('Available');
  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Stock Update Modal State
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [quickStockValue, setQuickStockValue] = useState<number>(0);

  // Delete Confirmation State
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  // Filter & Search in My Products
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStatusFilter, setProductStatusFilter] = useState('All');

  // Customer Registry
  const registeredUsers = getUsers();
  const [customerSearch, setCustomerSearch] = useState('');

  // Orders Filter
  const [orderSearch, setOrderSearch] = useState('');

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Access Restricted</h2>
        <p className="text-sm text-neutral-500">
          Only authorized store owners can view or manage products. Customers cannot access this portal.
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] transition-all cursor-pointer shadow-sm"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  // Dashboard Metrics
  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.status === 'Available' && p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock <= 0 || p.status === 'Out of Stock').length;
  const totalOrders = allOrders.length;
  const totalSales = allOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);

  // Reset form to blank for Add Product
  const resetFormForAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDescription('');
    setFormCategory(categories[0]?.name || 'Fashion');
    setFormBrand('MR.Premium');
    setFormOriginalPrice('');
    setFormSellingPrice('');
    setFormDiscount('');
    setFormStock(10);
    setFormSizes([]);
    setFormColors([]);
    setFormStatus('Available');
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
    setFormBrand(p.brand || 'MR.Premium');
    setFormOriginalPrice(p.originalPrice);
    setFormSellingPrice(p.discountPrice || p.sellingPrice || p.originalPrice);
    setFormDiscount(p.discountPercent || p.discount || 0);
    setFormStock(p.stock);
    setFormSizes(p.sizes || []);
    setFormColors(p.colors || []);
    setFormStatus(p.status || (p.stock > 0 ? 'Available' : 'Out of Stock'));
    setFormImages(p.images && p.images.length > 0 ? [...p.images] : []);
    setImageUrlInput('');
    setFormErrors({});
    setActiveView('add-product');
  };

  // Auto calculate discount percentage when prices change
  const handleOriginalPriceChange = (val: number | '') => {
    setFormOriginalPrice(val);
    if (typeof val === 'number' && typeof formSellingPrice === 'number' && val > 0) {
      if (val >= formSellingPrice) {
        setFormDiscount(Math.round(((val - formSellingPrice) / val) * 100));
      }
    }
  };

  const handleSellingPriceChange = (val: number | '') => {
    setFormSellingPrice(val);
    if (typeof formOriginalPrice === 'number' && typeof val === 'number' && formOriginalPrice > 0) {
      if (formOriginalPrice >= val) {
        setFormDiscount(Math.round(((formOriginalPrice - val) / formOriginalPrice) * 100));
      }
    }
  };

  // Image Upload handler (supports multiple file uploads from device)
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

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setFormImages(prev => [...prev, url]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddSize = () => {
    const s = newSizeInput.trim().toUpperCase();
    if (s && !formSizes.includes(s)) {
      setFormSizes(prev => [...prev, s]);
      setNewSizeInput('');
    }
  };

  const handleRemoveSize = (s: string) => {
    setFormSizes(prev => prev.filter(size => size !== s));
  };

  const handleAddColor = () => {
    const c = newColorInput.trim();
    if (c && !formColors.includes(c)) {
      setFormColors(prev => [...prev, c]);
      setNewColorInput('');
    }
  };

  const handleRemoveColor = (c: string) => {
    setFormColors(prev => prev.filter(color => color !== c));
  };

  // Form submission: Validate and save to database
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formName.trim()) errors.name = 'Product name is required';
    if (!formDescription.trim()) errors.description = 'Product description is required';
    if (!formCategory.trim()) errors.category = 'Category is required';
    if (formSellingPrice === '' || formSellingPrice <= 0) errors.sellingPrice = 'Valid selling price is required';
    if (formStock === '' || formStock < 0) errors.stock = 'Valid stock quantity is required';
    if (formImages.length === 0) errors.images = 'Please upload or provide at least one product image';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const origPrice = typeof formOriginalPrice === 'number' && formOriginalPrice > 0 
      ? formOriginalPrice 
      : Number(formSellingPrice);
    const sellPrice = Number(formSellingPrice);
    const discountPct = typeof formDiscount === 'number' 
      ? formDiscount 
      : (origPrice > sellPrice ? Math.round(((origPrice - sellPrice) / origPrice) * 100) : 0);
    const stockQty = Number(formStock);

    if (editingProduct) {
      // Update existing product everywhere
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
        status: formStatus,
        images: formImages,
      });
      setSuccessToast(`Product "${formName}" updated successfully!`);
    } else {
      // Add new product
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
        status: formStatus,
        images: formImages,
        rating: 5.0,
        reviewsCount: 1,
        featured: true,
        popular: true,
        newArrival: true,
      });
      setSuccessToast(`Product "${formName}" added successfully!`);
    }

    setTimeout(() => setSuccessToast(null), 3500);
    setActiveView('my-products');
  };

  // Quick Stock Update Action
  const handleQuickStockSave = () => {
    if (!stockModalProduct) return;
    updateStock(stockModalProduct.id, quickStockValue);
    setSuccessToast(`Stock for "${stockModalProduct.name}" updated to ${quickStockValue}!`);
    setTimeout(() => setSuccessToast(null), 2500);
    setStockModalProduct(null);
  };

  // Delete Action
  const handleConfirmDelete = () => {
    if (!deleteConfirmProduct) return;
    deleteProduct(deleteConfirmProduct.id);
    setSuccessToast(`Product "${deleteConfirmProduct.name}" was deleted successfully.`);
    setTimeout(() => setSuccessToast(null), 2500);
    setDeleteConfirmProduct(null);
  };

  // Filtered Products for "My Products" view
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
      {/* Top Banner / Owner Bar */}
      <section className="bg-white border-b border-neutral-200/80 sticky top-16 md:top-20 z-30 shadow-xs py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-neutral-900 text-[#f5d77f]">
                MR.Premium Owner
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
                Product Management System
              </h1>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Authorized Owner: <span className="font-semibold text-neutral-800">{currentUser?.email}</span>
            </p>
          </div>

          {/* Quick Exit to Marketplace */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-300 hover:border-black text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors self-start md:self-auto cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Marketplace Home</span>
          </button>
        </div>

        {/* Navigation Tabs Required by Owner Spec:
            + Add Product | My Products | Orders | Customers | Payments */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 pt-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
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
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* ================= 1. OWNER DASHBOARD VIEW ================= */}
        {activeView === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Owner Dashboard Header */}
            <div>
              <h2 className="text-2xl font-black text-neutral-900">
                MR.Premium Owner Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                Live performance summary, product inventory metrics, and revenue analytics
              </p>
            </div>

            {/* Metrics Cards:
                * Total Products
                * Available Products
                * Out of Stock
                * Total Orders
                * Total Sales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Products</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Boxes className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-neutral-900">{totalProducts}</p>
                <span className="text-[11px] text-neutral-400 block">{categories.length} categories</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Available Products</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-emerald-700">{availableProducts}</p>
                <span className="text-[11px] text-emerald-600 font-semibold block">In Stock & Active</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Out of Stock</span>
                  <div className="p-2 rounded-xl bg-red-50 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-red-600">{outOfStockProducts}</p>
                <span className="text-[11px] text-red-500 font-semibold block">Requires Restock</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-neutral-900">{totalOrders}</p>
                <span className="text-[11px] text-neutral-500 block">Customer purchases</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-[#b8860b]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-neutral-900">${totalSales.toLocaleString()}</p>
                <span className="text-[11px] text-emerald-600 font-bold block">Gross settlements</span>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={handleOpenAddProduct}
                className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-md hover:shadow-lg cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[#d4af37] text-neutral-900 flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h3 className="font-extrabold text-base mb-1">+ Add New Product</h3>
                  <p className="text-xs text-neutral-400">
                    Upload images from device, set prices, stock, sizes, and colors.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#f5d77f] mt-4 flex items-center gap-1">
                  Open Add Form →
                </span>
              </div>

              <div 
                onClick={() => setActiveView('my-products')}
                className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs hover:border-[#d4af37] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#b8860b] flex items-center justify-center mb-4">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-neutral-900 mb-1">My Products</h3>
                  <p className="text-xs text-neutral-500">
                    Manage catalog: edit pricing, update stock levels, delete items.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#b8860b] mt-4 flex items-center gap-1">
                  View Catalog ({products.length}) →
                </span>
              </div>

              <div 
                onClick={() => setActiveView('orders')}
                className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs hover:border-[#d4af37] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-neutral-900 mb-1">Customer Orders</h3>
                  <p className="text-xs text-neutral-500">
                    Review orders, manage fulfillment stages, and update status.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600 mt-4 flex items-center gap-1">
                  Review Orders ({allOrders.length}) →
                </span>
              </div>

              <div 
                onClick={() => setActiveView('payments')}
                className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs hover:border-[#d4af37] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-neutral-900 mb-1">Payment Ledger</h3>
                  <p className="text-xs text-neutral-500">
                    Transaction breakdown, payment gateway status, and settlements.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-600 mt-4 flex items-center gap-1">
                  View Payments →
                </span>
              </div>
            </div>

            {/* Recent Products Snapshot */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-neutral-900">
                  Recently Managed Products
                </h3>
                <button
                  onClick={() => setActiveView('my-products')}
                  className="text-xs font-bold text-[#b8860b] hover:text-black cursor-pointer"
                >
                  View All Products →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.slice(0, 4).map((p) => (
                  <div key={p.id} className="p-3.5 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex items-center gap-3">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80'}
                      alt={p.name}
                      className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-neutral-900 truncate">{p.name}</h4>
                      <p className="text-[11px] font-extrabold text-neutral-900">${(p.discountPrice || p.originalPrice).toLocaleString()}</p>
                      <span className={`text-[10px] font-bold ${p.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. ADD / EDIT PRODUCT FORM ================= */}
        {activeView === 'add-product' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <h2 className="text-2xl font-black text-neutral-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs text-neutral-500">
                  {editingProduct ? 'Update product information, pricing, stock and images' : 'Publish a new item directly to the MR.Premium marketplace'}
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
              {/* Product Images Upload Section */}
              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wide">
                      Product Images *
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Upload from your device or paste image URLs. Multiple images supported.
                    </p>
                  </div>

                  {formErrors.images && (
                    <span className="text-xs font-bold text-red-600">{formErrors.images}</span>
                  )}
                </div>

                {/* Image Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100">
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                        title="Remove Image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-neutral-900 text-[#f5d77f]">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Device File Upload Button */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-neutral-300 hover:border-[#d4af37] bg-neutral-50 hover:bg-amber-50/30 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors"
                  >
                    <Upload className="w-6 h-6 text-[#b8860b] mb-1" />
                    <span className="text-[11px] font-bold text-neutral-800">Upload Device</span>
                    <span className="text-[9px] text-neutral-400">JPG, PNG, WebP</span>
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

                {/* Additional URL Input */}
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
                    Add URL
                  </button>
                </div>
              </div>

              {/* Product Information Section */}
              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wide">
                  Product Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Signature Italian Wool Trench Coat"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none"
                    />
                    {formErrors.name && <span className="text-xs text-red-600 font-bold">{formErrors.name}</span>}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Category *
                    </label>
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
                      placeholder="e.g. MR.Premium / Milano Atelier"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Product Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Provide comprehensive details, materials, specs, and highlights..."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none resize-none"
                    />
                    {formErrors.description && <span className="text-xs text-red-600 font-bold">{formErrors.description}</span>}
                  </div>
                </div>
              </div>

              {/* Pricing & Stock Section */}
              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wide">
                  Pricing & Stock
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Original Price */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Original Price ($)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formOriginalPrice}
                      onChange={(e) => handleOriginalPriceChange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="120"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none"
                    />
                  </div>

                  {/* Selling Price */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Selling Price ($) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formSellingPrice}
                      onChange={(e) => handleSellingPriceChange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="99"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm font-bold text-neutral-900 outline-none"
                    />
                    {formErrors.sellingPrice && <span className="text-xs text-red-600 font-bold">{formErrors.sellingPrice}</span>}
                  </div>

                  {/* Discount Percentage */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={formDiscount}
                      onChange={(e) => setFormDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="15"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none"
                    />
                  </div>

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
                      onChange={(e) => setFormStock(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="25"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] text-sm text-neutral-900 outline-none font-bold"
                    />
                    {formErrors.stock && <span className="text-xs text-red-600 font-bold">{formErrors.stock}</span>}
                  </div>
                </div>
              </div>

              {/* Sizes & Colors Section */}
              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wide">
                  Sizes & Colors (Optional)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Sizes */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formSizes.map((s) => (
                        <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-900 border border-neutral-200">
                          <span>{s}</span>
                          <button type="button" onClick={() => handleRemoveSize(s)} className="text-neutral-400 hover:text-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newSizeInput}
                        onChange={(e) => setNewSizeInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSize(); } }}
                        placeholder="Add size (e.g. S, M, L, XL, 42mm)"
                        className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddSize}
                        className="px-3 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                      Available Colors
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formColors.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-900 border border-neutral-200">
                          <span>{c}</span>
                          <button type="button" onClick={() => handleRemoveColor(c)} className="text-neutral-400 hover:text-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newColorInput}
                        onChange={(e) => setNewColorInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddColor(); } }}
                        placeholder="Add color (e.g. Gold, Black, White)"
                        className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddColor}
                        className="px-3 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Status Radio */}
              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-3">
                <h3 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wide">
                  Product Visibility & Status
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                    formStatus === 'Available' ? 'border-emerald-600 bg-emerald-50/40' : 'border-neutral-200 hover:bg-neutral-50'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="Available"
                      checked={formStatus === 'Available'}
                      onChange={() => setFormStatus('Available')}
                      className="text-emerald-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">Available</span>
                      <span className="text-[10px] text-neutral-500">Live on Home & Search</span>
                    </div>
                  </label>

                  <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                    formStatus === 'Out of Stock' ? 'border-amber-600 bg-amber-50/40' : 'border-neutral-200 hover:bg-neutral-50'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="Out of Stock"
                      checked={formStatus === 'Out of Stock'}
                      onChange={() => setFormStatus('Out of Stock')}
                      className="text-amber-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">Out of Stock</span>
                      <span className="text-[10px] text-neutral-500">Visible but cannot be added to cart</span>
                    </div>
                  </label>

                  <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                    formStatus === 'Hidden' ? 'border-neutral-900 bg-neutral-100' : 'border-neutral-200 hover:bg-neutral-50'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="Hidden"
                      checked={formStatus === 'Hidden'}
                      onChange={() => setFormStatus('Hidden')}
                      className="text-neutral-900"
                    />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">Hidden</span>
                      <span className="text-[10px] text-neutral-500">Only visible in Owner Panel</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveView('my-products')}
                  className="px-6 py-3 rounded-2xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] active:scale-[0.98] transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{editingProduct ? 'Save Product Changes' : '+ Add Product'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= 3. MY PRODUCTS LIST VIEW ================= */}
        {activeView === 'my-products' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header with Search and Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-neutral-900">
                  My Products ({filteredProducts.length})
                </h2>
                <p className="text-xs text-neutral-500">
                  Owner inventory catalog with instant live updates to customer store
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] transition-all cursor-pointer shadow-sm self-start md:self-auto"
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
                {/* Category Filter */}
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

                {/* Status Filter */}
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

            {/* Product Cards List required by spec:
                Each product card should show:
                * Product image
                * Product name
                * Selling price
                * Stock
                * Category
                * Status
                Buttons:
                * Edit
                * Delete
                * Update Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const isOut = product.stock <= 0 || product.status === 'Out of Stock';
                const isHidden = product.status === 'Hidden';

                return (
                  <div
                    key={product.id}
                    className="p-5 rounded-3xl bg-white border border-neutral-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Image & Status Badge */}
                      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-100 mb-3 border border-neutral-200">
                        <img
                          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Status Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          {isHidden ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-900 text-white shadow">
                              <EyeOff className="w-3 h-3" />
                              <span>Hidden</span>
                            </span>
                          ) : isOut ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-600 text-white shadow">
                              <AlertCircle className="w-3 h-3" />
                              <span>Out of Stock</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Available</span>
                            </span>
                          )}
                        </div>

                        {/* Category */}
                        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-neutral-800 shadow border border-neutral-200">
                          {product.category}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-neutral-500">
                          <span className="font-semibold text-[#b8860b]">{product.brand || 'MR.Premium'}</span>
                          <span className="font-mono text-[10px]">{product.productId || product.id}</span>
                        </div>

                        <h3 className="font-bold text-sm text-neutral-900 line-clamp-1">
                          {product.name}
                        </h3>

                        {/* Selling Price & Stock */}
                        <div className="flex items-baseline justify-between pt-2">
                          <div>
                            <span className="text-base font-black text-neutral-900">
                              ${(product.discountPrice || product.sellingPrice || product.originalPrice).toLocaleString()}
                            </span>
                            {product.originalPrice > (product.discountPrice || product.sellingPrice || product.originalPrice) && (
                              <span className="text-xs text-neutral-400 line-through ml-2">
                                ${product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                            product.stock > 5 ? 'bg-emerald-50 text-emerald-700' : product.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {product.stock} in stock
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons required: Edit | Delete | Update Stock */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setStockModalProduct(product);
                          setQuickStockValue(product.stock);
                        }}
                        className="flex-1 py-2 px-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold transition-colors cursor-pointer text-center"
                      >
                        Update Stock
                      </button>

                      <button
                        onClick={() => handleOpenEditProduct(product)}
                        className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-[#b8860b] text-white text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
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
                <p className="text-xs text-neutral-500">Try clearing your search query or add a new product.</p>
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
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-neutral-900">
                  Customer Orders ({allOrders.length})
                </h2>
                <p className="text-xs text-neutral-500">
                  View full customer purchases, delivery addresses, and update fulfillment statuses
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
                            {order.items.reduce((s, i) => s + i.quantity, 0)} items
                          </td>
                          <td className="py-3.5 px-4 font-black text-neutral-900 text-sm">
                            ${order.total.toLocaleString()}
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
          <div className="space-y-6 animate-fadeIn">
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
          <div className="space-y-6 animate-fadeIn">
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
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Net Sales Volume</span>
                <p className="text-3xl font-black text-neutral-900">${totalSales.toLocaleString()}</p>
                <span className="text-xs text-emerald-600 font-bold">100% Verified settlements</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Average Order Value</span>
                <p className="text-3xl font-black text-neutral-900">
                  ${totalOrders > 0 ? Math.round(totalSales / totalOrders).toLocaleString() : '0'}
                </p>
                <span className="text-xs text-neutral-500">Per transaction</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Payment Gateway</span>
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-extrabold text-neutral-900 text-lg">Active (Encrypted)</span>
                </div>
                <span className="text-xs text-neutral-500">Card, UPI, COD enabled</span>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-neutral-100">
                <h3 className="font-extrabold text-base text-neutral-900">Recent Payment Records</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Transaction / Order</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Payment Method</th>
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
                        <td className="py-3 px-4 text-neutral-600">Online Card / Instant Checkout</td>
                        <td className="py-3 px-4 text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-black text-neutral-900">${order.total.toLocaleString()}</td>
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

            <h3 className="font-extrabold text-base text-neutral-900">
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

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-neutral-200 p-6 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-extrabold text-neutral-900">
              Delete Product?
            </h3>
            <p className="text-xs text-neutral-600">
              Are you sure you want to delete <span className="font-bold text-neutral-900">"{deleteConfirmProduct.name}"</span>?
              <br />
              This will remove the product permanently from the Home page, Search page, and all catalog listings.
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
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
