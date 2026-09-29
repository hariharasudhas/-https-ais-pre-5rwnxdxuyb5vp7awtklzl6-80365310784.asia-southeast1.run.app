import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onRequireAuth?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onRequireAuth }) => {
  const { openProductDetail, addToCart } = useStore();
  const { isAuthenticated } = useAuth();
  const [justAdded, setJustAdded] = React.useState(false);

  const handleCardClick = () => {
    openProductDetail(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const discountPercent = product.discountPercent || (
    product.originalPrice > product.discountPrice 
      ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100) 
      : 0
  );

  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col rounded-2xl bg-white border border-neutral-200/80 hover:border-[#d4af37]/60 hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer select-none"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-neutral-800 shadow-sm border border-neutral-200/60">
          {product.category}
        </div>

        {/* Discount Percentage Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white text-[11px] font-bold shadow-md">
            -{discountPercent}%
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold tracking-wider uppercase shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 justify-between gap-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5 text-xs text-neutral-500">
            <div className="flex items-center text-[#d4af37]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 font-bold text-neutral-900">{product.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>({product.reviewsCount} reviews)</span>
          </div>

          {/* Brand */}
          <span className="text-[11px] font-bold text-[#b8860b] block uppercase tracking-wider mb-1">
            {product.brand || 'MR.Premium'}
          </span>

          {/* Product Name */}
          <h3 className="font-semibold text-neutral-900 text-sm md:text-base group-hover:text-[#b8860b] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Stock indicator */}
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500">
            {!isOutOfStock ? (
              <span className="text-emerald-700 font-medium">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-500 font-medium">Currently Unavailable</span>
            )}
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg md:text-xl font-extrabold text-neutral-900">
                ${product.discountPrice.toLocaleString()}
              </span>
              {product.originalPrice > product.discountPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-900 text-white hover:bg-[#b8860b] active:scale-95 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
