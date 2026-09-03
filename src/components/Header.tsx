import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, User, ChevronDown, Menu, X, ExternalLink, SlidersHorizontal, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenScreener: () => void;
  liveTicking: boolean;
  onToggleLiveTicking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenScreener,
  liveTicking,
  onToggleLiveTicking,
}) => {
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Markets');

  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#f0f3fa] h-[60px] flex items-center justify-between px-4 lg:px-6">
      {/* Left: Logo & Search */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* TradingView Logo Mark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="TradingView Home"
          className="flex items-center group cursor-pointer focus:outline-hidden"
          id="header-tv-logo-btn"
        >
          <svg className="w-8 h-8 text-[#131722] transition-transform group-hover:scale-105" fill="currentColor" viewBox="0 0 36 28">
            <path d="M14 22H7V6h7v16zm15 0h-7V0h7v22zM0 22h5V12H0v10z" fill="#131722" />
          </svg>
        </button>

        {/* Quick Search Bar */}
        <div className="relative w-56 sm:w-64 md:w-72">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center w-full h-[38px] px-3.5 bg-[#f0f3fa] hover:bg-[#e7eaf3] text-[#787b86] rounded-full text-sm cursor-pointer transition-colors border border-transparent focus:border-blue-400 focus:outline-hidden"
            id="header-search-bar-trigger"
          >
            <Search className="w-4 h-4 mr-2.5 text-[#131722] shrink-0 stroke-[2.2]" />
            <span className="text-xs md:text-sm font-normal text-[#787b86] truncate">
              Search (Ctrl+K)
            </span>
          </button>
        </div>
      </div>

      {/* Center Navigation Links */}
      <nav className="hidden lg:flex items-center space-x-7 text-[15px] font-medium text-[#131722]">
        <button
          onClick={() => setActiveNav('Products')}
          className={`transition-colors py-[18px] cursor-pointer ${
            activeNav === 'Products'
              ? 'text-[#2962ff] font-semibold border-b-2 border-[#2962ff]'
              : 'hover:text-[#2962ff] text-[#131722]'
          }`}
          id="nav-link-products"
        >
          Products
        </button>
        <button
          onClick={() => setActiveNav('Community')}
          className={`transition-colors py-[18px] cursor-pointer ${
            activeNav === 'Community'
              ? 'text-[#2962ff] font-semibold border-b-2 border-[#2962ff]'
              : 'hover:text-[#2962ff] text-[#131722]'
          }`}
          id="nav-link-community"
        >
          Community
        </button>
        <button
          onClick={() => setActiveNav('Markets')}
          className={`transition-colors py-[18px] cursor-pointer ${
            activeNav === 'Markets'
              ? 'text-[#2962ff] font-semibold border-b-2 border-[#2962ff]'
              : 'hover:text-[#2962ff] text-[#131722]'
          }`}
          id="nav-link-markets"
        >
          Markets
        </button>
        <button
          onClick={() => setActiveNav('Brokers')}
          className={`transition-colors py-[18px] cursor-pointer ${
            activeNav === 'Brokers'
              ? 'text-[#2962ff] font-semibold border-b-2 border-[#2962ff]'
              : 'hover:text-[#2962ff] text-[#131722]'
          }`}
          id="nav-link-brokers"
        >
          Brokers
        </button>
        <button
          onClick={() => setActiveNav('More')}
          className={`transition-colors py-[18px] cursor-pointer ${
            activeNav === 'More'
              ? 'text-[#2962ff] font-semibold border-b-2 border-[#2962ff]'
              : 'hover:text-[#2962ff] text-[#131722]'
          }`}
          id="nav-link-more"
        >
          More
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Live Simulation Pulse Indicator */}
        <button
          onClick={onToggleLiveTicking}
          title={liveTicking ? 'Live market simulation ON (Click to pause)' : 'Live market simulation paused (Click to resume)'}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${
            liveTicking
              ? 'bg-emerald-50 text-[#089981] border-emerald-200'
              : 'bg-neutral-100 text-[#787b86] border-neutral-200'
          }`}
          id="toggle-live-market-data"
        >
          <span className={`w-2 h-2 rounded-full ${liveTicking ? 'bg-[#089981] animate-pulse' : 'bg-gray-400'}`} />
          <span>{liveTicking ? 'LIVE' : 'PAUSED'}</span>
        </button>

        {/* Language Picker */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            aria-label="Select Language"
            className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-[#131722] hover:bg-[#f0f3fa] rounded-md transition-colors cursor-pointer"
            id="header-lang-picker-btn"
          >
            <Globe className="w-4 h-4 stroke-[1.8]" />
            <span className="text-xs uppercase tracking-wide font-semibold">{selectedLang}</span>
            <ChevronDown className="w-3 h-3 text-[#787b86]" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-[#e0e3eb] rounded-xl shadow-lg py-1.5 z-50 text-sm animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-xs font-semibold text-[#787b86] uppercase tracking-wider">
                Select Region
              </div>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setSelectedLang(l.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs hover:bg-[#f0f3fa] transition-colors ${
                    selectedLang === l.code ? 'font-bold text-[#2962ff] bg-blue-50/50' : 'text-[#131722]'
                  }`}
                >
                  <span>{l.name}</span>
                  <span className="text-[11px] text-[#787b86] uppercase font-mono">{l.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Icon Button */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-label="Account Menu"
            className="p-2 text-[#131722] hover:bg-[#f0f3fa] rounded-full transition-colors cursor-pointer"
            id="header-user-menu-btn"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-1 w-60 bg-white border border-[#e0e3eb] rounded-xl shadow-xl py-2 z-50 text-sm">
              <div className="px-4 py-2 border-b border-[#f0f3fa]">
                <p className="text-xs font-semibold text-[#131722]">Guest Trader</p>
                <p className="text-[11px] text-[#787b86]">Standard Market Access</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    onOpenScreener();
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#131722] hover:bg-[#f0f3fa] flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#2962ff]" />
                  <span>Open Stock Screener</span>
                </button>
                <button
                  onClick={() => {
                    onOpenSearch();
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#131722] hover:bg-[#f0f3fa] flex items-center gap-2"
                >
                  <Search className="w-3.5 h-3.5 text-[#787b86]" />
                  <span>Quick Symbol Lookup</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={onOpenScreener}
          className="inline-flex items-center justify-center px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white rounded-full bg-gradient-to-r from-[#2962ff] to-[#9c27b0] hover:opacity-95 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          id="header-get-started-btn"
        >
          Get started
        </button>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#131722] hover:bg-[#f0f3fa] rounded-lg"
          aria-label="Toggle navigation menu"
          id="header-mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[60px] left-0 right-0 bg-white border-b border-[#e0e3eb] shadow-xl p-4 z-40 flex flex-col gap-3">
          <nav className="flex flex-col gap-1 text-sm font-medium">
            {['Products', 'Community', 'Markets', 'Brokers', 'More'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-lg ${
                  activeNav === item ? 'bg-blue-50 text-[#2962ff] font-semibold' : 'text-[#131722] hover:bg-[#f0f3fa]'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="pt-2 border-t border-[#f0f3fa] flex items-center justify-between">
            <button
              onClick={onToggleLiveTicking}
              className="flex items-center gap-2 text-xs font-semibold text-[#131722]"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${liveTicking ? 'bg-[#089981]' : 'bg-gray-400'}`} />
              Market Live Tick Updates: {liveTicking ? 'Enabled' : 'Paused'}
            </button>
            <button
              onClick={() => {
                onOpenScreener();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-[#2962ff]"
            >
              Stock Screener
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
