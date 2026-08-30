## 2026-03-30 - Input Validation & Symbol Limits for External Proxy Endpoints

**Vulnerability:**
API routes that query external financial providers (e.g. Yahoo Finance) used `Promise.all` over unvalidated symbol arrays from request parameters without checking array length or character patterns. This allowed potential Resource Exhaustion / Server-Side DoS via thousands of concurrent outbound HTTP requests.

**Learning:**
Any API route proxying user-supplied symbol parameters to downstream external providers must enforce strict maximum quantity limits (`MAX_SYMBOLS`) in addition to regex validation for symbol strings.

**Prevention:**
Enforce maximum parameter count limits (e.g. `MAX_SYMBOLS = 20`) and whitelist regex patterns (`/^[a-zA-Z0-9:^.\-=]{1,30}$/`) on all proxy endpoint inputs before executing batch fetching logic.
