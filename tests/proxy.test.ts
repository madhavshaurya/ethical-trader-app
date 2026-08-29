import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy, isNegotiablePath } from '@/proxy';
import { SITE_URL, absoluteUrl } from '@/lib/site';
import { AGENT_DOCS } from '@/lib/agent-docs';

const ORIGIN = 'https://theethicaltrader.in';

function request(path: string, init: { accept?: string | null; method?: string } = {}) {
  const headers = new Headers();
  if (init.accept !== undefined && init.accept !== null) headers.set('accept', init.accept);
  return new NextRequest(new URL(path, ORIGIN), { method: init.method ?? 'GET', headers });
}

/** Header set by NextResponse.next(); its presence means "hand off to the app". */
function isPassThrough(response: Response) {
  return response.headers.get('x-middleware-next') === '1';
}

const BROWSER_ACCEPT =
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8';

describe('HTML requests', () => {
  it('passes a browser request through to the app', async () => {
    const response = await proxy(request('/', { accept: BROWSER_ACCEPT }));
    expect(isPassThrough(response)).toBe(true);
  });

  it('passes a request with no Accept header through to the app', async () => {
    const response = await proxy(request('/about'));
    expect(isPassThrough(response)).toBe(true);
  });

  it('advertises Accept in Vary on the HTML variant', async () => {
    const response = await proxy(request('/', { accept: BROWSER_ACCEPT }));
    const vary = response.headers.get('vary') ?? '';
    expect(vary.split(',').map((v) => v.trim().toLowerCase())).toContain('accept');
    expect(vary.toLowerCase()).toContain('accept-encoding');
    // The Next router tokens must survive, or client-side navigation caching breaks.
    expect(vary.toLowerCase()).toContain('rsc');
    expect(vary.toLowerCase()).toContain('next-router-state-tree');
  });

  it('advertises the Markdown alternate for pages that have one', async () => {
    const response = await proxy(request('/about', { accept: BROWSER_ACCEPT }));
    expect(response.headers.get('link')).toBe(
      `<${absoluteUrl('/about')}>; rel="alternate"; type="text/markdown"`
    );
  });

  it('keeps the security headers on every response', async () => {
    const response = await proxy(request('/', { accept: BROWSER_ACCEPT }));
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('strict-transport-security')).toContain('max-age=31536000');
    expect(response.headers.get('content-security-policy')).toContain("default-src 'self'");
    expect(response.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('permissions-policy')).toBe('camera=(), microphone=(), geolocation=()');
  });
});

describe('Markdown requests (acceptmarkdown.com)', () => {
  it('serves Markdown from the same URL', async () => {
    const response = await proxy(request('/about', { accept: 'text/markdown' }));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    await expect(response.text()).resolves.toContain('# Trading with Uncompromising Integrity');
  });

  it('sets Vary: Accept so a CDN cannot cross-serve the HTML variant', async () => {
    const response = await proxy(request('/about', { accept: 'text/markdown' }));
    const vary = response.headers.get('vary') ?? '';
    expect(vary.split(',').map((v) => v.trim().toLowerCase())).toContain('accept');
    expect(vary.toLowerCase()).toContain('accept-encoding');
  });

  it('points at the canonical HTML URL', async () => {
    const response = await proxy(request('/blog', { accept: 'text/markdown' }));
    expect(response.headers.get('link')).toBe(`<${absoluteUrl('/blog')}>; rel="canonical"`);
  });

  it.each(AGENT_DOCS.map((doc) => doc.path))('serves Markdown for %s', async (path) => {
    const response = await proxy(request(path, { accept: 'text/markdown' }));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    const body = await response.text();
    expect(body.startsWith('# ')).toBe(true);
    expect(Number(response.headers.get('content-length'))).toBe(
      new TextEncoder().encode(body).byteLength
    );
  });

  it('honours q-values in both directions', async () => {
    const wantsMarkdown = await proxy(
      request('/', { accept: 'text/html;q=0.9, text/markdown;q=1.0' })
    );
    expect(wantsMarkdown.headers.get('content-type')).toBe('text/markdown; charset=utf-8');

    const wantsHtml = await proxy(request('/', { accept: 'text/html;q=1.0, text/markdown;q=0.9' }));
    expect(isPassThrough(wantsHtml)).toBe(true);
  });

  it('serves the Markdown body as text/plain to a plain-text-only client', async () => {
    const response = await proxy(request('/about', { accept: 'text/plain' }));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
  });

  it('answers HEAD with the same headers and no body', async () => {
    const response = await proxy(
      request('/about', { accept: 'text/markdown', method: 'HEAD' })
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(Number(response.headers.get('content-length'))).toBeGreaterThan(0);
    await expect(response.text()).resolves.toBe('');
  });

  it('does not negotiate non-GET requests', async () => {
    const response = await proxy(request('/contact', { accept: 'text/markdown', method: 'POST' }));
    expect(isPassThrough(response)).toBe(true);
  });

  it('resolves a trailing slash to the same document', async () => {
    const response = await proxy(request('/about/', { accept: 'text/markdown' }));
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toContain('# Trading with Uncompromising Integrity');
  });

  it('generates a document for any terminal symbol', async () => {
    const response = await proxy(request('/live-terminal/XAUUSD', { accept: 'text/markdown' }));
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toContain('XAUUSD');
  });
});

describe('406 for unsupported types', () => {
  it('rejects a client that accepts none of our representations', async () => {
    const response = await proxy(request('/', { accept: 'application/json' }));
    expect(response.status).toBe(406);
    const body = await response.text();
    expect(body).toContain('Accept: text/markdown');
    expect(body).toContain('Accept: text/html');
    expect(body).toContain(absoluteUrl('/llms.txt'));
  });

  it('rejects a blanket q=0', async () => {
    const response = await proxy(request('/about', { accept: '*/*;q=0' }));
    expect(response.status).toBe(406);
  });

  it('never 406s a real browser', async () => {
    for (const accept of [
      BROWSER_ACCEPT,
      '*/*',
      'text/html',
      'application/xhtml+xml',
      'text/html, application/xhtml+xml, image/jxr, */*',
    ]) {
      const response = await proxy(request('/', { accept }));
      expect(isPassThrough(response), `${accept} should pass through`).toBe(true);
    }
  });

  it('never 406s a static file or an API route', async () => {
    for (const path of ['/robots.txt', '/sitemap.xml', '/llms.txt', '/icon.png', '/api/spot']) {
      const response = await proxy(request(path, { accept: 'application/json' }));
      expect(isPassThrough(response), `${path} should pass through`).toBe(true);
    }
  });
});

describe('404s', () => {
  it('returns a Markdown 404 for a path that does not exist', async () => {
    const response = await proxy(
      request('/some-path-that-does-not-exist', { accept: 'text/markdown' })
    );
    expect(response.status).toBe(404);
    expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    const body = await response.text();
    expect(body).toContain('# 404 — Not Found');
    expect(body).toContain(`${SITE_URL}/sitemap.xml`);
    expect(body).toContain(`${SITE_URL}/llms.txt`);
  });

  it('lets the app render its own HTML 404 for browsers', async () => {
    const response = await proxy(request('/nope', { accept: BROWSER_ACCEPT }));
    expect(isPassThrough(response)).toBe(true);
  });

  it('does not 404 a real route that has no Markdown twin', async () => {
    const response = await proxy(request('/opengraph-image', { accept: 'text/markdown' }));
    expect(isPassThrough(response)).toBe(true);
  });
});

describe('rate limiting', () => {
  it('429s the chat API past the limit, with security headers intact', async () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.99' });
    const chat = () =>
      proxy(new NextRequest(new URL('/api/chat', ORIGIN), { method: 'POST', headers }));

    for (let i = 0; i < 10; i += 1) {
      expect(isPassThrough(await chat())).toBe(true);
    }

    const limited = await chat();
    expect(limited.status).toBe(429);
    expect(limited.headers.get('x-frame-options')).toBe('DENY');
    await expect(limited.json()).resolves.toMatchObject({ error: expect.any(String) });
  });

  it('429s general API routes past the higher limit (60 req/min)', async () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.100' });
    const spot = () =>
      proxy(new NextRequest(new URL('/api/spot', ORIGIN), { method: 'GET', headers }));

    for (let i = 0; i < 60; i += 1) {
      expect(isPassThrough(await spot())).toBe(true);
    }

    const limited = await spot();
    expect(limited.status).toBe(429);
    expect(limited.headers.get('x-frame-options')).toBe('DENY');
    await expect(limited.json()).resolves.toMatchObject({ error: expect.any(String) });
  });
});

describe('isNegotiablePath', () => {
  it('accepts page routes', () => {
    for (const path of ['/', '/about', '/blog/some-post', '/live-terminal/XAUUSD', '/nope']) {
      expect(isNegotiablePath(path)).toBe(true);
    }
  });

  it('rejects assets, metadata files, API routes and framework internals', () => {
    for (const path of [
      '/robots.txt',
      '/sitemap.xml',
      '/llms.txt',
      '/llms-full.txt',
      '/favicon.ico',
      '/blog/liquidity.png',
      '/opengraph-image',
      '/api/spot',
      '/_next/static/chunk.js',
      '/_vercel/insights/script.js',
    ]) {
      expect(isNegotiablePath(path), `${path} should not be negotiable`).toBe(false);
    }
  });
});
