import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const interval = searchParams.get('interval');
  const limit = searchParams.get('limit') || '200';
  
  if (!symbol || !interval) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // Helper to map Binance symbols to Yahoo Finance symbols
  const getYahooSymbol = (binSymbol: string) => {
    const map: Record<string, string> = {
      'XAUUSDT': 'GC=F',
      'EURUSDT': 'EURUSD=X',
      'BTCUSDT': 'BTC-USD',
      'ETHUSDT': 'ETH-USD',
      'SOLUSDT': 'SOL-USD',
      'GBPUSDT': 'GBPUSD=X',
      'JPYUSDT': 'JPYUSD=X'
    };
    return map[binSymbol] || binSymbol;
  };

  const isFutures = symbol === 'XAUUSDT';
  const baseUrl = isFutures ? 'https://fapi.binance.com/fapi/v1' : 'https://api.binance.com/api/v3';
  
  const fetchOptions: RequestInit = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json',
      'Referer': 'https://www.binance.com/'
    },
    cache: 'no-store'
  };

  try {
    const res = await fetch(`${baseUrl}/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=${limit}`, fetchOptions);
    
    // BROAD FALLBACK: If Binance blocks ANY symbol in production (451/403/Forbidden)
    if (!res.ok) {
      console.log(`Klines: Binance blocked ${symbol}, trying Yahoo fallback...`);
      const yahooSymbol = getYahooSymbol(symbol);
      
      // Map Binance intervals to Yahoo intervals
      const intervalMap: Record<string, string> = {
        '1m': '1m', '5m': '5m', '15m': '15m', '1h': '60m', '4h': '60m', '1d': '1d'
      };
      
      const yahooRes = await fetch(`https://query2.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=${intervalMap[interval] || '60m'}&range=1mo`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        cache: 'no-store'
      });
      
      if (yahooRes.ok) {
        const yData = await yahooRes.json();
        const result = yData.chart.result?.[0];
        if (result && result.timestamp) {
          const timestamps = result.timestamp;
          const quote = result.indicators.quote[0];
          const klines = timestamps.map((t: number, index: number) => [
            t * 1000,
            quote.open[index] || quote.close[index] || 0,
            quote.high[index] || quote.close[index] || 0,
            quote.low[index] || quote.close[index] || 0,
            quote.close[index] || 0,
            quote.volume[index] || 0
          ]).filter((k: any) => k[4] !== 0); // Ensure we have a close price
          
          return NextResponse.json(klines.slice(-parseInt(limit)));
        }
      }
    }

    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream Error' }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch(error) {
    console.error('Klines API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch klines' }, { status: 500 });
  }
}
