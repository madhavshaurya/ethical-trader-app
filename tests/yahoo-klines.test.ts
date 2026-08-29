import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../src/app/api/yahoo-klines/route';

global.fetch = vi.fn();

describe('Yahoo Klines Route Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects missing symbol parameter with 400 status', async () => {
    const req = new Request('http://localhost/api/yahoo-klines?interval=15m');
    const res = await GET(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body).toEqual({ error: 'Invalid parameter format' });
  });

  it('rejects invalid interval parameter with 400 status', async () => {
    const req = new Request('http://localhost/api/yahoo-klines?symbol=AAPL&interval=invalid_interval');
    const res = await GET(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body).toEqual({ error: 'Invalid parameter format' });
  });

  it('rejects malicious or invalid symbol inputs with 400 status', async () => {
    const maliciousSymbols = [
      'AAPL<script>',
      '../../etc/passwd',
      'AAPL; DROP TABLE users;',
      'SYMBOL_THAT_IS_WAY_TOO_LONG_AND_EXCEEDS_MAX_CHARACTERS_LIMIT_OF_THIRTY'
    ];

    for (const sym of maliciousSymbols) {
      const req = new Request(`http://localhost/api/yahoo-klines?symbol=${encodeURIComponent(sym)}&interval=15m`);
      const res = await GET(req);
      expect(res.status).toBe(400);

      const body = await res.json();
      expect(body).toEqual({ error: 'Invalid parameter format' });
    }
  });

  it('accepts valid symbol and interval parameters', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        chart: {
          result: [
            {
              timestamp: [1600000000],
              indicators: {
                quote: [{ open: [100], high: [105], low: [95], close: [102], volume: [1000] }]
              }
            }
          ]
        }
      })
    });

    const req = new Request('http://localhost/api/yahoo-klines?symbol=AAPL&interval=15m');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual([[1600000000000, 100, 105, 95, 102, 1000]]);
  });
});
