# TheEthicalTrader — Master the Markets

An institutional-grade trading platform designed for the disciplined elite. **TheEthicalTrader** combines real-time market data, AI-driven trade intelligence, and high-fidelity ICT/SMC education into a single, seamless, obsidian-gold UX.

## The Philosophy
TheEthicalTrader is built on the foundation of **Transparency** and **Integrity**. We provide the tools to see the footprints of Smart Money, decode institutional order flow, and execute trades with mechanical precision. No noise, no hype—just pure market mechanics.

---

## Core Technologies
*   **Next.js 16 (App Router):** The cutting-edge React framework for institutional speed and SEO authority.
*   **AI Signal Engine (NVIDIA NIM):** Powered by custom-trained llama-3.1-70b/405b models for deep ICT context and real-time trade analysis.
*   **Market Data (Binance & CryptoCompare):** Real-time tick and kline streams via low-latency WebSockets.
*   **Security (Cloud Proxy Middleware):** Custom OWASP-hardened CSP (Content Security Policy) and Edge-based Rate Limiting.
*   **Institutional UI:** Obsidian black gradients and gold-brushed typography using **Fontshare** professional typefaces.

---

## Marketplace Features

### 1. The Terminal
*   **Lightweight Charts:** Zero-lag institutional charting.
*   **Signal Engine:** Indicator-confluence readings (EMA trend, RSI, MACD, directional movement, Bollinger position) computed server-side on live candles.
*   **Market Screener:** Indian equity, US equity, forex and crypto, sourced from TradingView's scanner.

### 2. ICT/SMC Education Center
*   **The Framework:** A comprehensive library covering Market Structure (MSS/BOS), Order Blocks, FVG Imbalances, and Liquidity Pools (BSL/SSL).
*   **Killzone Strategy:** Time-based trading models for London and New York overlaps.

### 3. AI Trade Assistant 
*   **Real-Time Intelligence:** Ask questions about market structure, specific setups, or risk management formulas.
*   **NVIDIA NIM Guardrails:** Hardened to ensure responses remain strictly within the bounds of trading education and institutional strategy.

---

## Deployment & Configuration

### Environment Variables
To launch **TheEthicalTrader** in production, you must configure these variables in Vercel:

| Key | Purpose |
| :--- | :--- |
| `NVIDIA_API_KEY` | Powers the AI Signal Engine (NIM) |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Authenticates the Contact Portal submissions |

### Launch Protocol
1.  **Clone the Authority:**
    ```bash
    git clone https://github.com/madhavshaurya/ethical-trader-app.git
    cd ethical-trader-app
    ```
2.  **Initialize Engine:**
    ```bash
    npm install
    ```
3.  **Local Execution:**
    ```bash
    npm run dev
    ```

---

## Agent & Crawler Interface

The site is built to be readable by AI agents and crawlers, not just browsers.

| Endpoint | What it serves |
| :--- | :--- |
| `/llms.txt` | [llmstxt.org](https://llmstxt.org) index of every page, with explicit *when to use this site* guidance |
| `/llms-full.txt` | The whole site plus the full education curriculum as one Markdown document |
| `/sitemap.xml` | Every indexable URL |
| `/robots.txt` | Crawl rules (`/api/*` disallowed) |

**Markdown content negotiation** ([acceptmarkdown.com](https://acceptmarkdown.com)): every page route serves
Markdown from its own URL when the request carries `Accept: text/markdown`, and HTML otherwise.
Markdown responses carry `Vary: Accept`, and a request that accepts neither representation is
answered with `406`. Negotiation happens in the proxy, which runs ahead of the CDN cache lookup,
so a cached HTML variant is never handed to a client that asked for Markdown.

```bash
curl -s -H "Accept: text/markdown" https://theethicaltrader.in/account-management
curl -s -o /dev/null -w "%{http_code}" https://theethicaltrader.in/no-such-page   # 404
```

Negotiation lives in `src/proxy.ts`; the Markdown itself is assembled in `src/lib/agent-docs.ts`
from the same constants the pages render from, so an agent can never be quoted a price or a
managed-account term the page does not show.

---

## Tests

```bash
npm test
```

Vitest covers Accept-header negotiation and q-values, every proxy response path (Markdown, HTML,
`406`, `404`, HEAD, rate limiting), the Markdown registry and its drift guards against
`lib/constants`, `lib/blog-data` and the legal content, the llms.txt format, the Organization
JSON-LD, and the server-rendered heading structure of the home page.

---

## Institutional Security
Your platform is protected by an **active middleware proxy** (`src/proxy.ts`):
*   **XSS Protection:** Strict-type blocking and "nosniff" enforcement.
*   **CSP (Content Security Policy):** High-integrity whitelisting for Binance, Nvidia, and Fontshare CDNs.
*   **Rate Limiting:** Protects the `/api/chat` endpoint from brute-force queries using a rolling-window algorithm at the Edge.

---

## Trade with Integrity. Join TheElite.
For partnership inquiries or institutional access, please use the **Contact Portal** on the live site.

© 2026 TheEthicalTrader. All Rights Reserved.
*(Risk Disclosure: Trading involves substantial risk of loss. Past performance is not indicative of future results.)*
