import { NextResponse } from 'next/server';

const SYMBOL_MAP: Record<string, string> = {
  'NIFTY 50': '^NSEI',
  'SENSEX': '^BSESN',
  'SPX': '^GSPC',
  'NDQ': '^IXIC',
  'DJI': '^DJI',
  'VIX': '^VIX',
  'DXY': 'DX-Y.NYB',
  'AAPL': 'AAPL',
  'TSLA': 'TSLA',
  'NFLX': 'NFLX',
  'RELIANCE': 'RELIANCE.NS',
  'XAU-USD': 'GC=F',
  'EUR-USD': 'EURUSD=X',
  'GBP-USD': 'GBPUSD=X',
  'JPY-USD': 'JPYUSD=X',
  'GOLD': 'GC=F'
};

const INTERVAL_MAP: Record<string, { yInterval: string, range: string }> = {
  '1m': { yInterval: '1m', range: '5d' },
  '5m': { yInterval: '5m', range: '1mo' },
  '15m': { yInterval: '15m', range: '1mo' },
  '1h': { yInterval: '60m', range: '3mo' },
  '4h': { yInterval: '60m', range: '3mo' }, // Yahoo fallback
  '1d': { yInterval: '1d', range: '2y' },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || '';
  const interval = searchParams.get('interval') || '15m';
  
  let ySymbol = SYMBOL_MAP[symbol] || symbol;
  
  // Clean prefix if present (e.g. 'THINKMARKETS:EURJPY' -> 'EURJPY')
  const baseSymbol = symbol.includes(':') ? symbol.split(':')[1] : symbol;

  // Dynamically attach Indian market suffixes if prefix is provided
  if (symbol.startsWith('NSE:')) {
    ySymbol = baseSymbol + '.NS';
  } else if (symbol.startsWith('BSE:')) {
    ySymbol = baseSymbol + '.BO';
  } else if (!SYMBOL_MAP[symbol]) {
    // Check if it looks like a Forex pair (e.g. EURJPY, GBPUSD)
    // Most forex pairs are 6 chars or like EUR-USD
    const cleanForex = baseSymbol.replace('-', '').replace('/', '');
    if (cleanForex.length === 6 && !cleanForex.includes('.')) {
      ySymbol = cleanForex + '=X';
    } else {
      ySymbol = baseSymbol;
    }
  }
  
  const mapConfig = INTERVAL_MAP[interval] || { yInterval: '15m', range: '1mo' };

  try {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySymbol)}?interval=${mapConfig.yInterval}&range=${mapConfig.range}`;
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Yahoo API Error' }, { status: res.status });
    }

    const data = await res.json();
    const result = data.chart.result?.[0];
    
    if (!result || !result.timestamp) {
      return NextResponse.json([]); // Return empty array if no data
    }

    const timestamps = result.timestamp;
    const quote = result.indicators.quote[0];
    
    const limitNum = parseInt(searchParams.get('limit') || '200');

    // Format into Binance-style kline array: [time_ms, open, high, low, close, volume]
    let klines = timestamps.map((t: number, index: number) => {
      // Yahoo returns timestamps in seconds. Multiply by 1000 for ms layout.
      return [
        t * 1000, 
        quote.open[index] ?? 0,
        quote.high[index] ?? 0,
        quote.low[index] ?? 0,
        quote.close[index] ?? 0,
        quote.volume[index] ?? 0
      ];
    }).filter((k: any[]) => k[1] !== null && k[1] !== 0); // Remove null entries (e.g. market internal pauses)

    if (limitNum) {
      klines = klines.slice(-limitNum);
    }

    return NextResponse.json(klines);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Yahoo klines' }, { status: 500 });
  }
}
