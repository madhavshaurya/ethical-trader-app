import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/screener/route';

describe('/api/screener input validation', () => {
  it('returns 400 Bad Request for invalid market parameter', async () => {
    const req = new Request('http://localhost/api/screener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ market: 'invalid_market' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid request payload');
  });

  it('returns 400 Bad Request for malicious/invalid sortBy parameter', async () => {
    const req = new Request('http://localhost/api/screener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sortBy: 'volume; DROP TABLE users;' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid request payload');
  });

  it('returns 400 Bad Request for invalid sortOrder parameter', async () => {
    const req = new Request('http://localhost/api/screener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sortOrder: 'invalid_order' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid request payload');
  });

  it('returns 400 Bad Request if search string exceeds maximum length', async () => {
    const longSearch = 'a'.repeat(51);
    const req = new Request('http://localhost/api/screener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ search: longSearch }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid request payload');
  });
});
