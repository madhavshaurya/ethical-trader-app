## 2026-03-31 - Input Validation and Bounds on API Symbol Query Proxy Routes
**Vulnerability:** Unbounded array inputs and missing symbol character validation on `/api/indices` allowed potential Denial of Service (DoS) via resource exhaustion (unbounded concurrent outbound HTTP requests to Yahoo Finance) and unsanitized parameters.
**Learning:** Next.js route handlers proxying external finance APIs (Yahoo, Binance) need strict validation on both parameter string length, item count, and ticker format regex.
**Prevention:** Always enforce `VALID_SYMBOL_REGEX`, maximum symbol count (e.g. max 20), and max raw length (e.g. 500 chars) before making upstream fetch calls in proxy routes.
