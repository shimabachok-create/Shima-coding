import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { IndexCard } from './components/IndexCard';
import { StocksTable } from './components/StocksTable';
import { StockDetailModal } from './components/StockDetailModal';
import { IndexDetailModal } from './components/IndexDetailModal';
import { SearchModal } from './components/SearchModal';
import { StockScreenerModal } from './components/StockScreenerModal';
import { IndicesDrawerModal } from './components/IndicesDrawerModal';
import { Footer } from './components/Footer';
import { MarketCategory, TableViewTab, StockData, IndexMarketCardData } from './types';
import { CATEGORY_INDICES, US_STOCKS } from './data/marketData';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<MarketCategory>('US stocks');
  const [currentRegion, setCurrentRegion] = useState('United States');
  const [activeTableViewTab, setActiveTableViewTab] = useState<TableViewTab>('Overview');

  // Modals state
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<IndexMarketCardData | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [screenerOpen, setScreenerOpen] = useState(false);
  const [indicesDrawerOpen, setIndicesDrawerOpen] = useState(false);

  // Watchlist state
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['NVDA', 'AAPL'];
    } catch {
      return ['NVDA', 'AAPL'];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live real-time market data state
  const [liveTicking, setLiveTicking] = useState(true);
  const [indicesList, setIndicesList] = useState<IndexMarketCardData[]>(CATEGORY_INDICES['US stocks']);
  const [stocksList, setStocksList] = useState<StockData[]>(US_STOCKS);
  const [flashCards, setFlashCards] = useState<Record<string, 'up' | 'down'>>({});
  const [flashStocks, setFlashStocks] = useState<Record<string, 'up' | 'down'>>({});

  // When category changes, update indices
  useEffect(() => {
    setIndicesList(CATEGORY_INDICES[currentCategory] || CATEGORY_INDICES['US stocks']);
  }, [currentCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleToggleWatchlist = (ticker: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(ticker);
      const next = exists ? prev.filter((t) => t !== ticker) : [...prev, ticker];
      try {
        localStorage.setItem('tv_watchlist', JSON.stringify(next));
      } catch {}
      showToast(exists ? `Removed ${ticker} from Watchlist` : `Added ${ticker} to Watchlist`);
      return next;
    });
  };

  // Subtle real-time market price ticking simulation
  useEffect(() => {
    if (!liveTicking) return;

    const interval = setInterval(() => {
      // 50% chance tick a stock, 50% chance tick an index
      const tickTarget = Math.random() > 0.4 ? 'stock' : 'index';

      if (tickTarget === 'stock') {
        const randomIndex = Math.floor(Math.random() * stocksList.length);
        const stock = stocksList[randomIndex];
        if (!stock) return;

        const delta = (Math.random() - 0.48) * (stock.price * 0.0015);
        const newPrice = Math.max(1, Number((stock.price + delta).toFixed(2)));
        const direction: 'up' | 'down' = delta >= 0 ? 'up' : 'down';

        setStocksList((prev) =>
          prev.map((s, idx) => (idx === randomIndex ? { ...s, price: newPrice } : s))
        );

        setFlashStocks((prev) => ({ ...prev, [stock.ticker]: direction }));
        setTimeout(() => {
          setFlashStocks((prev) => {
            const next = { ...prev };
            delete next[stock.ticker];
            return next;
          });
        }, 600);
      } else {
        const randomIndex = Math.floor(Math.random() * indicesList.length);
        const card = indicesList[randomIndex];
        if (!card) return;

        const delta = (Math.random() - 0.48) * (card.price * 0.0008);
        const newPrice = Number((card.price + delta).toFixed(2));
        const direction: 'up' | 'down' = delta >= 0 ? 'up' : 'down';

        setIndicesList((prev) =>
          prev.map((c, idx) => (idx === randomIndex ? { ...c, price: newPrice } : c))
        );

        setFlashCards((prev) => ({ ...prev, [card.id]: direction }));
        setTimeout(() => {
          setFlashCards((prev) => {
            const next = { ...prev };
            delete next[card.id];
            return next;
          });
        }, 600);
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [liveTicking, stocksList, indicesList]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#131722] font-sans antialiased">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131722] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-[#089981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenScreener={() => setScreenerOpen(true)}
        liveTicking={liveTicking}
        onToggleLiveTicking={() => setLiveTicking(!liveTicking)}
      />

      {/* Main Content */}
      <main className="flex-grow max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Hero Title with Chevron Dropdown */}
        <HeroSection
          currentRegion={currentRegion}
          onSelectRegion={(reg) => {
            setCurrentRegion(reg);
            showToast(`Market scope updated to ${reg}`);
          }}
        />

        {/* Sub-navigation Category Filter & Header */}
        <CategoryFilter
          currentCategory={currentCategory}
          onSelectCategory={(cat) => setCurrentCategory(cat)}
          onIndicesClick={() => setIndicesDrawerOpen(true)}
        />

        {/* Index Market Cards */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          data-purpose="indices-cards"
          id="indices-market-cards-grid"
        >
          {indicesList.map((card) => (
            <IndexCard
              key={card.id}
              card={card}
              onClick={(c) => setSelectedIndex(c)}
              flash={flashCards[card.id]}
            />
          ))}
        </section>

        {/* Most Active Stocks Section */}
        <StocksTable
          stocks={stocksList}
          activeTab={activeTableViewTab}
          onTabChange={(tab) => setActiveTableViewTab(tab)}
          onSelectStock={(stock) => setSelectedStock(stock)}
          onExploreScreener={() => setScreenerOpen(true)}
          regionLabel={currentRegion}
          flashMap={flashStocks}
        />
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Stock Detail Modal */}
      <StockDetailModal
        stock={selectedStock}
        onClose={() => setSelectedStock(null)}
        isWatchlisted={selectedStock ? watchlist.includes(selectedStock.ticker) : false}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* Index Detail Modal */}
      <IndexDetailModal
        index={selectedIndex}
        onClose={() => setSelectedIndex(null)}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        stocks={stocksList}
        indices={indicesList}
        onSelectStock={(stock) => setSelectedStock(stock)}
        onSelectIndex={(index) => setSelectedIndex(index)}
      />

      {/* Stock Screener Modal */}
      <StockScreenerModal
        isOpen={screenerOpen}
        onClose={() => setScreenerOpen(false)}
        stocks={stocksList}
        onSelectStock={(stock) => setSelectedStock(stock)}
      />

      {/* Indices Drawer Modal */}
      <IndicesDrawerModal
        isOpen={indicesDrawerOpen}
        onClose={() => setIndicesDrawerOpen(false)}
        indices={indicesList}
        onSelectIndex={(idx) => setSelectedIndex(idx)}
      />
    </div>
  );
}
