import { NextResponse } from 'next/server';
import { fetchYahooDaily } from '@/lib/yahoo';

export async function GET() {
  try {
    // SESSION 1: Try Binance (Futures API for XAU)
    const fetchOptions: RequestInit = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.binance.com/'
      },
      cache: 'no-store'
    };

    const binanceRes = await fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=${encodeURIComponent('XAUUSDT')}&interval=1d&limit=2`, fetchOptions);
    
    // SESSION 2: Fallback to Yahoo Finance if Binance blocks (451/403/Forbidden)
    if (!binanceRes.ok) {
       console.log('XAU: Binance blocked, falling back to Yahoo...');
       const q = await fetchYahooDaily('GC=F');
       if (q) {
          return NextResponse.json({
            symbol: 'XAUUSD (Yahoo)',
            lastPrice: q.price.toFixed(2),
            priceChangePercent: q.changePercent.toFixed(3)
          });
       }

       return NextResponse.json({ error: 'XAU Data Unavailable' }, { status: 502 });
    }
    
    const klines = await binanceRes.json();
    if (klines.length < 2) return NextResponse.json({ error: 'No data' }, { status: 404 });
    
    // Binance kline indices: [1] = open, [4] = close. Daily change must be measured
    // against yesterday's CLOSE — using [1] measured from yesterday's open, i.e. ~2 days.
    const prevClose = parseFloat(klines[0][4]);
    const currentPrice = parseFloat(klines[1][4]);
    const priceChangePct = ((currentPrice - prevClose) / prevClose) * 100;

    return NextResponse.json({
      symbol: 'XAUUSDT',
      lastPrice: currentPrice.toFixed(2),
      priceChangePercent: priceChangePct.toFixed(3)
    });
  } catch (error) {
    console.error('XAU API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch XAUUSDT data' }, { status: 500 });
  }
}
