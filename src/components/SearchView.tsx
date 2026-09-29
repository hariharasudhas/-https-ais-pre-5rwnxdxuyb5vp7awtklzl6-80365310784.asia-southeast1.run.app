import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Search, X, SlidersHorizontal, Sparkles, AlertCircle } from 'lucide-react';

interface SearchViewProps {
  onRequireAuth: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onRequireAuth }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    searchResults,
    categories,
    customerProducts
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on entry if empty
  useEffect(() => {
    if (!searchQuery) {
      inputRef.current?.focus();
    }
  }, []);

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  // Sorting
  const sortedResults = [...searchResults].sort((a, b) => {
    if (sortBy === 'price-asc') return a.discountPrice - b.discountPrice;
    if (sortBy === 'price-desc') return b.discountPrice - a.discountPrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default order
  });

  return (
    <div className="w-full min-h-[calc(100vh-140px)] pb-20 bg-[#f9fafb]">
      {/* Top Search Controls Bar */}
      <section className="bg-white border-b border-neutral-200/80 sticky top-16 md:top-20 z-30 py-4 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Main Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-neutral-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, category, or brand..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-neutral-100 border border-neutral-300 focus:border-[#d4af37] focus:bg-white text-neutral-900 placeholder-neutral-400 text-sm md:text-base outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={handleClear}
                className="absolute right-4 p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-200 transition-colors"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Chips and Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                All Products ({customerProducts.length})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600 ml-auto shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-neutral-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-[#d4af37] cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

        </div>
      </section>

      {/* Main Results View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-500">
              Showing {sortedResults.length} {sortedResults.length === 1 ? 'item' : 'items'}
            </span>
            {(searchQuery || selectedCategory !== 'All') && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200 font-semibold">
                {selectedCategory !== 'All' ? selectedCategory : ''} {searchQuery ? `"${searchQuery}"` : ''}
              </span>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={handleClear}
              className="text-xs text-neutral-500 hover:text-black font-semibold underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {sortedResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sortedResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        ) : (
          /* Empty State: No products found */
          <div className="max-w-md mx-auto py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">
              No products found.
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              We couldn't find any products matching your search for <span className="font-semibold text-neutral-800">"{searchQuery}"</span>. Try adjusting your query or browsing another category.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleClear}
                className="py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wide text-white bg-neutral-900 hover:bg-[#b8860b] transition-all cursor-pointer shadow-sm"
              >
                Clear Search
              </button>
              <button
                onClick={() => setSelectedCategory('All')}
                className="py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wide text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-50 transition-all cursor-pointer shadow-sm"
              >
                View All Categories
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
