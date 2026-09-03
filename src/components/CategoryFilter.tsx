import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MarketCategory } from '../types';

interface CategoryFilterProps {
  currentCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  onIndicesClick: () => void;
}

const CATEGORIES: MarketCategory[] = [
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Government bonds',
  'Corporate bonds',
  'ETFs',
  'Economy',
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  currentCategory,
  onSelectCategory,
  onIndicesClick,
}) => {
  return (
    <section className="mt-4 mb-6" data-purpose="market-category-filters">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Title with right arrow */}
        <button
          type="button"
          onClick={onIndicesClick}
          className="inline-flex items-center gap-1.5 text-2xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors w-fit group cursor-pointer focus:outline-hidden"
          id="category-title-indices-btn"
        >
          <span>Indices</span>
          <ChevronRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform text-[#131722] group-hover:text-[#2962ff]" />
        </button>

        {/* Category Pill Navigation Bar */}
        <div className="flex items-center overflow-x-auto no-scrollbar p-1 border border-[#e0e3eb] rounded-full bg-white shadow-xs max-w-full">
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm whitespace-nowrap rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'font-semibold bg-[#131722] text-white shadow-xs'
                    : 'font-medium text-[#131722] hover:text-[#2962ff] hover:bg-neutral-50'
                }`}
                id={`cat-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
