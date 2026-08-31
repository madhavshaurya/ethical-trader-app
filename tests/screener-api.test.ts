import { describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/screener/route';

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ totalCount: 0, data: [] }),
} as Response);

describe('Screener API route input validation', () => {
  it('accepts valid parameters and defaults', async () => {
    const req = new Request('http://localhost/api/screener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ market: 'crypto', sortBy: 'volume', sortOrder: 'desc', search: 'BTC' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('rejects invalid market enum', async () => {
    const req = new Request('http://localhost/api/screener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ market: 'invalid_market' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid request format');
  });

  it('rejects malicious or invalid search inputs', async () => {
    const req = new Request('http://localhost/api/screener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ search: '<script>alert(1)</script>' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('rejects invalid sortBy input pattern', async () => {
    const req = new Request('http://localhost/api/screener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sortBy: 'volume; DROP TABLE users;' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
