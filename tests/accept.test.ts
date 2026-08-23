import { describe, expect, it } from 'vitest';
import { parseAccept, qualityOf, selectMediaType } from '@/lib/accept';

const OFFERS = [
  'text/html',
  'application/xhtml+xml',
  'text/markdown',
  'text/x-markdown',
  'text/plain',
] as const;

describe('parseAccept', () => {
  it('treats an absent header as accepting anything', () => {
    expect(parseAccept(null)).toEqual([{ type: '*', subtype: '*', q: 1, specificity: 0 }]);
    expect(parseAccept('')).toEqual([{ type: '*', subtype: '*', q: 1, specificity: 0 }]);
    expect(parseAccept('   ')).toEqual([{ type: '*', subtype: '*', q: 1, specificity: 0 }]);
  });

  it('parses media ranges, q-values and specificity', () => {
    expect(parseAccept('text/markdown;q=0.8, text/*;q=0.5, */*;q=0.1')).toEqual([
      { type: 'text', subtype: 'markdown', q: 0.8, specificity: 2 },
      { type: 'text', subtype: '*', q: 0.5, specificity: 1 },
      { type: '*', subtype: '*', q: 0.1, specificity: 0 },
    ]);
  });

  it('defaults a missing q to 1 and clamps out-of-range values', () => {
    expect(parseAccept('text/html')[0].q).toBe(1);
    expect(parseAccept('text/html;q=7')[0].q).toBe(1);
    expect(parseAccept('text/html;q=-3')[0].q).toBe(0);
    expect(parseAccept('text/html;q=notanumber')[0].q).toBe(1);
  });

  it('is case-insensitive and ignores non-q parameters', () => {
    expect(parseAccept('TEXT/MARKDOWN;charset=UTF-8;Q=0.4')).toEqual([
      { type: 'text', subtype: 'markdown', q: 0.4, specificity: 2 },
    ]);
  });

  it('falls back to the wildcard when nothing in the header is a media range', () => {
    expect(parseAccept('garbage, alsogarbage')).toEqual([
      { type: '*', subtype: '*', q: 1, specificity: 0 },
    ]);
  });
});

describe('qualityOf', () => {
  it('prefers the most specific matching range over the highest q', () => {
    // RFC 9110 §12.5.1: text/markdown;q=0 wins over */*;q=1 because it is more specific.
    const ranges = parseAccept('*/*;q=1, text/markdown;q=0');
    expect(qualityOf('text/markdown', ranges)).toBe(0);
    expect(qualityOf('text/html', ranges)).toBe(1);
  });

  it('matches type wildcards', () => {
    const ranges = parseAccept('text/*;q=0.6');
    expect(qualityOf('text/markdown', ranges)).toBe(0.6);
    expect(qualityOf('application/json', ranges)).toBe(0);
  });
});

describe('selectMediaType', () => {
  it('serves HTML to a browser', () => {
    const browser =
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8';
    expect(selectMediaType(browser, OFFERS)).toBe('text/html');
  });

  it('serves HTML to a client sending no Accept header at all', () => {
    expect(selectMediaType(null, OFFERS)).toBe('text/html');
  });

  it('serves HTML on a bare wildcard, using server preference to break the tie', () => {
    expect(selectMediaType('*/*', OFFERS)).toBe('text/html');
  });

  it('serves Markdown when Markdown is what was asked for', () => {
    expect(selectMediaType('text/markdown', OFFERS)).toBe('text/markdown');
    expect(selectMediaType('text/markdown, */*;q=0.1', OFFERS)).toBe('text/markdown');
  });

  it('honours q-values in both directions', () => {
    expect(selectMediaType('text/html;q=0.9, text/markdown;q=1.0', OFFERS)).toBe('text/markdown');
    expect(selectMediaType('text/html;q=1.0, text/markdown;q=0.9', OFFERS)).toBe('text/html');
  });

  it('respects an explicit q=0 rejection', () => {
    expect(selectMediaType('*/*, text/html;q=0', OFFERS)).toBe('application/xhtml+xml');
    // A more specific q=0 range excludes Markdown even though text/* would accept it.
    expect(selectMediaType('text/*, text/markdown;q=0', OFFERS)).toBe('text/html');
  });

  it('returns null when the client accepts nothing we can produce', () => {
    expect(selectMediaType('application/json', OFFERS)).toBeNull();
    expect(selectMediaType('image/png, application/pdf', OFFERS)).toBeNull();
    expect(selectMediaType('*/*;q=0', OFFERS)).toBeNull();
  });

  it('falls back to the plain-text offer for a text-only client', () => {
    expect(selectMediaType('text/plain', OFFERS)).toBe('text/plain');
  });
});
