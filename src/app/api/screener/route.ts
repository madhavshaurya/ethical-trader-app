import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const market = body.market || 'crypto'; // 'crypto', 'india', 'america'
    const sortBy = body.sortBy || 'volume';
    const sortOrder = body.sortOrder || 'desc';
    const limit = body.limit || 100;
    
    // Determine the exact TradingView scanner route based on market grouping
    const tvMarketId = market === 'crypto' ? 'crypto' : market === 'india' ? 'india' : market === 'forex' ? 'forex' : 'america';
    const url = `https://scanner.tradingview.com/${tvMarketId}/scan`;

    // Base filters
    const filters: any[] = [{ left: "name", operation: "nempty" }];
    
    let reqColumns = [
        "name",             
        "close",            
        "change",           
        "volume",           
        "market_cap_basic", 
        "Recommend.All",    
        "description",      
        "type"              
    ];

    if (market === 'india' || market === 'america') {
      // Show all stocks without volume or primary restrictions
    } else if (market === 'forex') {
      // Forex does not support market_cap_basic on TradingView
      reqColumns[4] = "name"; // Fill with dummy name so length maps back correctly
    } else if (market === 'crypto') {
      // Ensure we only show Binance listed trading pairs for reliable cross-route fetching
      filters.push({ left: "exchange", operation: "equal", right: "BINANCE" });
    }

    // Advanced TradingView Payload simulating Python TradingView-Screener reverse-engineering
    const payload = {
      filter: filters,
      options: { lang: "en" },
      markets: tvMarketId === 'forex' ? [] : [tvMarketId],
      symbols: { query: { types: [] }, tickers: [] },
      columns: reqColumns,
      sort: { sortBy, sortOrder },
      range: [0, 500]
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
    
    // Map compact data arrays precisely back into frontend-friendly objects
    const results = data.data.map((item: any) => ({
      providerSymbol: item.s, // e.g., "BINANCE:BTCUSDT" or "NSE:RELIANCE"
      name: item.d[0],
      close: item.d[1],
      changePct: item.d[2],
      volume: item.d[3],
      marketCap: item.d[4],
      rating: item.d[5],
      description: item.d[6],
      type: item.d[7],
    }));

    return NextResponse.json({ totalCount: data.totalCount, data: results });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to proxy scanner request' }, { status: 500 });
  }
}
