import { describe, expect, it } from 'vitest';
import { GET } from '../src/app/api/indices/route';

describe('indices API route input validation', () => {
  it('rejects invalid or malicious symbols to prevent injection / SSRF', async () => {
    const maliciousSymbols = [
      '../etc/passwd',
      '^NSEI;rm -rf /',
      'http://evil.com',
      '<script>alert(1)</script>',
    ];

    for (const sym of maliciousSymbols) {
      const req = new Request(`http://localhost/api/indices?symbols=${encodeURIComponent(sym)}`);
      const res = await GET(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBe('Invalid or excessive symbols parameter');
    }
  });

  it('rejects excessive symbol count to prevent DoS request amplification', async () => {
    const excessiveSymbols = Array.from({ length: 25 }, (_, i) => `SYM${i}`).join(',');
    const req = new Request(`http://localhost/api/indices?symbols=${excessiveSymbols}`);
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid or excessive symbols parameter');
  });
});
