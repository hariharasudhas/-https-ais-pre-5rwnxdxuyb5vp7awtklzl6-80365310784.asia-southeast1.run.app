export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  passwordHash?: string;
  membershipTier?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  image?: string;
  itemCount?: number;
}

export type ProductStatus = 'Available' | 'Out of Stock' | 'Hidden';

export interface Product {
  id: string;
  productId?: string;
  ownerId?: string;
  name: string;
  category: string;
  brand?: string;
  description: string;
  originalPrice: number;
  discountPrice: number; // Selling price
  sellingPrice?: number; // Alias for selling price
  discountPercent?: number; // Discount percentage
  discount?: number; // Alias for discount percentage
  stock: number;
  images: string[];
  sizes?: string[];
  colors?: string[];
  status?: ProductStatus;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  popular?: boolean;
  newArrival?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  brand?: string;
  price: number; // selling price
  originalPrice?: number;
  image: string;
  quantity: number;
  stock: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
