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
  
  try {
    const res = await fetch(`${baseUrl}/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=${limit}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream Error' }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch(error) {
    return NextResponse.json({ error: 'Failed to fetch klines' }, { status: 500 });
  }
}
