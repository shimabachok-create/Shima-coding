import React from 'react';
import { ChevronRight } from 'lucide-react';
import { StockData, TableViewTab } from '../types';

interface StocksTableProps {
  stocks: StockData[];
  activeTab: TableViewTab;
  onTabChange: (tab: TableViewTab) => void;
  onSelectStock: (stock: StockData) => void;
  onExploreScreener: () => void;
  regionLabel?: string;
  flashMap?: Record<string, 'up' | 'down'>;
}

const TABS: TableViewTab[] = ['Overview', 'Performance', 'Valuation', 'Dividends', 'Margins'];

export const StocksTable: React.FC<StocksTableProps> = ({
  stocks,
  activeTab,
  onTabChange,
  onSelectStock,
  onExploreScreener,
  regionLabel = 'United States',
  flashMap = {},
}) => {
  // Helper to render sparkline SVG for 24h trend
  const renderTrendSvg = (points: number[], isPositive: boolean) => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const pathD = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * 80;
        const y = 26 - ((val - min) / range) * 20;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor = isPositive ? '#089981' : '#f23645';

    return (
      <div className="inline-block w-20 h-7">
        <svg className="w-full h-full" viewBox="0 0 80 28">
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  const getRatingBadge = (rating: StockData['rating']) => {
    switch (rating) {
      case 'Strong Buy':
        return (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            Strong Buy
          </span>
        );
      case 'Buy':
        return (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            Buy
          </span>
        );
      case 'Hold':
        return (
          <span className="text-xs font-semibold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            Hold
          </span>
        );
      case 'Sell':
      case 'Strong Sell':
        return (
          <span className="text-xs font-semibold text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            {rating}
          </span>
        );
    }
  };

  return (
    <section
      className="mt-12 bg-white border border-[#e0e3eb] rounded-xl shadow-xs overflow-hidden"
      data-purpose="market-data-table-section"
      id="most-active-stocks-section"
    >
      {/* Table Header Bar */}
      <div className="p-5 border-b border-[#e0e3eb] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#131722]">Most Active Stocks</h2>
            <span className="text-xs bg-[#f0f3fa] text-[#787b86] px-2 py-0.5 rounded-full font-medium">
              {regionLabel}
            </span>
          </div>
          <p className="text-xs text-[#787b86] mt-0.5">Real-time market quotes and trading metrics</p>
        </div>

        {/* Table View Tabs */}
        <div className="flex items-center gap-1 bg-[#f0f3fa] p-1 rounded-lg text-xs font-semibold text-[#787b86] overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white text-[#131722] shadow-xs'
                  : 'hover:text-[#131722]'
              }`}
              id={`table-tab-${tab.toLowerCase()}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Data Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="text-xs uppercase font-medium text-[#787b86] border-b border-[#f0f3fa] bg-[#fafbfd]">
              <th className="py-3.5 px-5" scope="col">
                Ticker / Company
              </th>

              {activeTab === 'Overview' && (
                <>
                  <th className="py-3.5 px-4 text-right" scope="col">
                    Price (USD)
                  </th>
                  <th className="py-3.5 px-4 text-right" scope="col">
                    Change %
                  </th>
                  <th className="py-3.5 px-4 text-right" scope="col">
                    Volume
                  </th>
                  <th className="py-3.5 px-4 text-right" scope="col">
                    Market Cap
                  </th>
                  <th className="py-3.5 px-4 text-right" scope="col">
                    P/E (TTM)
                  </th>
                  <th className="py-3.5 px-4 text-center" scope="col">
                    Analyst Rating
                  </th>
                  <th className="py-3.5 px-5 text-right" scope="col">
                    24H Trend
                  </th>
                </>
              )}

              {activeTab === 'Performance' && (
                <>
                  <th className="py-3.5 px-4 text-right" scope="col">Price</th>
                  <th className="py-3.5 px-4 text-right" scope="col">1D %</th>
                  <th className="py-3.5 px-4 text-right" scope="col">1W %</th>
                  <th className="py-3.5 px-4 text-right" scope="col">1M %</th>
                  <th className="py-3.5 px-4 text-right" scope="col">3M %</th>
                  <th className="py-3.5 px-4 text-right" scope="col">YTD %</th>
                  <th className="py-3.5 px-4 text-right" scope="col">Volatility</th>
                  <th className="py-3.5 px-5 text-right" scope="col">24H Trend</th>
                </>
              )}

              {activeTab === 'Valuation' && (
                <>
                  <th className="py-3.5 px-4 text-right" scope="col">Price</th>
                  <th className="py-3.5 px-4 text-right" scope="col">Market Cap</th>
                  <th className="py-3.5 px-4 text-right" scope="col">P/E</th>
                  <th className="py-3.5 px-4 text-right" scope="col">Forward P/E</th>
                  <th className="py-3.5 px-4 text-right" scope="col">P/S</th>
                  <th className="py-3.5 px-4 text-right" scope="col">P/B</th>
                  <th className="py-3.5 px-5 text-right" scope="col">EV/EBITDA</th>
                </>
              )}

              {activeTab === 'Dividends' && (
                <>
                  <th className="py-3.5 px-4 text-right" scope="col">Price</th>
                  <th className="py-3.5 px-4 text-right" scope="col">Div Yield</th>
                  <th className="py-3.5 px-4 text-right" scope="col">Annual Payout</th>
                  <th className="py-3.5 px-4 text-right" scope="col">Payout Ratio</th>
                  <th className="py-3.5 px-5 text-right" scope="col">Ex-Dividend Date</th>
                </>
              )}

              {activeTab === 'Margins' && (
                <>
                  <th className="py-3.5 px-4 text-right" scope="col">Price</th>
                  <th className="py-3.5 px-4 text-right" scope="col">Gross Margin</th>
                  <th className="py-3.5 px-4 text-right" scope="col">Operating Margin</th>
                  <th className="py-3.5 px-4 text-right" scope="col">Net Margin</th>
                  <th className="py-3.5 px-4 text-right" scope="col">ROE</th>
                  <th className="py-3.5 px-5 text-right" scope="col">ROA</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f3fa] font-medium text-[#131722]">
            {stocks.slice(0, 5).map((stock) => {
              const isPositive = stock.changePercent >= 0;
              const flash = flashMap[stock.ticker];

              return (
                <tr
                  key={stock.ticker}
                  onClick={() => onSelectStock(stock)}
                  className={`hover:bg-[#f8f9fd] transition-colors cursor-pointer group ${
                    flash === 'up'
                      ? 'bg-emerald-50/40'
                      : flash === 'down'
                      ? 'bg-rose-50/40'
                      : ''
                  }`}
                  id={`stock-row-${stock.ticker.toLowerCase()}`}
                >
                  {/* Ticker / Company column */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: stock.badgeBg,
                          color: stock.badgeTextColor,
                        }}
                      >
                        {stock.badgeLetter}
                      </div>
                      <div>
                        <div className="font-bold text-[#131722] group-hover:text-[#2962ff] flex items-center gap-1.5 transition-colors">
                          {stock.ticker}
                          {stock.hasDividendBadge && (
                            <span
                              title="Dividend security"
                              className="text-[10px] text-white bg-[#2962ff]/90 px-1 py-0.2 rounded font-mono font-bold"
                            >
                              D
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#787b86] font-normal truncate max-w-[140px] sm:max-w-none">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tab-dependent columns */}
                  {activeTab === 'Overview' && (
                    <>
                      <td className="py-3.5 px-4 text-right font-semibold tabular-nums">
                        {stock.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        <span
                          className={`inline-flex items-center font-semibold px-2 py-0.5 rounded text-xs ${
                            isPositive
                              ? 'text-[#089981] bg-emerald-50'
                              : 'text-[#f23645] bg-rose-50'
                          }`}
                        >
                          {isPositive ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787b86] font-normal">
                        {stock.volume}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        {stock.marketCap}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787b86] font-normal">
                        {stock.pe}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {getRatingBadge(stock.rating)}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {renderTrendSvg(stock.sparkline, isPositive)}
                      </td>
                    </>
                  )}

                  {activeTab === 'Performance' && (
                    <>
                      <td className="py-3.5 px-4 text-right font-semibold tabular-nums">
                        {stock.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-[#089981]">
                        {stock.performance.d1}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums font-medium">
                        {stock.performance.w1}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums font-medium">
                        {stock.performance.m1}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums font-medium">
                        {stock.performance.m3}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-[#089981]">
                        {stock.performance.ytd}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787b86]">
                        {stock.performance.volatility}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {renderTrendSvg(stock.sparkline, isPositive)}
                      </td>
                    </>
                  )}

                  {activeTab === 'Valuation' && (
                    <>
                      <td className="py-3.5 px-4 text-right font-semibold tabular-nums">
                        {stock.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums font-semibold">
                        {stock.marketCap}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        {stock.pe}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787b86]">
                        {stock.valuation.forwardPe}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787b86]">
                        {stock.valuation.ps}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787b86]">
                        {stock.valuation.pb}
                      </td>
                      <td className="py-3.5 px-5 text-right tabular-nums">
                        {stock.valuation.evEbitda}
                      </td>
                    </>
                  )}

                  {activeTab === 'Dividends' && (
                    <>
                      <td className="py-3.5 px-4 text-right font-semibold tabular-nums">
                        {stock.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-[#089981]">
                        {stock.dividends.yield}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        {stock.dividends.annualPayout}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#787b86]">
                        {stock.dividends.payoutRatio}
                      </td>
                      <td className="py-3.5 px-5 text-right tabular-nums text-[#787b86]">
                        {stock.dividends.exDate}
                      </td>
                    </>
                  )}

                  {activeTab === 'Margins' && (
                    <>
                      <td className="py-3.5 px-4 text-right font-semibold tabular-nums">
                        {stock.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums font-semibold">
                        {stock.margins.gross}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        {stock.margins.operating}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-[#089981]">
                        {stock.margins.net}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        {stock.margins.roe}
                      </td>
                      <td className="py-3.5 px-5 text-right tabular-nums text-[#787b86]">
                        {stock.margins.roa}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination Link */}
      <div className="py-3 px-5 border-t border-[#f0f3fa] bg-white flex items-center justify-between text-xs text-[#787b86]">
        <span>Showing top 5 of 500 US large-cap securities</span>
        <button
          type="button"
          onClick={onExploreScreener}
          className="font-semibold text-[#2962ff] hover:underline inline-flex items-center gap-1 cursor-pointer focus:outline-hidden"
          id="explore-screener-btn"
        >
          <span>Explore complete stock screener</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-2" />
        </button>
      </div>
    </section>
  );
};
