import { NextResponse } from 'next/server';
import { fetchYahooDaily } from '@/lib/yahoo';

// Yahoo symbol -> the name the frontend expects back.
const SYMBOL_LABELS: Record<string, string> = {
  '^NSEI': 'NIFTY 50',
  '^BSESN': 'SENSEX',
  '^GSPC': 'SPX',
  'ES=F': 'ES1!', // E-mini S&P 500 front-month future
  'NQ=F': 'NQ1!', // E-mini Nasdaq-100 front-month future
  'DX-Y.NYB': 'DXY', // ICE US Dollar Index
  AAPL: 'AAPL',
  TSLA: 'TSLA',
  'RELIANCE.NS': 'RELIANCE',
};

const DEFAULT_SYMBOLS = '^NSEI,^BSESN,^GSPC,ES=F,NQ=F,DX-Y.NYB,AAPL,TSLA,RELIANCE.NS';

// Security: Validate symbol format and cap quantity to prevent SSRF and DoS (resource exhaustion)
const VALID_SYMBOL_REGEX = /^[a-zA-Z0-9\s:^.\-=]{1,30}$/;
const MAX_SYMBOLS = 20;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawSymbols = searchParams.get('symbols');

  let symbols = rawSymbols || DEFAULT_SYMBOLS;

  // Handle dynamically appended queries from the frontend that have prefixes
  if (rawSymbols) {
    const parsed = rawSymbols.split(',').map((s) => {
      const trimmed = s.trim();
      if (trimmed.startsWith('NSE:')) return trimmed.split(':')[1] + '.NS';
      if (trimmed.startsWith('BSE:')) return trimmed.split(':')[1] + '.BO';
      // Auto-strip US Exchanges so Yahoo catches bare tickers (e.g. NASDAQ:AAPL -> AAPL)
      if (trimmed.includes(':')) return trimmed.split(':')[1];
      return trimmed;
    });
    symbols = parsed.join(',');
  }

  const list = symbols
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (list.length > MAX_SYMBOLS) {
    return NextResponse.json({ error: 'Too many symbols requested' }, { status: 400 });
  }

  for (const s of list) {
    if (!VALID_SYMBOL_REGEX.test(s) || s.includes('..')) {
      return NextResponse.json({ error: 'Invalid symbol parameter format' }, { status: 400 });
    }
  }

  try {
    // One daily-bar request per symbol. The previous batch endpoint (v7/spark) only
    // returns 5-minute intraday bars, from which the true previous session close
    // cannot be recovered — see src/lib/yahoo.ts.
    const quotes = await Promise.all(list.map((s) => fetchYahooDaily(s)));

    const results = quotes.filter(Boolean).map((q) => ({
      symbol: SYMBOL_LABELS[q!.symbol] || q!.symbol,
      lastPrice: q!.price,
      priceChangePercent: q!.changePercent.toFixed(2),
    }));

    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch Indices data' }, { status: 500 });
  }
}
