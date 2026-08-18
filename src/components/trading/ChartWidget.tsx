'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

export default function ChartWidget({ symbol, panelHeight }: { symbol: string, panelHeight?: number }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const [tf, setTf] = useState('15m');
  const [price, setPrice] = useState(0);
  // Reference for the day's change. The header used to measure from the FIRST candle in
  // the loaded window (200 bars), so a 15m chart reported ~2 days of movement as "today"
  // — the header read +2.32% while the watchlist correctly showed +0.14% for the same
  // symbol on the same screen.
  const [prevClose, setPrevClose] = useState<number | null>(null);

  // Clean symbol extraction (e.g., 'NSE:JPPOWER' -> 'JPPOWER')
  const cleanSymbol = symbol.includes(':') ? symbol.split(':')[1] || symbol : symbol;

  // Handle Resize whenever panelHeight (from the draggable resizer) changes
  useEffect(() => {
    if (chartRef.current && chartContainerRef.current) {
      chartRef.current.resize(
        chartContainerRef.current.clientWidth,
        chartContainerRef.current.clientHeight
      );
    }
  }, [panelHeight]);

  // Automatically identify asset class to route to correct backend proxy
  const isCrypto = cleanSymbol.includes('USD') || cleanSymbol.includes('EUR') || cleanSymbol.includes('ETH') || cleanSymbol.includes('BTC') || cleanSymbol.includes('SOL') || symbol.startsWith('BINANCE:');
  
  // Clean symbol for Binance if Crypto
  let binanceSymbol = cleanSymbol.replace('-', '');
  if (isCrypto && binanceSymbol.endsWith('USD')) {
     binanceSymbol = binanceSymbol.replace(/USD$/, 'USDT');
  }

  const [loading, setLoading] = useState(true);

  // Previous session close, so the header change matches the watchlist and the ticker.
  useEffect(() => {
    let cancelled = false;

    const loadPrevClose = async () => {
      try {
        if (isCrypto) {
          // Binance always prints an in-progress bar for today, so [0] is yesterday.
          const res = await fetch(`/api/klines?symbol=${binanceSymbol}&interval=1d&limit=2`);
          if (!res.ok) return;
          const k = await res.json();
          if (Array.isArray(k) && k.length >= 2) {
            const v = parseFloat(k[k.length - 2][4]);
            if (!cancelled && Number.isFinite(v) && v !== 0) setPrevClose(v);
          }
        } else {
          // /api/indices derives the true previous close (see src/lib/yahoo.ts).
          const res = await fetch(`/api/indices?symbols=${encodeURIComponent(symbol)}`);
          if (!res.ok) return;
          const list = await res.json();
          const d = Array.isArray(list) ? list[0] : null;
          if (!d) return;
          const lastPrice = parseFloat(d.lastPrice);
          const pct = parseFloat(d.priceChangePercent);
          if (!Number.isFinite(lastPrice) || !Number.isFinite(pct) || pct === -100) return;
          const pc = lastPrice / (1 + pct / 100);
          if (!cancelled && Number.isFinite(pc) && pc !== 0) setPrevClose(pc);
        }
      } catch {
        // Leave prevClose as-is; the header simply omits the change until it resolves.
      }
    };

    setPrevClose(null);
    loadPrevClose();
    const id = window.setInterval(loadPrevClose, 60000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [symbol, binanceSymbol, isCrypto]);

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
        const isFutures = binanceSymbol === 'XAUUSDT';
        const wsUrl = isFutures ? 'wss://fstream.binance.com/ws' : 'wss://stream.binance.com:9443/ws';
        
        let response;
        if (isCrypto) {
            response = await fetch(`/api/klines?symbol=${binanceSymbol}&interval=${tf}&limit=200`);
        } else {
            response = await fetch(`/api/yahoo-klines?symbol=${symbol}&interval=${tf}`);
        }
        
        if (!response.ok) {
          // If the specific symbol fails, try one more time with a clean base symbol if it had a prefix
          if (symbol.includes(':')) {
            const fallbackRes = await fetch(`/api/yahoo-klines?symbol=${cleanSymbol}&interval=${tf}`);
            if (fallbackRes.ok) {
              response = fallbackRes;
            } else {
              throw new Error('Symbol not found');
            }
          } else {
            throw new Error('Symbol not found');
          }
        }
        let klines = await response.json();
        
        // If Yahoo data, it might need translation or merging with live price
        const isYahooData = !isCrypto || (response.url && response.url.includes('yahoo'));
        
        const formattedData = klines.map((k: any) => ({
          time: (k[0] / 1000) as import('lightweight-charts').Time,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));

        // INJECT LATEST CANDLE: Yahoo historical data often lags by 1 candle.
        // If we have a price already, and it's newer than the last candle, update/append.
        if (isYahooData && formattedData.length > 0) {
           const lastK = formattedData[formattedData.length - 1];
           // If current price is different from last close, it's a 'live' candle
           const liveCandle = {
              time: (Math.floor(Date.now() / 1000) - (Math.floor(Date.now() / 1000) % 60)) as import('lightweight-charts').Time,
              open: lastK.close,
              high: Math.max(lastK.close, price || lastK.close),
              low: Math.min(lastK.close, price || lastK.close),
              close: price || lastK.close
           };
           // Only push if time is significantly newer or update current
           if (price > 0) series.update(liveCandle);
        }
        
        series.setData(formattedData);
        chart.timeScale().fitContent();
        setLoading(false);

        const last = formattedData[formattedData.length - 1];
        setPrice(last.close);

        // Streaming / Polling logic for live updates
        if (isFutures || !isCrypto) {
          // Polling fallback to avoid Browser SecurityError with fstream websockets, 
          // and to poll Yahoo Finance which lacks public websockets
          const pollInterval = window.setInterval(async () => {
            try {
              // Priority 1: Check the global XAU/Spot data first if available in ticker/parent
              const fetchUrl = isCrypto 
                ? `/api/klines?symbol=${binanceSymbol}&interval=${tf}&limit=1`
                : `/api/yahoo-klines?symbol=${symbol}&interval=${tf}&limit=1`;
                
              const res = await fetch(fetchUrl);
              if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                  const k = data[data.length - 1]; // ALWAYS use the very last item returned
                  const candle = {
                    time: (k[0] / 1000) as import('lightweight-charts').Time,
                    open: parseFloat(k[1]),
                    high: parseFloat(k[2]),
                    low: parseFloat(k[3]),
                    close: parseFloat(k[4]),
                  };
                  series.update(candle);
                  setPrice(candle.close);
                }
              }
            } catch (e) {}
          }, 4000);
          socket = { close: () => window.clearInterval(pollInterval) } as any;
        } else {
          socket = new WebSocket(`${wsUrl}/${binanceSymbol.toLowerCase()}@kline_${tf}`);
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
        }
      } catch (err) {
        console.error('Chart Data Error:', err);
        setLoading(false);
        // Set an empty state so the chart doesn't just hang on the previous symbol's data
        if (series) series.setData([]);
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
  }, [symbol, binanceSymbol, isCrypto, tf]);

  const change =
    prevClose !== null && price > 0 ? ((price - prevClose) / prevClose) * 100 : null;

  const formatPrice = (p: number) =>
    p.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: p >= 1000 ? 2 : p >= 1 ? 4 : 8,
    });

  return (
    <div className="flex flex-col h-full bg-void overflow-hidden">
      <div className="flex items-center justify-between py-3.5 px-6 border-b border-border-subtle bg-black/30">
        <div className="flex items-center gap-4">
          <div className="font-serif text-[1.4rem] font-semibold text-ivory">
            {cleanSymbol.replace('-', ' / ')}
          </div>
          <div className="flex items-center gap-1.5 text-[0.6rem] font-bold tracking-[0.18em] text-bull uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-bull animate-[live-pulse_1.4s_infinite]" />
            Live
          </div>
        </div>
        {!loading && (
          <div className="text-right flex items-center gap-3 md:gap-4">
            <div className="font-mono text-[1.1rem] md:text-xl font-normal text-ivory">
              {formatPrice(price)}
            </div>
            {change !== null && (
              <div className={`text-[0.7rem] md:text-[0.8rem] font-mono ${change >= 0 ? 'text-bull' : 'text-bear'}`}>
                {change >= 0 ? '▲ +' : '▼ '}{Math.abs(change).toFixed(2)}%
              </div>
            )}
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
