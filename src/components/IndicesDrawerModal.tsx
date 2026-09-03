import React from 'react';
import { X, TrendingUp, TrendingDown, ChevronRight, Globe } from 'lucide-react';
import { IndexMarketCardData } from '../types';

interface IndicesDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  indices: IndexMarketCardData[];
  onSelectIndex: (index: IndexMarketCardData) => void;
}

export const IndicesDrawerModal: React.FC<IndicesDrawerModalProps> = ({
  isOpen,
  onClose,
  indices,
  onSelectIndex,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white border border-[#e0e3eb] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
        id="indices-drawer-modal"
      >
        <div className="p-5 border-b border-[#f0f3fa] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-[#2962ff] rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#131722]">Global Market Indices</h2>
              <p className="text-xs text-[#787b86]">Key market benchmark indices across major global regions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2">
          {indices.map((idx) => {
            const isPos = idx.changePercent >= 0;
            return (
              <div
                key={idx.id}
                onClick={() => {
                  onSelectIndex(idx);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-[#e0e3eb] hover:border-blue-300 hover:bg-[#f8f9fd] cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                    style={{ backgroundColor: idx.badgeBgColor }}
                  >
                    {idx.badgeNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] flex items-center gap-2">
                      {idx.name}
                      <span className="text-xs font-mono font-normal text-[#787b86]">
                        {idx.ticker} · {idx.exchange}
                      </span>
                    </h3>
                    <p className="text-xs text-[#787b86]">
                      {isPos ? 'Trending positive in today\'s session' : 'Under slight pullback pressure'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold text-[#131722] tabular-nums">
                    {idx.currency === '%'
                      ? `${idx.price.toFixed(3)}%`
                      : idx.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`text-xs font-semibold tabular-nums flex items-center justify-end gap-1 ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{isPos ? `+${idx.changePercent.toFixed(2)}%` : `${idx.changePercent.toFixed(2)}%`}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#f0f3fa] bg-[#fafbfd] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white rounded-full bg-[#131722] hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
