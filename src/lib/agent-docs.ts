/**
 * Markdown representations of every content route, served from the same URL as the
 * HTML when a client sends `Accept: text/markdown` (acceptmarkdown.com).
 *
 * Everything factual here resolves from the same constants the pages render from —
 * pricing, managed-account terms, the curriculum, the ICT concept list, the legal
 * section lists — so the Markdown an agent reads cannot quote different numbers from
 * the page a human reads. Prose that lives in JSX is mirrored here and covered by
 * tests that fail when a section exists on one side and not the other.
 */

import { SITE_NAME, SITE_URL, absoluteUrl } from './site';
import { SITE_CONFIG, ACCOUNT_MANAGEMENT, PRICING_PLANS, perDayUsd, ORGANIZATION } from './constants';
import { posts } from './blog-data';
import { LESSONS } from './education-content';
import { TABS, CARDS } from './ict-content';
import { MARKETS, MARKET_SLUGS } from './markets-content';
import {
  TERMS_SECTIONS,
  TERMS_LAST_UPDATED,
  PRIVACY_SECTIONS,
  PRIVACY_LAST_UPDATED,
} from './legal-content';

export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';

export interface AgentDoc {
  /** Route this document represents, without a trailing slash. `/` for the home page. */
  path: string;
  title: string;
  description: string;
  /** Complete Markdown document, starting with its H1. */
  body: string;
}

const { minCapital, maxCapital, riskOnCapital, payoutCycle, profitSplit, indicativeReturns, markets, disclaimer } =
  ACCOUNT_MANAGEMENT;

const TELEGRAM = SITE_CONFIG.links.telegram;
const SUPPORT_EMAIL = SITE_CONFIG.links.supportEmail;

/* ------------------------------------------------------------------ */
/* Document assembly                                                   */
/* ------------------------------------------------------------------ */

function link(path: string, label: string): string {
  return `[${label}](${absoluteUrl(path)})`;
}

/**
 * Assemble one document.
 *
 * Every document ends with the same navigation block so an agent that landed here
 * from a search result can always find the rest of the site without guessing URLs.
 */
function buildDoc(opts: {
  path: string;
  title: string;
  description: string;
  sections: string[];
  related?: { path: string; label: string }[];
}): AgentDoc {
  const parts = [`# ${opts.title}`, `> ${opts.description}`, ...opts.sections];

  if (opts.related && opts.related.length > 0) {
    parts.push(
      ['## Related pages', '', ...opts.related.map((r) => `- ${link(r.path, r.label)}`)].join('\n')
    );
  }

  parts.push(
    [
      '---',
      '',
      `Canonical HTML: ${absoluteUrl(opts.path)}`,
      `Agent index: ${absoluteUrl('/llms.txt')} · Full text: ${absoluteUrl('/llms-full.txt')} · Sitemap: ${absoluteUrl('/sitemap.xml')}`,
      '',
      `This Markdown is the same URL served with \`Accept: text/markdown\`.`,
    ].join('\n')
  );

  return {
    path: opts.path,
    title: opts.title,
    description: opts.description,
    body: `${parts.join('\n\n')}\n`,
  };
}

/* ------------------------------------------------------------------ */
/* Reusable fragments                                                  */
/* ------------------------------------------------------------------ */

const RISK_DISCLOSURE = [
  '## Required disclosure',
  '',
  `**${disclaimer}**`,
  '',
  'Nothing on this site is investment advice, a recommendation to buy or sell any security, or a solicitation to invest. Trading and investing carry a substantial risk of loss, including the loss of your entire capital. Past performance is not indicative of future results.',
].join('\n');

function pricingTable(): string {
  const rows = PRICING_PLANS.map(
    (plan) =>
      `| ${plan.name} | ${plan.kicker} | $${plan.priceUsd} | $${perDayUsd(plan.priceUsd)} | ${plan.features.join('; ')} |`
  );

  return [
    '## Membership plans',
    '',
    'All prices are monthly and billed in USD. All plans include direct Telegram access, real-time views, and defined guidance.',
    '',
    '| Plan | Markets | USD / month | Indicative USD / day | Included |',
    '| --- | --- | --- | --- | --- |',
    ...rows,
    '',
    `Subscribe or ask questions on Telegram: ${TELEGRAM}`,
  ].join('\n');
}

function accountManagementTerms(): string {
  return [
    '| Term | Value |',
    '| --- | --- |',
    `| Minimum capital | ${minCapital} |`,
    `| Maximum capital | ${maxCapital} |`,
    `| Risk on capital | ${riskOnCapital} — maximum drawdown exposure, not a return figure |`,
    `| Profit share | ${profitSplit.client}% client / ${profitSplit.house}% ${SITE_NAME} |`,
    `| Settlement frequency | ${payoutCycle} |`,
    `| Performance fee basis | Applies to profit only |`,
    `| Markets traded | ${markets.join(' · ')} |`,
    `| Method | Discretionary — strategy and experience based |`,
    `| Mandate options | Standard, or conservative on request |`,
    `| Indicative return | ${indicativeReturns} — indicative only, not guaranteed |`,
    `| Regulatory status | Not SEBI Registered |`,
  ].join('\n');
}

function curriculumList(): string {
  return Object.values(LESSONS)
    .map((lesson) => `- **${lesson.title}** (${lesson.badge}, ${lesson.meta}): ${lesson.desc}`)
    .join('\n');
}

function ictConcepts(): string {
  return TABS.map((tab) =>
    [
      `### ${tab.label}`,
      '',
      ...CARDS[tab.id].map((card) => `- **${card.title}**: ${card.desc}`),
    ].join('\n')
  ).join('\n\n');
}

const ICT_CONCEPT_COUNT = TABS.reduce((total, tab) => total + CARDS[tab.id].length, 0);

/* ------------------------------------------------------------------ */
/* Terms of Service prose                                              */
/* ------------------------------------------------------------------ */

/**
 * Markdown body for each Terms section, keyed by the section id in
 * lib/legal-content. A test asserts the keys here match TERMS_SECTIONS exactly, so a
 * section added to the page without prose here is a build-time failure, not a silent
 * gap in what agents are told.
 */
const TERMS_BODIES: Record<string, string> = {
  acceptance: [
    `By accessing ${SITE_CONFIG.name}, subscribing to any plan, joining our community channels, or engaging the Account Handling Management service, you agree to be bound by these terms. If you do not agree with any part of them, do not use the service.`,
    `These terms operate alongside our ${link('/privacy', 'Privacy Policy')}.`,
  ].join('\n\n'),

  'what-we-are': [
    'We provide trading education (ICT, Smart Money Concepts, order flow), market analysis tools, charting, a market screener, and discretionary trading signals. Separately, we offer Account Handling Management, under which our traders manage capital on a client’s behalf.',
    'We are **not** a broker, exchange, custodian, bank, mutual fund, or portfolio management service as defined under Indian securities law. We do not hold client securities. We do not provide personalised investment advice, tax advice, or legal advice.',
    'Educational content and signals are general in nature. They do not account for your financial position, objectives, or risk tolerance, and must not be treated as a recommendation tailored to you.',
  ].join('\n\n'),

  regulatory: [
    `**${disclaimer}**`,
    'We are not registered with the Securities and Exchange Board of India (SEBI) as a Research Analyst, Investment Adviser, or Portfolio Manager, and we hold no equivalent registration in any other jurisdiction. We are not regulated by the RBI or any other financial authority.',
    'In practical terms this means there is no statutory investor protection covering your dealings with us, no regulated grievance-redressal route, and no compensation scheme. If you require a regulated structure, you should use a SEBI-registered intermediary instead.',
    'You are responsible for ensuring that your use of this service is lawful in your own jurisdiction.',
  ].join('\n\n'),

  risk: [
    'Trading in equities, futures, options, currencies and digital assets involves substantial risk. Leveraged instruments such as F&O can produce losses that exceed your initial capital. Markets gap, liquidity disappears, and stop orders are not guaranteed to execute at the requested price.',
    '**Past performance is not indicative of future results.** No figure published on this site — whether a signal, a historical example, or an indicative return range — is a promise, projection, or guarantee of any outcome.',
    'Never commit capital you cannot afford to lose in full.',
  ].join('\n\n'),

  eligibility: [
    'You must be at least 18 years old and legally capable of entering into a binding contract. By using the service you confirm that you meet these requirements and that any information you provide us is accurate.',
    'We may decline or discontinue service to anyone, at our discretion, including where we believe the arrangement is unsuitable for you.',
  ].join('\n\n'),

  subscriptions: [
    'Subscription plans grant access to signals, education and community channels for the stated billing period. Access begins on confirmation of payment and continues until the end of that period.',
    'Subscription fees are stated on the pricing section of the site and may change with notice. Changes do not affect a period you have already paid for.',
    '**Subscription fees are non-refundable once access has been granted**, because the material is delivered immediately and in full. If you believe you have been charged in error, contact us and we will investigate.',
    'Sharing, reselling or redistributing your access is grounds for immediate termination without refund.',
  ].join('\n\n'),

  'managed-accounts': [
    `Where you engage our Account Handling Management service, the following published terms apply. Full details are set out on the ${link('/account-management', 'Account Handling Management page')}.`,
    [
      `- Minimum capital of ${minCapital}, with no upper limit.`,
      `- A risk ceiling of ${riskOnCapital} of capital, being maximum drawdown exposure — not a return figure and not a guarantee that losses will stop at that level.`,
      `- Profit is shared ${profitSplit.label}, with the client retaining ${profitSplit.client}% and ${SITE_CONFIG.name} receiving ${profitSplit.house}% as a performance fee on profit.`,
      `- ${payoutCycle} settlement of profit share.`,
      `- An indicative return range of ${indicativeReturns}, which is indicative only and expressly not guaranteed.`,
      '- A conservative, safety-first mandate is available on request.',
    ].join('\n'),
    'Trading decisions under this mandate are discretionary and made by us. Losses sit with your capital. We accept no liability for market losses incurred while managing your account, and nothing in this arrangement transfers that risk to us.',
    'Custody, funding, withdrawal terms and reporting are agreed with you directly before any capital is committed. Anything not confirmed with you in writing is not a term of your mandate, regardless of what may have been said in conversation.',
  ].join('\n\n'),

  'market-data': [
    'Prices, charts, indicators and screener results are sourced from third parties including Binance, Yahoo Finance and TradingView. We do not originate this data and cannot warrant its accuracy, completeness, or timeliness.',
    'Index, futures and equity data may be delayed. Data may be interrupted, revised or withdrawn by its source without notice. Always verify against your broker’s own feed before acting on any price shown here.',
  ].join('\n\n'),

  ai: [
    'Our AI assistant produces automated responses and can be wrong, incomplete or out of date. It is an educational aid, not a source of advice, and its output should not be relied on without independent verification.',
    'The signal engine applies published technical indicators to live market data and reports how many of them agree on direction. It is deterministic technical analysis, not a prediction, and it deliberately publishes no confidence or accuracy figure. A signal is not a recommendation to trade.',
  ].join('\n\n'),

  'acceptable-use': [
    'You agree not to:',
    [
      '- Copy, republish, resell or redistribute our content, signals or tools.',
      '- Share your account credentials or community access with anyone else.',
      '- Scrape, crawl or programmatically extract data from the site or its APIs.',
      '- Attempt to disrupt, reverse engineer, or gain unauthorised access to the service.',
      `- Represent yourself as affiliated with, or authorised to speak for, ${SITE_NAME}.`,
      '- Use the service for unlawful purposes, including market manipulation.',
    ].join('\n'),
  ].join('\n\n'),

  ip: `All content on this site — written material, frameworks, charts, graphics, code and branding — belongs to ${SITE_CONFIG.name} unless stated otherwise. Your subscription grants a personal, non-transferable, revocable licence to access it for your own use. It transfers no ownership and grants no right to reproduce or distribute it.`,

  liability: [
    `To the maximum extent permitted by law, ${SITE_CONFIG.name}, its operators and associates are not liable for any trading loss, lost profit, lost opportunity, or any indirect, incidental or consequential damages arising from your use of the service, from reliance on any content, signal or figure published here, or from inaccurate or delayed market data.`,
    'Where liability cannot lawfully be excluded, our total aggregate liability is limited to the amount you paid us in subscription fees in the three months preceding the claim.',
    'The service is provided on an “as is” and “as available” basis. We do not warrant uninterrupted or error-free operation.',
  ].join('\n\n'),

  indemnity: `You agree to indemnify and hold harmless ${SITE_CONFIG.name} and its operators against any claim, loss, liability or expense arising from your use of the service, your breach of these terms, or your violation of any law or third-party right.`,

  termination: [
    'You may stop using the service at any time. We may suspend or terminate your access without refund if you breach these terms, abuse the service or its community, or where we are required to do so by law.',
    'Sections covering risk, liability, indemnity and intellectual property survive termination.',
  ].join('\n\n'),

  changes: `We may update these terms from time to time. The revised version takes effect when posted here, and the “last updated” date above will change. Continued use of the service after that constitutes acceptance. Please review this page periodically.`,

  law: 'These terms are governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with them is subject to the exclusive jurisdiction of the courts at Bengaluru, Karnataka, India, and you consent to that venue.',

  contact: `Questions about these terms can be sent to ${SUPPORT_EMAIL} or raised on our Telegram channel (${TELEGRAM}). You can also use the ${link('/contact', 'contact form')}.`,
};

export const TERMS_BODY_IDS = Object.keys(TERMS_BODIES);

/* ------------------------------------------------------------------ */
/* Documents                                                           */
/* ------------------------------------------------------------------ */

const homeDoc = buildDoc({
  path: '/',
  title: `${SITE_NAME} — Master the Markets`,
  description:
    'Trading education and market intelligence covering ICT, Smart Money Concepts and order flow, with a live charting terminal, discretionary signals, and a managed-account service. Based in India, billed in USD, not SEBI Registered.',
  sections: [
    [
      '## What this site is',
      '',
      `${SITE_CONFIG.name} teaches independent traders to read markets the way institutional desks do: ICT and Smart Money Concepts, order flow, cumulative delta and depth of market. Alongside the curriculum it runs a live charting terminal, an indicator-confluence signal engine, and a discretionary account-management mandate.`,
      '',
      'Positioning is education-first and disclosure-first: every commercial term, and the fact that the business holds no SEBI registration, is published before anyone is asked for money.',
    ].join('\n'),
    [
      '## What you can do here',
      '',
      `- ${link('/', 'Learn the framework')} — ${Object.keys(LESSONS).length} structured modules covering foundations through advanced ICT models.`,
      `- ${link('/live-terminal/XAUUSD', 'Open the live terminal')} — charting, screener and watchlist across Indian equity, F&O, forex and crypto.`,
      `- ${link('/markets/forex', 'Read the market pages')} — forex, indices, commodities and crypto, each with a live chart.`,
      `- ${link('/blog', 'Read the analysis blog')} — liquidity, order flow and trading psychology.`,
      `- ${link('/account-management', 'Review the managed-account terms')} — every commercial term of the mandate, published in full.`,
      `- ${link('/contact', 'Get in touch')} — support email and Telegram.`,
    ].join('\n'),
    [
      '## Platform facts',
      '',
      `- ${ICT_CONCEPT_COUNT} ICT / SMC concepts documented on the home page.`,
      `- ${Object.keys(LESSONS).length} structured education modules.`,
      '- 4 markets covered: forex, equity indices, commodities, crypto.',
      '- Default instrument across the terminal and home chart: Gold (XAU/USD).',
    ].join('\n'),
    ['## Education modules', '', curriculumList()].join('\n'),
    [`## The ICT / SMC framework`, '', 'The same playbook used by institutional desks, decoded for the independent trader.', '', ictConcepts()].join('\n'),
    [
      '## Live trading terminal',
      '',
      'Professional market intelligence: live candles from Binance and Yahoo Finance, a market screener spanning Indian equity (BSE/NSE), US indices, forex and crypto, a watchlist, and an AI signal engine that reports how many published technical indicators agree on direction for the selected symbol and timeframe.',
      '',
      'The signal engine is deterministic technical analysis, not a prediction. It publishes no accuracy or confidence figure by design.',
    ].join('\n'),
    pricingTable(),
    [
      '## Account Handling Management',
      '',
      `A separate service from the subscriptions above: professional traders manage a client’s capital across ${markets.join(', ')}. Headline terms — minimum ${minCapital}, a ${riskOnCapital} risk ceiling, a ${profitSplit.label} profit split settled ${payoutCycle.toLowerCase()}.`,
      '',
      `Full terms: ${link('/account-management', 'Account Handling Management')}.`,
    ].join('\n'),
    [
      '## Contact',
      '',
      `- Email: ${SUPPORT_EMAIL}`,
      `- Telegram: ${TELEGRAM}`,
      `- Contact form: ${absoluteUrl('/contact')}`,
    ].join('\n'),
    RISK_DISCLOSURE,
  ],
  related: [
    { path: '/about', label: 'About' },
    { path: '/account-management', label: 'Account Handling Management' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
    { path: '/terms', label: 'Terms of Service' },
    { path: '/privacy', label: 'Privacy Policy' },
  ],
});

const aboutDoc = buildDoc({
  path: '/about',
  title: 'Trading with Uncompromising Integrity',
  description: `The mission and philosophy behind ${SITE_CONFIG.name}: integrity-first trading education built on ICT, Smart Money Concepts and order flow.`,
  sections: [
    'At The Ethical Trader, we believe that the financial markets are not just a place for profit, but an arena for discipline, character, and continuous growth. Our platform has been created by market observation over time and through experience: most traders fail not because they lack data, but because they lack a systematic, ethical framework for risk.',
    [
      '## The "Ethical" in Trading',
      '',
      'Being an "Ethical Trader" means more than just following rules. It means trading with a conscience—understanding that every position has a consequence, and that long-term success requires a radical commitment to transparency and risk management.',
      '',
      '### Education First',
      '',
      'We don\'t sell "get rich quick" schemes. We provide the tools and logic (ICT, SMC, Order Flow) to decode market behavior.',
      '',
      '### Institutional Logic',
      '',
      'We empower retail traders by teaching them how institutions move liquidity and engineer price action.',
    ].join('\n'),
    'Join a community that values deep analysis over gambling, and discipline over luck. This is the new standard of retail trading intelligence.',
  ],
  related: [
    { path: '/', label: 'Home' },
    { path: '/contact', label: 'Contact' },
    { path: '/terms', label: 'Terms of Service' },
  ],
});

const contactDoc = buildDoc({
  path: '/contact',
  title: "Let's Start a Conversation",
  description: `How to reach ${SITE_CONFIG.name} — support email, Telegram community, and a contact form.`,
  sections: [
    'Whether you have questions about the curriculum, need technical support for the terminal, or want to discuss a customized institutional license, our team is ready to assist.',
    [
      '### Email Support',
      '',
      SUPPORT_EMAIL,
      '',
      '### Community Hub',
      '',
      `Join our official Telegram channel for instant updates and signals: ${TELEGRAM}`,
      '',
      '### Contact form',
      '',
      `The HTML page at ${absoluteUrl('/contact')} carries a form asking for first name, last name, email address and a message. There is no public form-submission API; agents should use the email address or Telegram link above instead of attempting to post to the form.`,
    ].join('\n'),
    [
      '### Business details',
      '',
      `- Organization: ${ORGANIZATION.legalName} (${SITE_NAME})`,
      `- Country: India`,
      `- Support email: ${ORGANIZATION.email}`,
      `- Telegram: ${TELEGRAM}`,
    ].join('\n'),
  ],
  related: [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/account-management', label: 'Account Handling Management' },
  ],
});

const accountManagementDoc = buildDoc({
  path: '/account-management',
  title: 'Account Handling Management',
  description: `Professional traders manage your capital across ${markets.join(', ')}. Minimum ${minCapital}, a ${riskOnCapital} risk ceiling, and a ${profitSplit.label} profit split settled ${payoutCycle.toLowerCase()}. Not SEBI Registered.`,
  sections: [
    'Professional traders manage your capital on your behalf. Every term of that mandate is printed on this page — the minimum, the risk ceiling, the split, the settlement cycle and our regulatory standing. You should not have to ask for any of it, and nothing about this service is disclosed only after you have funded it.',
    ['## The complete commercial terms', '', accountManagementTerms(), '', `${riskOnCapital} is a risk figure, not a return figure. It describes how much of your capital can be exposed to loss — not what you should expect to make.`].join('\n'),
    [
      '## Regulatory standing',
      '',
      `**${disclaimer}**`,
      '',
      'We are not a SEBI-registered research analyst, investment adviser or portfolio manager. This is not a regulated portfolio management service, and it carries no statutory protection, no regulated grievance route and no compensation mechanism.',
      '',
      `Every rupee placed under this mandate is exposed to market risk, including the risk of losing it. The ${riskOnCapital} figure is the exposure the mandate is built to work within — it is not a guarantee that a loss will stop there. Losses sit with your capital.`,
      '',
      'Anything not written on the page is not a promise. If anyone quotes you a return, a guarantee, a timeline or a term that does not appear in the table above — including us, in conversation — treat it as unverified until you have it in writing.',
    ].join('\n'),
    [
      '## Profit sharing',
      '',
      `Profit is split ${profitSplit.label} in your favour and settled ${payoutCycle.toLowerCase()} — not every quarter, and not at some distant exit. The ${profitSplit.house}% is a performance fee and it applies to profit only. Where there is no profit, there is no performance fee.`,
      '',
      '- Weekly settlement, not quarterly — you see the outcome while it is still recent enough to act on.',
      '- Payout mechanics, timing and record-keeping are yours to settle before any capital is committed — ask for them explicitly and get the answers confirmed.',
    ].join('\n'),
    [
      '## Risk architecture',
      '',
      `${riskOnCapital} is a limit on exposure — not a target, not a forecast. It defines how much of your capital can stand in front of the market at the worst point of a drawdown, and it governs position size on every trade taken for you.`,
      '',
      'It is a discipline, not a guarantee. Markets gap, and no operator can honestly promise that a loss will stop at a stated line. The ceiling is published in advance so you can decide whether you are comfortable with it before a single trade is placed, and hold us to it afterwards.',
      '',
      '### Conservative mandate, on request',
      '',
      `A safety-first version of this mandate is available if you ask for it: smaller position sizing, tighter exposure, fewer trades taken. Same ${payoutCycle.toLowerCase()} settlement, same ${profitSplit.label} split. Ask for it before anything is deployed.`,
    ].join('\n'),
    [
      '## Suitability',
      '',
      '### This is built for you if…',
      '',
      `- You have at least ${minCapital} you can leave deployed, and it is genuinely surplus capital.`,
      `- You accept a ${riskOnCapital} risk ceiling on that capital, and you understand it is a discipline rather than a guarantee.`,
      `- You want exposure to ${markets.join(', ')} without running the trades, the screens or the decisions yourself.`,
      '- You would rather read the terms on a public page than be walked through them by a salesperson.',
      '- You have read the risk statement above and you are proceeding with your eyes open on our regulatory standing.',
      '',
      '### Do not proceed if…',
      '',
      `- The ${minCapital} is borrowed, is your emergency fund, or is money you will need back on a fixed date.`,
      '- You want a guaranteed, fixed or assured monthly return. Nobody can honestly offer you that, and we will not.',
      `- A ${riskOnCapital} drawdown on this capital would cause you real financial or personal harm.`,
      '- A losing week would cause you to panic. There will be losing weeks.',
      '- You want the final say on individual trades. This is a discretionary mandate.',
      '- You are trying to recover previous market losses quickly.',
      '- You require a SEBI-regulated structure with statutory protection. Use a SEBI-registered portfolio manager instead.',
    ].join('\n'),
    [
      '## How it works',
      '',
      '1. **Conversation** — message us on Telegram and tell us what you are considering placing, what you want from it, and what you are afraid of. Ask everything: custody, access, withdrawals, reporting, worst case.',
      '2. **Mandate** — ask for every term before you commit anything, and get each answer confirmed. If you want the conservative mandate, this is where you ask for it.',
      `3. **Funding and deployment** — only once the mandate is agreed does anything get traded. You fund from ${minCapital} upward, with no upper limit.`,
      `4. **${payoutCycle} settlement** — profit is calculated and split ${profitSplit.label}, and your ${profitSplit.client}% is settled. Where there is no profit, there is no performance fee.`,
    ].join('\n'),
    [
      '## Method and markets',
      '',
      'We trade on strategy and experience, not on volume: structurally clean setups, low risk against high reward, with the invalidation defined before entry. Where a setup is not clean, no trade is placed.',
      '',
      `That is also why ${indicativeReturns} is a range and not a figure. Return follows the setups the market actually offers, and the market does not offer them evenly. There is no algorithm being sold here and no black box.`,
      '',
      '- **Indian Equity** — positions in Indian listed equity, selected on structure and sized against the same risk ceiling.',
      '- **F&O (Futures & Options)** — index and stock derivatives, used to express a view with defined risk rather than to stack leverage.',
      '- **Forex** — major currency pairs, traded on the same setup discipline.',
    ].join('\n'),
    [
      '## Questions you should be asking',
      '',
      '**Who actually holds the money?** Custody, access and the operating arrangement for your account are settled with you directly, not reduced to a one-line answer on a web page. Ask on Telegram and insist on a clear answer before sending anything.',
      '',
      '**Can I withdraw my capital?** The capital is yours. Withdrawal terms — notice, timing, and how it interacts with an open book — are not published here, so treat them as unsettled until you have settled them in writing.',
      '',
      `**What happens if you lose my money?** The ${riskOnCapital} figure is the maximum drawdown exposure the mandate is built to work within. Losses sit with your capital. There is no clause anywhere in this arrangement that makes us liable for a market loss.`,
      '',
      '**Why are you not SEBI Registered?** Because we are not. SEBI registration as a research analyst, investment adviser or portfolio manager is a specific licence, and we do not hold one. In practice that means no regulated redress and no statutory protection.',
      '',
      `**Is ${indicativeReturns} guaranteed?** No. It is indicative and varies entirely with the setups available. Anyone quoting an assured monthly return on market capital is either misinformed or lying.`,
      '',
      '**Do you publish a track record?** No. There are no performance screenshots, verified statements or historical results, and you should treat that absence as information.',
      '',
      `**Can I start with less than ${minCapital}?** No. It is the floor and it is not negotiable. There is no upper limit.`,
      '',
      '**Can you trade my account more conservatively?** Yes. A conservative, safety-first mandate is available on request, agreed before capital is deployed.',
    ].join('\n'),
    [
      '## Next step',
      '',
      `There is no signup form on this page and no payment link, by design. The next step is a conversation on Telegram: ${TELEGRAM}`,
      '',
      `${minCapital} minimum · ${maxCapital} · ${riskOnCapital} risk ceiling · ${profitSplit.label} split · Settled ${payoutCycle.toLowerCase()}`,
    ].join('\n'),
    RISK_DISCLOSURE,
  ],
  related: [
    { path: '/', label: 'Home' },
    { path: '/terms', label: 'Terms of Service' },
    { path: '/contact', label: 'Contact' },
  ],
});

const blogIndexDoc = buildDoc({
  path: '/blog',
  title: 'The Ethical Trader Blog',
  description: 'Market intelligence essays on liquidity, order flow execution and trading psychology.',
  sections: [
    [
      '## Posts',
      '',
      ...posts.map(
        (post) => `- ${link(`/blog/${post.slug}`, post.title)} — ${post.category}, ${post.date}. ${post.excerpt}`
      ),
    ].join('\n'),
  ],
  related: [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
  ],
});

const blogPostDocs = posts.map((post) =>
  buildDoc({
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    sections: [
      `**Category:** ${post.category} · **Published:** ${post.date}`,
      ...post.content,
    ],
    related: [
      { path: '/blog', label: 'All posts' },
      { path: '/', label: 'Home' },
    ],
  })
);

const marketDocs = MARKET_SLUGS.map((slug) => {
  const market = MARKETS[slug];
  return buildDoc({
    path: `/markets/${slug}`,
    title: `${market.headingLead} ${market.headingEmphasis}`,
    description: market.metaDescription,
    sections: [
      market.intro,
      ['## Focus areas', '', ...market.bullets.map((b) => `- ${b}`)].join('\n'),
      [
        '## What we teach here',
        '',
        ...market.cards.flatMap((card) => [`### ${card.title}`, '', card.body, '']),
      ]
        .join('\n')
        .trimEnd(),
      `The HTML page carries a live ${market.chartSymbol.replace('-', '/')} chart. Live data is available from the ${link(`/live-terminal/${market.chartSymbol.replace('-', '')}`, 'trading terminal')}.`,
    ],
    related: [
      { path: '/', label: 'Home' },
      ...MARKET_SLUGS.filter((other) => other !== slug).map((other) => ({
        path: `/markets/${other}`,
        label: `${MARKETS[other].headingLead} ${MARKETS[other].headingEmphasis}`,
      })),
    ],
  });
});

const termsDoc = buildDoc({
  path: '/terms',
  title: 'Terms of Service',
  description: `The terms governing use of ${SITE_CONFIG.name} — education, market tools, signals and Account Handling Management. Not SEBI Registered; market risks apply.`,
  sections: [
    `These terms govern your use of ${SITE_CONFIG.name} — our website, educational material, market tools, trading signals, and the Account Handling Management service.`,
    `**Last updated:** ${TERMS_LAST_UPDATED}`,
    [
      '## Read this first',
      '',
      `**${disclaimer}**`,
      '',
      'Nothing on this site is investment advice, a recommendation to buy or sell any security, or a solicitation to invest. Trading and investing carry a substantial risk of loss, including the loss of your entire capital. You are solely responsible for your own decisions.',
    ].join('\n'),
    ...TERMS_SECTIONS.map((section) =>
      [`## ${section.n}. ${section.title}`, '', TERMS_BODIES[section.id] ?? ''].join('\n')
    ),
  ],
  related: [
    { path: '/privacy', label: 'Privacy Policy' },
    { path: '/account-management', label: 'Account Handling Management' },
    { path: '/contact', label: 'Contact' },
  ],
});

const privacyDoc = buildDoc({
  path: '/privacy',
  title: 'Privacy Policy',
  description: `How ${SITE_CONFIG.name} collects, uses and protects your information.`,
  sections: [
    ...PRIVACY_SECTIONS.map((section) => [`## ${section.heading}`, '', section.body].join('\n')),
    `Last Updated: ${PRIVACY_LAST_UPDATED}. For questions regarding this policy, please contact ${SUPPORT_EMAIL}.`,
  ],
  related: [
    { path: '/terms', label: 'Terms of Service' },
    { path: '/contact', label: 'Contact' },
  ],
});

/**
 * The terminal accepts any symbol, so its document is generated per request rather
 * than stored. The route is deliberately noindex — it is an interactive tool, not a
 * content page — but agents still land on it from the home page CTA, so it gets a
 * Markdown representation that explains what the tool does.
 */
export function liveTerminalDoc(symbol: string): AgentDoc {
  const clean = sanitisePathSegment(symbol);
  return buildDoc({
    path: `/live-terminal/${clean}`,
    title: `Live Trading Terminal — ${clean}`,
    description: `Interactive charting, screener and watchlist for ${clean} across Indian equity, F&O, forex and crypto.`,
    sections: [
      [
        '## What this page is',
        '',
        `An interactive terminal, not an article. It renders a live candlestick chart for **${clean}**, a market screener spanning Indian equity (BSE/NSE), US indices, forex and crypto, a watchlist, and an indicator-confluence signal readout. It requires JavaScript and a live market-data connection, so there is no static text representation of what it shows at any moment.`,
        '',
        'The route is excluded from the sitemap and marked `noindex`: symbol permutations are unbounded and the page carries no indexable prose.',
      ].join('\n'),
      [
        '## Reading market data programmatically',
        '',
        `Market data behind this page comes from Binance and Yahoo Finance. ${SITE_NAME} publishes no public data API — the internal \`/api/*\` routes are disallowed in ${absoluteUrl('/robots.txt')} and are not a supported integration surface. Go to the upstream sources directly.`,
      ].join('\n'),
      RISK_DISCLOSURE,
    ],
    related: [
      { path: '/', label: 'Home' },
      { path: '/markets/forex', label: 'Forex' },
      { path: '/markets/crypto', label: 'Digital Assets' },
    ],
  });
}

/** Documents for every fixed route, in the order they are listed in llms.txt. */
export const AGENT_DOCS: AgentDoc[] = [
  homeDoc,
  aboutDoc,
  accountManagementDoc,
  ...marketDocs,
  blogIndexDoc,
  ...blogPostDocs,
  contactDoc,
  termsDoc,
  privacyDoc,
];

const DOCS_BY_PATH = new Map(AGENT_DOCS.map((doc) => [doc.path, doc]));

/* ------------------------------------------------------------------ */
/* Route resolution                                                    */
/* ------------------------------------------------------------------ */

/**
 * Strip a trailing slash so `/about/` and `/about` resolve to the same document.
 * Next itself redirects the former to the latter; this keeps the proxy consistent
 * with that before the redirect happens.
 */
export function normalisePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '') || '/';
  }
  return pathname;
}

/**
 * Reflecting a requested path back into a response body is only safe if it cannot
 * carry markup or control characters, so a path segment is reduced to a conservative
 * character set and truncated before it is echoed in a 404 body.
 */
export function sanitisePathSegment(value: string): string {
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    // Malformed percent-encoding — fall back to the raw value and let the filter run.
  }
  return decoded.replace(/[^A-Za-z0-9._~/-]/g, '').slice(0, 96);
}

/** Routes that exist but serve something other than a Markdown-negotiable page. */
const NON_NEGOTIABLE_ROUTES = new Set([
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/llms-full.txt',
  '/opengraph-image',
  '/favicon.ico',
  '/icon.png',
  '/apple-icon.png',
  '/apple-touch-icon.png',
  '/apple-touch-icon-precomposed.png',
]);

/** Every fixed route with a Markdown representation. */
export const AGENT_DOC_PATHS: string[] = AGENT_DOCS.map((doc) => doc.path);

/** The Markdown document for a route, or `null` when the route has none. */
export function resolveAgentDoc(pathname: string): AgentDoc | null {
  const path = normalisePath(pathname);

  const fixed = DOCS_BY_PATH.get(path);
  if (fixed) return fixed;

  if (path.startsWith('/live-terminal/')) {
    const symbol = path.slice('/live-terminal/'.length);
    // Only the single-segment form is a real route.
    if (symbol !== '' && !symbol.includes('/')) return liveTerminalDoc(symbol);
  }

  return null;
}

/**
 * Whether the app serves something at this path.
 *
 * The proxy uses this to decide whether a Markdown request should be answered with a
 * document or with a 404 body. It only has to be right for paths that reach
 * negotiation — API routes, framework internals and anything with a file extension
 * are filtered out before this is called.
 */
export function isKnownRoute(pathname: string): boolean {
  const path = normalisePath(pathname);
  if (NON_NEGOTIABLE_ROUTES.has(path)) return true;
  return resolveAgentDoc(path) !== null;
}

/**
 * Body for a 404. Agents that hit a dead URL get a short document telling them where
 * the real ones are, rather than a wall of application shell.
 */
export function notFoundMarkdown(pathname: string): string {
  const safe = sanitisePathSegment(pathname) || '/';

  return [
    '# 404 — Not Found',
    '',
    `> No page exists at \`${safe}\` on ${SITE_URL}. Nothing was moved; this path was never published.`,
    '',
    '## Where to look next',
    '',
    `- ${link('/llms.txt', 'llms.txt')} — index of every page, with when-to-use guidance for agents`,
    `- ${link('/llms-full.txt', 'llms-full.txt')} — the whole site as one Markdown document`,
    `- ${link('/sitemap.xml', 'sitemap.xml')} — machine-readable list of every indexable URL`,
    `- ${link('/robots.txt', 'robots.txt')} — crawl rules`,
    '',
    '## Main pages',
    '',
    ...AGENT_DOCS.map((doc) => `- ${link(doc.path, doc.title)}`),
    '',
    '## Notes',
    '',
    `- Every page above also serves Markdown from the same URL when the request carries \`Accept: text/markdown\`.`,
    `- \`/api/*\` is disallowed for crawlers and is not a supported integration surface.`,
    `- Questions a page does not answer: ${SUPPORT_EMAIL} or ${TELEGRAM}.`,
    '',
  ].join('\n');
}

/**
 * Convert a lesson's stored HTML body to Markdown for the full-text dump.
 *
 * The lesson bodies use a fixed, small vocabulary — h2, p, ul/li and a highlight div —
 * so this handles exactly that rather than pulling in a general HTML parser.
 */
export function lessonBodyToMarkdown(html: string): string {
  return html
    .replace(/<h2>\s*([\s\S]*?)\s*<\/h2>/g, '\n### $1\n')
    .replace(/<div class="lesson-hl">\s*([\s\S]*?)\s*<\/div>/g, '\n> $1\n')
    .replace(/<li>\s*([\s\S]*?)\s*<\/li>/g, '- $1\n')
    .replace(/<\/?ul>/g, '\n')
    .replace(/<p>\s*([\s\S]*?)\s*<\/p>/g, '\n$1\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
