'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

export default function ChartWidget({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const [tf, setTf] = useState('15m');
  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);

  // Map symbols to Binance standard
  const binanceSymbol = (() => {
    const map: Record<string, string> = {
      'EUR-USD': 'EURUSDT',
      'GBP-USD': 'GBPUSDT',
      'NQ1-USD': 'BTCUSDT', // Proxy for Nasdaq
      'ES1-USD': 'BTCUSDT', // Proxy for S&P
      'XAU-USD': 'PAXGUSDT', // Gold (PAXG is Gold-backed coin)
      'BTC-USD': 'BTCUSDT',
      'ETH-USD': 'ETHUSDT',
      'DXY-USD': 'EURUSDT', // Inverse proxy
    };
    return map[symbol] || symbol.replace('-', '').replace('USD', 'USDT').toUpperCase();
  })();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    setLoading(true);
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: 'rgba(106,90,72,0.85)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      timeScale: { 
        timeVisible: true,
        borderColor: 'rgba(201,149,42,0.22)' 
      },
      rightPriceScale: {
        borderColor: 'rgba(201,149,42,0.22)',
      },
      crosshair: {
        mode: 1,
        vertLine: { color: 'rgba(201,149,42,0.5)', width: 1, style: 1 },
        horzLine: { color: 'rgba(201,149,42,0.5)', width: 1, style: 1 },
      }
    });

    // @ts-ignore
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22C97A',
      downColor: '#E04545',
      borderVisible: false,
      wickUpColor: '#22C97A',
      wickDownColor: '#E04545',
    });

    chartRef.current = chart;
    seriesRef.current = series;

    let socket: WebSocket | null = null;

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${tf}&limit=200`);
        if (!response.ok) throw new Error('Symbol not found');
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
        setLoading(false);

        const last = formattedData[formattedData.length - 1];
        setPrice(last.close);
        const start = formattedData[0];
        setChange(((last.close - start.close) / start.close) * 100);

        // Initialize WebSocket only after successful fetch
        socket = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSymbol.toLowerCase()}@kline_${tf}`);
        socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.e !== 'kline') return;
            const k = msg.k;
            const candle = {
              time: (k.t / 1000) as import('lightweight-charts').Time,
              open: parseFloat(k.o),
              high: parseFloat(k.h),
              low: parseFloat(k.l),
              close: parseFloat(k.c),
            };
            series.update(candle);
            setPrice(candle.close);
          } catch (e) {}
        };
      } catch (err) {
        console.error('Chart Data Error:', err);
        setLoading(false);
      }
    };

    fetchData();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      if (socket) socket.close();
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol, binanceSymbol, tf]);

  return (
    <div className="flex flex-col h-full bg-void overflow-hidden">
      <div className="flex items-center justify-between py-3.5 px-6 border-b border-border-subtle bg-black/30">
        <div className="flex items-center gap-4">
          <div className="font-serif text-[1.4rem] font-semibold text-ivory">
            {symbol.replace('-', ' / ')}
          </div>
          <div className="flex items-center gap-1.5 text-[0.6rem] font-bold tracking-[0.18em] text-bull uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-bull animate-[live-pulse_1.4s_infinite]" />
            Live
          </div>
        </div>
        {!loading && (
          <div className="text-right flex items-center gap-3 md:gap-4">
            <div className="font-mono text-[1.1rem] md:text-xl font-normal text-ivory">
              {price > 1000 ? price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : price.toFixed(5)}
            </div>
            <div className={`text-[0.7rem] md:text-[0.8rem] font-mono ${change >= 0 ? 'text-bull' : 'text-bear'}`}>
              {change >= 0 ? '▲ +' : '▼ '}{Math.abs(change).toFixed(2)}%
            </div>
          </div>
        )}
      </div>
      
      {/* Timeframes */}
      <div className="flex px-4 py-2 gap-1 border-b border-border-subtle bg-onyx/50">
        {['1m', '5m', '15m', '1h', '4h', '1d'].map((t) => (
          <button 
            key={t}
            onClick={() => setTf(t)}
            className={`px-3 py-1.5 border-none bg-transparent font-mono text-[0.65rem] rounded-[3px] transition-all hover:bg-gold-trace hover:text-gold-light ${tf === t ? 'text-gold-light bg-gold-trace font-bold' : 'text-stone'}`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex-1 w-full relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-void/50 backdrop-blur-[2px]">
            <div className="text-gold-light text-[0.7rem] uppercase tracking-widest animate-pulse">Synchronizing Data...</div>
          </div>
        )}
        <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
