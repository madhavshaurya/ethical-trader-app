# TheEthicalTrader

Trading education and market intelligence for ICT, Smart Money Concepts and order flow —
with a live charting terminal, a deterministic signal engine, and a published-terms
managed-account service.

**Live:** [theethicaltrader.in](https://theethicaltrader.in) · **For agents:**
[`/llms.txt`](https://theethicaltrader.in/llms.txt)

> The platform is built on transparency: every commercial term, every data source, and the
> fact that the business holds no SEBI registration is published before anyone is asked for
> money. That principle extends to the code — no fabricated metrics, no invented accuracy
> figures, no `Math.random()` standing in for market data.

---

## Stack

| Layer | Choice |
| :--- | :--- |
| Framework | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript |
| Styling | Tailwind CSS v4 · Cormorant Garamond / Cabinet Grotesk / Fira Code |
| Charts | `lightweight-charts` v5 |
| Indicators | `trading-signals` (MIT, zero runtime deps) |
| State | `zustand` |
| AI assistant | NVIDIA NIM — `nvidia/llama-3.3-nemotron-super-49b-v1` |
| Market data | Binance spot + futures, Yahoo Finance fallback, TradingView scanner |
| Forms | Web3Forms |
| Analytics | `@vercel/analytics` · `@vercel/speed-insights` |
| Tests | Vitest |
| Hosting | Vercel |

Requires **Node ≥ 20.9**.

---

## Quick start

```bash
git clone git@github.com:madhavshaurya/ethical-trader-app.git
cd ethical-trader-app
npm install
cp .env.example .env.local         # then fill in the keys below
npm run dev
```

### Environment variables

| Key | Required | Purpose |
| :--- | :--- | :--- |
| `NVIDIA_API_KEY` | yes | Server-side calls to NVIDIA NIM for the AI assistant |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | yes | Contact-form submissions |
| `NEXT_PUBLIC_SITE_URL` | no | Overrides the canonical origin (staging domains). Defaults to `https://theethicaltrader.in` |

Market data needs no credentials — Binance, Yahoo Finance and the TradingView scanner are
all called unauthenticated.

### Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm start        # serve the production build
npm test         # vitest run
npm run lint     # eslint
```

`./verify-ticker.sh [port]` cross-checks the ticker's numbers against independently derived
ground truth — it deliberately avoids Yahoo's `meta.chartPreviousClose`, which is the close
before the requested range rather than the previous session.

---

## Layout

```
src/
├─ app/
│  ├─ page.tsx                    home: hero, education, terminal, ICT/SMC, pricing
│  ├─ not-found.tsx               404 with the full page list and agent entry points
│  ├─ about|contact|terms|privacy
│  ├─ account-management/         managed-account mandate, every term published
│  ├─ markets/{forex,indices,commodities,crypto}
│  ├─ blog/[slug]/
│  ├─ live-terminal/[symbol]/     charting + screener + watchlist (noindex)
│  ├─ llms.txt/ · llms-full.txt/  agent index and full-text dump
│  ├─ robots.ts · sitemap.ts · opengraph-image.tsx
│  └─ api/                        chat · signal · klines · spot · xau · indices ·
│                                 yahoo-klines · screener
├─ components/{home,layout,markets,trading,contact,ui}/
├─ lib/                           content + logic, no JSX
└─ proxy.ts                       security headers, rate limiting, content negotiation
```

**`lib/` is the source of truth.** Pricing, managed-account terms, the curriculum, the ICT
concept library, market-page copy and the legal section lists all live there, and both the
rendered pages and the Markdown served to agents read from the same constants. A price
cannot drift between the page, the chatbot's knowledge base and `llms.txt`, and tests fail
if it tries.

---

## Agent & crawler interface

The site is built to be read by AI agents, not only by browsers.

| Endpoint | What it serves |
| :--- | :--- |
| `/llms.txt` | [llmstxt.org](https://llmstxt.org) index of every page, with an explicit *when to use this site* section |
| `/llms-full.txt` | The whole site plus the full education curriculum as one Markdown document |
| `/sitemap.xml` | Every indexable URL |
| `/robots.txt` | Crawl rules — `/api/*` is disallowed |

**Markdown content negotiation** ([acceptmarkdown.com](https://acceptmarkdown.com)): every
page route serves Markdown from its own URL when the request carries
`Accept: text/markdown`, and HTML otherwise.

```bash
curl -H "Accept: text/markdown" https://theethicaltrader.in/account-management
curl -sI -H "Accept: text/markdown" https://theethicaltrader.in/   # text/markdown; charset=utf-8
curl -s -o /dev/null -w "%{http_code}" https://theethicaltrader.in/no-such-page   # 404
```

Accept parsing follows RFC 9110 §12.5.1 in full: a more specific media range beats a higher
q-value, `q=0` is an explicit rejection, and server preference breaks ties so a bare `*/*`
gets HTML. A client that accepts none of the available representations gets `406`. Markdown
responses carry `Vary: Accept`; negotiation runs in the proxy, ahead of the CDN cache
lookup, so a cached HTML variant is never handed to a client that asked for Markdown.

Dead URLs return a real `404` whose body — HTML or Markdown, depending on `Accept` — lists
every published page and the machine-readable entry points, so an agent that lands on one
can recover without guessing.

---

## The signal engine

`/api/signal` applies published technical indicators (EMA trend, RSI, MACD, ADX, Bollinger
position) from `trading-signals` to live candles and reports **how many independent
indicators currently agree on direction**, returning every component so the number can be
audited.

It is deterministic technical analysis, not machine learning, and it deliberately emits **no
confidence percentage** — there is no model behind it that could justify one. A signal is
not a recommendation to trade.

---

## Security

Enforced in [`src/proxy.ts`](src/proxy.ts) on every matched request:

- **CSP** with an explicit allowlist — Binance REST and WebSocket, NVIDIA NIM,
  Web3Forms, Google Fonts and Fontshare — and `default-src 'self'` for everything else.
- **HSTS** with `includeSubDomains; preload`, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  and a `Permissions-Policy` denying camera, microphone and geolocation.
- **Rate limiting** on `/api/chat` — a rolling window of 10 requests per minute per IP.
  The counter is an in-memory `Map`, so it is per-instance; a distributed deployment that
  needs a hard guarantee should move it to Redis.
- **Request validation** — chat payloads are parsed with `zod` before reaching NIM.

---

## Tests

```bash
npm test
```

Vitest covers Accept-header parsing and q-value precedence, every proxy response path
(Markdown, HTML, `406`, `404`, `HEAD`, rate limiting), the Markdown document registry and
its drift guards against `lib/constants`, `lib/blog-data` and the legal content, the
`llms.txt` format, the Organization JSON-LD, and the server-rendered heading structure of
the home page.

The drift guards are the point: they fail if a Terms section exists on the page but not in
the Markdown, if a pricing plan changes without the agent-facing copy following, or if a
route is added to the sitemap without a Markdown representation.

---

## Deployment

Deployed on Vercel. Feature work lands on `develop`; `develop` → `main` opens the release
PR. Set the environment variables above in the Vercel project before the first deploy.

---

## Risk disclosure

**We are not SEBI Registered. Market risks apply and we do not take any responsibility for
your loss.**

Nothing in this repository or on the site is investment advice, a recommendation to buy or
sell any security, or a solicitation to invest. Trading and investing carry a substantial
risk of loss, including the loss of your entire capital. Past performance is not indicative
of future results. See [Terms of Service](https://theethicaltrader.in/terms).

© 2026 TheEthicalTrader. All rights reserved.
