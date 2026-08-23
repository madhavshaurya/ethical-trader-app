import type { Metadata } from 'next';
import Link from 'next/link';
import { AGENT_DOCS } from '@/lib/agent-docs';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    'That page does not exist on The Ethical Trader. Links to the sitemap, the agent index and every published page.',
  robots: { index: false, follow: true },
  alternates: { canonical: undefined },
};

/** Machine-readable entry points, listed so an agent can recover without guessing. */
const MACHINE_FILES = [
  { href: '/llms.txt', label: 'llms.txt', note: 'index of every page, with when-to-use guidance' },
  { href: '/llms-full.txt', label: 'llms-full.txt', note: 'the whole site as one Markdown document' },
  { href: '/sitemap.xml', label: 'sitemap.xml', note: 'every indexable URL' },
  { href: '/robots.txt', label: 'robots.txt', note: 'crawl rules' },
];

/**
 * 404 page.
 *
 * Next returns a real 404 status for unmatched paths; this replaces the default body
 * with something recoverable — the full page list and the machine-readable entry
 * points — because a 404 is often the first response an agent sees from the site.
 * The same URL returns a short Markdown 404 when the request sends
 * `Accept: text/markdown`.
 */
export default function NotFound() {
  return (
    <main className="pt-32 pb-20 px-6 lg:px-16 min-h-screen bg-void relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[820px] mx-auto relative z-10">
        <div className="flex items-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-6 before:content-[''] before:block before:w-10 before:h-[1px] before:bg-amber">
          404 · Not Found
        </div>

        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.1] text-ivory mb-8">
          That page <em className="italic text-gold-mid">does not exist</em>
        </h1>

        <p className="text-parchment leading-[1.8] text-[1.05rem] mb-14 max-w-[62ch]">
          Nothing was moved — this path was never published. Everything the site does publish
          is listed below.
        </p>

        <section className="mb-14">
          <h2 className="font-serif text-[1.5rem] font-light text-ivory mb-6">Every page</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {AGENT_DOCS.map((doc) => (
              <li key={doc.path} className="text-[0.9rem]">
                <Link
                  href={doc.path}
                  className="text-parchment hover:text-gold-light transition-colors"
                >
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14 border-t border-border-subtle pt-10">
          <h2 className="font-serif text-[1.5rem] font-light text-ivory mb-6">
            Machine-readable entry points
          </h2>
          <ul className="space-y-3">
            {MACHINE_FILES.map((file) => (
              <li key={file.href} className="text-[0.9rem] text-stone">
                <a href={file.href} className="text-gold hover:underline decoration-gold/30 underline-offset-4">
                  {file.label}
                </a>
                {' — '}
                {file.note}
              </li>
            ))}
          </ul>
          <p className="text-stone text-[0.85rem] leading-[1.8] mt-6 max-w-[62ch]">
            Every page above also returns Markdown from the same URL when the request sends{' '}
            <code className="font-mono text-[0.8rem] text-gold-light">Accept: text/markdown</code>.
          </p>
        </section>

        <section className="border-t border-border-subtle pt-10">
          <h2 className="font-serif text-[1.5rem] font-light text-ivory mb-6">Still stuck?</h2>
          <p className="text-parchment text-[0.9rem] leading-[1.8]">
            Email {SITE_CONFIG.links.supportEmail} or ask on our{' '}
            <a
              href={SITE_CONFIG.links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline decoration-gold/30 underline-offset-4"
            >
              Telegram channel
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
