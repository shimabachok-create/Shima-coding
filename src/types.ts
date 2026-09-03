export type MarketCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export type TableViewTab =
  | 'Overview'
  | 'Performance'
  | 'Valuation'
  | 'Dividends'
  | 'Margins';

export interface IndexMarketCardData {
  id: string;
  name: string;
  ticker: string;
  exchange: string;
  badgeNumber: string;
  badgeBgColor: string;
  price: number;
  changeValue: number;
  changePercent: number;
  currency: string;
  isPositive: boolean;
  sparkline: number[];
  high24h?: number;
  low24h?: number;
}

export interface StockData {
  ticker: string;
  name: string;
  badgeLetter: string;
  badgeBg: string;
  badgeTextColor: string;
  hasDividendBadge?: boolean;
  price: number;
  changePercent: number;
  changeValue: number;
  volume: string;
  marketCap: string;
  pe: string;
  rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  sparkline: number[];
  isPositive: boolean;
  sector: string;
  performance: {
    d1: string;
    w1: string;
    m1: string;
    m3: string;
    ytd: string;
    y1: string;
    volatility: string;
  };
  valuation: {
    forwardPe: string;
    ps: string;
    pb: string;
    evEbitda: string;
    peg: string;
  };
  dividends: {
    yield: string;
    annualPayout: string;
    payoutRatio: string;
    exDate: string;
  };
  margins: {
    gross: string;
    operating: string;
    net: string;
    roe: string;
    roa: string;
  };
  details: {
    description: string;
    ceo: string;
    headquarters: string;
    employees: string;
    dayRange: string;
    week52Range: string;
    avgVolume: string;
    eps: string;
    beta: string;
  };
}
