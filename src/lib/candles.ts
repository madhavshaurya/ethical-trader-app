/**
 * Server-side candle fetching for the signal engine.
 *
 * Mirrors the source selection in /api/klines (Binance futures for XAUUSDT, spot
 * otherwise, Yahoo as fallback) but returns normalised numeric candles rather than
 * Binance's raw string arrays, because indicators need numbers.
 */

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

export interface Candle {
  time: number; // ms epoch of the bar's open
  open: number;
  high: number;
  low: number;
  close: number;
}

// XAUUSDT is listed on Binance FUTURES only — spot returns -1121 "Invalid symbol".
const FUTURES_ONLY = new Set(['XAUUSDT']);

const YAHOO_SYMBOLS: Record<string, string> = {
  XAUUSDT: 'GC=F',
  BTCUSDT: 'BTC-USD',
  ETHUSDT: 'ETH-USD',
  SOLUSDT: 'SOL-USD',
  EURUSDT: 'EURUSD=X',
};

const YAHOO_INTERVALS: Record<string, { interval: string; range: string }> = {
  '1m': { interval: '1m', range: '5d' },
  '5m': { interval: '5m', range: '1mo' },
  '15m': { interval: '15m', range: '1mo' },
  '1h': { interval: '60m', range: '3mo' },
  '4h': { interval: '60m', range: '3mo' },
  '1d': { interval: '1d', range: '1y' },
};

function num(v: unknown): number | null {
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

async function fromBinance(symbol: string, interval: string, limit: number): Promise<Candle[] | null> {
  const base = FUTURES_ONLY.has(symbol)
    ? 'https://fapi.binance.com/fapi/v1'
    : 'https://api.binance.com/api/v3';
  try {
    const res = await fetch(
      `${base}/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(
        interval
      )}&limit=${limit}`,
      {
        headers: { 'User-Agent': UA, Accept: 'application/json', Referer: 'https://www.binance.com/' },
        cache: 'no-store',
      }
    );
    if (!res.ok) return null;
    const raw = (await res.json()) as unknown[];
    if (!Array.isArray(raw)) return null;

    const out: Candle[] = [];
    for (const row of raw) {
      if (!Array.isArray(row)) continue;
      const [t, o, h, l, c] = row as unknown[];
      const time = num(t);
      const open = num(o);
      const high = num(h);
      const low = num(l);
      const close = num(c);
      if (time === null || open === null || high === null || low === null || close === null) continue;
      out.push({ time, open, high, low, close });
    }
    return out.length > 0 ? out : null;
  } catch {
    return null;
  }
}

async function fromYahoo(symbol: string, interval: string, limit: number): Promise<Candle[] | null> {
  const ySym = YAHOO_SYMBOLS[symbol] || symbol;
  const cfg = YAHOO_INTERVALS[interval] || { interval: '60m', range: '3mo' };
  try {
    const res = await fetch(
      `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySym)}?interval=${
        cfg.interval
      }&range=${cfg.range}`,
      { headers: { 'User-Agent': UA, Accept: 'application/json' }, next: { revalidate: 10 } }
    );
    if (!res.ok) return null;

    const data = (await res.json()) as {
      chart?: {
        result?: {
          timestamp?: number[];
          indicators?: {
            quote?: { open?: (number | null)[]; high?: (number | null)[]; low?: (number | null)[]; close?: (number | null)[] }[];
          };
        }[];
      };
    };
    const r = data.chart?.result?.[0];
    const q = r?.indicators?.quote?.[0];
    if (!r?.timestamp || !q) return null;

    const out: Candle[] = [];
    for (let i = 0; i < r.timestamp.length; i++) {
      const open = num(q.open?.[i]);
      const high = num(q.high?.[i]);
      const low = num(q.low?.[i]);
      const close = num(q.close?.[i]);
      if (open === null || high === null || low === null || close === null) continue;
      out.push({ time: r.timestamp[i] * 1000, open, high, low, close });
    }
    return out.length > 0 ? out.slice(-limit) : null;
  } catch {
    return null;
  }
}

/** Binance first, Yahoo as fallback (Binance geo-blocks some hosting regions with 451). */
export async function fetchCandles(
  symbol: string,
  interval: string,
  limit = 200
): Promise<Candle[] | null> {
  return (await fromBinance(symbol, interval, limit)) ?? (await fromYahoo(symbol, interval, limit));
}
