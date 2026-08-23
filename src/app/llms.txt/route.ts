import { buildLlmsTxt } from '@/lib/llms-txt';

/**
 * /llms.txt — the llmstxt.org index, including when-to-use guidance.
 *
 * Built from the same constants the pages render from rather than hand-maintained, so
 * a price or a managed-account term can never be stale here.
 */
export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      // llmstxt.org files are Markdown. `Vary: Accept` is set for consistency with the
      // negotiated page routes even though this URL only ever has one representation.
      'Content-Type': 'text/markdown; charset=utf-8',
      'Vary': 'Accept, Accept-Encoding',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Robots-Tag': 'index, follow',
    },
  });
}
