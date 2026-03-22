import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawSymbols = searchParams.get('symbols');
  
  // Default string if none requested
  let symbols = rawSymbols || '^NSEI,^BSESN,^GSPC,AAPL,TSLA,RELIANCE.NS';
  
  // Handle dynamically appended queries from the frontend that have prefixes
  if (rawSymbols) {
     const parsed = rawSymbols.split(',').map(s => {
        if (s.startsWith('NSE:')) return s.split(':')[1] + '.NS';
        if (s.startsWith('BSE:')) return s.split(':')[1] + '.BO';
        // Auto-strip US Exchanges so Yahoo catches bare tickers (e.g. NASDAQ:AAPL -> AAPL)
        if (s.includes(':')) return s.split(':')[1];
        return s;
     });
     symbols = parsed.join(',');
  }

  try {
    const res = await fetch(`https://query2.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(symbols)}`, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' 
      },
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream Error' }, { status: res.status });
    }
    
    const data = await res.json();
    const results = data.spark.result.map((r: any) => {
      const meta = r.response[0].meta;
      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose;
      const changePercent = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
      
      const mapping: Record<string, string> = {
         '^NSEI': 'NIFTY 50',
         '^BSESN': 'SENSEX',
         '^GSPC': 'SPX',
         'AAPL': 'AAPL',
         'TSLA': 'TSLA',
         'RELIANCE.NS': 'RELIANCE'
      };

      return {
         symbol: mapping[meta.symbol] || meta.symbol,
         lastPrice: price,
         priceChangePercent: changePercent.toFixed(2)
      };
    });
    
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Indices data' }, { status: 500 });
  }
}
