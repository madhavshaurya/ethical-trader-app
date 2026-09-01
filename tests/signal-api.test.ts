import { describe, expect, it } from 'vitest';
import { GET } from '../src/app/api/signal/route';

describe('signal API route input validation', () => {
  it('rejects invalid or malicious symbols to prevent SSRF', async () => {
    const maliciousSymbols = [
      '../etc/passwd',
      'BTCUSDT;rm -rf /',
      'http://evil.com',
      'XAUUSDT<script>',
      'VERY_LONG_SYMBOL_NAME_THAT_EXCEEDS_MAX_LENGTH_LIMIT_123456789',
    ];

    for (const sym of maliciousSymbols) {
      const req = new Request(`http://localhost/api/signal?symbol=${encodeURIComponent(sym)}&interval=1h`);
      const res = await GET(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBe('Invalid symbol format');
    }
  });

  it('rejects unsupported intervals', async () => {
    const req = new Request('http://localhost/api/signal?symbol=BTCUSDT&interval=2h');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Unsupported interval');
  });
});
