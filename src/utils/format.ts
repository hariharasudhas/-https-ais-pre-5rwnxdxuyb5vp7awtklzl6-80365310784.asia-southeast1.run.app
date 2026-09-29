/**
 * Currency and Discount formatting utilities for MR.Premium
 */

export const formatPrice = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
};

export const calculateDiscountPercent = (originalPrice: number, sellingPrice: number): number => {
  if (!originalPrice || !sellingPrice || originalPrice <= sellingPrice) return 0;
  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
};

export const formatDiscountText = (percent: number): string => {
  if (!percent || percent <= 0) return '';
  return `${percent}% OFF`;
};
