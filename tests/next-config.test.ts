import { describe, expect, it } from 'vitest';
import nextConfig from '../next.config';

const headerRules = await nextConfig.headers!();
const varyRule = headerRules.find((rule) =>
  rule.headers.some((header) => header.key.toLowerCase() === 'vary')
);

/**
 * `source` is a path-to-regexp pattern, but this one is a plain negative lookahead
 * plus a capture group, so anchoring it is a faithful enough approximation to assert
 * which paths it covers.
 */
const sourceMatches = (path: string) => new RegExp(`^${varyRule!.source}$`).test(path);

describe('Vary is configured at the routing layer', () => {
  it('declares Accept, because Next overwrites the proxy value on rendered HTML', () => {
    expect(varyRule).toBeDefined();
    const value = varyRule!.headers.find((h) => h.key.toLowerCase() === 'vary')!.value;
    expect(value.split(',').map((v) => v.trim().toLowerCase())).toContain('accept');
    expect(value.toLowerCase()).toContain('accept-encoding');
  });

  it('keeps the Next router tokens, since this replaces rather than extends them', () => {
    const value = varyRule!.headers.find((h) => h.key.toLowerCase() === 'vary')!.value.toLowerCase();
    for (const token of [
      'rsc',
      'next-router-state-tree',
      'next-router-prefetch',
      'next-router-segment-prefetch',
    ]) {
      expect(value).toContain(token);
    }
  });

  it('applies to page routes', () => {
    for (const path of ['/', '/about', '/blog/a-post', '/live-terminal/XAUUSD', '/nope']) {
      expect(sourceMatches(path), `${path} should be covered`).toBe(true);
    }
  });

  it('does not apply to assets, API routes or framework internals', () => {
    for (const path of [
      '/robots.txt',
      '/sitemap.xml',
      '/llms.txt',
      '/favicon.ico',
      '/blog/liquidity.png',
      '/api/spot',
      '/_next/static/chunk.js',
    ]) {
      expect(sourceMatches(path), `${path} should be excluded`).toBe(false);
    }
  });

  it('leaves the existing security headers in place', () => {
    const global = headerRules.find((rule) => rule.source === '/(.*)');
    expect(global).toBeDefined();
    const keys = global!.headers.map((h) => h.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        'Content-Security-Policy',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy',
      ])
    );
  });
});
