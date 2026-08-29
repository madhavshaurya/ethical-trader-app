## 2025-05-14 - Canvas Animation Optimization via Offscreen Path/Batching
**Learning:** React canvas animation components (like Starfield) re-rendering/re-calculating path operations inside 60fps frame callbacks without object reuse or optimized stroke calls can cause unnecessary GC pressure and CPU cycles. Pre-calculating or avoiding redundant string allocations inside RAF loops measurably reduces frame time variance.
**Action:** When working with canvas animations, avoid string concatenation (like strokeStyle template literals) inside loops if possible, and reuse geometry/path objects.

## 2026-08-26 - Memoize static LLM documentation builders
**Learning:** Functions that generate static text/markdown indexes from static constants (`LESSONS`, `posts`, `MARKETS`) should be memoized at module loading time rather than computed dynamically on every route request.
**Action:** When building static documents or text feeds for AI agents (`/llms.txt`, `/llms-full.txt`), cache the output in top-level module constants.
