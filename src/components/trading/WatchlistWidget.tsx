'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface WatchlistData {
  sym: string;
  name: string;
  last: number;
  chg: number;
  chgPct: number;
}

const INITIAL_INDICES = [
  { sym: 'NIFTY 50', name: 'Nifty 50 (India)' },
  { sym: 'SENSEX', name: 'BSE Sensex' },
  { sym: 'SPX', name: 'S&P 500 Index' }
];

const INITIAL_STOCKS = [
  { sym: 'AAPL', name: 'Apple Inc.' },
  { sym: 'TSLA', name: 'Tesla Inc.' },
  { sym: 'RELIANCE', name: 'Reliance Ind.' }
];

const INITIAL_FOREX = [
  { sym: 'EURUSD', name: 'Euro / U.S. Dollar' },
  { sym: 'XAUUSDT', name: 'Gold Spot' },
  { sym: 'BTCUSDT', name: 'Bitcoin' },
];

export default function WatchlistWidget({ activeSymbol }: { activeSymbol: string }) {
  const router = useRouter();
  const [data, setData] = useState<Record<string, WatchlistData>>({});
  
  // Details pane state
  const activeData = data[activeSymbol] || { sym: activeSymbol, name: '-', last: 0, chg: 0, chgPct: 0 };

  useEffect(() => {
    let isMounted = true;
    
    const fetchPrices = async () => {
      try {
        const spotRes = await fetch('/api/spot');
        const xauRes = await fetch('/api/xau');
        const indRes = await fetch('/api/indices');
        
        let updates: Record<string, WatchlistData> = {};

        if (spotRes.ok) {
          const spotList = await spotRes.json();
          spotList.forEach((d: any) => {
            const last = parseFloat(d.lastPrice);
            const chgPct = parseFloat(d.priceChangePercent);
            const prev = last / (1 + chgPct / 100);
            const chg = last - prev;
            const sym = d.symbol === 'EURUSDT' ? 'EURUSD' : d.symbol;
            updates[sym] = { sym, name: sym, last, chg, chgPct };
          });
        }
        
        if (xauRes.ok) {
          const d = await xauRes.json();
          const last = parseFloat(d.lastPrice);
          const chgPct = parseFloat(d.priceChangePercent);
          const prev = last / (1 + chgPct / 100);
          updates['XAUUSDT'] = { sym: 'XAUUSDT', name: 'Gold Spot', last, chg: last - prev, chgPct };
        }
        
        if (indRes.ok) {
          const indList = await indRes.json();
          indList.forEach((d: any) => {
            const last = parseFloat(d.lastPrice);
            const chgPct = parseFloat(d.priceChangePercent);
            const prev = last / (1 + chgPct / 100);
            updates[d.symbol] = { sym: d.symbol, name: d.symbol, last, chg: last - prev, chgPct };
          });
        }
        
        // Single symbol fetching fallback for any dynamic screener routing
        if (activeSymbol && !updates[activeSymbol]) {
           try {
              const cleanDynSymbol = activeSymbol.includes(':') ? activeSymbol.split(':')[1] : activeSymbol;
              const isCrypto = activeSymbol.includes('USD') || activeSymbol.includes('EUR') || activeSymbol.includes('ETH') || activeSymbol.includes('BTC') || activeSymbol.includes('SOL') || activeSymbol.startsWith('BINANCE:') || activeSymbol.startsWith('FX_IDC:');
              
              if (isCrypto) {
                  let binanceSym = cleanDynSymbol.replace('-', '').toUpperCase();
                  if (binanceSym.endsWith('USD')) {
                      binanceSym = binanceSym.replace(/USD$/, 'USDT');
                  }
                  
                  const dynRes = await fetch(`/api/klines?symbol=${binanceSym}&interval=1d&limit=2`);
                  if (dynRes.ok) {
                    const klines = await dynRes.json();
                    if (klines && klines.length > 0) {
                       const current = klines[klines.length - 1];
                       const prev = klines.length > 1 ? klines[klines.length - 2] : null;
                       const last = parseFloat(current[4]) || 0;
                       const yestClose = prev ? parseFloat(prev[4]) : last;
                       const chg = last - yestClose;
                       const chgPct = yestClose ? (chg / yestClose) * 100 : 0;
                       updates[activeSymbol] = { sym: cleanDynSymbol, name: activeSymbol, last, chg, chgPct };
                    }
                  }
              } else {
                  const dynRes = await fetch(`/api/indices?symbols=${encodeURIComponent(activeSymbol)}`);
                  if (dynRes.ok) {
                    const indList = await dynRes.json();
                    if (indList && indList.length > 0) {
                       const d = indList[0];
                       const last = parseFloat(d.lastPrice) || 0;
                       const chgPct = parseFloat(d.priceChangePercent) || 0;
                       const prev = chgPct ? last / (1 + chgPct / 100) : last;
                       const chg = last - prev;
                       updates[activeSymbol] = { sym: cleanDynSymbol, name: activeSymbol, last, chg, chgPct };
                    }
                  }
              }
           } catch(e) {}
        }
        
        if (isMounted) {
            setData(prev => ({ ...prev, ...updates }));
        }
      } catch (e) {}
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 3000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  const formatPrice = (num: number, sym: string) => {
    if (!num) return '—';
    if (sym === 'EURUSD' || sym === 'EURUSDT') return num.toFixed(5);
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const [watchlistType, setWatchlistType] = useState('Watchlist');
  const [isWlDropdownOpen, setIsWlDropdownOpen] = useState(false);
  const [isTuneOpen, setIsTuneOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);

  const toggleGroup = (title: string) => {
    setCollapsedGroups(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const renderGroup = (title: string, items: {sym: string, name: string}[]) => {
    const isCollapsed = collapsedGroups.includes(title);
    return (
      <div className="mb-2">
        <div 
          onClick={() => toggleGroup(title)}
          className="flex items-center gap-1 px-3 py-1.5 hover:bg-[#2a2b2e] cursor-pointer group"
        >
          <span className={`material-symbols-outlined text-[14px] text-[#A3A6AF] group-hover:text-white transition-transform ${isCollapsed ? '-rotate-90' : ''}`}>
            expand_more
          </span>
          <h3 className="text-[11px] font-semibold text-[#A3A6AF] uppercase tracking-wider group-hover:text-white transition-colors">
            {title}
          </h3>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            {items.map(item => {
              const isActive = activeSymbol === item.sym;
              const point = data[item.sym];
              const isUp = point && point.chgPct >= 0;
              
              return (
                <div 
                  key={item.sym}
                  onClick={() => router.push(`/live-terminal/${item.sym}`)}
                  className={`flex items-center justify-between px-4 py-1.5 cursor-pointer textxs transition-colors ${
                    isActive ? 'bg-[#2B354D] text-white' : 'hover:bg-[#2A2B2E] text-[#D1D4DC]'
                  }`}
                >
                  <div className="flex items-center gap-2 w-[35%]">
                    {/* Fake icon to match TradingView */}
                    <div className={`w-4 h-4 shrink-0 rounded-full flex items-center justify-center text-[8px] font-bold ${isActive ? 'bg-[#2962FF]' : 'bg-[#434651]'}`}>
                      {item.sym.charAt(0)}
                    </div>
                    <span className={`font-semibold text-[13px] truncate ${isActive ? 'text-white' : 'text-[#D1D4DC]'}`}>{item.sym}</span>
                  </div>
                  
                  <div className="w-[22%] text-right font-mono text-[12px]">
                    {point ? formatPrice(point.last, item.sym) : '—'}
                  </div>
                  <div className={`w-[20%] text-right font-mono text-[12px] ${isUp ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                    {point ? `${isUp ? '+' : ''}${point.chg.toFixed(2)}` : '—'}
                  </div>
                  <div className={`w-[23%] text-right font-mono text-[12px] font-semibold ${isUp ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                    {point ? `${isUp ? '+' : ''}${point.chgPct.toFixed(2)}%` : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const activeIsUp = activeData.chgPct >= 0;

  return (
    <div className="w-[340px] md:w-[380px] bg-[#131722] border-l border-[#2A2B2E] flex flex-col shrink-0 h-full overflow-hidden text-[#D1D4DC] font-sans relative">
      
      {/* Watchlist Selection Dropdown */}
      {isWlDropdownOpen && (
        <div className="absolute top-12 left-4 w-48 bg-[#1e222d] border border-[#2a2b2e] rounded shadow-2xl z-50 py-2">
          {['Watchlist', 'Main List', 'Red List', 'Blue List'].map(list => (
            <div 
              key={list} 
              onClick={() => { setWatchlistType(list); setIsWlDropdownOpen(false); }}
              className="px-4 py-2 hover:bg-[#2a2b2e] cursor-pointer text-xs flex items-center justify-between"
            >
              <span>{list}</span>
              {watchlistType === list && <span className="material-symbols-outlined text-[14px] text-[#2962ff]">check</span>}
            </div>
          ))}
        </div>
      )}

      {/* Tune/Settings Dropdown */}
      {isTuneOpen && (
        <div className="absolute top-12 right-4 w-48 bg-[#1e222d] border border-[#2a2b2e] rounded shadow-2xl z-50 py-2">
          {['Sort by Price', 'Sort by Change', 'Show Description', 'Show Icons'].map(opt => (
            <div key={opt} className="px-4 py-2 hover:bg-[#2a2b2e] cursor-pointer text-xs">{opt}</div>
          ))}
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-[#2A2B2E]">
        <div 
          onClick={() => setIsWlDropdownOpen(!isWlDropdownOpen)}
          className="flex items-center gap-1 cursor-pointer group"
        >
          <span className="font-semibold text-sm text-white group-hover:text-[#2962ff] transition-colors">{watchlistType}</span>
          <span className={`material-symbols-outlined text-[16px] text-[#A3A6AF] group-hover:text-white transition-transform ${isWlDropdownOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[18px] text-[#A3A6AF] hover:text-white cursor-pointer active:scale-95 transition-transform">add</span>
          <span 
            onClick={() => setIsTuneOpen(!isTuneOpen)}
            className={`material-symbols-outlined text-[18px] transition-colors cursor-pointer ${isTuneOpen ? 'text-[#2962ff]' : 'text-[#A3A6AF] hover:text-white'}`}
          >
            tune
          </span>
        </div>
      </div>

      {/* Columns Header */}
      <div className="flex items-center justify-between px-4 py-2 text-[11px] text-[#A3A6AF] border-b border-[#2A2B2E] shrink-0">
        <div className="w-[35%] font-medium">Symbol</div>
        <div className="w-[22%] text-right font-medium">Last</div>
        <div className="w-[20%] text-right font-medium">Chg</div>
        <div className="w-[23%] text-right font-medium">Chg%</div>
      </div>

      {/* Scrollable Watchlist Area with min-h-0 to prevent layout blowouts */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide py-2">
        {renderGroup('Indices', INITIAL_INDICES)}
        {renderGroup('Stocks', INITIAL_STOCKS)}
        {renderGroup('Crypto & Forex', INITIAL_FOREX)}
      </div>

      {/* Bottom Details Pane (Like TradingView) */}
      <div className="shrink-0 h-[300px] border-t border-[#2A2B2E] bg-[#131722] flex flex-col pt-4 px-4 relative">
         <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-[#2962FF] rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {activeData.sym.charAt(0)}
            </div>
            <span className="font-bold text-lg text-white tracking-tight truncate">{activeData.sym}</span>
            <div className="flex gap-1 ml-auto shrink-0">
              <span className="material-symbols-outlined text-[18px] text-[#A3A6AF] hover:text-white cursor-pointer">grid_view</span>
              <span className="material-symbols-outlined text-[18px] text-[#A3A6AF] hover:text-white cursor-pointer">edit</span>
            </div>
         </div>
         
         <div className="text-[12px] text-[#A3A6AF] mb-3 truncate">
            {activeData.name} • Internal Exchange
         </div>

         <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[28px] font-bold text-white tabular-nums tracking-tight">
               {formatPrice(activeData.last, activeData.sym)}
            </span>
            <span className="text-[14px] text-[#A3A6AF] font-medium tracking-tight">
               {activeData.sym.includes('USD') || activeData.sym.includes('BTC') ? 'USD' : 'INR'}
            </span>
         </div>
         
         <div className={`flex items-center gap-2 font-mono text-[14px] font-medium mb-3 ${activeIsUp ? 'text-[#089981]' : 'text-[#F23645]'}`}>
            <span>{activeIsUp ? '+' : ''}{activeData.chg.toFixed(2)}</span>
            <span>{activeIsUp ? '+' : ''}{activeData.chgPct.toFixed(2)}%</span>
         </div>

         <div className="flex items-center gap-1.5 text-[11px] text-[#A3A6AF] mb-4">
            {activeData.sym.includes('USD') || activeData.sym.includes('BTC') || activeData.sym.includes('XAU') ? (
              <><span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>Market open 24/7</>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-[#A3A6AF]"></span>Market closed</>
            )}
         </div>

         {/* Dynamic Seasonals Chart Area mapped to active symbol signature */}
         <div className="flex-1 mt-auto border-t border-[#2A2B2E] pt-3 pb-2 flex flex-col min-h-0">
            <h4 className="text-[12px] font-semibold text-[#D1D4DC] mb-2">Seasonals Profile</h4>
            <div className="flex-1 w-full flex items-end gap-[3px] opacity-60">
               {[...activeData.sym, ...activeData.sym].map((char, i) => {
                 const heightVal = (((char.charCodeAt(0) * (i + 1)) % 10) + 1) * 10;
                 return <div key={i} className="flex-1 bg-[#2962FF] rounded-sm min-w-1 min-h-[1px]" style={{ height: `${heightVal}%` }}></div>;
               })}
            </div>
         </div>
      </div>

    </div>
  );
}
