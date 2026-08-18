import { NextResponse } from 'next/server';
import { fetchYahooDaily } from '@/lib/yahoo';

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
        const q = await fetchYahooDaily(getYahooSymbol(sym));
        if (q) {
          return {
            symbol: sym,
            lastPrice: sym === 'EURUSDT' ? q.price.toFixed(5) : q.price.toFixed(2),
            priceChangePercent: q.changePercent.toFixed(3)
          };
        }
        return null; // Both failed
      }
      
      const klines = await binRes.json();
      if (klines.length < 2) return null;
      
      // Binance kline indices: [1] = open, [4] = close. Daily change must be measured
      // against yesterday's CLOSE — using [1] measured from yesterday's open, i.e. ~2 days.
      const prevClose = parseFloat(klines[0][4]);
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
