import { buildLlmsFullTxt } from '@/lib/llms-txt';

/** /llms-full.txt — every page plus the full curriculum as one Markdown document. */
export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Vary': 'Accept, Accept-Encoding',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Robots-Tag': 'index, follow',
    },
  });
}
