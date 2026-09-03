import { describe, expect, it } from 'vitest';
import { GET } from '../src/app/api/signal/route';

describe('signal API route input validation', () => {
  it('rejects invalid or malicious symbols', async () => {
    const maliciousSymbols = [
      '../etc/passwd',
      'XAUUSDT;rm -rf /',
      'http://evil.com',
      'XAUUSD<script>',
    ];

    for (const sym of maliciousSymbols) {
      const req = new Request(`http://localhost/api/signal?symbol=${encodeURIComponent(sym)}`);
      const res = await GET(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBe('Invalid symbol format');
    }
  });

  it('rejects unsupported intervals', async () => {
    const req = new Request('http://localhost/api/signal?symbol=XAUUSDT&interval=2h');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Unsupported interval');
  });
});
