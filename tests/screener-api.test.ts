import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../src/app/api/screener/route';

global.fetch = vi.fn();

describe('Screener API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('maps TradingView response correctly using column index map', async () => {
    const mockTvData = {
      totalCount: 1,
      data: [
        {
          s: 'BINANCE:BTCUSDT',
          d: [
            'BTCUSDT', // name
            'Bitcoin / TetherUS', // description
            65000, // close
            2.5, // change
            1000000000, // volume
            1200000000000, // market_cap_basic
            0.8, // Recommend.All
            'crypto', // type
            62.5, // RSI
            120.5, // MACD.macd
            100.2, // MACD.signal
            66000, // BB.upper
            64000, // BB.lower
            64800, // EMA20
            63000, // EMA50
            64900, // VWAP
          ],
        },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTvData,
    });

    const request = new Request('http://localhost/api/screener', {
      method: 'POST',
      body: JSON.stringify({ market: 'crypto' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.totalCount).toBe(1);
    expect(json.data[0]).toEqual({
      providerSymbol: 'BINANCE:BTCUSDT',
      name: 'BTCUSDT',
      description: 'Bitcoin / TetherUS',
      close: 65000,
      changePct: 2.5,
      volume: 1000000000,
      marketCap: 1200000000000,
      rating: 0.8,
      type: 'crypto',
      rsi: 62.5,
      macd: 120.5,
      macdSignal: 100.2,
      bbUpper: 66000,
      bbLower: 64000,
      ema20: 64800,
      ema50: 63000,
      vwap: 64900,
    });
  });

  it('handles empty response gracefully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ totalCount: 0, data: [] }),
    });

    const request = new Request('http://localhost/api/screener', {
      method: 'POST',
      body: JSON.stringify({ market: 'crypto' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ totalCount: 0, data: [] });
  });
});
