'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChartWidget from '@/components/trading/ChartWidget';
import ScreenerPanel from '@/components/trading/ScreenerPanel';
import WatchlistWidget from '@/components/trading/WatchlistWidget';

interface LiveTerminalClientProps {
  initialSymbol: string;
}

export default function LiveTerminalClient({ initialSymbol }: LiveTerminalClientProps) {
  const [panelHeight, setPanelHeight] = useState(40); // height in percent
  const [isResizing, setIsResizing] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'chart' | 'watchlist' | 'screener'>('chart');
  const containerRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent | TouchEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const relativeY = clientY - containerRect.top;
      const totalHeight = containerRect.height;
      const newHeight = ((totalHeight - relativeY) / totalHeight) * 100;
      
      // Constraints: Screener should be between 10% and 80% of space
      if (newHeight > 10 && newHeight < 80) {
        setPanelHeight(newHeight);
      }
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      window.addEventListener('touchmove', resize);
      window.addEventListener('touchend', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      window.removeEventListener('touchmove', resize);
      window.removeEventListener('touchend', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      window.removeEventListener('touchmove', resize);
      window.removeEventListener('touchend', stopResizing);
    };
  }, [isResizing]);

  return (
    <div ref={containerRef} className="pt-[85px] md:pt-[96px] h-screen bg-[#0E0E0E] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* MOBILE TABS (Hidden on Desktop) */}
      <div className="flex md:hidden items-center justify-around bg-[#131722] border-b border-[#2A2B2E] shrink-0 z-50">
        {[
          { id: 'watchlist', icon: 'list', label: 'Watchlist' },
          { id: 'chart', icon: 'show_chart', label: 'Chart' },
          { id: 'screener', icon: 'filter_alt', label: 'Screener' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveMobileTab(tab.id as any)}
            className={`flex flex-col items-center py-2 px-4 gap-0.5 border-b-2 transition-all ${
              activeMobileTab === tab.id ? 'border-[#2962FF] text-[#2962FF]' : 'border-transparent text-[#A3A6AF]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 border-r border-[#2A2B2E] ${activeMobileTab !== 'chart' && activeMobileTab !== 'screener' ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Top: Analytical Chart */}
        <div 
          style={{ flex: activeMobileTab === 'chart' ? '1 1 auto' : `1 1 ${100 - panelHeight}%` }} 
          className={`relative min-h-0 ${activeMobileTab === 'screener' ? 'hidden md:block' : 'block'}`}
        >
          <ChartWidget symbol={initialSymbol} panelHeight={panelHeight} />
        </div>
        
        {/* DRAGGABLE RESIZER BAR (Desktop Only) */}
        <div 
          onMouseDown={startResizing}
          onTouchStart={startResizing}
          className={`hidden md:flex h-1 cursor-row-resize bg-[#2A2B2E] hover:bg-[#2962FF] transition-colors relative z-50 items-center justify-center ${isResizing ? 'bg-[#2962FF]' : ''}`}
        >
          <div className="w-10 h-[2px] bg-[#434651] rounded-full"></div>
        </div>

        {/* Bottom Panel: Advanced TradingView Screener */}
        <div 
          style={{ height: activeMobileTab === 'screener' ? '100%' : `${panelHeight}%` }} 
          className={`relative shrink-0 min-h-0 overflow-hidden ${activeMobileTab === 'chart' ? 'hidden md:block' : 'block'}`}
        >
          <ScreenerPanel />
        </div>
      </div>

      {/* Right Sidebar (Watchlist) */}
      <div className={`w-full md:w-[340px] lg:w-[380px] shrink-0 h-full ${activeMobileTab !== 'watchlist' ? 'hidden md:block' : 'block'}`}>
        <WatchlistWidget activeSymbol={initialSymbol} />
      </div>
      
    </div>
  );
}
