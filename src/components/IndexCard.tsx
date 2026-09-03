import React, { useState, useEffect } from 'react';
import { IndexMarketCardData } from '../types';

interface IndexCardProps {
  card: IndexMarketCardData;
  onClick: (card: IndexMarketCardData) => void;
  flash?: 'up' | 'down' | null;
}

export const IndexCard: React.FC<IndexCardProps> = ({ card, onClick, flash }) => {
  const isPositive = card.changePercent >= 0;

  // Render smooth SVG path based on sparkline points
  const points = card.sparkline;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  // Scale points to 100 x 36 viewbox
  const pathD = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * 100;
      // Invert Y because SVG coordinates go down
      const y = 34 - ((val - min) / range) * 28;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const strokeColor = isPositive ? '#089981' : '#f23645';
  const fillColor = isPositive ? 'rgba(8, 153, 129, 0.08)' : 'rgba(242, 54, 69, 0.08)';

  return (
    <article
      onClick={() => onClick(card)}
      className={`p-4 rounded-xl border border-[#e0e3eb] bg-[#f8f9fd] hover:border-gray-400 hover:shadow-sm transition-all duration-200 cursor-pointer relative overflow-hidden group ${
        flash === 'up'
          ? 'ring-2 ring-emerald-400/60 bg-emerald-50/30'
          : flash === 'down'
          ? 'ring-2 ring-rose-400/60 bg-rose-50/30'
          : ''
      }`}
      id={`index-card-${card.id}`}
    >
      {/* Top row: Badge, Name, Subtitle, Change % Pill */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold tracking-tight shrink-0 shadow-xs"
            style={{ backgroundColor: card.badgeBgColor }}
          >
            {card.badgeNumber}
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#131722] leading-tight group-hover:text-[#2962ff] transition-colors">
              {card.name}
            </h2>
            <span className="text-xs text-[#787b86] font-medium">
              {card.ticker} · {card.exchange}
            </span>
          </div>
        </div>

        <span
          className={`px-1.5 py-0.5 rounded text-[11px] font-semibold tabular-nums ${
            isPositive ? 'bg-emerald-50 text-[#089981]' : 'bg-rose-50 text-[#f23645]'
          }`}
        >
          {isPositive ? `+${card.changePercent.toFixed(2)}%` : `${card.changePercent.toFixed(2)}%`}
        </span>
      </div>

      {/* Bottom row: Price, Change point, Sparkline */}
      <div className="flex items-baseline justify-between mt-1">
        <div>
          <div className="text-xl font-bold text-[#131722] tabular-nums">
            {card.currency === '%'
              ? `${card.price.toFixed(3)}%`
              : card.price >= 1000
              ? card.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : card.price.toFixed(2)}
          </div>
          <div
            className={`text-xs font-semibold tabular-nums mt-0.5 ${
              isPositive ? 'text-[#089981]' : 'text-[#f23645]'
            }`}
          >
            {isPositive ? `+${card.changeValue.toFixed(2)}` : card.changeValue.toFixed(2)}{' '}
            ({card.currency})
          </div>
        </div>

        {/* Sparkline Mini Chart */}
        <div className="w-24 h-10 shrink-0">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d={`${pathD} L 100,40 L 0,40 Z`}
              fill={fillColor}
            />
          </svg>
        </div>
      </div>
    </article>
  );
};
