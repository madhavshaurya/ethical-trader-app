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
*   **Order Flow & Delta:** Visualizing aggressive buyer/seller volume and hidden divergences.
*   **Depth of Market (DOM):** Reading the bid/ask walls of the actual institutional order book.

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
