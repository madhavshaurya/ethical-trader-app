import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const interval = searchParams.get('interval');
  const limit = searchParams.get('limit') || '200';
  
  if (!symbol || !interval) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

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
    
    // Fallback for XAU if Binance blocks in production
    if (!res.ok && symbol === 'XAUUSDT') {
      console.log('Klines: Binance blocked XAU, falling back to Yahoo...');
      const yahooSymbol = 'GC=F';
      const yahooRes = await fetch(`https://query2.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=${interval === '1h' ? '60m' : interval}&range=1mo`, {
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
            quote.open[index] || 0,
            quote.high[index] || 0,
            quote.low[index] || 0,
            quote.close[index] || 0,
            quote.volume[index] || 0
          ]).filter((k: any) => k[1] !== 0);
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
