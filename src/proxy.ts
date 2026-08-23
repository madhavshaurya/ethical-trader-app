import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { selectMediaType } from '@/lib/accept';
import {
  isKnownRoute,
  normalisePath,
  notFoundMarkdown,
  resolveAgentDoc,
} from '@/lib/agent-docs';
import { absoluteUrl } from '@/lib/site';

// -----------------------------------------------------------------------------
// SECURE RATE LIMITING (In-Memory for Vercel Edge/Middleware)
// Note: In highly distributed production, use Redis (e.g. Upstash).
// This sliding window implementation handles basic abuse protection.
// -----------------------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 10; // 10 requests per minute per IP

  const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - record.lastReset > windowMs) {
    record.count = 1;
    record.lastReset = now;
  } else {
    record.count++;
  }

  rateLimitMap.set(ip, record);
  return record.count > maxRequests;
}

// -----------------------------------------------------------------------------
// CONTENT NEGOTIATION (acceptmarkdown.com)
//
// Page routes have two representations at the same URL: HTML for browsers, Markdown
// for agents that ask for it. Negotiation runs here rather than in a route handler so
// it covers statically prerendered pages and 404s alike.
// -----------------------------------------------------------------------------

/**
 * Representations this site can produce, in server-preference order. The order breaks
 * q-value ties, so a client sending a bare wildcard Accept gets HTML.
 *
 * `text/plain` is offered so a client restricted to plain text gets the Markdown body
 * (labelled text/plain) instead of a 406.
 */
const OFFERS = [
  'text/html',
  'application/xhtml+xml',
  'text/markdown',
  'text/x-markdown',
  'text/plain',
] as const;

const MARKDOWN_TYPES = new Set(['text/markdown', 'text/x-markdown', 'text/plain']);

/**
 * Vary for negotiable routes.
 *
 * `Accept` is the one that matters: without it a CDN can hand an agent asking for
 * Markdown whichever variant happened to be cached first. The Next router tokens are
 * repeated because this replaces rather than extends any value set downstream.
 *
 * This is authoritative on the Markdown responses returned from here. On the HTML
 * variant, Next's App Router page handler overwrites Vary with its own value after
 * the proxy runs, so that case is covered by `headers()` in next.config.ts, which the
 * edge applies afterwards. Setting it here too costs nothing and keeps the header
 * correct on hosts that merge proxy headers last.
 */
const VARY =
  'Accept, Accept-Encoding, RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch';

const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com; font-src 'self' https://fonts.gstatic.com https://api.fontshare.com https://cdn.fontshare.com; img-src 'self' data: https:; connect-src 'self' https://integrate.api.nvidia.com https://api.binance.com wss://stream.binance.com:9443 wss://fstream.binance.com https://api.web3forms.com https://min-api.cryptocompare.com;",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function withSecurityHeaders<T extends NextResponse>(response: T): T {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Whether this path has both an HTML and a Markdown representation to choose between.
 *
 * Anything with a file extension is excluded, which covers robots.txt, sitemap.xml,
 * llms.txt and every static asset — those have exactly one representation and must
 * never be answered with 406.
 */
export function isNegotiablePath(pathname: string): boolean {
  if (pathname.startsWith('/api/')) return false;
  if (pathname.startsWith('/_next/') || pathname.startsWith('/_vercel/')) return false;
  if (pathname === '/opengraph-image') return false;
  if (/\.[A-Za-z0-9]+$/.test(pathname)) return false;
  return true;
}

function textResponse(
  body: string,
  init: { status: number; contentType: string; method: string; canonical?: string }
): NextResponse {
  const headers = new Headers({
    'Content-Type': init.contentType,
    Vary: VARY,
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'Content-Length': String(new TextEncoder().encode(body).byteLength),
  });

  if (init.canonical) {
    headers.set('Link', `<${init.canonical}>; rel="canonical"`);
  }

  // HEAD must carry the same headers as GET with no body.
  return new NextResponse(init.method === 'HEAD' ? null : body, {
    status: init.status,
    headers,
  });
}

/**
 * Answer a request that wants something other than HTML, or `null` to let the request
 * continue to the app.
 */
function negotiate(request: NextRequest, pathname: string): NextResponse | null {
  const method = request.method.toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') return null;

  const chosen = selectMediaType(request.headers.get('accept'), OFFERS);

  // RFC 9110 §15.5.7: the client accepts none of the representations we can produce.
  if (chosen === null) {
    return textResponse(
      [
        `406 Not Acceptable: ${absoluteUrl(pathname)} can be served as text/html or text/markdown.`,
        '',
        'Send one of:',
        '  Accept: text/html',
        '  Accept: text/markdown',
        '',
        `Index of every page: ${absoluteUrl('/llms.txt')}`,
        '',
      ].join('\n'),
      { status: 406, contentType: 'text/plain; charset=utf-8', method }
    );
  }

  if (!MARKDOWN_TYPES.has(chosen)) return null; // HTML wins — hand off to the app.

  const contentType = chosen === 'text/plain' ? 'text/plain; charset=utf-8' : `${chosen}; charset=utf-8`;
  const doc = resolveAgentDoc(pathname);

  if (doc) {
    return textResponse(doc.body, {
      status: 200,
      contentType,
      method,
      canonical: absoluteUrl(doc.path),
    });
  }

  // A real route with no Markdown twin still renders HTML; only genuinely missing
  // paths get the Markdown 404.
  if (isKnownRoute(pathname)) return null;

  return textResponse(notFoundMarkdown(pathname), {
    status: 404,
    contentType,
    method,
  });
}

export function proxy(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
  const pathname = normalisePath(request.nextUrl.pathname);

  // 1. API RATE LIMITING (Targeting Chat API)
  if (pathname.startsWith('/api/chat')) {
    if (isRateLimited(ip)) {
      return withSecurityHeaders(
        new NextResponse(
          JSON.stringify({ error: 'Too many requests. Please take a breath and try again in a minute.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        )
      );
    }
  }

  // 2. MARKDOWN CONTENT NEGOTIATION
  const negotiable = isNegotiablePath(pathname);
  if (negotiable) {
    const negotiated = negotiate(request, pathname);
    if (negotiated) return withSecurityHeaders(negotiated);
  }

  // 3. GLOBAL SECURITY HEADERS (OWASP Best Practices)
  const response = NextResponse.next();

  if (negotiable) {
    // The HTML variant must advertise that it varies by Accept too, or a CDN can
    // serve this cached HTML to an agent that asked for Markdown. See VARY: on
    // App Router pages this value is superseded by next.config.ts `headers()`.
    response.headers.set('Vary', VARY);
    if (resolveAgentDoc(pathname)) {
      response.headers.set(
        'Link',
        `<${absoluteUrl(pathname)}>; rel="alternate"; type="text/markdown"`
      );
    }
  }

  return withSecurityHeaders(response);
}

// Ensure middleware runs for API and standard pages
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (if you add auth later)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
