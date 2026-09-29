import { User, Product, Category, CartItem, Order, OrderStatus, AppNotification, FirebaseConfig } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/initialProducts';

const STORAGE_KEYS = {
  USERS: 'mr_premium_users_v2',
  PRODUCTS: 'mr_premium_products_v2',
  CATEGORIES: 'mr_premium_categories_v2',
  ORDERS: 'mr_premium_orders_v2',
  CARTS: 'mr_premium_carts_v2',
  ADMINS: 'mr_premium_admins_v2',
  NOTIFICATIONS: 'mr_premium_notifs_v2',
  CURRENT_USER_ID: 'mr_premium_session_uid_v2',
};

// Seed default products and categories if not present
function initializeDatabase() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }

  // Ensure default admin registry contains owner email
  const existingAdmins = getAdmins();
  const defaultOwnerEmail = 'hariharasudhaselvakumar25@gmail.com';
  if (!existingAdmins.includes(defaultOwnerEmail)) {
    existingAdmins.push(defaultOwnerEmail);
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(existingAdmins));
  }
}

// Admins Collection
export function getAdmins(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMINS);
    return raw ? JSON.parse(raw) : ['hariharasudhaselvakumar25@gmail.com', 'owner@mrpremium.com', 'admin@mrpremium.com'];
  } catch {
    return ['hariharasudhaselvakumar25@gmail.com', 'owner@mrpremium.com'];
  }
}

export function isUserAdmin(email?: string | null, userId?: string): boolean {
  if (!email && !userId) return false;
  const admins = getAdmins().map(e => e.toLowerCase());
  if (email && admins.includes(email.toLowerCase())) return true;
  if (userId && admins.includes(userId.toLowerCase())) return true;
  return false;
}

// Users Collection
export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUser(user: User): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.id === id);
}

// Categories Collection (Dynamically manageable by owner)
export function getCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export function saveCategory(category: Category): void {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === category.id);
  if (index >= 0) {
    categories[index] = category;
  } else {
    categories.push(category);
  }
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

export function deleteCategory(categoryId: string): void {
  const categories = getCategories().filter(c => c.id !== categoryId);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

// Products Collection
export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveProduct(product: Product): void {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.unshift(product);
  }
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

export function deleteProduct(productId: string): void {
  const products = getProducts().filter(p => p.id !== productId);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

export function updateProductStock(productId: string, newStock: number): void {
  const products = getProducts();
  const index = products.findIndex(p => p.id === productId || p.productId === productId);
  if (index >= 0) {
    const updatedStock = Math.max(0, newStock);
    products[index].stock = updatedStock;
    if (products[index].status !== 'Hidden') {
      products[index].status = updatedStock > 0 ? 'Available' : 'Out of Stock';
    }
    products[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }
}

export function reduceProductStock(productId: string, quantityToDeduct: number): void {
  const products = getProducts();
  const index = products.findIndex(p => p.id === productId || p.productId === productId);
  if (index >= 0) {
    const currentStock = products[index].stock || 0;
    const newStock = Math.max(0, currentStock - quantityToDeduct);
    products[index].stock = newStock;
    if (products[index].status !== 'Hidden') {
      products[index].status = newStock > 0 ? 'Available' : 'Out of Stock';
    }
    products[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }
}

// Cart Collection (Isolated by Customer User ID)
export function getUserCart(userId: string): CartItem[] {
  if (!userId) return [];
  try {
    const allCarts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARTS) || '{}');
    return allCarts[userId] || [];
  } catch {
    return [];
  }
}

export function saveUserCart(userId: string, items: CartItem[]): void {
  if (!userId) return;
  try {
    const allCarts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARTS) || '{}');
    allCarts[userId] = items;
    localStorage.setItem(STORAGE_KEYS.CARTS, JSON.stringify(allCarts));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
}

export function clearUserCart(userId: string): void {
  if (!userId) return;
  saveUserCart(userId, []);
}

// Orders Collection
export function getAllOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getUserOrders(userId: string): Order[] {
  if (!userId) return [];
  const allOrders = getAllOrders();
  return allOrders.filter(order => order.userId === userId);
}

export function saveOrder(order: Order): void {
  const allOrders = getAllOrders();
  allOrders.unshift(order);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));

  // Automatically deduct inventory stock for each ordered item
  order.items.forEach(item => {
    reduceProductStock(item.productId, item.quantity);
  });
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const allOrders = getAllOrders();
  const index = allOrders.findIndex(o => o.id === orderId);
  if (index >= 0) {
    allOrders[index].status = status;
    allOrders[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));
  }
}

// Notifications
export function getNotifications(userId: string): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all: AppNotification[] = raw ? JSON.parse(raw) : [];
    return all.filter(n => n.userId === 'all' || n.userId === userId);
  } catch {
    return [];
  }
}

export function addNotification(notification: AppNotification): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all: AppNotification[] = raw ? JSON.parse(raw) : [];
    all.unshift(notification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save notification', e);
  }
}

export function markNotificationAsRead(id: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all: AppNotification[] = raw ? JSON.parse(raw) : [];
    const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}

// Active Session Management
export function getActiveSessionUserId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
}

export function setActiveSessionUserId(userId: string | null): void {
  if (userId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  }
}

// Firebase Config Storage
export function getFirebaseConfig(): FirebaseConfig | null {
  try {
    const raw = localStorage.getItem('mr_premium_firebase_config_v2');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveFirebaseConfig(config: FirebaseConfig): void {
  localStorage.setItem('mr_premium_firebase_config_v2', JSON.stringify(config));
}

// Run initial seeding
initializeDatabase();
