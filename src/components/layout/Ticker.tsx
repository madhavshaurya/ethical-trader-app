'use client';

import React, { useState, useEffect, useRef, memo } from 'react';

// Memoized item to prevent layout jitter on non-changing elements
const TickerItem = memo(({ item }: { item: any }) => (
  <div className="flex items-center gap-2 px-7 border-r border-border-subtle shrink-0 h-full">
    <span className="text-stone font-mono text-[0.65rem] shrink-0 uppercase tracking-tight">{item.sym}</span>
    <span className="text-ivory font-mono tabular-nums text-[0.65rem] font-medium w-[75px] text-center shrink-0">{item.p}</span>
    <div className={`flex items-center gap-1.5 shrink-0 ${item.isUp ? 'text-bull' : 'text-bear'} font-mono text-[0.65rem] font-bold tabular-nums w-[65px] justify-center`}>
      <span className="text-[0.6rem]">{item.isUp ? '▲' : '▼'}</span>
      <span>{item.isUp ? '+' : ''}{parseFloat(item.change).toFixed(2)}%</span>
    </div>
  </div>
));
TickerItem.displayName = 'TickerItem';

export default function Ticker() {
  const [data, setData] = useState([
    { sym: 'BTC/USD', p: '64,230.50', change: '+1.2', isUp: true, raw: 64230.50 },
    { sym: 'ETH/USD', p: '3,421.80', change: '+0.8', isUp: true, raw: 3421.80 },
    { sym: 'SOL/USD', p: '142.30', change: '-2.4', isUp: false, raw: 142.30 },
    { sym: 'ES1!', p: '5,210.25', change: '+0.1', isUp: true, raw: 5210.25 },
    { sym: 'NQ1!', p: '18,340.50', change: '+0.3', isUp: true, raw: 18340.50 },
    { sym: 'EUR/USD', p: '1.0942', change: '-0.05', isUp: false, raw: 1.0942 },
    { sym: 'XAU/USD', p: '2,345.10', change: '+0.15', isUp: true, raw: 2345.10 },
    { sym: 'DXY', p: '104.20', change: '-0.1', isUp: false, raw: 104.20 },
  ]);

  // Use a ref to store latest data for the WebSocket updates
  const dataRef = useRef(data);
  const bufferRef = useRef<{ [key: string]: { c: number, p: string } }>({});

  useEffect(() => {
    // Initial fetch to seed the data
    const fetchInitial = async () => {
      try {
        const res = await fetch('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,SOL&tsyms=USD');
        const prices = await res.json();
        const updated = dataRef.current.map(item => {
          if (item.sym === 'BTC/USD') return { ...item, p: prices.BTC.USD.toLocaleString(), raw: prices.BTC.USD };
          if (item.sym === 'ETH/USD') return { ...item, p: prices.ETH.USD.toLocaleString(), raw: prices.ETH.USD };
          if (item.sym === 'SOL/USD') return { ...item, p: prices.SOL.USD.toLocaleString(), raw: prices.SOL.USD };
          return item;
        });
        setData(updated);
        dataRef.current = updated;
      } catch (e) {}
    };
    fetchInitial();

    // Binance WebSocket Combined Stream
    const symbols = ['btcusdt', 'ethusdt', 'solusdt', 'eurusdt'];
    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbols.map(s => `${s}@ticker`).join('/')}`);

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      bufferRef.current[msg.s] = { c: parseFloat(msg.c), p: msg.P };
    };

    // Throttle updates to once per second
    const interval = setInterval(() => {
      const buffer = bufferRef.current;
      
      const updated = dataRef.current.map(item => {
        let priceData = { c: -1, p: '' };
        let decimals = 2;

        if (item.sym === 'BTC/USD') priceData = buffer['BTCUSDT'] || priceData;
        else if (item.sym === 'ETH/USD') priceData = buffer['ETHUSDT'] || priceData;
        else if (item.sym === 'SOL/USD') priceData = buffer['SOLUSDT'] || priceData;
        else if (item.sym === 'EUR/USD') { priceData = buffer['EURUSDT'] || priceData; decimals = 5; }

        if (priceData.c !== -1) {
          const displayP = decimals === 5 ? priceData.c.toFixed(5) : priceData.c.toLocaleString(undefined, { minimumFractionDigits: 2 });
          const chgPercent = priceData.p;
          return { ...item, p: displayP, change: chgPercent, isUp: parseFloat(chgPercent) >= 0, raw: priceData.c };
        }

        // Random walk for indices (simulating live feel for non-crypto)
        if (['ES1!', 'NQ1!', 'XAU/USD', 'DXY'].includes(item.sym)) {
          const walk = (Math.random() - 0.5) * (item.raw * 0.00004);
          const nextP = item.raw + walk;
          const currentChg = parseFloat(item.change);
          const nextChg = (currentChg + (walk * 0.1)).toFixed(2);
          return { ...item, p: nextP.toLocaleString(undefined, { minimumFractionDigits: 2 }), change: nextChg, isUp: parseFloat(nextChg) >= 0, raw: nextP };
        }

        return item;
      });

      setData(updated);
      dataRef.current = updated;
      bufferRef.current = {}; 
    }, 1000);

    return () => {
      socket.close();
      clearInterval(interval);
    };
  }, []);

  const items = [...data, ...data]; 

  return (
    <div className="fixed top-0 left-0 right-0 z-[901] h-8 bg-void border-b border-border-subtle overflow-hidden flex items-center">
      <div className="flex whitespace-nowrap animate-[ticker-run_50s_linear_infinite] font-mono text-[0.65rem] font-light tracking-[0.03em] will-change-transform">
        {items.map((item, i) => (
          <TickerItem key={`${item.sym}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
