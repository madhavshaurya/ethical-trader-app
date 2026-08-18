/**
 * Single source of truth for the canonical site origin.
 *
 * Everything SEO-facing (metadataBase, canonicals, sitemap, robots, JSON-LD) reads
 * from here. The domain was previously hardcoded as theethicaltrader.com in three
 * separate files; the live domain is theethicaltrader.in.
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel to override (e.g. for a staging domain). Google
 * treats every distinct origin as a different site, so this must always be the exact
 * canonical host — no trailing slash, no www unless www is the canonical choice.
 */
const FALLBACK_ORIGIN = 'https://theethicaltrader.in';

function normalise(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

export const SITE_URL = normalise(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_ORIGIN);

export const SITE_NAME = 'TheEthicalTrader';
export const SITE_TAGLINE = 'Trade with Integrity';
export const SITE_LOCALE = 'en_IN';

/** Absolute URL for a path — required for canonicals, sitemap and structured data. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Shared Open Graph image.
 *
 * Next does NOT deep-merge `openGraph` — a page that sets it replaces the layout's
 * object entirely, dropping the inherited image and locale. So every page that
 * defines openGraph must spread these in explicitly. Path resolves to the generated
 * card in app/opengraph-image.tsx.
 */
export const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'TheEthicalTrader — Master the Markets',
};

/** Build a complete, self-contained openGraph block for a page. */
export function pageOpenGraph(opts: {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
}) {
  return {
    title: opts.title,
    description: opts.description,
    url: opts.url,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: opts.type ?? ('website' as const),
    images: [OG_IMAGE],
  };
}
