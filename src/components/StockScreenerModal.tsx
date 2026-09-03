import React, { useState } from 'react';
import { X, ArrowUpDown, Filter, Search, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { StockData } from '../types';

interface StockScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockData[];
  onSelectStock: (stock: StockData) => void;
}

type SortField = 'marketCap' | 'price' | 'changePercent' | 'pe' | 'volume';

export const StockScreenerModal: React.FC<StockScreenerModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortAsc, setSortAsc] = useState(false);

  const sectors = ['All Sectors', ...Array.from(new Set(stocks.map((s) => s.sector)))];

  // Helper to parse market cap to float for sorting
  const parseMarketCap = (str: string) => {
    if (str.endsWith('T')) return parseFloat(str) * 1000;
    if (str.endsWith('B')) return parseFloat(str);
    return parseFloat(str) || 0;
  };

  const filtered = stocks
    .filter((s) => {
      const matchesSearch =
        s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'All Sectors' || s.sector === selectedSector;
      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortField === 'marketCap') {
        valA = parseMarketCap(a.marketCap);
        valB = parseMarketCap(b.marketCap);
      } else if (sortField === 'price') {
        valA = a.price;
        valB = b.price;
      } else if (sortField === 'changePercent') {
        valA = a.changePercent;
        valB = b.changePercent;
      } else if (sortField === 'pe') {
        valA = parseFloat(a.pe) || 0;
        valB = parseFloat(b.pe) || 0;
      } else if (sortField === 'volume') {
        valA = parseFloat(a.volume) || 0;
        valB = parseFloat(b.volume) || 0;
      }
      return sortAsc ? valA - valB : valB - valA;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white border border-[#e0e3eb] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        id="stock-screener-modal"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#f0f3fa] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#131722]">Complete Stock Screener</h2>
              <span className="text-xs bg-[#f0f3fa] text-[#787b86] px-2.5 py-0.5 rounded-full font-semibold">
                US Large-Cap
              </span>
            </div>
            <p className="text-xs text-[#787b86] mt-0.5">
              Filter and screen leading US equites by valuation, momentum, and fundamentals
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-[#fafbfd] border-b border-[#f0f3fa] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#787b86]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by ticker or name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#e0e3eb] rounded-lg focus:outline-hidden focus:border-[#2962ff]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#787b86]" />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="text-xs bg-white border border-[#e0e3eb] rounded-lg px-3 py-1.5 font-medium text-[#131722] focus:outline-hidden cursor-pointer"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Screener Table */}
        <div className="overflow-y-auto flex-grow">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="sticky top-0 bg-[#fafbfd] border-b border-[#f0f3fa] z-10 text-xs font-medium text-[#787b86] uppercase">
              <tr>
                <th className="py-3 px-5">Ticker / Company</th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Change %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('marketCap')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Market Cap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pe')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>P/E</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('volume')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Analyst Rating</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3fa] font-medium text-[#131722]">
              {filtered.map((stock) => {
                const isPos = stock.changePercent >= 0;
                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => {
                      onSelectStock(stock);
                      onClose();
                    }}
                    className="hover:bg-[#f8f9fd] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                          style={{
                            backgroundColor: stock.badgeBg,
                            color: stock.badgeTextColor,
                          }}
                        >
                          {stock.badgeLetter}
                        </div>
                        <div>
                          <div className="font-bold text-[#131722] group-hover:text-[#2962ff] flex items-center gap-1.5">
                            {stock.ticker}
                            {stock.hasDividendBadge && (
                              <span className="text-[10px] text-white bg-[#2962ff]/90 px-1 py-0.2 rounded font-mono">
                                D
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#787b86] font-normal">{stock.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold tabular-nums">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          isPos ? 'bg-emerald-50 text-[#089981]' : 'bg-rose-50 text-[#f23645]'
                        }`}
                      >
                        {isPos ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold">
                      {stock.marketCap}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-[#787b86] font-normal">
                      {stock.pe}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-[#787b86] font-normal">
                      {stock.volume}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {stock.rating}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <span className="text-xs font-semibold text-[#2962ff] group-hover:underline inline-flex items-center gap-0.5">
                        Details
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fafbfd] border-t border-[#f0f3fa] flex items-center justify-between text-xs text-[#787b86]">
          <span>Showing {filtered.length} matching securities</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#131722] text-white font-semibold hover:bg-neutral-800 cursor-pointer"
          >
            Close Screener
          </button>
        </div>
      </div>
    </div>
  );
};
