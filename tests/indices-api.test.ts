import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../src/app/api/indices/route';

vi.mock('../src/lib/yahoo', () => ({
  fetchYahooDaily: vi.fn(async (symbol: string) => ({
    symbol,
    price: 100,
    prevClose: 95,
    changePercent: 5.26,
  })),
}));

describe('Indices API Route Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects invalid or malicious symbol strings with 400', async () => {
    const maliciousSymbols = [
      'AAPL<script>',
      '../../etc/passwd',
      'AAPL; DROP TABLE users;',
      'SYMBOL_THAT_EXCEEDS_MAX_LENGTH_OF_THIRTY_CHARACTERS_123456789'
    ];

    for (const sym of maliciousSymbols) {
      const req = new Request(`http://localhost/api/indices?symbols=${encodeURIComponent(sym)}`);
      const res = await GET(req);
      expect(res.status).toBe(400);

      const body = await res.json();
      expect(body).toEqual({ error: 'Invalid symbol format' });
    }
  });

  it('rejects requests exceeding the maximum symbol limit (>20 symbols) with 400', async () => {
    const symbols = Array.from({ length: 25 }, (_, i) => `SYM${i}`).join(',');
    const req = new Request(`http://localhost/api/indices?symbols=${symbols}`);
    const res = await GET(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body).toEqual({ error: 'Too many symbols requested' });
  });

  it('accepts valid default or custom symbol requests with 200', async () => {
    const req = new Request('http://localhost/api/indices?symbols=AAPL,TSLA');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
  });
});
