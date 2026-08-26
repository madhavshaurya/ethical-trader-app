## 2026-08-26 - Memoize static LLM documentation builders
**Learning:** Functions that generate static text/markdown indexes from static constants (`LESSONS`, `posts`, `MARKETS`) should be memoized at module loading time rather than computed dynamically on every route request.
**Action:** When building static documents or text feeds for AI agents (`/llms.txt`, `/llms-full.txt`), cache the output in top-level module constants.
