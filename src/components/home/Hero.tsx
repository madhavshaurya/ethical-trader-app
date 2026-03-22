'use client';

import { Button } from '@/components/ui/Button';
import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

export default function Hero() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [price, setPrice] = useState('64,230.50');
  const [activeAsset, setActiveAsset] = useState({ label: 'XAU/USD', value: 'XAU-USD', isCrypto: false });
  const [change, setChange] = useState('+1.12%');
  const [isUp, setIsUp] = useState(true);
  const [delta, setDelta] = useState(4821);
  const [activeInterval, setActiveInterval] = useState('1h');

  useEffect(() => {
    const dInterval = setInterval(() => {
      setDelta(prev => prev + Math.floor((Math.random() - 0.45) * 150));
    }, 3500);

    const fetchXauPrice = async () => {
      try {
        const res = await fetch('/api/xau');
        if (res.ok) {
          const data = await res.json();
          setPrice(parseFloat(data.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2 }));
          setChange((parseFloat(data.priceChangePercent) >= 0 ? '+' : '') + data.priceChangePercent + '%');
          setIsUp(parseFloat(data.priceChangePercent) >= 0);
        }
      } catch (err) {
        console.error('Hero XAU price fetch failed:', err);
      }
    };
    fetchXauPrice();
    const pInterval = setInterval(fetchXauPrice, 30000);

    return () => {
      clearInterval(dInterval);
      clearInterval(pInterval);
    };
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: 'rgba(106,90,72,0.85)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
      },
      timeScale: { visible: false },
      rightPriceScale: {
        borderVisible: false,
      },
      handleScroll: false,
      handleScale: false,
    });

    // @ts-ignore - fixing v4/v5 typing differences in lightweight-charts
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22C97A',
      downColor: '#E04545',
      borderVisible: false,
      wickUpColor: '#22C97A',
      wickDownColor: '#E04545',
    });

    const fetchData = async () => {
      try {
        const binanceInterval = activeInterval.toLowerCase();
        const response = await fetch(`/api/klines?symbol=XAUUSDT&interval=${binanceInterval}&limit=100`);
        const klines = await response.json();
        
        const formattedData = klines.map((k: any) => ({
          time: (k[0] / 1000) as import('lightweight-charts').Time,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));

        series.setData(formattedData);
        chart.timeScale().fitContent();
      } catch (err) {
        console.error('Binance fetch failed:', err);
      }
    };

    fetchData();

    // WebSocket for live updates
    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/xauusdt@kline_${activeInterval.toLowerCase()}`);
    socket.onmessage = (event) => {
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
      setPrice(candle.close.toLocaleString(undefined, { minimumFractionDigits: 2 }));
    };

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      socket.close();
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [activeInterval]);

  return (
    <section>
      <div className="min-h-screen pt-[140px] md:pt-[180px] grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20 max-w-[1440px] mx-auto px-6 lg:px-16 pb-16">
        <div className="animate-[fade-up_0.7s_ease_forwards] text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 text-[0.6rem] md:text-[0.65rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-6 before:content-[''] before:hidden sm:before:block before:w-8 before:h-[1px] before:bg-amber after:content-[''] after:hidden sm:after:block after:w-8 after:h-[1px] after:bg-amber">
            Ethical · Transparent · Disciplined
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,8vw,6.5rem)] font-light leading-[1.05] tracking-[-0.01em] text-ivory mb-1">
            Trade Like<br />
            <strong className="font-bold block">Institutions</strong>
            <em className="italic text-gold-mid font-light block">Think</em>
          </h1>
          <p className="font-serif text-[1rem] md:text-[1.2rem] font-light italic text-stone mb-10 leading-[1.6] border-l-[2px] border-gold-deep pl-5 mt-8 max-w-[540px] mx-auto lg:mx-0">
            Master ICT/SMC concepts, live order flow, cumulative delta & AI-powered signals — built on transparency, discipline, and real edge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start mb-14">
            <Button href="/live-terminal/XAUUSD" variant="primary" className="w-full sm:w-auto" target="_blank" rel="noopener noreferrer">Enter Terminal &nbsp;→</Button>
            <Button href="#learn" variant="secondary" className="w-full sm:w-auto">Start Learning</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 pt-10 border-t border-border-subtle">
            <div>
              <div className="font-serif text-[1.6rem] md:text-[2.2rem] font-semibold text-gold-light leading-none">94.2%</div>
              <div className="text-[0.55rem] md:text-[0.65rem] font-medium tracking-[0.12em] md:tracking-[0.15em] uppercase text-stone mt-1.5">Signal Accuracy</div>
            </div>
            <div>
              <div className="font-serif text-[1.6rem] md:text-[2.2rem] font-semibold text-gold-light leading-none">12,400+</div>
              <div className="text-[0.55rem] md:text-[0.65rem] font-medium tracking-[0.12em] md:tracking-[0.15em] uppercase text-stone mt-1.5">Active Members</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="font-serif text-[1.6rem] md:text-[2.2rem] font-semibold text-gold-light leading-none">$2.8M</div>
              <div className="text-[0.55rem] md:text-[0.65rem] font-medium tracking-[0.12em] md:tracking-[0.15em] uppercase text-stone mt-1.5">Member Profits</div>
            </div>
          </div>
        </div>

        <div className="relative animate-[fade-up_0.7s_ease_forwards] [animation-delay:0.15s] opacity-0 mt-8 lg:mt-0">
          <div className="absolute z-10 bg-[rgba(14,11,24,0.92)] border border-border-mid rounded-lg px-[10px] md:px-[13px] py-[7px] md:py-[9px] backdrop-blur-md -top-[10px] md:-top-[25px] -left-[10px] md:-left-[20px] shadow-2xl">
            <div className="text-[0.5rem] md:text-[0.55rem] uppercase tracking-[0.15em] text-stone mb-[3px]">Cum. Delta</div>
            <div className={`font-mono text-[0.8rem] md:text-[0.95rem] font-normal transition-colors ${delta >= 0 ? 'text-bull' : 'text-bear'}`}>
              {delta >= 0 ? '+' : ''}{delta.toLocaleString()}
            </div>
          </div>

          <div className="hero-visual-frame bg-onyx/40 border border-border-subtle rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="flex items-center justify-between py-3 md:py-[14px] px-4 md:px-5 border-b border-border-subtle relative min-h-[60px]">
              <div className="w-[80px]" /> {/* Spacer for header balance */}

              <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="font-serif text-[0.9rem] md:text-[1.1rem] font-semibold text-ivory tracking-tight">XAU / USD</div>
                <div className="flex items-center gap-1.5 text-[0.45rem] md:text-[0.5rem] font-bold tracking-[0.2em] text-bull uppercase mt-1">
                  <span className="w-1 h-1 rounded-full bg-bull animate-[live-pulse_1.4s_infinite]" />
                  Live Stream
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-sm md:text-base font-normal text-ivory">{price}</div>
                <div className={`text-[0.6rem] md:text-[0.7rem] font-mono mt-[2px] ${isUp ? 'text-bull' : 'text-bear'}`}>
                  {isUp ? '▲' : '▼'} {change}
                </div>
              </div>
            </div>
            <div className="p-3 md:p-[15px]">
              <div ref={chartContainerRef} className="w-full h-[180px] md:h-[250px]" />
            </div>
            <div className="flex px-2.5 py-1.5 gap-0.5 border-t border-border-subtle bg-onyx/50 overflow-x-auto no-scrollbar">
              {[
                { label: '1m', value: '1m' },
                { label: '5m', value: '5m' },
                { label: '15m', value: '15m' },
                { label: '1H', value: '1h' },
                { label: '4H', value: '4h' },
                { label: 'D', value: '1d' }
              ].map((tf) => (
                <button 
                  key={tf.value} 
                  onClick={() => setActiveInterval(tf.value)}
                  className={`px-[7px] md:px-[9px] py-[2px] md:py-[3px] border-none bg-transparent font-mono text-[0.6rem] md:text-[0.65rem] rounded-[3px] transition-all hover:bg-gold-trace hover:text-gold-light ${activeInterval === tf.value ? 'text-gold-light bg-gold-trace' : 'text-stone'}`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute z-10 bg-[rgba(14,11,24,0.92)] border border-border-mid rounded-lg px-[10px] md:px-[13px] py-[7px] md:py-[9px] backdrop-blur-md -bottom-[10px] md:-bottom-[14px] -right-[10px] md:-right-[14px]">
            <div className="text-[0.5rem] md:text-[0.55rem] uppercase tracking-[0.15em] text-stone mb-[3px]">AI Signal</div>
            <div className="font-mono text-[0.7rem] md:text-[0.82rem] font-normal text-bull">LONG ▲ 89% conf.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
