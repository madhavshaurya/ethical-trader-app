import { describe, expect, it } from 'vitest';
import {
  AGENT_DOCS,
  AGENT_DOC_PATHS,
  TERMS_BODY_IDS,
  isKnownRoute,
  lessonBodyToMarkdown,
  liveTerminalDoc,
  normalisePath,
  notFoundMarkdown,
  resolveAgentDoc,
  sanitisePathSegment,
} from '@/lib/agent-docs';
import sitemap from '@/app/sitemap';
import { SITE_URL, absoluteUrl } from '@/lib/site';
import { ACCOUNT_MANAGEMENT, PRICING_PLANS, perDayUsd, SITE_CONFIG } from '@/lib/constants';
import { posts } from '@/lib/blog-data';
import { TERMS_SECTIONS, PRIVACY_SECTIONS } from '@/lib/legal-content';
import { MARKETS, MARKET_SLUGS } from '@/lib/markets-content';
import { LESSONS } from '@/lib/education-content';
import { CARDS, TABS } from '@/lib/ict-content';

/** Paths in the sitemap, made relative for comparison against the doc registry. */
const sitemapPaths = sitemap().map((entry) => entry.url.replace(SITE_URL, '') || '/');

describe('document registry', () => {
  it('covers every route in the sitemap', () => {
    const missing = sitemapPaths.filter((path) => !AGENT_DOC_PATHS.includes(path));
    expect(missing).toEqual([]);
  });

  it('does not document routes that are not in the sitemap', () => {
    const extra = AGENT_DOC_PATHS.filter((path) => !sitemapPaths.includes(path));
    expect(extra).toEqual([]);
  });

  it('has no duplicate paths', () => {
    expect(new Set(AGENT_DOC_PATHS).size).toBe(AGENT_DOC_PATHS.length);
  });

  it.each(AGENT_DOCS.map((doc) => [doc.path, doc] as const))(
    '%s is a well-formed Markdown document',
    (path, doc) => {
      const lines = doc.body.split('\n');

      expect(lines[0]).toBe(`# ${doc.title}`);
      expect(lines[2]).toBe(`> ${doc.description}`);
      expect(doc.body.length).toBeGreaterThan(500);
      expect(doc.body).toContain(`Canonical HTML: ${absoluteUrl(path)}`);
      expect(doc.body).toContain('/llms.txt');
      expect(doc.body).toContain('/sitemap.xml');
      // Exactly one H1 — anything else is a broken heading hierarchy for a reader
      // that only sees the Markdown.
      expect(lines.filter((line) => /^# /.test(line))).toHaveLength(1);
      // No empty headings and no unresolved template placeholders.
      expect(doc.body).not.toMatch(/^#{1,6}\s*$/m);
      expect(doc.body).not.toContain('undefined');
      expect(doc.body).not.toContain('[object Object]');
    }
  );

  it('links only to routes that exist', () => {
    const linked = new Set<string>();
    for (const doc of AGENT_DOCS) {
      for (const match of doc.body.matchAll(/\]\((https:\/\/[^)]+)\)/g)) {
        if (match[1].startsWith(SITE_URL)) linked.add(match[1].replace(SITE_URL, '') || '/');
      }
    }
    const broken = [...linked].filter((path) => !isKnownRoute(path));
    expect(broken).toEqual([]);
  });
});

describe('facts stay in sync with their source of truth', () => {
  const home = AGENT_DOCS.find((doc) => doc.path === '/')!;
  const account = AGENT_DOCS.find((doc) => doc.path === '/account-management')!;

  it('quotes current membership prices on the home page document', () => {
    for (const plan of PRICING_PLANS) {
      expect(home.body).toContain(plan.name);
      expect(home.body).toContain(`$${plan.priceUsd}`);
      expect(home.body).toContain(`$${perDayUsd(plan.priceUsd)}`);
      for (const feature of plan.features) expect(home.body).toContain(feature);
    }
  });

  it('quotes current managed-account terms', () => {
    expect(account.body).toContain(ACCOUNT_MANAGEMENT.minCapital);
    expect(account.body).toContain(ACCOUNT_MANAGEMENT.riskOnCapital);
    expect(account.body).toContain(ACCOUNT_MANAGEMENT.profitSplit.label);
    expect(account.body).toContain(ACCOUNT_MANAGEMENT.indicativeReturns);
    for (const market of ACCOUNT_MANAGEMENT.markets) expect(account.body).toContain(market);
  });

  it('carries the required disclosure wherever money or returns are discussed', () => {
    expect(account.body).toContain(ACCOUNT_MANAGEMENT.disclaimer);
    expect(home.body).toContain(ACCOUNT_MANAGEMENT.disclaimer);
  });

  it('lists every education module and every ICT concept on the home page document', () => {
    for (const lesson of Object.values(LESSONS)) expect(home.body).toContain(lesson.title);
    for (const tab of TABS) {
      expect(home.body).toContain(`### ${tab.label}`);
      for (const card of CARDS[tab.id]) expect(home.body).toContain(card.title);
    }
  });

  it('publishes the support email and Telegram link', () => {
    const contact = AGENT_DOCS.find((doc) => doc.path === '/contact')!;
    expect(contact.body).toContain(SITE_CONFIG.links.supportEmail);
    expect(contact.body).toContain(SITE_CONFIG.links.telegram);
  });

  it('has a Terms section body for every section on the Terms page, and no orphans', () => {
    expect([...TERMS_BODY_IDS].sort()).toEqual(TERMS_SECTIONS.map((s) => s.id).sort());
    const terms = AGENT_DOCS.find((doc) => doc.path === '/terms')!;
    for (const section of TERMS_SECTIONS) {
      expect(terms.body).toContain(`## ${section.n}. ${section.title}`);
    }
  });

  it('mirrors the Privacy page section for section', () => {
    const privacy = AGENT_DOCS.find((doc) => doc.path === '/privacy')!;
    for (const section of PRIVACY_SECTIONS) {
      expect(privacy.body).toContain(`## ${section.heading}`);
      expect(privacy.body).toContain(section.body);
    }
  });

  it('mirrors each market page', () => {
    for (const slug of MARKET_SLUGS) {
      const doc = AGENT_DOCS.find((d) => d.path === `/markets/${slug}`)!;
      expect(doc.body).toContain(MARKETS[slug].intro);
      for (const bullet of MARKETS[slug].bullets) expect(doc.body).toContain(bullet);
      for (const card of MARKETS[slug].cards) {
        expect(doc.body).toContain(`### ${card.title}`);
        expect(doc.body).toContain(card.body);
      }
    }
  });

  it('reproduces every blog post in full', () => {
    for (const post of posts) {
      const doc = AGENT_DOCS.find((d) => d.path === `/blog/${post.slug}`)!;
      expect(doc.title).toBe(post.title);
      for (const paragraph of post.content) expect(doc.body).toContain(paragraph);
    }
  });
});

describe('route resolution', () => {
  it('normalises trailing slashes', () => {
    expect(normalisePath('/about/')).toBe('/about');
    expect(normalisePath('/')).toBe('/');
    expect(normalisePath('/blog//')).toBe('/blog');
  });

  it('resolves fixed routes with or without a trailing slash', () => {
    expect(resolveAgentDoc('/about')?.path).toBe('/about');
    expect(resolveAgentDoc('/about/')?.path).toBe('/about');
    expect(resolveAgentDoc('/')?.path).toBe('/');
  });

  it('generates a document for any single-segment terminal symbol', () => {
    expect(resolveAgentDoc('/live-terminal/XAUUSD')?.title).toContain('XAUUSD');
    expect(resolveAgentDoc('/live-terminal/')).toBeNull();
    expect(resolveAgentDoc('/live-terminal/a/b')).toBeNull();
  });

  it('returns null for paths the app does not serve', () => {
    expect(resolveAgentDoc('/does-not-exist')).toBeNull();
    expect(isKnownRoute('/does-not-exist')).toBe(false);
    expect(isKnownRoute('/some-path-that-does-not-exist')).toBe(false);
  });

  it('treats non-negotiable published files as known routes', () => {
    for (const path of ['/robots.txt', '/sitemap.xml', '/llms.txt', '/llms-full.txt', '/opengraph-image']) {
      expect(isKnownRoute(path)).toBe(true);
    }
  });
});

describe('404 body', () => {
  it('names the missing path and points at recovery entry points', () => {
    const body = notFoundMarkdown('/some-path-that-does-not-exist');
    expect(body).toMatch(/^# 404 — Not Found$/m);
    expect(body).toContain('/some-path-that-does-not-exist');
    expect(body).toContain(`${SITE_URL}/sitemap.xml`);
    expect(body).toContain(`${SITE_URL}/llms.txt`);
    expect(body).toContain(`${SITE_URL}/robots.txt`);
    for (const doc of AGENT_DOCS) expect(body).toContain(`](${absoluteUrl(doc.path)})`);
  });

  it('stays short enough to be cheap for an agent to read', () => {
    expect(notFoundMarkdown('/nope').length).toBeLessThan(4000);
  });

  it('strips anything that could be markup or a control character from the echoed path', () => {
    expect(sanitisePathSegment('/<script>alert(1)</script>')).toBe('/scriptalert1/script');
    expect(sanitisePathSegment('/%3Cimg%20onerror%3Dx%3E')).toBe('/imgonerrorx');
    expect(sanitisePathSegment('/a\nb')).toBe('/ab');
    expect(sanitisePathSegment(`/${'x'.repeat(500)}`).length).toBe(96);
    expect(notFoundMarkdown('/<b>x</b>')).not.toContain('<b>');
  });

  it('survives malformed percent-encoding', () => {
    expect(() => notFoundMarkdown('/%')).not.toThrow();
    expect(sanitisePathSegment('/%')).toBe('/');
  });
});

describe('live terminal document', () => {
  it('explains that the page is an interactive tool with no static content', () => {
    const doc = liveTerminalDoc('BTCUSDT');
    expect(doc.body).toContain('BTCUSDT');
    expect(doc.body).toContain('noindex');
    expect(doc.body).toContain(ACCOUNT_MANAGEMENT.disclaimer);
  });

  it('sanitises the symbol before echoing it', () => {
    expect(liveTerminalDoc('<script>').body).not.toContain('<script>');
  });
});

describe('lessonBodyToMarkdown', () => {
  it('converts the lesson HTML vocabulary and leaves no tags behind', () => {
    const markdown = lessonBodyToMarkdown(
      '<h2>Title</h2><p>Body &amp; more</p><ul><li>One</li><li>Two</li></ul><div class="lesson-hl">Quote</div>'
    );
    expect(markdown).toContain('### Title');
    expect(markdown).toContain('Body & more');
    expect(markdown).toContain('- One');
    expect(markdown).toContain('- Two');
    expect(markdown).toContain('> Quote');
    expect(markdown).not.toMatch(/<[^>]+>/);
  });

  it('leaves no HTML tags in any real lesson body', () => {
    for (const lesson of Object.values(LESSONS)) {
      expect(lessonBodyToMarkdown(lesson.body)).not.toMatch(/<[^>]+>/);
    }
  });
});
