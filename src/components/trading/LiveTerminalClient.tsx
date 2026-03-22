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
    <div ref={containerRef} className="pt-[96px] h-screen bg-[#0E0E0E] flex overflow-hidden font-sans">
      
      {/* Left/Center Viewport: Chart + Screener with Resizer */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-[#2A2B2E]">
        
        {/* Top: Analytical Chart */}
        <div style={{ flex: `1 1 ${100 - panelHeight}%` }} className="relative min-h-0">
          <ChartWidget symbol={initialSymbol} panelHeight={panelHeight} />
        </div>
        
        {/* DRAGGABLE RESIZER BAR */}
        <div 
          onMouseDown={startResizing}
          onTouchStart={startResizing}
          className={`h-1 cursor-row-resize bg-[#2A2B2E] hover:bg-[#2962FF] transition-colors relative z-50 flex items-center justify-center ${isResizing ? 'bg-[#2962FF]' : ''}`}
        >
          <div className="w-10 h-[2px] bg-[#434651] rounded-full"></div>
        </div>

        {/* Bottom Panel: Advanced TradingView Screener */}
        <div 
          style={{ height: `${panelHeight}%` }} 
          className="relative shrink-0 min-h-0 overflow-hidden"
        >
          <ScreenerPanel />
        </div>
      </div>

      {/* Right Sidebar */}
      <WatchlistWidget activeSymbol={initialSymbol} />
      
    </div>
  );
}
