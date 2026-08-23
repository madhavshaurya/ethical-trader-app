import { describe, expect, it } from 'vitest';
import { buildLlmsFullTxt, buildLlmsTxt } from '@/lib/llms-txt';
import { AGENT_DOCS, isKnownRoute } from '@/lib/agent-docs';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';
import { ACCOUNT_MANAGEMENT, PRICING_PLANS, SITE_CONFIG } from '@/lib/constants';
import { LESSONS } from '@/lib/education-content';
import { posts } from '@/lib/blog-data';
import { MARKETS, MARKET_SLUGS } from '@/lib/markets-content';

const llms = buildLlmsTxt();
const lines = llms.split('\n');

describe('llms.txt follows the llmstxt.org format', () => {
  it('opens with a single H1 naming the site', () => {
    expect(lines[0]).toBe(`# ${SITE_NAME}`);
    expect(lines.filter((line) => /^# /.test(line))).toHaveLength(1);
  });

  it('follows the H1 with a blockquote summary', () => {
    const firstContent = lines.slice(1).find((line) => line.trim() !== '');
    expect(firstContent?.startsWith('> ')).toBe(true);
  });

  it('puts free-form detail before the first H2 and uses no headings inside it', () => {
    const firstH2 = lines.findIndex((line) => line.startsWith('## '));
    expect(firstH2).toBeGreaterThan(2);
    const detail = lines.slice(2, firstH2);
    expect(detail.some((line) => line.trim() !== '' && !line.startsWith('>'))).toBe(true);
    expect(detail.filter((line) => /^#{1,6} /.test(line))).toEqual([]);
  });

  it('makes every H2 section a list of links with notes', () => {
    const sections = new Map<string, string[]>();
    let current: string | null = null;
    for (const line of lines) {
      if (line.startsWith('## ')) {
        current = line.slice(3);
        sections.set(current, []);
      } else if (line.startsWith('---')) {
        current = null;
      } else if (current && line.trim() !== '') {
        sections.get(current)!.push(line);
      }
    }

    expect(sections.size).toBeGreaterThan(0);
    for (const [heading, body] of sections) {
      expect(body.length, `section "${heading}" is empty`).toBeGreaterThan(0);
      for (const entry of body) {
        expect(entry, `section "${heading}" has a non-link entry`).toMatch(
          /^- \[[^\]]+\]\(https:\/\/[^)]+\): .+$/
        );
      }
    }
  });

  it('links only to URLs the site actually serves, absolutely', () => {
    const urls = [...llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThan(10);
    for (const url of urls) {
      expect(url.startsWith(SITE_URL), `${url} is not absolute against the canonical origin`).toBe(true);
      expect(isKnownRoute(url.replace(SITE_URL, '') || '/'), `${url} is not a real route`).toBe(true);
    }
  });
});

describe('llms.txt carries when-to-use guidance', () => {
  it('has an explicit when-to-use section', () => {
    expect(llms).toContain('## When to use this site');
  });

  it('names concrete jobs rather than marketing copy', () => {
    const section = llms.split('## When to use this site')[1].split('\n## ')[0];
    // Every entry says what question it answers, not just what the page is called.
    for (const entry of section.split('\n').filter((line) => line.startsWith('- '))) {
      expect(entry).toMatch(/use (for|to)\b/);
    }
    expect(section).toContain(ACCOUNT_MANAGEMENT.minCapital);
    expect(section).toContain(ACCOUNT_MANAGEMENT.riskOnCapital);
    expect(section).toContain(ACCOUNT_MANAGEMENT.profitSplit.label);
  });

  it('says what the site is not a fit for', () => {
    expect(llms).toContain('Not a fit for:');
    expect(llms).toContain('no public market-data API');
  });

  it('explains how an agent should call the site', () => {
    expect(llms).toContain('Accept: text/markdown');
    expect(llms).toContain('Vary: Accept');
    expect(llms).toContain('406');
    expect(llms).toContain(absoluteUrl('/llms-full.txt'));
  });

  it('routes a human question to a real channel', () => {
    expect(llms).toContain(SITE_CONFIG.links.supportEmail);
    expect(llms).toContain(SITE_CONFIG.links.telegram);
  });

  it('states the required regulatory disclosure', () => {
    expect(llms).toContain(ACCOUNT_MANAGEMENT.disclaimer);
  });

  it('quotes the live price range', () => {
    const min = Math.min(...PRICING_PLANS.map((p) => p.priceUsd));
    const max = Math.max(...PRICING_PLANS.map((p) => p.priceUsd));
    expect(llms).toContain(`$${min}–$${max}/month`);
  });

  it('lists every market page and every blog post', () => {
    for (const slug of MARKET_SLUGS) {
      expect(llms).toContain(absoluteUrl(`/markets/${slug}`));
      expect(llms).toContain(`${MARKETS[slug].headingLead} ${MARKETS[slug].headingEmphasis}`);
    }
    for (const post of posts) expect(llms).toContain(absoluteUrl(`/blog/${post.slug}`));
  });
});

describe('llms-full.txt', () => {
  const full = buildLlmsFullTxt();

  it('contains every page document', () => {
    for (const doc of AGENT_DOCS) {
      expect(full, `${doc.path} missing from llms-full.txt`).toContain(doc.body.trim());
    }
  });

  it('adds the full curriculum that the HTML keeps behind a modal', () => {
    for (const lesson of Object.values(LESSONS)) {
      expect(full).toContain(`## ${lesson.title}`);
      expect(full).toContain(lesson.desc);
    }
    // The lesson bodies are converted, so a distinctive line of lesson prose must survive.
    expect(full).toContain('The OTE zone is between 61.8% and 79% retracement');
    expect(full).not.toMatch(/<(h2|p|ul|li|div)[ >]/);
  });

  it('points back at the index', () => {
    expect(full).toContain(absoluteUrl('/llms.txt'));
  });
});
