import { describe, expect, it } from 'vitest';
import { GET } from '../src/app/api/klines/route';

describe('klines API route input validation', () => {
  it('returns 400 when missing parameters', async () => {
    const req = new Request('http://localhost/api/klines');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing parameters');
  });

  it('rejects invalid or malicious symbols to prevent SSRF', async () => {
    const maliciousSymbols = [
      '../etc/passwd',
      'BTCUSDT;rm -rf /',
      'http://evil.com',
      'XAUUSDT<script>',
      'VERY_LONG_SYMBOL_NAME_THAT_EXCEEDS_MAX_LENGTH_LIMIT_123456789'
    ];

    for (const sym of maliciousSymbols) {
      const req = new Request(`http://localhost/api/klines?symbol=${encodeURIComponent(sym)}&interval=1h`);
      const res = await GET(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBe('Invalid symbol or interval format');
    }
  });

  it('rejects unsupported intervals', async () => {
    const req = new Request('http://localhost/api/klines?symbol=BTCUSDT&interval=2h');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid symbol or interval format');
  });

  it('rejects invalid limit values', async () => {
    const invalidLimits = ['-1', '0', '1001', 'abc'];

    for (const limit of invalidLimits) {
      const req = new Request(`http://localhost/api/klines?symbol=BTCUSDT&interval=1h&limit=${limit}`);
      const res = await GET(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBe('Invalid limit parameter');
    }
  });
});
