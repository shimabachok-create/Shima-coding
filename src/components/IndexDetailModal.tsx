import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Layers, BarChart2, ShieldCheck } from 'lucide-react';
import { IndexMarketCardData } from '../types';

interface IndexDetailModalProps {
  index: IndexMarketCardData | null;
  onClose: () => void;
}

export const IndexDetailModal: React.FC<IndexDetailModalProps> = ({ index, onClose }) => {
  if (!index) return null;

  const [activeRange, setActiveRange] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | '5Y'>('1D');
  const isPositive = index.changePercent >= 0;

  // Generate 25 points based on index price
  const points = index.sparkline.map((val) => {
    return Number((index.price * (1 + (val - 20) * 0.0008)).toFixed(2));
  });

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const width = 580;
  const height = 180;
  const padding = 15;

  const pathCoords = points.map((p, i) => {
    const x = padding + (i / (points.length - 1)) * (width - padding * 2);
    const y = height - padding - ((p - min) / range) * (height - padding * 2);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = pathCoords.join(' ');
  const strokeColor = isPositive ? '#089981' : '#f23645';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white border border-[#e0e3eb] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
        id={`modal-index-${index.id}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#f0f3fa] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: index.badgeBgColor }}
            >
              {index.badgeNumber}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#131722]">{index.name}</h2>
              <div className="text-xs text-[#787b86]">
                {index.ticker} · {index.exchange} Index
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Price Header */}
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-bold text-[#131722] tabular-nums">
                {index.currency === '%'
                  ? `${index.price.toFixed(3)}%`
                  : index.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded tabular-nums ${
                    isPositive ? 'bg-emerald-50 text-[#089981]' : 'bg-rose-50 text-[#f23645]'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {isPositive ? `+${index.changePercent.toFixed(2)}%` : `${index.changePercent.toFixed(2)}%`}
                </span>
                <span
                  className={`text-xs font-semibold tabular-nums ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPositive ? `+${index.changeValue.toFixed(2)}` : index.changeValue.toFixed(2)} ({index.currency})
                </span>
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center bg-[#f0f3fa] p-1 rounded-lg text-xs font-semibold">
              {(['1D', '5D', '1M', '6M', '1Y', '5Y'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeRange === r ? 'bg-white text-[#131722] shadow-xs' : 'text-[#787b86]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="border border-[#e0e3eb] rounded-xl p-4 bg-white">
            <div className="h-[180px] w-full">
              <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`indexGrad-${index.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`${pathD} L ${width - padding},${height} L ${padding},${height} Z`}
                  fill={`url(#indexGrad-${index.id})`}
                />
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#f8f9fd] rounded-xl border border-[#f0f3fa]">
              <div className="text-[#787b86]">Day&apos;s High</div>
              <div className="font-bold text-[#131722] text-sm mt-0.5">
                {(index.high24h || index.price * 1.006).toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-[#f8f9fd] rounded-xl border border-[#f0f3fa]">
              <div className="text-[#787b86]">Day&apos;s Low</div>
              <div className="font-bold text-[#131722] text-sm mt-0.5">
                {(index.low24h || index.price * 0.994).toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-[#f8f9fd] rounded-xl border border-[#f0f3fa]">
              <div className="text-[#787b86]">Exchange Provider</div>
              <div className="font-bold text-[#131722] text-sm mt-0.5">{index.exchange}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f0f3fa] bg-[#fafbfd] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white rounded-full bg-[#131722] hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
