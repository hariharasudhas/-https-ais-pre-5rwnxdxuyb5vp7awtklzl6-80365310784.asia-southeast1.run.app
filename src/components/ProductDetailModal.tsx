import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  ShoppingBag, 
  Zap, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Minus, 
  Plus,
  Check
} from 'lucide-react';

interface ProductDetailModalProps {
  onRequireAuth?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ onRequireAuth }) => {
  const { selectedProduct, closeProductDetail, addToCart, setActiveTab } = useStore();
  const { isAuthenticated } = useAuth();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setSelectedSize(selectedProduct.sizes && selectedProduct.sizes.length > 0 ? selectedProduct.sizes[0] : '');
      setSelectedColor(selectedProduct.colors && selectedProduct.colors.length > 0 ? selectedProduct.colors[0] : '');
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const discountPercent = selectedProduct.discountPercent || (
    selectedProduct.originalPrice > selectedProduct.discountPrice 
      ? Math.round(((selectedProduct.originalPrice - selectedProduct.discountPrice) / selectedProduct.originalPrice) * 100) 
      : 0
  );

  const isOutOfStock = selectedProduct.stock <= 0 || selectedProduct.status === 'Out of Stock';

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }
    if (isOutOfStock) return;
    addToCart(selectedProduct, quantity, { size: selectedSize, color: selectedColor });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }
    if (isOutOfStock) return;
    addToCart(selectedProduct, quantity, { size: selectedSize, color: selectedColor });
    closeProductDetail();
    setActiveTab('checkout');
  };

  const currentImg = selectedProduct.images[selectedImageIndex] || selectedProduct.images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl my-auto rounded-3xl bg-white border border-neutral-200 shadow-2xl overflow-hidden text-neutral-900">
        {/* Close Button */}
        <button
          onClick={closeProductDetail}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors shadow-md border border-neutral-200 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Added Toast */}
        {addedToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold shadow-xl animate-bounce">
            <Check className="w-4 h-4 text-[#d4af37]" />
            <span>Added {quantity} item(s) to your cart!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-neutral-50/70 border-b md:border-b-0 md:border-r border-neutral-200">
            <div>
              {/* Large Image */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm">
                <img
                  src={currentImg}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-xs font-bold text-neutral-800 shadow-sm border border-neutral-200">
                  {selectedProduct.category}
                </div>

                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white text-xs font-extrabold shadow">
                    Save {discountPercent}%
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        selectedImageIndex === idx 
                          ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30' 
                          : 'border-neutral-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Marketplace Guarantees */}
            <div className="mt-6 pt-5 border-t border-neutral-200 space-y-2.5 text-xs text-neutral-600">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#b8860b] shrink-0" />
                <span className="font-medium">100% Genuine & Verified Premium Quality</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#b8860b] shrink-0" />
                <span className="font-medium">Free Express Delivery on orders over $50</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#b8860b] shrink-0" />
                <span className="font-medium">Hassle-free 30-Day Return & Replacement</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category, Brand & Rating */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-extrabold text-[#b8860b] block">
                    {selectedProduct.category}
                  </span>
                  {selectedProduct.brand && (
                    <span className="text-xs font-bold text-neutral-500">
                      Brand: {selectedProduct.brand}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                  <span className="font-bold">{selectedProduct.rating.toFixed(1)}</span>
                  <span className="text-neutral-500 text-[11px]">({selectedProduct.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-snug">
                {selectedProduct.name}
              </h2>

              {/* Pricing & Stock */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-neutral-900">
                      ${selectedProduct.discountPrice.toLocaleString()}
                    </span>
                    {selectedProduct.originalPrice > selectedProduct.discountPrice && (
                      <span className="text-base text-neutral-400 line-through">
                        ${selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {discountPercent > 0 && (
                    <span className="text-xs text-emerald-700 font-semibold mt-0.5 block">
                      You save ${(selectedProduct.originalPrice - selectedProduct.discountPrice).toLocaleString()} ({discountPercent}% off)
                    </span>
                  )}
                </div>

                <div className="text-right">
                  {!isOutOfStock ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock ({selectedProduct.stock} units)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-neutral-500 font-bold mb-1.5">Description</h4>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Size Selector (if available) */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-neutral-700 font-bold mb-2">
                    Select Size: <span className="text-[#b8860b]">{selectedSize}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedSize === s
                            ? 'bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900'
                            : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector (if available) */}
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-neutral-700 font-bold mb-2">
                    Select Color: <span className="text-[#b8860b]">{selectedColor}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedColor === c
                            ? 'bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900'
                            : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-neutral-200 space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-800">Quantity</span>
                <div className="flex items-center gap-3 bg-neutral-100 border border-neutral-300 rounded-xl px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-1 text-neutral-600 hover:text-black disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-neutral-900 min-w-[24px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    disabled={quantity >= selectedProduct.stock || isOutOfStock}
                    className="p-1 text-neutral-600 hover:text-black disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart & Buy Now Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="py-3.5 px-5 rounded-2xl font-bold text-sm tracking-wide text-neutral-900 bg-white border-2 border-neutral-900 hover:bg-neutral-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="py-3.5 px-5 rounded-2xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa771c] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
