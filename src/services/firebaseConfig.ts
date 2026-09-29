/**
 * ============================================================================
 * MR PREMIUM - FIREBASE CONFIGURATION GUIDE & CONNECTOR
 * ============================================================================
 * 
 * If you wish to connect your live Firebase project (Authentication + Cloud Firestore),
 * enter your project credentials below or set them in your environment variables.
 * 
 * 1. Visit https://console.firebase.google.com/
 * 2. Create or select your Firebase project.
 * 3. Under Project Settings -> General -> Your apps -> Web app (</>), copy the config object.
 * 4. Paste your configuration below or configure via the in-app Developer Panel:
 * 
 * Collections schema used by MR Premium:
 * - /users/{userId} -> User profile (name, email, phone, role, tier)
 * - /products/{productId} -> Luxury catalog products and services
 * - /cart/{userId} -> User's private shopping bag items
 * - /orders/{orderId} -> Customer orders & status history
 * - /admins/{adminId} -> Authorized admin user records
 * ============================================================================
 */

import { FirebaseConfig } from '../types';
import { getFirebaseConfig as getStoredConfig, saveFirebaseConfig as persistConfig } from './db';

// Default configuration placeholder or environment-based values
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMRPremiumDemoKeyPlaceholder001",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mr-premium-luxury.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mr-premium-luxury",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mr-premium-luxury.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "80365310784",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:80365310784:web:mrpremiumprod01"
};

export function getCurrentFirebaseConfig(): FirebaseConfig {
  const custom = getStoredConfig();
  if (custom && custom.apiKey) {
    return custom;
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function updateCustomFirebaseConfig(config: FirebaseConfig) {
  persistConfig(config);
}
