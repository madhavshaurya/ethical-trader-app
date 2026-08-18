/**
 * Shared Yahoo Finance daily-quote helper.
 *
 * WHY THIS EXISTS
 * Yahoo's `meta.chartPreviousClose` is the close immediately BEFORE the requested
 * range — not the previous session's close. Using it turns a multi-day move into a
 * "daily" change, and the error grows with the range:
 *
 *   GC=F, range=5d  -> chartPreviousClose 4,363.60 (4 sessions stale) => "+0.52%"
 *   GC=F, range=1mo -> chartPreviousClose 4,012.70                    => "+9.3%"
 *   actual previous session close 4,417.80                            =>  -0.72%
 *
 * `meta.previousClose` is no better (it reported 4,473.70 for the same instrument).
 *
 * So we derive the previous close from the dated daily bars: the last bar that
 * closed BEFORE the current trading session began. `currentTradingPeriod.regular.start`
 * is what separates "yesterday's completed bar" from "today's in-progress bar", and it
 * works for instruments that have already printed a bar today (futures, crypto) as well
 * as those that have not (an index between sessions).
 *
 * Verified against BTC-USD, GC=F, ES=F and ^NSEI — all four match the true daily change.
 */

const YAHOO_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// Yahoo index/futures data is delayed anyway, so a short server-side cache costs
// nothing in freshness and stops per-visitor polling from hammering upstream.
const REVALIDATE_SECONDS = 10;

export interface YahooDailyQuote {
  symbol: string;
  price: number;
  prevClose: number;
  changePercent: number;
}

interface ChartResult {
  meta?: {
    symbol?: string;
    regularMarketPrice?: number;
    currentTradingPeriod?: { regular?: { start?: number } };
  };
  timestamp?: number[];
  indicators?: { quote?: { close?: (number | null)[] }[] };
}

/**
 * Last close strictly before the current session, falling back to the
 * second-to-last bar when the session boundary is unavailable.
 */
export function derivePreviousClose(result: ChartResult): number | null {
  const closes = result.indicators?.quote?.[0]?.close;
  const stamps = result.timestamp;
  if (!Array.isArray(closes) || !Array.isArray(stamps)) return null;

  const bars: { t: number; c: number }[] = [];
  for (let i = 0; i < stamps.length; i++) {
    const c = closes[i];
    if (typeof c === 'number' && Number.isFinite(c)) bars.push({ t: stamps[i], c });
  }
  if (bars.length === 0) return null;

  const sessionStart = result.meta?.currentTradingPeriod?.regular?.start;
  if (typeof sessionStart === 'number') {
    const before = bars.filter((b) => b.t < sessionStart);
    if (before.length > 0) return before[before.length - 1].c;
  }

  return bars.length > 1 ? bars[bars.length - 2].c : null;
}

/** Fetch one symbol's price and true daily change. Returns null if unavailable. */
export async function fetchYahooDaily(yahooSymbol: string): Promise<YahooDailyQuote | null> {
  try {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      yahooSymbol
    )}?interval=1d&range=1mo`;

    const res = await fetch(url, {
      headers: { 'User-Agent': YAHOO_UA, Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { chart?: { result?: ChartResult[] } };
    const result = data.chart?.result?.[0];
    if (!result) return null;

    const price = result.meta?.regularMarketPrice;
    const prevClose = derivePreviousClose(result);
    if (typeof price !== 'number' || !Number.isFinite(price)) return null;
    if (typeof prevClose !== 'number' || !Number.isFinite(prevClose) || prevClose === 0) return null;

    return {
      symbol: result.meta?.symbol ?? yahooSymbol,
      price,
      prevClose,
      changePercent: ((price - prevClose) / prevClose) * 100,
    };
  } catch {
    return null;
  }
}
