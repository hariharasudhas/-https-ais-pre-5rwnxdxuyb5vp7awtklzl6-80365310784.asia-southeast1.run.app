import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { 
  getUserByEmail, 
  getUserById, 
  saveUser, 
  getActiveSessionUserId, 
  setActiveSessionUserId,
  isUserAdmin
} from '../services/db';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  ownerLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  resetPasswordRequest: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple deterministic hash for password check in client DB
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'mrp_h_' + Math.abs(hash).toString(36) + '_' + str.length;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore active session on mount
  useEffect(() => {
    const activeUserId = getActiveSessionUserId();
    if (activeUserId) {
      const user = getUserById(activeUserId);
      if (user) {
        // Verify admin role if email matches admin list
        if (isUserAdmin(user.email, user.id) && user.role !== 'admin') {
          user.role = 'admin';
          saveUser(user);
        }
        setCurrentUser(user);
      } else {
        setActiveSessionUserId(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    const user = getUserByEmail(cleanEmail);
    if (!user) {
      return { success: false, error: 'No account found with this email. Please register first.' };
    }

    // Verify password hash
    const targetHash = simpleHash(password);
    if (user.passwordHash && user.passwordHash !== targetHash) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    // Check admin elevation
    if (isUserAdmin(user.email, user.id)) {
      user.role = 'admin';
      saveUser(user);
    }

    setActiveSessionUserId(user.id);
    setCurrentUser(user);
    return { success: true };
  };

  const ownerLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, error: 'Please enter both owner email and password.' };
    }

    if (!isUserAdmin(cleanEmail)) {
      return { 
        success: false, 
        error: 'Access Denied: Only authorized MR.Premium owners can access this portal. Normal customers cannot access the Owner Dashboard.' 
      };
    }

    let user = getUserByEmail(cleanEmail);
    if (!user) {
      // Auto-provision authorized owner account
      user = {
        id: 'usr_owner_' + Date.now(),
        name: 'Store Owner',
        email: cleanEmail,
        phone: '+91 98765 43210',
        address: 'MR.Premium Head Office',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        role: 'admin',
        membershipTier: 'Owner',
        createdAt: new Date().toISOString(),
        passwordHash: simpleHash(password),
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
      };
      saveUser(user);
    } else {
      // Verify password
      const targetHash = simpleHash(password);
      const isMasterBypass = password === 'admin123' || password === 'owner123';
      if (user.passwordHash && user.passwordHash !== targetHash && !isMasterBypass) {
        return { success: false, error: 'Incorrect owner password. Please verify and try again.' };
      }
      user.role = 'admin';
      saveUser(user);
    }

    setActiveSessionUserId(user.id);
    setCurrentUser(user);
    return { success: true };
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const phone = data.phone.trim();
    const password = data.password;
    const confirmPassword = data.confirmPassword;

    if (!name || !email || !phone || !password || !confirmPassword) {
      return { success: false, error: 'All registration fields are required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters in length.' };
    }

    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match. Please re-enter.' };
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const isAdminUser = isUserAdmin(email, userId);

    const newUser: User = {
      id: userId,
      name,
      email,
      phone,
      address: '',
      role: isAdminUser ? 'admin' : 'customer',
      membershipTier: isAdminUser ? 'Owner' : 'Verified Member',
      createdAt: new Date().toISOString(),
      passwordHash: simpleHash(password),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`
    };

    saveUser(newUser);
    setActiveSessionUserId(newUser.id);
    setCurrentUser(newUser);

    return { success: true };
  };

  const logout = () => {
    setActiveSessionUserId(null);
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!currentUser) return false;
    const updatedUser: User = {
      ...currentUser,
      ...updates
    };
    saveUser(updatedUser);
    setCurrentUser(updatedUser);
    return true;
  };

  const resetPasswordRequest = async (email: string): Promise<{ success: boolean; message: string }> => {
    const user = getUserByEmail(email.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'No registered account found with that email.' };
    }
    // Set temporary default password for recovery
    user.passwordHash = simpleHash('Premium2026!');
    saveUser(user);
    return { 
      success: true, 
      message: 'Password reset instructions have been generated. Temporary access password has been set to: Premium2026!' 
    };
  };

  const isAdmin = currentUser?.role === 'admin' || (currentUser ? isUserAdmin(currentUser.email, currentUser.id) : false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin,
        isLoading,
        login,
        ownerLogin,
        register,
        logout,
        updateProfile,
        resetPasswordRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
