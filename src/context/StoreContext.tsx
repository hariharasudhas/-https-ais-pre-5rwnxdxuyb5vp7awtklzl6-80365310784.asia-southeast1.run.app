import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, OrderStatus, AppNotification } from '../types';
import { 
  getProducts, 
  saveProduct as persistProduct, 
  deleteProduct as removeProduct,
  updateProductStock as persistProductStock,
  getCategories,
  saveCategory as persistCategory,
  deleteCategory as removeCategory,
  getUserCart, 
  saveUserCart, 
  clearUserCart, 
  getUserOrders, 
  getAllOrders, 
  saveOrder as persistOrder, 
  updateOrderStatus as persistOrderStatus,
  getNotifications,
  addNotification as persistNotification,
  markNotificationAsRead as persistMarkRead
} from '../services/db';
import { useAuth } from './AuthContext';

export type NavigationTab = 'welcome' | 'home' | 'search' | 'cart' | 'orders' | 'profile' | 'admin' | 'checkout';

export function pathToTab(pathname: string): NavigationTab {
  const clean = pathname.toLowerCase().replace(/\/$/, '') || '/';
  if (clean === '/home') return 'home';
  if (clean === '/search') return 'search';
  if (clean === '/cart') return 'cart';
  if (clean === '/orders') return 'orders';
  if (clean === '/profile') return 'profile';
  if (clean === '/admin') return 'admin';
  if (clean === '/checkout') return 'checkout';
  return 'welcome';
}

export function tabToPath(tab: NavigationTab): string {
  switch (tab) {
    case 'home': return '/home';
    case 'search': return '/search';
    case 'cart': return '/cart';
    case 'orders': return '/orders';
    case 'profile': return '/profile';
    case 'admin': return '/admin';
    case 'checkout': return '/checkout';
    case 'welcome':
    default:
      return '/';
  }
}

export interface PlaceOrderData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod?: string;
  notes?: string;
}

interface StoreContextType {
  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedProduct: Product | null;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchResults: Product[];
  
  // Catalog
  products: Product[]; // all products (for owner)
  customerProducts: Product[]; // visible to customer (excludes Hidden)
  refreshProducts: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (product: Product) => void;
  updateStock: (productId: string, newStock: number) => void;
  deleteProduct: (productId: string) => void;

  // Categories (Dynamically manageable by owner)
  categories: Category[];
  refreshCategories: () => void;
  addCategory: (categoryData: Omit<Category, 'id'>) => Category;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  
  // Cart (Scoped to current user)
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, options?: { size?: string; color?: string }) => void;
  updateCartQuantity: (itemId: string, newQty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  
  // Orders
  userOrders: Order[];
  allOrders: Order[]; // For Admin
  placeOrder: (orderData: PlaceOrderData) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  lastPlacedOrder: Order | null;
  clearLastPlacedOrder: () => void;
  
  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markAsRead: (id: string) => void;
  sendNotification: (title: string, message: string, type?: AppNotification['type'], targetUserId?: string) => void;
  
  // Modals & Panels
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isFirebaseConfigOpen: boolean;
  setIsFirebaseConfigOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Navigation with URL routing
  const [activeTab, setActiveTabState] = useState<NavigationTab>(() => {
    if (typeof window !== 'undefined') {
      const tab = pathToTab(window.location.pathname);
      return tab;
    }
    return 'welcome';
  });

  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const targetPath = tabToPath(tab);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const tab = pathToTab(window.location.pathname);
        setActiveTabState(tab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Products & Categories
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Cart & Orders
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  
  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFirebaseConfigOpen, setIsFirebaseConfigOpen] = useState(false);

  // Load products & categories
  const refreshProducts = () => {
    const list = getProducts();
    setProducts(list);
  };

  const refreshCategories = () => {
    const list = getCategories();
    setCategories(list);
  };

  useEffect(() => {
    refreshProducts();
    refreshCategories();
  }, []);

  // When currentUser changes, sync user-specific cart and orders
  useEffect(() => {
    if (currentUser) {
      setCart(getUserCart(currentUser.id));
      setUserOrders(getUserOrders(currentUser.id));
      setNotifications(getNotifications(currentUser.id));
    } else {
      setCart([]);
      setUserOrders([]);
      setNotifications([]);
    }
    // Refresh all orders for admin
    setAllOrders(getAllOrders());
  }, [currentUser]);

  // Handle Cart Operations
  const addToCart = (product: Product, quantity = 1, options?: { size?: string; color?: string }) => {
    if (!currentUser) return;
    
    const existingIndex = cart.findIndex(item => 
      item.productId === product.id &&
      item.selectedSize === options?.size &&
      item.selectedColor === options?.color
    );
    let updatedCart: CartItem[];

    const unitPrice = product.discountPrice || product.originalPrice;

    if (existingIndex >= 0) {
      updatedCart = cart.map((item, idx) =>
        idx === existingIndex 
          ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) } 
          : item
      );
    } else {
      const newItem: CartItem = {
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        productId: product.id,
        name: product.name,
        category: product.category,
        brand: product.brand,
        price: unitPrice,
        originalPrice: product.originalPrice,
        image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        quantity: Math.min(product.stock, Math.max(1, quantity)),
        stock: product.stock,
        selectedSize: options?.size,
        selectedColor: options?.color,
        addedAt: new Date().toISOString()
      };
      updatedCart = [...cart, newItem];
    }

    setCart(updatedCart);
    saveUserCart(currentUser.id, updatedCart);
  };

  const updateCartQuantity = (itemId: string, newQty: number) => {
    if (!currentUser) return;
    let updated: CartItem[];
    if (newQty <= 0) {
      updated = cart.filter(item => item.id !== itemId);
    } else {
      updated = cart.map(item => item.id === itemId ? { ...item, quantity: Math.min(item.stock, newQty) } : item);
    }
    setCart(updated);
    saveUserCart(currentUser.id, updated);
  };

  const removeFromCart = (itemId: string) => {
    if (!currentUser) return;
    const updated = cart.filter(item => item.id !== itemId);
    setCart(updated);
    saveUserCart(currentUser.id, updated);
  };

  const clearCart = () => {
    if (!currentUser) return;
    setCart([]);
    clearUserCart(currentUser.id);
  };

  // Cart Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartOriginalSubtotal = cart.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartDiscount = Math.max(0, cartOriginalSubtotal - cartSubtotal);
  const cartTotal = cartSubtotal;

  // Checkout and Order Creation
  const placeOrder = async (orderData: PlaceOrderData): Promise<Order> => {
    if (!currentUser) throw new Error('Authentication required to place orders.');
    if (cart.length === 0) throw new Error('Your cart is empty.');

    const uniqueOrderId = 'MRP-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      id: uniqueOrderId,
      userId: currentUser.id,
      customerName: orderData.fullName,
      customerEmail: orderData.email,
      customerPhone: orderData.phone,
      address: orderData.address,
      city: orderData.city,
      state: orderData.state,
      pincode: orderData.pincode,
      items: [...cart],
      subtotal: cartOriginalSubtotal > 0 ? cartOriginalSubtotal : cartSubtotal,
      discount: cartDiscount,
      total: cartTotal,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    persistOrder(newOrder);
    clearCart();
    refreshProducts(); // Refresh products to reflect reduced stock
    
    // Refresh orders
    setUserOrders(prev => [newOrder, ...prev]);
    setAllOrders(prev => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);

    // Send order confirmation notification
    sendNotification(
      'Order Confirmed #' + uniqueOrderId,
      `Your order for ${newOrder.items.length} item(s) totaling $${newOrder.total.toLocaleString()} has been placed successfully.`,
      'order',
      currentUser.id
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    persistOrderStatus(orderId, status);
    
    // Update local state
    setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
    setUserOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));

    // Notify the customer
    const targetOrder = allOrders.find(o => o.id === orderId);
    if (targetOrder) {
      sendNotification(
        `Order Status Updated: ${status}`,
        `Your order #${orderId} is now marked as "${status}".`,
        'order',
        targetOrder.userId
      );
    }
  };

  const clearLastPlacedOrder = () => setLastPlacedOrder(null);

  // Owner/Admin Product Operations
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const uniqueId = 'MRP-PRD-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newProduct: Product = {
      id: uniqueId,
      productId: uniqueId,
      ownerId: currentUser?.id || 'owner_admin',
      name: productData.name,
      description: productData.description,
      category: productData.category,
      brand: productData.brand || 'MR.Premium',
      originalPrice: productData.originalPrice,
      discountPrice: productData.discountPrice,
      sellingPrice: productData.discountPrice,
      discountPercent: productData.discountPercent || (productData.originalPrice > productData.discountPrice ? Math.round(((productData.originalPrice - productData.discountPrice) / productData.originalPrice) * 100) : 0),
      discount: productData.discountPercent || 0,
      stock: productData.stock,
      images: productData.images && productData.images.length > 0 ? productData.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
      sizes: productData.sizes || [],
      colors: productData.colors || [],
      status: productData.status || (productData.stock > 0 ? 'Available' : 'Out of Stock'),
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 1,
      featured: productData.featured || false,
      popular: productData.popular || false,
      newArrival: productData.newArrival !== undefined ? productData.newArrival : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    persistProduct(newProduct);
    refreshProducts();
    return newProduct;
  };

  const updateProduct = (product: Product) => {
    const updated: Product = {
      ...product,
      productId: product.productId || product.id,
      sellingPrice: product.discountPrice,
      discount: product.discountPercent,
      status: product.status || (product.stock > 0 ? 'Available' : 'Out of Stock'),
      updatedAt: new Date().toISOString()
    };
    persistProduct(updated);
    refreshProducts();
    if (selectedProduct?.id === product.id) {
      setSelectedProduct(updated);
    }
  };

  const updateStock = (productId: string, newStock: number) => {
    persistProductStock(productId, newStock);
    refreshProducts();
  };

  const deleteProduct = (productId: string) => {
    removeProduct(productId);
    refreshProducts();
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  // Owner/Admin Category Operations
  const addCategory = (categoryData: Omit<Category, 'id'>): Category => {
    const id = 'cat-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5);
    const newCategory: Category = {
      id,
      ...categoryData
    };
    persistCategory(newCategory);
    refreshCategories();
    return newCategory;
  };

  const updateCategory = (category: Category) => {
    persistCategory(category);
    refreshCategories();
  };

  const deleteCategory = (categoryId: string) => {
    removeCategory(categoryId);
    refreshCategories();
  };

  // Customer visible products (never show Hidden products to customers)
  const customerProducts = products.filter(p => p.status !== 'Hidden');

  // Search Results Filtering: Product name, Category, Brand, Description
  const searchResults = customerProducts.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;
    
    const matchesName = item.name.toLowerCase().includes(query);
    const matchesCategoryName = item.category.toLowerCase().includes(query);
    const matchesBrand = !!item.brand && item.brand.toLowerCase().includes(query);
    const matchesDesc = item.description.toLowerCase().includes(query);

    return matchesCategory && (matchesName || matchesCategoryName || matchesBrand || matchesDesc);
  });

  // Notifications
  const sendNotification = (
    title: string, 
    message: string, 
    type: AppNotification['type'] = 'system',
    targetUserId: string = 'all'
  ) => {
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      userId: targetUserId,
      title,
      message,
      date: new Date().toISOString(),
      read: false,
      type
    };
    persistNotification(newNotif);
    if (!currentUser || targetUserId === 'all' || targetUserId === currentUser.id) {
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const markAsRead = (id: string) => {
    persistMarkRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  return (
    <StoreContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProduct,
        openProductDetail,
        closeProductDetail,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        searchResults,
        products,
        customerProducts,
        refreshProducts,
        addProduct,
        updateProduct,
        updateStock,
        deleteProduct,
        categories,
        refreshCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        userOrders,
        allOrders,
        placeOrder,
        updateOrderStatus,
        lastPlacedOrder,
        clearLastPlacedOrder,
        notifications,
        unreadNotificationsCount,
        markAsRead,
        sendNotification,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isFirebaseConfigOpen,
        setIsFirebaseConfigOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
