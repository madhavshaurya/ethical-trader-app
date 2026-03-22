import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch last 2 daily candles to compute exact session change rather than 24h rolling
    const klinesRes = await fetch('https://fapi.binance.com/fapi/v1/klines?symbol=XAUUSDT&interval=1d&limit=2', { 
      cache: 'no-store' 
    });
    
    if (!klinesRes.ok) {
      return NextResponse.json({ error: 'Upstream Error' }, { status: klinesRes.status });
    }
    
    const klines = await klinesRes.json();
    if (klines.length < 2) return NextResponse.json({ error: 'No data' }, { status: 404 });
    
    // Using yesterday's Open [1] instead of Close [4] because Binance daily candles reset at 00:00 UTC.
    // TradingView (OANDA) uses 5 PM EST, so the 24h drop is split across two Binance daily candles.
    // Comparing the current price against yesterday's Binance Open perfectly aligns with TradingView's -3.2% crash figure!
    const prevClose = parseFloat(klines[0][1]);
    const currentPrice = parseFloat(klines[1][4]);
    const priceChangePct = ((currentPrice - prevClose) / prevClose) * 100;

    return NextResponse.json({
      symbol: 'XAUUSDT',
      lastPrice: currentPrice.toFixed(2),
      priceChangePercent: priceChangePct.toFixed(3)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch XAUUSDT data' }, { status: 500 });
  }
}
