import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../src/app/api/indices/route';

global.fetch = vi.fn();

describe('Indices API Route Input Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepts default request with no symbols query parameter', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        chart: {
          result: [
            {
              meta: { symbol: '^GSPC', regularMarketPrice: 5000 },
              timestamp: [1600000000, 1600086400],
              indicators: { quote: [{ close: [4950, 5000] }] },
            },
          ],
        },
      }),
    } as Response);

    const req = new Request('http://localhost/api/indices');
    const res = await GET(req);
    expect(res.status).toBe(200);
  });

  it('rejects malicious or invalid symbol inputs with 400 status', async () => {
    const maliciousSymbols = [
      '^GSPC<script>',
      '../../etc/passwd',
      '^GSPC; DROP TABLE users;',
      'SYMBOL_THAT_IS_WAY_TOO_LONG_AND_EXCEEDS_MAX_CHARACTERS_LIMIT_OF_THIRTY',
    ];

    for (const sym of maliciousSymbols) {
      const req = new Request(`http://localhost/api/indices?symbols=${encodeURIComponent(sym)}`);
      const res = await GET(req);
      expect(res.status).toBe(400);

      const body = await res.json();
      expect(body).toEqual({ error: 'Invalid symbol parameter' });
    }
  });

  it('rejects requests with more than 20 symbols with 400 status', async () => {
    const twentyOneSymbols = Array.from({ length: 21 }, (_, i) => `SYM${i}`).join(',');
    const req = new Request(`http://localhost/api/indices?symbols=${twentyOneSymbols}`);
    const res = await GET(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body).toEqual({ error: 'Invalid symbol parameter' });
  });

  it('rejects raw symbol parameters exceeding max length with 400 status', async () => {
    const longParam = 'A'.repeat(501);
    const req = new Request(`http://localhost/api/indices?symbols=${longParam}`);
    const res = await GET(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body).toEqual({ error: 'Invalid symbol parameter' });
  });

  it('accepts valid custom symbols including exchange prefixes', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        chart: {
          result: [
            {
              meta: { symbol: 'RELIANCE.NS', regularMarketPrice: 2500 },
              timestamp: [1600000000, 1600086400],
              indicators: { quote: [{ close: [2450, 2500] }] },
            },
          ],
        },
      }),
    } as Response);

    const req = new Request('http://localhost/api/indices?symbols=NSE:RELIANCE');
    const res = await GET(req);
    expect(res.status).toBe(200);
  });
});
