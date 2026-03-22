import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "EURUSDT"];
    
    // Map Binance symbols to Yahoo Finance symbols for fallback
    const getYahooSymbol = (binSymbol: string) => {
      const map: Record<string, string> = {
        'EURUSDT': 'EURUSD=X',
        'BTCUSDT': 'BTC-USD',
        'ETHUSDT': 'ETH-USD',
        'SOLUSDT': 'SOL-USD'
      };
      return map[binSymbol] || binSymbol;
    };

    const fetchOptions: RequestInit = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.binance.com/'
      },
      cache: 'no-store'
    };

    // Fetch last 2 daily candles concurrently to compute exact session changes
    const results = await Promise.all(symbols.map(async (sym) => {
      let binRes = await fetch(`https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(sym)}&interval=1d&limit=2`, fetchOptions);
      
      // BROAD FALLBACK: If Binance blocks ANY symbol in production (451/403/Forbidden)
      if (!binRes.ok) {
        console.log(`Spot: Binance blocked ${sym}, trying Yahoo fallback...`);
        const ySym = getYahooSymbol(sym);
        const yahooRes = await fetch(`https://query2.finance.yahoo.com/v8/finance/chart/${ySym}?interval=1d&range=5d`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          cache: 'no-store'
        });
        
        if (yahooRes.ok) {
          const yData = await yahooRes.json();
          const result = yData.chart.result?.[0];
          if (result && result.meta) {
            const currentPrice = result.meta.regularMarketPrice;
            const prevClose = result.meta.chartPreviousClose || result.meta.previousClose;
            const priceChangePct = ((currentPrice - prevClose) / prevClose) * 100;
            
            return {
              symbol: sym,
              lastPrice: sym === 'EURUSDT' ? currentPrice.toFixed(5) : currentPrice.toFixed(2),
              priceChangePercent: priceChangePct.toFixed(3)
            };
          }
        }
        return null; // Both failed
      }
      
      const klines = await binRes.json();
      if (klines.length < 2) return null;
      
      const prevClose = parseFloat(klines[0][1]);
      const currentPrice = parseFloat(klines[1][4]);
      const priceChangePct = ((currentPrice - prevClose) / prevClose) * 100;
      
      return {
        symbol: sym,
        lastPrice: sym === 'EURUSDT' ? currentPrice.toFixed(5) : currentPrice.toFixed(2),
        priceChangePercent: priceChangePct.toFixed(3)
      };
    }));

    // Filter out any potential failed fetches and wrap in the expected JSON array structure
    return NextResponse.json(results.filter(Boolean));
  } catch (error) {
    console.error('Spot API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch Spot data' }, { status: 500 });
  }
}
