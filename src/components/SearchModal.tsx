import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { StockData, IndexMarketCardData } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockData[];
  indices: IndexMarketCardData[];
  onSelectStock: (stock: StockData) => void;
  onSelectIndex: (index: IndexMarketCardData) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stocks,
  indices,
  onSelectStock,
  onSelectIndex,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'STOCKS' | 'INDICES'>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const cleanQuery = query.toLowerCase().trim();

  const filteredStocks = stocks.filter((s) => {
    if (filterType === 'INDICES') return false;
    if (!cleanQuery) return true;
    return (
      s.ticker.toLowerCase().includes(cleanQuery) ||
      s.name.toLowerCase().includes(cleanQuery) ||
      s.sector.toLowerCase().includes(cleanQuery)
    );
  });

  const filteredIndices = indices.filter((idx) => {
    if (filterType === 'STOCKS') return false;
    if (!cleanQuery) return true;
    return (
      idx.ticker.toLowerCase().includes(cleanQuery) ||
      idx.name.toLowerCase().includes(cleanQuery) ||
      idx.exchange.toLowerCase().includes(cleanQuery)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="bg-white border border-[#e0e3eb] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
        id="quick-search-modal"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#f0f3fa] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#131722] shrink-0 stroke-[2.2]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickers, companies, indices (e.g. NVDA, S&P 500, AAPL)..."
            className="w-full text-base font-normal text-[#131722] placeholder:text-[#787b86] focus:outline-hidden"
            id="search-modal-input"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#787b86] hover:text-[#131722] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 text-[#787b86] hover:bg-[#f0f3fa] rounded-md transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Filter Category Tabs */}
        <div className="px-4 py-2 bg-[#fafbfd] border-b border-[#f0f3fa] flex items-center gap-2 text-xs">
          <span className="text-[#787b86] font-medium mr-1">Filter:</span>
          {(['ALL', 'STOCKS', 'INDICES'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-[#131722] text-white'
                  : 'bg-[#f0f3fa] text-[#787b86] hover:text-[#131722]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-[#f0f3fa]">
          {/* Indices group */}
          {filteredIndices.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-1 text-[11px] font-bold text-[#787b86] uppercase tracking-wider">
                Indices
              </div>
              {filteredIndices.map((idx) => {
                const isPos = idx.changePercent >= 0;
                return (
                  <div
                    key={idx.id}
                    onClick={() => {
                      onSelectIndex(idx);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8f9fd] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: idx.badgeBgColor }}
                      >
                        {idx.badgeNumber}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] flex items-center gap-1.5">
                          {idx.name}
                          <span className="text-xs text-[#787b86] font-normal font-mono">
                            {idx.ticker}
                          </span>
                        </div>
                        <div className="text-xs text-[#787b86]">{idx.exchange}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#131722] tabular-nums">
                        {idx.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-semibold tabular-nums flex items-center justify-end gap-0.5 ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPos ? `+${idx.changePercent.toFixed(2)}%` : `${idx.changePercent.toFixed(2)}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stocks group */}
          {filteredStocks.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-1 text-[11px] font-bold text-[#787b86] uppercase tracking-wider">
                Securities & Stocks
              </div>
              {filteredStocks.map((stock) => {
                const isPos = stock.changePercent >= 0;
                return (
                  <div
                    key={stock.ticker}
                    onClick={() => {
                      onSelectStock(stock);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8f9fd] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px]"
                        style={{
                          backgroundColor: stock.badgeBg,
                          color: stock.badgeTextColor,
                        }}
                      >
                        {stock.badgeLetter}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] flex items-center gap-1.5">
                          {stock.ticker}
                          <span className="text-xs text-[#787b86] font-normal truncate max-w-[180px]">
                            {stock.name}
                          </span>
                        </div>
                        <div className="text-xs text-[#787b86]">{stock.sector}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#131722] tabular-nums">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-semibold tabular-nums flex items-center justify-end gap-0.5 ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPos ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredStocks.length === 0 && filteredIndices.length === 0 && (
            <div className="py-12 text-center text-[#787b86]">
              <p className="text-sm">No symbols or indices matched &quot;{query}&quot;</p>
              <p className="text-xs mt-1">Try searching for NVDA, AAPL, TSLA, SPX, or Tech</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#fafbfd] border-t border-[#f0f3fa] text-xs text-[#787b86] flex items-center justify-between">
          <span>Navigate with mouse or touch</span>
          <span className="font-medium text-[#131722]">Instant Real-time Quotes</span>
        </div>
      </div>
    </div>
  );
};
