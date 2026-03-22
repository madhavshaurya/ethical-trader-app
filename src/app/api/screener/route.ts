import { NextResponse } from 'next/server';

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

    if (market === 'forex') {
      reqColumns[4] = "name"; 
    }

    const payload = {
      filter: filters,
      options: { lang: "en" },
      markets: tvMarketId === 'forex' ? [] : [tvMarketId],
      symbols: { query: { types: [] }, tickers: [] },
      columns: reqColumns,
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

    const results = data.data.map((item: any) => ({
      providerSymbol: item.s,
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
    console.error("Screener API error:", error);
    return NextResponse.json({ error: 'Failed to proxy scanner request' }, { status: 500 });
  }
}
