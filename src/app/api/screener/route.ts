import { NextResponse } from 'next/server';

/**
 * TradingView returns each row as a positional array matching this column order, so the
 * request list and the response mapping MUST stay in lockstep. They previously drifted:
 * `description` was requested nowhere yet read from index 6, which is MACD — every row
 * showed a raw float as its company name, `type` ("stock") rendered in the Market Cap
 * column, and RSI was read as the rating, so a 0..100 value hit the -1..1 "Strong Buy"
 * threshold and effectively every symbol was rated Strong Buy.
 *
 * Indices are now derived from this array via COLUMNS.indexOf, so adding or reordering a
 * column cannot silently shift the mapping again.
 */
const COLUMNS = [
  'name',
  'description',
  'close',
  'change',
  'volume',
  'market_cap_basic',
  'Recommend.All',
  'type',
  'RSI',
  'MACD.macd',
  'MACD.signal',
  'BB.upper',
  'BB.lower',
  'EMA20',
  'EMA50',
  'VWAP',
] as const;

type Column = (typeof COLUMNS)[number];

// Performance optimization: Pre-build O(1) column index map to eliminate
// 1,600+ O(N) array `.indexOf()` lookups per screener API request.
const COLUMN_INDEX_MAP = Object.fromEntries(
  COLUMNS.map((col, idx) => [col, idx])
) as Record<Column, number>;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const market = body.market || 'crypto'; 
    const sortBy = body.sortBy || 'volume';
    const sortOrder = body.sortOrder || 'desc';
    const search = body.search || '';
    
    // Determine scanner route
    const tvMarketId = market === 'crypto' ? 'crypto' : market === 'india' ? 'india' : market === 'forex' ? 'forex' : 'america';
    const url = `https://scanner.tradingview.com/${tvMarketId}/scan`;

    // Base filters
    const filters: any[] = [];
    
    // Add exchange filters
    if (market === 'india') {
      filters.push({ left: "exchange", operation: "in_range", right: ["NSE", "BSE"] });
    } else if (market === 'crypto') {
      filters.push({ left: "exchange", operation: "equal", right: "BINANCE" });
    }

    // If search is provided, we use TradingView's filter engine instead of just text
    // This is more reliable for finding specific tickers like MRF
    if (search) {
      filters.push({
        left: "name",
        operation: "match",
        right: search.toUpperCase()
      });
    }

    const payload = {
      filter: filters,
      options: { lang: "en" },
      markets: tvMarketId === 'forex' ? [] : [tvMarketId],
      symbols: { query: { types: [] }, tickers: [] },
      columns: COLUMNS,
      sort: { sortBy, sortOrder },
      range: [0, 100] // Small range is fine now because the filter will find the exact match
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'TradingView upstream failed' }, { status: res.status });
    }

    const data = await res.json();
    
    if (!data || !data.data) {
       return NextResponse.json({ totalCount: 0, data: [] });
    }

    const results = data.data.map((item: any) => {
      const row: unknown[] = item.d ?? [];
      const at = (column: Column) => row[COLUMN_INDEX_MAP[column]];

      return {
        providerSymbol: item.s,
        name: at('name'),
        description: at('description'),
        close: at('close'),
        changePct: at('change'),
        volume: at('volume'),
        marketCap: at('market_cap_basic'),
        rating: at('Recommend.All'),
        type: at('type'),
        rsi: at('RSI'),
        macd: at('MACD.macd'),
        macdSignal: at('MACD.signal'),
        bbUpper: at('BB.upper'),
        bbLower: at('BB.lower'),
        ema20: at('EMA20'),
        ema50: at('EMA50'),
        vwap: at('VWAP')
      };
    });

    return NextResponse.json({ totalCount: data.totalCount, data: results });

  } catch (error) {
    console.error("Screener API error:", error);
    return NextResponse.json({ error: 'Failed to proxy scanner request' }, { status: 500 });
  }
}
