import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        /**
         * Vary: Accept on the negotiable page routes.
         *
         * The same URL serves HTML or Markdown depending on Accept, which is what
         * acceptmarkdown.com asks this header to advertise.
         *
         * Known limit, measured against production: rendered App Router pages ignore
         * this. Next's page handler ends with an unconditional
         * `res.setHeader('Vary', getVaryHeader(...))`
         * (next/dist/build/templates/app-page.js) which replaces whatever the proxy
         * or this config set, and `headers()` is applied in the routing phase
         * *before* the function runs, so it cannot win. `/`, `/about` and friends
         * therefore still emit only Next's RSC tokens. This entry is kept because it
         * does apply to responses Next does not overwrite — the HTML 404 carries
         * `Vary: Accept` in production — and it costs nothing where it does not.
         *
         * That limit is not a correctness problem here. The proxy runs ahead of the
         * CDN cache lookup, so a Markdown request is answered by the proxy and never
         * reads the cached HTML variant: with `/about` sitting at
         * `x-vercel-cache: HIT`, `Accept: text/markdown` still returns Markdown, and
         * those responses carry no `x-vercel-cache` at all. Cross-serving cannot
         * occur, and Markdown responses carry `Vary: Accept` from the proxy.
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
