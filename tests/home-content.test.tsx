import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Education from '@/components/home/Education';
import EducationModal from '@/components/home/EducationModal';
import IctSmc from '@/components/home/IctSmc';
import { useEducationStore } from '@/lib/educationStore';
import Pricing from '@/components/home/Pricing';
import MarketPage from '@/components/markets/MarketPage';
import NotFound from '@/app/not-found';
import { LESSONS } from '@/lib/education-content';
import { CARDS, TABS } from '@/lib/ict-content';
import { MARKETS, MARKET_SLUGS } from '@/lib/markets-content';
import { PRICING_PLANS } from '@/lib/constants';
import { AGENT_DOCS } from '@/lib/agent-docs';

/**
 * These render the server-side HTML — the same output an AI crawler that does not
 * execute JavaScript sees. Client components still produce their initial markup here.
 */
/** Undo the entity escaping renderToStaticMarkup applies, so comparisons use source text. */
function decode(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

function headings(html: string, level: number): string[] {
  return [...html.matchAll(new RegExp(`<h${level}[^>]*>(.*?)</h${level}>`, 'gs'))].map((m) =>
    decode(m[1].replace(/<[^>]+>/g, '')).trim()
  );
}

function textLength(html: string): number {
  return html
    .replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length;
}

describe('EducationModal component', () => {
  it('renders modal dialog attributes and accessible close button when a lesson is active', () => {
    const modalHtml = renderToStaticMarkup(<EducationModal lessonId="basics" />);
    expect(modalHtml).toContain('role="dialog"');
    expect(modalHtml).toContain('aria-modal="true"');
    expect(modalHtml).toContain('aria-labelledby="education-modal-title"');
    expect(modalHtml).toContain('aria-label="Close modal"');
  });
});

describe('home page sections render meaningful HTML without JavaScript', () => {
  const educationHtml = renderToStaticMarkup(<Education />);
  const ictHtml = renderToStaticMarkup(<IctSmc />);
  const pricingHtml = renderToStaticMarkup(<Pricing />);

  it('gives every section an H2 and its cards an H3, so the hierarchy is not flat', () => {
    expect(headings(educationHtml, 2)).toHaveLength(1);
    expect(headings(ictHtml, 2)).toHaveLength(1);
    expect(headings(pricingHtml, 2)).toHaveLength(1);

    expect(headings(educationHtml, 3).length).toBeGreaterThan(0);
    expect(headings(ictHtml, 3).length).toBeGreaterThan(0);
    expect(headings(pricingHtml, 3).length).toBeGreaterThan(0);
  });

  it('titles every education module as an H3', () => {
    const h3s = headings(educationHtml, 3);
    for (const lesson of Object.values(LESSONS)) expect(h3s).toContain(lesson.title);
  });

  it('titles every pricing plan as an H3', () => {
    const h3s = headings(pricingHtml, 3);
    for (const plan of PRICING_PLANS) expect(h3s).toContain(plan.name);
  });

  it('server-renders all six ICT tab panels, not only the active one', () => {
    const h3s = headings(ictHtml, 3);
    const allConcepts = TABS.flatMap((tab) => CARDS[tab.id]);
    expect(allConcepts.length).toBe(24);

    for (const concept of allConcepts) {
      expect(h3s, `${concept.title} is missing from the server HTML`).toContain(concept.title);
      expect(decode(ictHtml)).toContain(concept.desc.slice(0, 60));
    }
  });

  it('hides the inactive ICT panels rather than dropping them', () => {
    // One visible grid, five display:none panels — the fade-up animation replays when
    // a hidden panel becomes displayed again, so tab switching still animates.
    expect([...ictHtml.matchAll(/class="hidden"/g)]).toHaveLength(TABS.length - 1);
    expect([...ictHtml.matchAll(/animate-\[fade-up_0\.3s_ease_forwards\]/g)]).toHaveLength(1);
  });

  it('produces well past the 500-character floor of raw text', () => {
    expect(textLength(educationHtml + ictHtml + pricingHtml)).toBeGreaterThan(5000);
  });
});

describe('market pages', () => {
  it.each(MARKET_SLUGS)('%s renders one H1 and an H3 per card', (slug) => {
    const html = renderToStaticMarkup(<MarketPage market={MARKETS[slug]} />);
    expect(headings(html, 1)).toHaveLength(1);
    expect(headings(html, 1)[0]).toBe(
      `${MARKETS[slug].headingLead} ${MARKETS[slug].headingEmphasis}`
    );
    expect(headings(html, 3)).toEqual(MARKETS[slug].cards.map((card) => card.title));
    expect(decode(html)).toContain(MARKETS[slug].intro);
    for (const bullet of MARKETS[slug].bullets) expect(decode(html)).toContain(bullet);
  });
});

describe('404 page', () => {
  const html = renderToStaticMarkup(<NotFound />);

  it('has a single H1 and section H2s', () => {
    expect(headings(html, 1)).toHaveLength(1);
    expect(headings(html, 2).length).toBeGreaterThanOrEqual(3);
  });

  it('links to every page so an agent can recover', () => {
    for (const doc of AGENT_DOCS) {
      expect(html, `${doc.path} missing from the 404 page`).toContain(`href="${doc.path}"`);
    }
  });

  it('links to the machine-readable entry points', () => {
    for (const href of ['/llms.txt', '/llms-full.txt', '/sitemap.xml', '/robots.txt']) {
      expect(html).toContain(`href="${href}"`);
    }
  });

  it('tells agents the same URL serves Markdown', () => {
    expect(html).toContain('Accept: text/markdown');
  });
});
