'use client';

import { Button } from '@/components/ui/Button';
import { useEffect, useState, useRef } from 'react';
import { createChart, CandlestickSeries, LineSeries } from 'lightweight-charts';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export default function Terminal() {
  const [mounted, setMounted] = useState(false);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [activeAsset, setActiveAsset] = useState({ label: 'BTC/USD', value: 'BTC-USD', isCrypto: true });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [tickerPrice, setTickerPrice] = useState('0.00');
  const [tickerChange, setTickerChange] = useState('0.00%');
  const [tickerIsUp, setTickerIsUp] = useState(true);
  const [deltaValues, setDeltaValues] = useState<number[]>([]);
  const [domValues, setDomValues] = useState<{bid:number, ask:number, p:number}[]>([]);
  const [activeSignal, setActiveSignal] = useState(0);
  const [tradePair, setTradePair] = useState('EUR / USD');
  const [tradeDir, setTradeDir] = useState<'buy' | 'sell'>('buy');

  const chartRef = useRef<HTMLDivElement>(null);

  const ASSETS = [
    { label: 'BTC/USD', value: 'BTC-USD', isCrypto: true },
    { label: 'NIFTY 50', value: 'NIFTY 50', isCrypto: false },
    { label: 'XAU/USD', value: 'XAU-USD', isCrypto: false },
    { label: 'EUR/USD', value: 'EUR-USD', isCrypto: false },
    { label: 'SPX', value: 'SPX', isCrypto: false }
  ];

  useEffect(() => {
    setMounted(true);
    setDeltaValues(Array.from({length: 40}, () => Math.random() * 100));
    setDomValues(Array.from({length: 8}, (_, i) => ({ 
      p: 0 + (i - 4) * 0.5, 
      bid: Math.floor(Math.random() * 80 + 20), 
      ask: Math.floor(Math.random() * 80 + 20) 
    })));

    const signalInterval = setInterval(() => {
      setActiveSignal(prev => (prev + 1) % 2);
    }, 8000);

    const dInterval = setInterval(() => {
      setDeltaValues(Array.from({length: 40}, () => Math.random() * 100));
    }, 3800);

    const domInterval = setInterval(() => {
      setDomValues(prev => {
        const center = parseFloat(tickerPrice.replace(/,/g, '')) || 0;
        return prev.map((d, i) => ({
          ...d,
          p: center + (i - 4) * 0.5,
          bid: Math.max(5, Math.min(100, d.bid + (Math.random() - 0.5) * 15)),
          ask: Math.max(5, Math.min(100, d.ask + (Math.random() - 0.5) * 15)),
        }));
      });
    }, 800);

    return () => {
      clearInterval(signalInterval);
      clearInterval(dInterval);
      clearInterval(domInterval);
    };
  }, []); // tickerPrice removed from dependencies to stop effect cycle

  useEffect(() => {
    if (tradeModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [tradeModalOpen]);

  useEffect(() => {
    if (!mounted || !chartRef.current) return;
    
    const chart = createChart(chartRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#6a5a48',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
      },
      timeScale: { 
        visible: true,
        borderColor: 'rgba(201,149,42,0.1)' 
      },
      rightPriceScale: {
        borderColor: 'rgba(201,149,42,0.1)',
      },
      handleScroll: true,
      handleScale: true,
    });

    // @ts-ignore
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22C97A',
      downColor: '#E04545',
      borderVisible: false,
      wickUpColor: '#22C97A',
      wickDownColor: '#E04545',
    });

    // @ts-ignore
    const emaSeries = chart.addSeries(LineSeries, {
      color: '#c9952a',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    let socket: any = null;
    let pollInterval: any = null;

    const fetchData = async () => {
      try {
        setTickerPrice('...');
        let fetchUrl = '';
        if (activeAsset.isCrypto) {
            const sym = activeAsset.value === 'XAU-USD' ? 'XAUUSDT' : 'BTCUSDT';
            fetchUrl = `/api/klines?symbol=${sym}&interval=15m&limit=100`;
        } else {
            fetchUrl = `/api/yahoo-klines?symbol=${encodeURIComponent(activeAsset.value)}&interval=15m`;
        }

        const response = await fetch(fetchUrl);
        const klines = await response.json();

        if (!Array.isArray(klines) || klines.length === 0) {
            console.error('No kline data returned for:', activeAsset.value);
            return;
        }

        const data = klines.map((k: any) => ({
          time: (k[0] / 1000) as import('lightweight-charts').Time,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));
        
        series.setData(data);
        
        let ema = data[0].close;
        const k = 2 / (21 + 1);
        const emaData = data.map((d: any) => {
          ema = (d.close * k) + (ema * (1 - k));
          return { time: d.time, value: ema };
        });
        emaSeries.setData(emaData);

        chart.timeScale().fitContent();

        const last = data[data.length - 1];
        const first = data[0];
        setTickerPrice(last.close.toLocaleString(undefined, { 
          minimumFractionDigits: activeAsset.value.includes('EUR') ? 5 : 2,
          maximumFractionDigits: activeAsset.value.includes('EUR') ? 5 : 2
        }));
        const diff = ((last.close - first.close) / first.close * 100);
        setTickerChange((diff >= 0 ? '+' : '') + diff.toFixed(2) + '%');
        setTickerIsUp(diff >= 0);

        if (activeAsset.value === 'BTC-USD') {
            socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_15m');
            socket.onmessage = (event: any) => {
              const msg = JSON.parse(event.data);
              const k = msg.k;
              const candle = {
                time: (k.t / 1000) as import('lightweight-charts').Time,
                open: parseFloat(k.o),
                high: parseFloat(k.h),
                low: parseFloat(k.l),
                close: parseFloat(k.c),
              };
              series.update(candle);
              setTickerPrice(candle.close.toLocaleString(undefined, { minimumFractionDigits: 2 }));
            };
        } else {
            pollInterval = setInterval(async () => {
                const res = await fetch(fetchUrl + '&limit=1');
                if (res.ok) {
                    const d = await res.json();
                    if (d && d.length > 0) {
                        const k = d[d.length - 1]; // Use latest candle instead of oldest
                        const candle = {
                          time: (k[0] / 1000) as import('lightweight-charts').Time,
                          open: parseFloat(k[1]),
                          high: parseFloat(k[2]),
                          low: parseFloat(k[3]),
                          close: parseFloat(k[4]),
                        };
                        series.update(candle);
                        setTickerPrice(candle.close.toLocaleString(undefined, { 
                            minimumFractionDigits: activeAsset.value.includes('EUR') ? 5 : 2 
                        }));
                    }
                }
            }, 5000);
        }
      } catch (e) {
        console.error('Terminal chart fetch failed', e);
      }
    };

    fetchData();

    const handleResize = () => {
      if (chartRef.current) {
        chart.applyOptions({ width: chartRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (socket) socket.close();
      if (pollInterval) clearInterval(pollInterval);
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [mounted, activeAsset]);

  return (
    <>
      <section className="bg-void border-y border-border-subtle z-1 relative" id="terminal">
        <div className="max-w-[1440px] mx-auto py-20 px-6 lg:px-16">
        <div className="flex items-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-5 before:content-[''] before:block before:w-7 before:h-[1px] before:bg-amber">
          Live Trading Terminal
        </div>
        <h2 className="font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-[1.1] text-ivory mb-5">
          Professional <em className="italic text-gold-mid font-light">Market Intelligence</em>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 md:gap-8 mt-10">
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="bg-onyx border border-border-subtle rounded-xl overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 px-5 md:px-6 border-b border-border-subtle bg-[#110E18] gap-4 sm:gap-0">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 bg-black/40 border border-border-subtle hover:border-gold-mid transition-colors rounded px-2.5 py-1 text-[0.65rem] md:text-[0.7rem] text-ivory font-mono group"
                    >
                      {activeAsset.label} <span className={`opacity-40 text-[0.6rem] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-32 bg-[#1A1625] border border-border-subtle rounded shadow-2xl z-[100] py-1 overflow-hidden">
                        {ASSETS.map(asset => (
                          <div 
                            key={asset.value}
                            onClick={() => { setActiveAsset(asset); setIsDropdownOpen(false); }}
                            className={`px-3 py-2 text-[0.7rem] font-mono cursor-pointer hover:bg-gold-trace hover:text-gold-light transition-colors ${activeAsset.value === asset.value ? 'bg-black/40 text-gold-light' : 'text-stone'}`}
                          >
                            {asset.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[0.55rem] md:text-[0.6rem] font-bold tracking-[0.15em] text-bull uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-bull animate-pulse" />
                    Live
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 md:gap-6">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[1rem] md:text-[1.1rem] text-ivory tracking-tight">{tickerPrice}</span>
                    <span className={`font-mono text-[0.7rem] md:text-[0.75rem] flex items-center gap-1 ${tickerIsUp ? 'text-bull' : 'text-bear'}`}>
                      {tickerIsUp ? '▲' : '▼'} {tickerChange}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                     href={`/live-terminal/${activeAsset.value === 'BTC-USD' ? 'BTCUSDT' : activeAsset.value}`}
                     className="bg-onyx hover:bg-gold-trace text-ivory border border-border-subtle hover:border-gold-mid text-[0.6rem] md:text-[0.65rem] font-bold px-3 md:px-4 py-1.5 rounded uppercase tracking-wider transition-all"
                    >
                      View Chart
                    </Link>
                    <a 
                     href={SITE_CONFIG.links.telegram}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="bg-gold hover:bg-gold-light text-[#0A0505] text-[0.6rem] md:text-[0.65rem] font-bold px-4 md:px-5 py-1.5 rounded uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(201,149,42,0.25)] flex items-center gap-2"
                    >
                      Join
                    </a>
                  </div>
                </div>
              </div>
              <div className="h-[250px] md:h-[400px] w-full bg-[#0E0B18] relative">
                <div ref={chartRef} className="w-full h-full block" />
              </div>
            </div>

            <div className="bg-onyx border border-border-subtle rounded-xl overflow-hidden">
              <div className="flex items-center justify-between py-3 px-5 border-b border-border-subtle bg-black/20">
                <span className="text-[0.6rem] md:text-[0.65rem] font-bold tracking-[0.15em] uppercase text-stone leading-none">Cumulative Delta</span>
              </div>
              <div className="p-4 md:p-6">
                <div className="h-20 md:h-24 w-full flex items-end gap-0.5 border-b border-border-subtle/30 pb-1">
                  {deltaValues.map((h, i) => (
                    <div key={i} className={`flex-1 rounded-t-sm ${Math.random() > 0.4 ? 'bg-bull' : 'bg-bear'}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:gap-8">
            <div className="bg-onyx border border-border-subtle rounded-xl overflow-hidden shadow-xl">
              <div className="flex items-center justify-between py-3 px-5 border-b border-border-subtle bg-black/20">
                <span className="text-[0.6rem] md:text-[0.65rem] font-bold tracking-[0.15em] uppercase text-stone">Depth Of Market</span>
                <span className="text-[0.55rem] text-stone italic">Order Book v2.4</span>
              </div>
              <div className="grid grid-cols-[1fr_80px_1fr] py-2 text-[0.55rem] md:text-[0.6rem] tracking-[0.1em] uppercase text-ash border-b border-border-subtle/50">
                <span className="pl-4">Bid</span>
                <span className="text-center">Price</span>
                <span className="text-right pr-4">Ask</span>
              </div>
              <div className="flex flex-col py-2">
                {domValues.map((d, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_1fr] relative py-0.5 md:py-1 group">
                    <div className="absolute left-0 top-0 bottom-0 bg-bull/5 transition-all duration-700" style={{ width: `${d.bid}%` }} />
                    <div className="absolute right-0 top-0 bottom-0 bg-bear/5 transition-all duration-700" style={{ width: `${d.ask}%` }} />
                    <div className="px-4 text-bull font-mono text-[0.65rem] md:text-[0.7rem] relative z-10 font-bold">{Math.floor(d.bid)}</div>
                    <div className="text-center text-ivory font-mono text-[0.62rem] md:text-[0.68rem] relative z-10 bg-void/40 backdrop-blur-sm border-x border-border-subtle/20">
                      {d.p.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-right px-4 text-bear font-mono text-[0.65rem] md:text-[0.7rem] relative z-10 font-bold">{Math.floor(d.ask)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-onyx border border-border-subtle rounded-xl overflow-hidden shadow-xl">
              <div className="flex items-center justify-between py-3 px-5 border-b border-border-subtle bg-black/20">
                <span className="text-[0.6rem] md:text-[0.65rem] font-bold tracking-[0.15em] uppercase text-stone leading-none">AI Signal Engine</span>
                <div className="flex items-center gap-1.5 text-[0.5rem] md:text-[0.6rem] font-bold tracking-[0.18em] text-bull uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-bull animate-[live-pulse_1.4s_infinite]" />
                  Scanning
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className={`bg-black/20 border-l-4 border-bull border-y border-r border-border-subtle rounded-lg p-3.5 cursor-pointer hover:bg-black/40 transition-all ${activeSignal === 0 ? 'opacity-100' : 'opacity-40 scale-[0.98]'}`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-serif font-bold text-[0.95rem] md:text-[1.05rem] text-ivory">BTC / USD</span>
                    <span className="text-[0.55rem] font-extrabold tracking-[0.1em] px-2 py-0.5 rounded-sm bg-bull text-[#0A0505]">LONG</span>
                  </div>
                  <div className="text-[0.65rem] md:text-[0.7rem] text-stone font-light leading-relaxed">Liquidity sweep + MSS detected on 15m timeframe.</div>
                </div>
                <div className={`bg-black/20 border-l-4 border-bear border-y border-r border-border-subtle rounded-lg p-3.5 cursor-pointer hover:bg-black/40 transition-all ${activeSignal === 1 ? 'opacity-100' : 'opacity-40 scale-[0.98]'}`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-serif font-bold text-[0.95rem] md:text-[1.05rem] text-ivory">EUR / USD</span>
                    <span className="text-[0.55rem] font-extrabold tracking-[0.1em] px-2 py-0.5 rounded-sm bg-bear text-white">SHORT</span>
                  </div>
                  <div className="text-[0.65rem] md:text-[0.7rem] text-stone font-light leading-relaxed">Mitigation block rejection at premium premium zones.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
      </section>

      {tradeModalOpen && (
        <div 
          className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-void/90 backdrop-blur-md transition-opacity animate-[fade-up_0.2s_ease_out]"
          onClick={() => setTradeModalOpen(false)}
        >
          <div 
            className="bg-[#110E18] border border-border-mid rounded-xl w-full max-w-[420px] relative shadow-[0_20px_80px_rgba(0,0,0,0.9)] overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-border-subtle bg-onyx relative">
              <div>
                <div className="text-[0.55rem] font-bold tracking-[0.15em] uppercase text-stone mb-1">Execute Trade</div>
                <div className="font-serif text-[1.45rem] font-semibold text-ivory leading-tight">{tradePair}</div>
              </div>
              <button 
                onClick={() => setTradeModalOpen(false)} 
                className="w-7 h-7 flex items-center justify-center text-stone hover:text-ivory bg-void rounded-full border border-border-subtle hover:border-bear hover:text-bear transition-colors text-[0.7rem]"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2">
              <button 
                className={`py-3.5 text-[0.62rem] font-bold tracking-[0.12em] uppercase transition-all ${tradeDir === 'buy' ? 'bg-[rgba(34,201,122,0.1)] text-bull border-b-2 border-bull' : 'bg-transparent text-stone border-b-2 border-transparent hover:text-cream'}`}
                onClick={() => setTradeDir('buy')}
              >
                BUY / LONG
              </button>
              <button 
                className={`py-3.5 text-[0.62rem] font-bold tracking-[0.12em] uppercase transition-all ${tradeDir === 'sell' ? 'bg-[rgba(224,69,69,0.1)] text-bear border-b-2 border-bear' : 'bg-transparent text-stone border-b-2 border-transparent hover:text-cream'}`}
                onClick={() => setTradeDir('sell')}
              >
                SELL / SHORT
              </button>
            </div>
            
            <div className="p-6 pb-2">
              <div className="mb-4">
                <label className="block text-[0.6rem] uppercase tracking-[0.12em] text-stone mb-1.5">Instrument</label>
                <select className="w-full bg-void border border-border-subtle rounded-md px-3 py-2.5 text-[0.85rem] text-ivory outline-none focus:border-gold-mid">
                  <option>{tradePair}</option>
                  <option>XAU/USD</option>
                  <option>NQ1!</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[0.6rem] uppercase tracking-[0.12em] text-stone mb-1.5">Lot Size</label>
                  <input type="number" defaultValue="0.1" step="0.01" className="w-full bg-void border border-border-subtle rounded-md px-3 py-2.5 text-[0.85rem] text-ivory outline-none focus:border-gold-mid font-mono" />
                </div>
                <div>
                  <label className="block text-[0.6rem] uppercase tracking-[0.12em] text-stone mb-1.5">Type</label>
                  <select className="w-full bg-void border border-border-subtle rounded-md px-3 py-2.5 text-[0.85rem] text-ivory outline-none focus:border-gold-mid">
                    <option>Market</option>
                    <option>Limit</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <button 
                onClick={() => setTradeModalOpen(false)}
                className={`w-full py-3.5 rounded-sm font-sans text-[0.75rem] font-bold tracking-[0.08em] uppercase text-[#0A0505] transition-transform hover:-translate-y-0.5 ${tradeDir === 'buy' ? 'bg-bull hover:shadow-[0_4px_25px_rgba(34,201,122,0.3)]' : 'bg-bear hover:shadow-[0_4px_25px_rgba(224,69,69,0.3)]'}`}
              >
                EXECUTE {tradeDir} ORDER
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
