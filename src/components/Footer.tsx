import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#f0f3fa] bg-[#fafbfd] py-8 text-xs text-[#787b86] mt-auto">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span>© 2025 TradingView</span>
          <a className="hover:text-[#131722] transition-colors" href="#terms" onClick={(e) => e.preventDefault()}>
            Terms of use
          </a>
          <a className="hover:text-[#131722] transition-colors" href="#privacy" onClick={(e) => e.preventDefault()}>
            Privacy policy
          </a>
          <a className="hover:text-[#131722] transition-colors" href="#cookies" onClick={(e) => e.preventDefault()}>
            Cookies
          </a>
        </div>
        <div>
          <span>Market data provided by ICE Data Services, Bats, and global stock exchanges.</span>
        </div>
      </div>
    </footer>
  );
};
