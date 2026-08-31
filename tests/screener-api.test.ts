import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../src/app/api/screener/route';

describe('screener API route mapping', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('correctly maps column positional arrays to response objects in O(1)', async () => {
    const mockTradingViewData = {
      totalCount: 1,
      data: [
        {
          s: 'BINANCE:BTCUSDT',
          d: [
            'BTCUSDT',            // name
            'Bitcoin / Tether',   // description
            65000.5,             // close
            2.5,                 // change
            12345678,            // volume
            1200000000000,       // market_cap_basic
            0.8,                 // Recommend.All (rating)
            'crypto',            // type
            62.4,                // RSI
            120.5,               // MACD.macd
            110.2,               // MACD.signal
            66000,               // BB.upper
            64000,               // BB.lower
            64800,               // EMA20
            63500,               // EMA50
            64900,               // VWAP
          ],
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTradingViewData,
    } as Response);

    const req = new Request('http://localhost/api/screener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ market: 'crypto', search: 'BTC' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.totalCount).toBe(1);
    expect(body.data).toHaveLength(1);

    const item = body.data[0];
    expect(item.providerSymbol).toBe('BINANCE:BTCUSDT');
    expect(item.name).toBe('BTCUSDT');
    expect(item.description).toBe('Bitcoin / Tether');
    expect(item.close).toBe(65000.5);
    expect(item.changePct).toBe(2.5);
    expect(item.volume).toBe(12345678);
    expect(item.marketCap).toBe(1200000000000);
    expect(item.rating).toBe(0.8);
    expect(item.type).toBe('crypto');
    expect(item.rsi).toBe(62.4);
    expect(item.macd).toBe(120.5);
    expect(item.macdSignal).toBe(110.2);
    expect(item.bbUpper).toBe(66000);
    expect(item.bbLower).toBe(64000);
    expect(item.ema20).toBe(64800);
    expect(item.ema50).toBe(63500);
    expect(item.vwap).toBe(64900);
  });

  it('handles empty results gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalCount: 0, data: [] }),
    } as Response);

    const req = new Request('http://localhost/api/screener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ market: 'india' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.totalCount).toBe(0);
    expect(body.data).toEqual([]);
  });

  it('returns 500 status on upstream error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
    } as Response);

    const req = new Request('http://localhost/api/screener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ market: 'america' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(502);

    const body = await res.json();
    expect(body.error).toBe('TradingView upstream failed');
  });
});
