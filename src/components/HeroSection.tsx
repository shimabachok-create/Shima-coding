import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe2, MapPin } from 'lucide-react';

interface HeroSectionProps {
  currentRegion: string;
  onSelectRegion: (region: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentRegion,
  onSelectRegion,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const regions = [
    { id: 'United States', label: 'United States', icon: '🇺🇸', desc: 'NYSE, NASDAQ, CME & US Treasuries' },
    { id: 'Global', label: 'Global Overview', icon: '🌐', desc: 'All international exchanges & multi-assets' },
    { id: 'Europe', label: 'Europe', icon: '🇪🇺', desc: 'LSE, Euronext, Deutsche Börse, SIX' },
    { id: 'Asia-Pacific', label: 'Asia-Pacific', icon: '🇯🇵', desc: 'TSE, HKEX, Shanghai, ASX, SGX' },
    { id: 'Americas', label: 'Americas (North & South)', icon: '🌎', desc: 'TSX, B3 Brazil, BMV Mexico' },
  ];

  return (
    <section className="text-center py-6 sm:py-10 relative" data-purpose="markets-hero">
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="inline-flex items-center justify-center gap-3 cursor-pointer group focus:outline-hidden"
          id="hero-market-dropdown-toggle"
          aria-expanded={dropdownOpen}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#131722] hover:text-[#2962ff] transition-colors select-none">
            Markets, everywhere
          </h1>
          <ChevronDown className={`w-7 h-7 sm:w-9 sm:h-9 text-[#131722] stroke-[3] transition-transform duration-200 ${
            dropdownOpen ? 'rotate-180 text-[#2962ff]' : 'group-hover:translate-y-0.5'
          }`} />
        </button>

        {dropdownOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-80 sm:w-96 bg-white border border-[#e0e3eb] rounded-2xl shadow-2xl p-2 z-40 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-[#f0f3fa]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#787b86]">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Select Market Scope</span>
              </div>
            </div>
            <div className="py-1 space-y-1">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => {
                    onSelectRegion(region.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left cursor-pointer ${
                    currentRegion === region.id
                      ? 'bg-blue-50/70 border border-blue-200/60'
                      : 'hover:bg-[#f8f9fd]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{region.icon}</span>
                    <div>
                      <div className={`text-sm font-bold ${currentRegion === region.id ? 'text-[#2962ff]' : 'text-[#131722]'}`}>
                        {region.label}
                      </div>
                      <div className="text-[11px] text-[#787b86] font-normal">
                        {region.desc}
                      </div>
                    </div>
                  </div>
                  {currentRegion === region.id && (
                    <Check className="w-4 h-4 text-[#2962ff] stroke-[2.5]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
