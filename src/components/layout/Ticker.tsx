'use client';

import React, { useState, useEffect, memo } from 'react';

type Quote = { p: string; change: number };

/**
 * Display symbol -> the key it arrives under from our API proxies, plus price precision.
 * Every entry here is fetched live; nothing on this ticker is simulated.
 *   BTC/ETH/SOL/EUR  -> /api/spot     (Binance, Yahoo fallback)
 *   XAU              -> /api/xau      (Binance futures, Yahoo GC=F fallback)
 *   ES1!/NQ1!/DXY    -> /api/indices  (Yahoo ES=F, NQ=F, DX-Y.NYB)
 *   NIFTY 50/SENSEX  -> /api/indices  (Yahoo ^NSEI, ^BSESN)
 */
const TICKER_SYMBOLS = [
  { sym: 'BTC/USD', src: 'BTCUSDT', decimals: 2 },
  { sym: 'ETH/USD', src: 'ETHUSDT', decimals: 2 },
  { sym: 'SOL/USD', src: 'SOLUSDT', decimals: 2 },
  { sym: 'ES1!', src: 'ES1!', decimals: 2 },
  { sym: 'NQ1!', src: 'NQ1!', decimals: 2 },
  { sym: 'EUR/USD', src: 'EURUSDT', decimals: 5 },
  { sym: 'XAU/USD', src: 'XAUUSDT', decimals: 2 },
  { sym: 'NIFTY 50', src: 'NIFTY 50', decimals: 2 },
  { sym: 'SENSEX', src: 'SENSEX', decimals: 2 },
  { sym: 'DXY', src: 'DXY', decimals: 2 },
] as const;

const SOURCE_KEYS = new Set<string>(TICKER_SYMBOLS.map((s) => s.src));

// Memoized item to prevent layout jitter on non-changing elements
const TickerItem = memo(({ sym, quote }: { sym: string; quote?: Quote }) => (
  <div className="flex items-center gap-2 px-7 border-r border-border-subtle shrink-0 h-full">
    <span className="text-stone font-mono text-[0.65rem] shrink-0 uppercase tracking-tight">{sym}</span>
    <span className="text-ivory font-mono tabular-nums text-[0.65rem] font-medium w-[75px] text-center shrink-0">
      {quote ? quote.p : '––––'}
    </span>
    {quote ? (
      <div className={`flex items-center gap-1.5 shrink-0 ${quote.change >= 0 ? 'text-bull' : 'text-bear'} font-mono text-[0.65rem] font-bold tabular-nums w-[65px] justify-center`}>
        <span className="text-[0.6rem]">{quote.change >= 0 ? '▲' : '▼'}</span>
        <span>{quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)}%</span>
      </div>
    ) : (
      <span className="text-stone font-mono text-[0.65rem] w-[65px] text-center shrink-0">–</span>
    )}
  </div>
));
TickerItem.displayName = 'TickerItem';

export default function Ticker() {
  // Starts empty on purpose: a placeholder is honest, a stale hardcoded price is not.
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});

  useEffect(() => {
    let cancelled = false;

    const fetchLivePrices = async () => {
      const next: Record<string, Quote> = {};

      const add = (key: string, price: unknown, changePct: unknown) => {
        if (!SOURCE_KEYS.has(key)) return;
        const c = parseFloat(String(price));
        const chg = parseFloat(String(changePct));
        if (!Number.isFinite(c) || !Number.isFinite(chg)) return;
        const decimals = TICKER_SYMBOLS.find((s) => s.src === key)!.decimals;
        next[key] = {
          p:
            decimals === 5
              ? c.toFixed(5)
              : c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          change: chg,
        };
      };

      const rows = (v: unknown): Record<string, unknown>[] =>
        Array.isArray(v) ? (v as Record<string, unknown>[]) : [];

      const get = (url: string) =>
        fetch(url)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);

      // One upstream failing must not take the others down with it.
      const [spot, xau, indices] = await Promise.all([
        get('/api/spot'),
        get('/api/xau'),
        get('/api/indices'),
      ]);

      rows(spot).forEach((d) => add(String(d.symbol ?? ''), d.lastPrice, d.priceChangePercent));
      // /api/xau reports either 'XAUUSDT' (Binance) or 'XAUUSD (Yahoo)' depending on which
      // source answered, so key it explicitly rather than trusting the returned name.
      const gold = (xau ?? {}) as Record<string, unknown>;
      if (gold.lastPrice !== undefined) {
        add('XAUUSDT', gold.lastPrice, gold.priceChangePercent);
      }
      rows(indices).forEach((d) => add(String(d.symbol ?? ''), d.lastPrice, d.priceChangePercent));

      if (cancelled) return;
      // Merge rather than replace, so a single failed poll never blanks a live price.
      setQuotes((prev) => ({ ...prev, ...next }));
    };

    fetchLivePrices();
    const pollingInterval = setInterval(fetchLivePrices, 3000);

    return () => {
      cancelled = true;
      clearInterval(pollingInterval);
    };
  }, []);

  const items = [...TICKER_SYMBOLS, ...TICKER_SYMBOLS];

  return (
    <div className="fixed top-0 left-0 right-0 z-[901] h-8 bg-void border-b border-border-subtle overflow-hidden flex items-center">
      <div className="flex whitespace-nowrap animate-[ticker-run_50s_linear_infinite] font-mono text-[0.65rem] font-light tracking-[0.03em] will-change-transform">
        {items.map((cfg, i) => (
          <TickerItem key={`${cfg.sym}-${i}`} sym={cfg.sym} quote={quotes[cfg.src]} />
        ))}
      </div>
    </div>
  );
}
