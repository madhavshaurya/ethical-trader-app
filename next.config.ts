import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        /**
         * Vary: Accept on the negotiable page routes.
         *
         * The same URL serves HTML or Markdown depending on Accept, so without this a
         * CDN can hand an agent asking for Markdown whichever variant landed in the
         * cache first (acceptmarkdown.com requires it).
         *
         * It has to be set here rather than only in the proxy. Next's App Router page
         * handler ends with an unconditional
         * `res.setHeader('Vary', getVaryHeader(...))`
         * (next/dist/build/templates/app-page.js), which replaces whatever the proxy
         * or this config set on the rendered HTML response. `headers()` is compiled
         * into the deployment's routing config and applied by the edge *after* the
         * function returns, so it is the layer that survives — and it is also the
         * layer doing the caching this header exists to protect. Markdown responses
         * are returned by the proxy directly and never reach that overwrite, so they
         * carry the header either way.
         *
         * The Next router tokens are repeated because this replaces rather than
         * extends Next's value. Assets, API routes and framework internals are
         * excluded: they have a single representation and would only lose cache hits.
         */
        source: '/((?!_next/|api/|.*\\.[A-Za-z0-9]+$).*)',
        headers: [
          {
            key: 'Vary',
            value:
              'Accept, Accept-Encoding, RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com; font-src 'self' https://fonts.gstatic.com https://api.fontshare.com; img-src 'self' data: https:; connect-src 'self' https://integrate.api.nvidia.com https://api.binance.com wss://stream.binance.com:9443 wss://fstream.binance.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
