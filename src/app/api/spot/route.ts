import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "EURUSDT"];
    
    // Fetch last 2 daily candles concurrently to compute exact session changes
    const results = await Promise.all(symbols.map(async (sym) => {
      const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(sym)}&interval=1d&limit=2`, { 
        cache: 'no-store' 
      });
      
      if (!res.ok) return null;
      
      const klines = await res.json();
      if (klines.length < 2) return null;
      
      // Calculate from yesterday's Open [1] instead of today's rolling 24hr to match timezone alignment
      const prevClose = parseFloat(klines[0][1]);
      const currentPrice = parseFloat(klines[1][4]);
      const priceChangePct = ((currentPrice - prevClose) / prevClose) * 100;
      
      return {
        symbol: sym,
        // EUR needs more precision
        lastPrice: sym === 'EURUSDT' ? currentPrice.toFixed(5) : currentPrice.toFixed(2),
        priceChangePercent: priceChangePct.toFixed(3)
      };
    }));

    // Filter out any potential failed fetches and wrap in the expected JSON array structure
    return NextResponse.json(results.filter(Boolean));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Spot data' }, { status: 500 });
  }
}
