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
    <div className="flex flex-col h-[40vh] min-h-[300px] border-t border-[#2A2B2E] bg-[#131722] text-[#D1D4DC] relative z-10 w-full font-sans">
      
      {/* Indicators Dropdown */}
      {isIndicatorsOpen && (
        <div className="absolute top-12 right-4 w-48 bg-[#1e222d] border border-[#2a2b2e] rounded shadow-2xl z-50 py-2">
          {['RSI', 'MACD', 'Bollinger Bands', 'EMA 20/50', 'VWAP'].map(ind => (
            <div 
              key={ind} 
              onClick={() => toggleIndicator(ind)}
              className="px-4 py-2 hover:bg-[#2a2b2e] cursor-pointer text-xs flex items-center justify-between"
            >
              <span>{ind}</span>
              {selectedIndicators.includes(ind) && (
                <span className="material-symbols-outlined text-[14px] text-[#2962ff]">check</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 h-11 shrink-0 border-b border-[#2A2B2E] bg-[#131722]">
        
        {/* Left: Search & Tabs */}
        <div className="flex items-center gap-6 h-full">
           <div className="flex items-center bg-[#1E222D] rounded-full px-3 py-1.5 w-64 border border-[#2A2B2E] focus-within:border-[#2962FF] transition-colors">
             <span className="material-symbols-outlined text-[16px] text-[#A3A6AF] mr-2">search</span>
             <input 
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="bg-transparent border-none outline-none text-[#D1D4DC] text-xs w-full placeholder:text-[#A3A6AF]"
               placeholder="Search ticker or company..."
             />
           </div>
           
           <div className="flex items-center h-full gap-4">
            {[
              { id: 'crypto', label: 'Crypto' },
              { id: 'india', label: 'India (BSE+NSE)' },
              { id: 'america', label: 'America' },
              { id: 'forex', label: 'Forex' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs font-semibold uppercase tracking-wider h-full flex items-center transition-colors border-b-2 ${
                  activeTab === tab.id ? 'text-[#2962FF] border-[#2962FF]' : 'text-[#A3A6AF] border-transparent hover:text-[#D1D4DC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Screener Actions / Indicators dynamic toggles */}
        <div className="flex items-center gap-2 relative">
           <button 
             onClick={() => setActiveFilter(f => f === 'Volume' ? 'Rating' : 'Volume')}
             className="flex items-center gap-1.5 text-xs text-[#A3A6AF] hover:text-[#D1D4DC] bg-[#1E222D] px-3 py-1.5 rounded transition-colors border border-[#2A2B2E]"
           >
             <span className="material-symbols-outlined text-[14px]">tune</span>
             Filter: {activeFilter}
           </button>
           
           <button 
             onClick={() => setIsIndicatorsOpen(!isIndicatorsOpen)}
             className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-colors border ${isIndicatorsOpen ? 'bg-[#2962FF]/20 text-[#2962FF] border-[#2962FF]/50' : 'text-[#A3A6AF] hover:text-[#D1D4DC] bg-[#1E222D] border-[#2A2B2E]'}`}
           >
             <span className="material-symbols-outlined text-[14px]">auto_graph</span>
             Indicators {selectedIndicators.length > 0 && `(${selectedIndicators.length})`}
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
                <th className="px-6 py-2">Ticker</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Change %</th>
                <th className="px-4 py-2 text-right">Volume</th>
                <th className="px-4 py-2 text-right">Market Cap</th>
                <th className="px-6 py-2 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#2A2B2E]/50">
              {filteredData.map((row, idx) => {
                const rating = getRating(row.rating);
                // Retain exchange prefix for internal routing to allow dynamic fetching
                const localSymbol = row.providerSymbol || row.name;

                return (
                  <tr key={`${row.providerSymbol}-${idx}`} className="hover:bg-[#1E222D] transition-colors group">
                    <td className="px-6 py-1.5">
                      <Link href={`/live-terminal/${localSymbol}`} className="flex flex-col gap-0 block">
                        <span className="font-bold text-[#D1D4DC] text-[13px] group-hover:text-[#2962FF] transition-colors">{row.name}</span>
                        <span className="text-[10px] text-[#A3A6AF] truncate max-w-[250px]">{row.description}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-1.5 text-right font-mono tabular-nums text-[#D1D4DC]">
                      {row.close ? row.close.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : '—'}
                    </td>
                    <td className={`px-4 py-1.5 text-right font-mono tabular-nums font-semibold ${row.changePct > 0 ? 'text-[#089981]' : row.changePct < 0 ? 'text-[#F23645]' : 'text-[#A3A6AF]'}`}>
                      {row.changePct ? `${row.changePct > 0 ? '+' : ''}${row.changePct.toFixed(2)}%` : '—'}
                    </td>
                    <td className="px-4 py-1.5 text-right font-mono tabular-nums text-[#D1D4DC]">
                      {formatNumber(row.volume)}
                    </td>
                    <td className="px-4 py-1.5 text-right font-mono tabular-nums text-[#D1D4DC]">
                      {formatNumber(row.marketCap)}
                    </td>
                    <td className={`px-6 py-1.5 text-right font-medium text-[11px] uppercase tracking-wide ${rating.color}`}>
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
