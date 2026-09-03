import React, { useState } from 'react';
import { X, Star, TrendingUp, TrendingDown, ArrowUpRight, BarChart3, Building2, User, MapPin, Users } from 'lucide-react';
import { StockData } from '../types';

interface StockDetailModalProps {
  stock: StockData | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (ticker: string) => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  if (!stock) return null;

  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1D');
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; price: number; time: string } | null>(null);

  const isPositive = stock.changePercent >= 0;

  // Generate mock chart data points for chosen timeframe
  const getTimeframePoints = (tf: Timeframe) => {
    const base = stock.price;
    const count = 30;
    const pts: { price: number; label: string }[] = [];
    let current = base * (tf === '1D' ? 0.98 : tf === '1Y' ? 0.65 : 0.92);

    for (let i = 0; i < count; i++) {
      const noise = (Math.random() - 0.47) * (base * 0.02);
      current += noise;
      pts.push({
        price: Number(current.toFixed(2)),
        label: tf === '1D' ? `${9 + Math.floor(i / 4)}:${(i % 4) * 15 || '00'}` : `Day ${i + 1}`,
      });
    }
    // ensure last is current price
    pts[pts.length - 1].price = stock.price;
    return pts;
  };

  const chartData = getTimeframePoints(activeTimeframe);
  const minPrice = Math.min(...chartData.map((d) => d.price));
  const maxPrice = Math.max(...chartData.map((d) => d.price));
  const range = maxPrice - minPrice || 1;

  // Width: 600, Height: 220
  const width = 600;
  const height = 220;
  const padding = 20;

  const pathCoords = chartData.map((d, i) => {
    const x = padding + (i / (chartData.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.price - minPrice) / range) * (height - padding * 2);
    return { x, y, price: d.price, label: d.label };
  });

  const pathString = pathCoords
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
    .join(' ');

  const strokeColor = isPositive ? '#089981' : '#f23645';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white border border-[#e0e3eb] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col relative"
        id={`modal-stock-${stock.ticker.toLowerCase()}`}
      >
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-[#f0f3fa] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs"
              style={{
                backgroundColor: stock.badgeBg,
                color: stock.badgeTextColor,
              }}
            >
              {stock.badgeLetter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#131722]">{stock.ticker}</h2>
                <span className="text-xs bg-[#f0f3fa] text-[#787b86] px-2 py-0.5 rounded font-mono font-medium">
                  {stock.sector}
                </span>
              </div>
              <p className="text-xs text-[#787b86]">{stock.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(stock.ticker)}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'text-[#787b86] hover:bg-[#f0f3fa] border-transparent'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              id="modal-watchlist-btn"
            >
              <Star className={`w-5 h-5 ${isWatchlisted ? 'fill-amber-400 text-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa] rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
              id="modal-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Price Header & Timeframe Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <div className="text-3xl font-bold text-[#131722] tabular-nums">
                ${stock.price.toFixed(2)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1 font-semibold text-sm px-2 py-0.5 rounded tabular-nums ${
                    isPositive ? 'bg-emerald-50 text-[#089981]' : 'bg-rose-50 text-[#f23645]'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {isPositive ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                </span>
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPositive ? `+$${stock.changeValue.toFixed(2)}` : `-$${Math.abs(stock.changeValue).toFixed(2)}`} Today
                </span>
              </div>
            </div>

            {/* Timeframe Buttons */}
            <div className="flex items-center bg-[#f0f3fa] p-1 rounded-lg text-xs font-semibold">
              {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    activeTimeframe === tf ? 'bg-white text-[#131722] shadow-xs' : 'text-[#787b86] hover:text-[#131722]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Area */}
          <div className="border border-[#e0e3eb] rounded-xl p-4 bg-white relative">
            <div className="flex justify-between items-center text-xs text-[#787b86] mb-2 font-mono">
              <span>Low: ${minPrice.toFixed(2)}</span>
              <span className="font-semibold text-[#131722]">
                {hoverPoint ? `$${hoverPoint.price.toFixed(2)} (${hoverPoint.time})` : `Current: $${stock.price.toFixed(2)}`}
              </span>
              <span>High: ${maxPrice.toFixed(2)}</span>
            </div>

            <div className="relative w-full h-[220px]">
              <svg
                className="w-full h-full cursor-crosshair"
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clientX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clientX / rect.width));
                  const idx = Math.round(ratio * (pathCoords.length - 1));
                  const pt = pathCoords[idx];
                  if (pt) {
                    setHoverPoint({ x: pt.x, y: pt.y, price: pt.price, time: pt.label });
                  }
                }}
                onMouseLeave={() => setHoverPoint(null)}
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1={padding} x2={width} y2={padding} stroke="#f0f3fa" strokeDasharray="3 3" />
                <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#f0f3fa" strokeDasharray="3 3" />
                <line x1="0" y1={height - padding} x2={width} y2={height - padding} stroke="#f0f3fa" strokeDasharray="3 3" />

                {/* Area under line */}
                <path
                  d={`${pathString} L ${width - padding},${height} L ${padding},${height} Z`}
                  fill="url(#chartGradient)"
                />

                {/* Main line */}
                <path
                  d={pathString}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Crosshair indicator on hover */}
                {hoverPoint && (
                  <g>
                    <line
                      x1={hoverPoint.x}
                      y1={0}
                      x2={hoverPoint.x}
                      y2={height}
                      stroke="#787b86"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={hoverPoint.x}
                      cy={hoverPoint.y}
                      r="4.5"
                      fill={strokeColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Technical Rating & Analyst Consensus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-[#e0e3eb] rounded-xl bg-[#fafbfd]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#787b86] uppercase tracking-wide">
                  Technical Rating
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {stock.rating}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                <div className="w-1/5 bg-rose-500" title="Strong Sell" />
                <div className="w-1/5 bg-rose-300" title="Sell" />
                <div className="w-1/5 bg-amber-400" title="Neutral" />
                <div className="w-1/5 bg-emerald-400" title="Buy" />
                <div className="w-1/5 bg-emerald-600" title="Strong Buy" />
              </div>
              <div className="flex justify-between text-[10px] text-[#787b86] mt-1.5 font-medium">
                <span>Strong Sell</span>
                <span>Neutral</span>
                <span>Strong Buy</span>
              </div>
            </div>

            <div className="p-4 border border-[#e0e3eb] rounded-xl bg-[#fafbfd]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#787b86] uppercase tracking-wide">
                  Analyst Target Price
                </span>
                <span className="text-xs font-semibold text-[#089981]">
                  +{(stock.changePercent * 3.5 + 8).toFixed(1)}% Upside
                </span>
              </div>
              <div className="text-xl font-bold text-[#131722] tabular-nums">
                ${(stock.price * 1.15).toFixed(2)}
              </div>
              <div className="text-[11px] text-[#787b86] mt-0.5">
                Consensus from 48 Wall Street analysts (38 Buy, 8 Hold, 2 Sell)
              </div>
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div>
            <h3 className="text-sm font-bold text-[#131722] mb-3">Key Trading Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#f8f9fd] rounded-lg border border-[#f0f3fa]">
                <div className="text-[#787b86] font-medium">Day Range</div>
                <div className="font-bold text-[#131722] mt-0.5">{stock.details.dayRange}</div>
              </div>
              <div className="p-3 bg-[#f8f9fd] rounded-lg border border-[#f0f3fa]">
                <div className="text-[#787b86] font-medium">52 Week Range</div>
                <div className="font-bold text-[#131722] mt-0.5">{stock.details.week52Range}</div>
              </div>
              <div className="p-3 bg-[#f8f9fd] rounded-lg border border-[#f0f3fa]">
                <div className="text-[#787b86] font-medium">Market Cap</div>
                <div className="font-bold text-[#131722] mt-0.5">{stock.marketCap}</div>
              </div>
              <div className="p-3 bg-[#f8f9fd] rounded-lg border border-[#f0f3fa]">
                <div className="text-[#787b86] font-medium">Avg Volume</div>
                <div className="font-bold text-[#131722] mt-0.5">{stock.details.avgVolume}</div>
              </div>
              <div className="p-3 bg-[#f8f9fd] rounded-lg border border-[#f0f3fa]">
                <div className="text-[#787b86] font-medium">P/E (TTM)</div>
                <div className="font-bold text-[#131722] mt-0.5">{stock.pe}</div>
              </div>
              <div className="p-3 bg-[#f8f9fd] rounded-lg border border-[#f0f3fa]">
                <div className="text-[#787b86] font-medium">EPS (TTM)</div>
                <div className="font-bold text-[#131722] mt-0.5">{stock.details.eps}</div>
              </div>
              <div className="p-3 bg-[#f8f9fd] rounded-lg border border-[#f0f3fa]">
                <div className="text-[#787b86] font-medium">Beta</div>
                <div className="font-bold text-[#131722] mt-0.5">{stock.details.beta}</div>
              </div>
              <div className="p-3 bg-[#f8f9fd] rounded-lg border border-[#f0f3fa]">
                <div className="text-[#787b86] font-medium">Dividend Yield</div>
                <div className="font-bold text-[#131722] mt-0.5">{stock.dividends.yield}</div>
              </div>
            </div>
          </div>

          {/* About Company */}
          <div className="border-t border-[#f0f3fa] pt-4">
            <h3 className="text-sm font-bold text-[#131722] mb-2">About {stock.name}</h3>
            <p className="text-xs text-[#787b86] leading-relaxed mb-3">
              {stock.details.description}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[#787b86]">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#131722]" />
                <span>CEO: <strong className="text-[#131722]">{stock.details.ceo}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#131722]" />
                <span>HQ: <strong className="text-[#131722]">{stock.details.headquarters}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#131722]" />
                <span>Employees: <strong className="text-[#131722]">{stock.details.employees}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 border-t border-[#f0f3fa] bg-[#fafbfd] flex items-center justify-between">
          <button
            onClick={() => onToggleWatchlist(stock.ticker)}
            className="text-xs font-semibold text-[#131722] hover:text-[#2962ff] flex items-center gap-1.5 cursor-pointer"
          >
            <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>{isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white rounded-full bg-[#131722] hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
