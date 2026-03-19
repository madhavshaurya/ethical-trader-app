import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

export function proxy(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
  const response = NextResponse.next();

  // 1. GLOBAL SECURITY HEADERS (OWASP Best Practices)
  const securityHeaders = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com; font-src 'self' https://fonts.gstatic.com https://api.fontshare.com; img-src 'self' data: https:; connect-src 'self' https://integrate.api.nvidia.com https://api.binance.com wss://stream.binance.com:9443;",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // 2. API RATE LIMITING (Targeting Chat API)
  if (request.nextUrl.pathname.startsWith('/api/chat')) {
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please take a breath and try again in a minute.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return response;
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
