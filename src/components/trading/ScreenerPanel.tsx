'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ScreenerData {
  providerSymbol: string;
  name: string;
  close: number;
  changePct: number;
  volume: number;
  marketCap: number;
  rating: number;
  description: string;
  type: string;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  bbUpper?: number;
  bbLower?: number;
  ema20?: number;
  ema50?: number;
  vwap?: number;
}

export default function ScreenerPanel() {
  const [activeTab, setActiveTab] = useState<'crypto' | 'india' | 'america' | 'forex'>('crypto');
  const [search, setSearch] = useState('');
  const [data, setData] = useState<ScreenerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchScreener = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/screener', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ market: activeTab, search, limit: 200 })
        });
        if (res.ok) {
          const json = await res.json();
          if (isMounted) setData(json.data || []);
        }
      } catch (err) {
        console.error("Scanner fetch failed");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchScreener();
    
    // Poll every 10 seconds for live screener updates
    const interval = setInterval(fetchScreener, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeTab, search]);

  const formatNumber = (num: number) => {
    if (!num) return '—';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const getRating = (score: number) => {
    if (score === null || score === undefined) return { text: 'Neutral', color: 'text-stone' };
    if (score >= 0.5) return { text: 'Strong Buy', color: 'text-bull font-bold' };
    if (score >= 0.1) return { text: 'Buy', color: 'text-[#10B981]' };
    if (score <= -0.5) return { text: 'Strong Sell', color: 'text-bear font-bold' };
    if (score <= -0.1) return { text: 'Sell', color: 'text-[#EF4444]' };
    return { text: 'Neutral', color: 'text-stone' };
  };

  const filteredData = data.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    (d.description && d.description.toLowerCase().includes(search.toLowerCase()))
  );

  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Volume');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);

  const toggleIndicator = (name: string) => {
    setSelectedIndicators(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex flex-col h-full border-t border-[#2A2B2E] bg-[#131722] text-[#D1D4DC] relative z-10 w-full font-sans">
      
      {/* Indicators Dropdown */}
      {isIndicatorsOpen && (
        <div className="absolute top-[88px] md:top-12 right-4 w-52 bg-[#1e222d] border border-[#2a2b2e] rounded shadow-2xl z-[100] py-2 overflow-hidden">
          <div className="px-4 py-2 border-b border-[#2A2B2E] mb-1">
             <span className="text-[10px] font-bold uppercase text-[#A3A6AF] tracking-widest">Toggle Indicators</span>
          </div>
          {['RSI', 'MACD', 'Bollinger Bands', 'EMA 20/50', 'VWAP'].map(ind => (
            <div 
              key={ind} 
              onClick={() => toggleIndicator(ind)}
              className="px-4 py-2 hover:bg-[#2a2b2e] cursor-pointer text-xs flex items-center justify-between group"
            >
              <span className={selectedIndicators.includes(ind) ? 'text-[#2962FF] font-bold' : 'group-hover:text-white'}>{ind}</span>
              {selectedIndicators.includes(ind) && (
                <span className="material-symbols-outlined text-[16px] text-[#2962ff]">check</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-2 md:py-0 md:h-11 shrink-0 border-b border-[#2A2B2E] bg-[#131722] gap-3 md:gap-0">
        
        {/* Left: Search & Tabs */}
        <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto">
           <div className="flex items-center bg-[#1E222D] rounded-full px-3 py-1.5 flex-1 md:w-64 border border-[#2A2B2E] focus-within:border-[#2962FF] transition-colors">
             <span className="material-symbols-outlined text-[16px] text-[#A3A6AF] mr-2">search</span>
             <input 
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="bg-transparent border-none outline-none text-[#D1D4DC] text-xs w-full placeholder:text-[#A3A6AF]"
               placeholder="Search ticker..."
             />
           </div>
           
           <div className="flex items-center h-full gap-4 overflow-x-auto scrollbar-hide shrink-0 pb-1 md:pb-0">
            {[
              { id: 'crypto', label: 'Crypto' },
              { id: 'india', label: 'India (BSE+NSE)' },
              { id: 'america', label: 'America' },
              { id: 'forex', label: 'Forex' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-[10px] md:text-xs font-semibold uppercase tracking-wider h-9 md:h-11 flex items-center transition-colors border-b-2 whitespace-nowrap shrink-0 ${
                  activeTab === tab.id ? 'text-[#2962FF] border-[#2962FF]' : 'text-[#A3A6AF] border-transparent hover:text-[#D1D4DC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Screener Actions / Indicators dynamic toggles */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end relative">
           <button 
             onClick={() => setActiveFilter(f => f === 'Volume' ? 'Rating' : 'Volume')}
             className="flex items-center gap-1.5 text-xs text-[#A3A6AF] hover:text-[#D1D4DC] bg-[#1E222D] px-3 py-1.5 rounded transition-colors border border-[#2A2B2E] flex-1 md:flex-none justify-center md:justify-start"
           >
             <span className="material-symbols-outlined text-[14px]">tune</span>
             <span className="truncate">Filter: {activeFilter}</span>
           </button>
           
           <button 
             onClick={() => setIsIndicatorsOpen(!isIndicatorsOpen)}
             className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-colors border flex-1 md:flex-none justify-center md:justify-start ${isIndicatorsOpen ? 'bg-[#2962FF]/20 text-[#2962FF] border-[#2962FF]/50' : 'text-[#A3A6AF] hover:text-[#D1D4DC] bg-[#1E222D] border-[#2A2B2E]'}`}
           >
             <span className="material-symbols-outlined text-[14px]">auto_graph</span>
             <span className="truncate">Indicators {selectedIndicators.length > 0 && `(${selectedIndicators.length})`}</span>
           </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#0b0e14]">
        {loading && data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-5 h-5 border-2 border-[#2962FF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-[#0E1015] shadow-sm z-10 border-b border-[#2A2B2E]">
              <tr className="text-[11px] uppercase tracking-wider text-[#A3A6AF] font-medium">
                <th className="px-4 md:px-6 py-2">Ticker</th>
                <th className="px-2 md:px-4 py-2 text-right">Price</th>
                <th className="px-2 md:px-4 py-2 text-right">Change %</th>
                <th className="px-4 py-2 text-right">Volume</th>
                {selectedIndicators.includes('RSI') && <th className="px-4 py-2 text-right">RSI</th>}
                {selectedIndicators.includes('MACD') && <th className="px-4 py-2 text-right">MACD</th>}
                {selectedIndicators.includes('Bollinger Bands') && <th className="px-4 py-2 text-right">BB Bands</th>}
                {selectedIndicators.includes('EMA 20/50') && <th className="px-4 py-2 text-right">EMA 20/50</th>}
                {selectedIndicators.includes('VWAP') && <th className="px-4 py-2 text-right">VWAP</th>}
                <th className="hidden lg:table-cell px-4 py-2 text-right">Market Cap</th>
                <th className="px-4 md:px-6 py-2 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#2A2B2E]/50">
              {filteredData.map((row, idx) => {
                const rating = getRating(row.rating);
                // Retain exchange prefix for internal routing to allow dynamic fetching
                const localSymbol = row.providerSymbol || row.name;

                return (
                  <tr 
                    key={`${row.providerSymbol}-${idx}`} 
                    className={`hover:bg-[#1E222D] transition-colors group ${
                      (selectedIndicators.includes('RSI') && row.rsi && row.rsi < 35) ? 'bg-[#089981]/5' : 
                      (selectedIndicators.includes('MACD') && row.macd && row.macdSignal && row.macd > row.macdSignal) ? 'bg-[#2962FF]/5' : 
                      (selectedIndicators.includes('VWAP') && row.close && row.vwap && row.close > row.vwap) ? 'bg-[#FBC02D]/5' : ''
                    }`}
                  >
                    <td className="px-4 md:px-6 py-1.5">
                      <Link href={`/live-terminal/${localSymbol}`} className="flex flex-col gap-0 block">
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-[#D1D4DC] text-[13px] group-hover:text-[#2962FF] transition-colors">{row.name}</span>
                           {row.rsi && row.rsi < 30 && <span className="text-[9px] bg-[#089981] text-white px-1 rounded uppercase font-bold">Oversold</span>}
                           {row.macd && row.macdSignal && row.macd > row.macdSignal && <span className="text-[9px] bg-[#2962FF] text-white px-1 rounded uppercase font-bold">MACD Bull</span>}
                           {row.close && row.bbLower && row.close < row.bbLower && <span className="text-[9px] bg-[#AB47BC] text-white px-1 rounded uppercase font-bold">BB Bounce</span>}
                           {row.close && row.ema20 && row.close > row.ema20 && <span className="text-[9px] bg-[#FF7043] text-white px-1 rounded uppercase font-bold">Trend</span>}
                        </div>
                        <span className="text-[10px] text-[#A3A6AF] truncate max-w-[150px] md:max-w-[250px]">{row.description}</span>
                      </Link>
                    </td>
                    <td className="px-2 md:px-4 py-1.5 text-right font-mono tabular-nums text-[#D1D4DC]">
                      {row.close ? row.close.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : '—'}
                    </td>
                    <td className={`px-2 md:px-4 py-1.5 text-right font-mono tabular-nums font-semibold ${row.changePct > 0 ? 'text-[#089981]' : row.changePct < 0 ? 'text-[#F23645]' : 'text-[#A3A6AF]'}`}>
                      {row.changePct ? `${row.changePct > 0 ? '+' : ''}${row.changePct.toFixed(2)}%` : '—'}
                    </td>
                    <td className="hidden md:table-cell px-4 py-1.5 text-right font-mono tabular-nums text-[#D1D4DC]">
                      {formatNumber(row.volume)}
                    </td>
                    {selectedIndicators.includes('RSI') && (
                      <td className={`px-4 py-1.5 text-right font-mono tabular-nums ${row.rsi && row.rsi < 30 ? 'text-[#089981] font-bold' : row.rsi && row.rsi > 70 ? 'text-[#F23645] font-bold' : 'text-[#D1D4DC]'}`}>
                        {row.rsi ? row.rsi.toFixed(2) : '—'}
                      </td>
                    )}
                    {selectedIndicators.includes('MACD') && (
                      <td className={`px-4 py-1.5 text-right font-mono tabular-nums ${row.macd && row.macdSignal && row.macd > row.macdSignal ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                        {row.macd ? row.macd.toFixed(2) : '—'}
                      </td>
                    )}
                    {selectedIndicators.includes('Bollinger Bands') && (
                      <td className="px-4 py-1.5 text-right font-mono tabular-nums text-[11px]">
                        <div className="text-[#F23645]">{row.bbUpper?.toFixed(1) || '—'}</div>
                        <div className="text-[#089981]">{row.bbLower?.toFixed(1) || '—'}</div>
                      </td>
                    )}
                    {selectedIndicators.includes('EMA 20/50') && (
                      <td className="px-4 py-1.5 text-right font-mono tabular-nums text-[11px]">
                        <div className="text-[#FF7043]">{row.ema20?.toFixed(1) || '—'}</div>
                        <div className="text-[#9FA8DA]">{row.ema50?.toFixed(1) || '—'}</div>
                      </td>
                    )}
                    {selectedIndicators.includes('VWAP') && (
                      <td className={`px-4 py-1.5 text-right font-mono tabular-nums ${row.close && row.vwap && row.close > row.vwap ? 'text-[#FBC02D]' : 'text-[#D1D4DC]'}`}>
                        {row.vwap ? row.vwap.toFixed(2) : '—'}
                      </td>
                    )}
                    <td className="hidden lg:table-cell px-4 py-1.5 text-right font-mono tabular-nums text-[#D1D4DC]">
                      {formatNumber(row.marketCap)}
                    </td>
                    <td className={`px-4 md:px-6 py-1.5 text-right font-medium text-[11px] uppercase tracking-wide ${rating.color}`}>
                      {rating.text}
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                 <tr>
                   <td colSpan={6} className="text-center py-6 text-[#A3A6AF] text-xs">
                     No symbols matched your search.
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
