import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../src/app/api/indices/route';
import { fetchYahooDaily } from '../src/lib/yahoo';

vi.mock('../src/lib/yahoo', () => ({
  fetchYahooDaily: vi.fn(),
}));

describe('Indices API Route Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects requests with more than 20 symbols with 400 status', async () => {
    const symbols = Array.from({ length: 21 }, (_, i) => `SYM${i}`).join(',');
    const req = new Request(`http://localhost/api/indices?symbols=${symbols}`);
    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ error: 'Too many symbols requested' });
  });

  it('rejects malicious or invalid symbol inputs with 400 status', async () => {
    const maliciousInputs = [
      'AAPL<script>',
      '../../etc/passwd',
      'AAPL; DROP TABLE users;',
      'SYMBOL_THAT_EXCEEDS_THE_MAXIMUM_ALLOWED_CHARACTER_LIMIT_OF_30_CHARS',
    ];

    for (const input of maliciousInputs) {
      const req = new Request(`http://localhost/api/indices?symbols=${encodeURIComponent(input)}`);
      const res = await GET(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toEqual({ error: 'Invalid symbol parameter format' });
    }
  });

  it('accepts valid symbols within limit and transforms exchange prefixes', async () => {
    vi.mocked(fetchYahooDaily).mockResolvedValue({
      symbol: '^NSEI',
      price: 22000,
      prevClose: 21900,
      changePercent: 0.456,
    });

    const req = new Request('http://localhost/api/indices?symbols=NSE:NIFTY,AAPL');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(fetchYahooDaily).toHaveBeenCalledWith('NIFTY.NS');
    expect(fetchYahooDaily).toHaveBeenCalledWith('AAPL');
  });
});
