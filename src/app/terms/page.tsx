import { Metadata } from 'next';
import Link from 'next/link';
import { pageOpenGraph } from '@/lib/site';
import { SITE_CONFIG, ACCOUNT_MANAGEMENT } from '@/lib/constants';
import { TERMS_LAST_UPDATED, TERMS_SECTIONS } from '@/lib/legal-content';

export const metadata: Metadata = {
  title: 'Terms of Service | The Ethical Trader',
  description:
    'The terms governing use of The Ethical Trader — education, market tools, signals and Account Handling Management. We are not SEBI Registered; market risks apply.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: pageOpenGraph({
    title: 'Terms of Service | The Ethical Trader',
    description:
      'The terms governing use of The Ethical Trader — education, market tools, signals and Account Handling Management.',
    url: '/terms',
  }),
};


const { minCapital, riskOnCapital, payoutCycle, profitSplit, indicativeReturns, disclaimer } =
  ACCOUNT_MANAGEMENT;

function Section({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-stone mb-3">
        ◈ {n}
      </div>
      <h2 className="font-serif text-[1.5rem] md:text-[1.75rem] font-light text-ivory mb-5 leading-snug">
        {title}
      </h2>
      <div className="space-y-4 text-[0.95rem] leading-[1.85]">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="pt-32 pb-24 px-6 lg:px-16 min-h-screen bg-void relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[820px] mx-auto relative z-10 text-parchment">
        <div className="flex items-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-6 before:content-[''] before:block before:w-10 before:h-[1px] before:bg-amber">
          Legal
        </div>

        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.1] text-ivory mb-6">
          Terms of <em className="italic text-gold-mid">Service</em>
        </h1>

        <p className="text-[1rem] leading-[1.8] max-w-[62ch] mb-4">
          These terms govern your use of {SITE_CONFIG.name} — our website, educational
          material, market tools, trading signals, and the Account Handling Management
          service. Please read them in full before using anything we publish or offer.
        </p>

        <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-stone mb-10">
          Last updated: {TERMS_LAST_UPDATED}
        </p>

        {/* The single most important disclosure on the site, stated before anything else. */}
        <div className="rounded-xl border border-bear/35 bg-bear-dim p-6 md:p-8 mb-14">
          <div className="text-[0.6rem] font-bold tracking-[0.3em] uppercase text-bear mb-4">
            Read This First
          </div>
          <p className="font-serif text-[1.15rem] md:text-[1.35rem] font-light leading-[1.5] text-ivory">
            {disclaimer}
          </p>
          <p className="text-[0.88rem] leading-[1.8] mt-5">
            Nothing on this site is investment advice, a recommendation to buy or sell any
            security, or a solicitation to invest. Trading and investing carry a substantial
            risk of loss, including the loss of your entire capital. You are solely responsible
            for your own decisions.
          </p>
        </div>

        {/* Contents */}
        <nav aria-label="Contents" className="mb-16 border-y border-border-subtle py-6">
          <div className="text-[0.6rem] font-bold tracking-[0.25em] uppercase text-stone mb-4">
            Contents
          </div>
          <ol className="list-none grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {TERMS_SECTIONS.map((s) => (
              <li key={s.id} className="flex items-baseline gap-3 text-[0.85rem]">
                <span className="font-mono text-[0.65rem] text-stone shrink-0">{s.n}</span>
                <a
                  href={`#${s.id}`}
                  className="text-parchment hover:text-gold-light transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-14">
          <Section id="acceptance" n="01" title="Acceptance of These Terms">
            <p>
              By accessing {SITE_CONFIG.name}, subscribing to any plan, joining our community
              channels, or engaging the Account Handling Management service, you agree to be
              bound by these terms. If you do not agree with any part of them, do not use the
              service.
            </p>
            <p>
              These terms operate alongside our{' '}
              <Link href="/privacy" className="text-gold hover:underline decoration-gold/30 underline-offset-4">
                Privacy Policy
              </Link>
              .
            </p>
          </Section>

          <Section id="what-we-are" n="02" title="What This Service Is — and Is Not">
            <p>
              We provide trading education (ICT, Smart Money Concepts, order flow), market
              analysis tools, charting, a market screener, and discretionary trading signals.
              Separately, we offer Account Handling Management, under which our traders manage
              capital on a client&apos;s behalf.
            </p>
            <p>
              We are <strong className="text-ivory">not</strong> a broker, exchange, custodian,
              bank, mutual fund, or portfolio management service as defined under Indian
              securities law. We do not hold client securities. We do not provide personalised
              investment advice, tax advice, or legal advice.
            </p>
            <p>
              Educational content and signals are general in nature. They do not account for
              your financial position, objectives, or risk tolerance, and must not be treated
              as a recommendation tailored to you.
            </p>
          </Section>

          <Section id="regulatory" n="03" title="Regulatory Status">
            <p className="text-ivory font-medium">{disclaimer}</p>
            <p>
              We are not registered with the Securities and Exchange Board of India (SEBI) as a
              Research Analyst, Investment Adviser, or Portfolio Manager, and we hold no
              equivalent registration in any other jurisdiction. We are not regulated by the
              RBI or any other financial authority.
            </p>
            <p>
              In practical terms this means there is no statutory investor protection covering
              your dealings with us, no regulated grievance-redressal route, and no
              compensation scheme. If you require a regulated structure, you should use a
              SEBI-registered intermediary instead.
            </p>
            <p>
              You are responsible for ensuring that your use of this service is lawful in your
              own jurisdiction.
            </p>
          </Section>

          <Section id="risk" n="04" title="Risk Disclosure">
            <p>
              Trading in equities, futures, options, currencies and digital assets involves
              substantial risk. Leveraged instruments such as F&amp;O can produce losses that
              exceed your initial capital. Markets gap, liquidity disappears, and stop orders
              are not guaranteed to execute at the requested price.
            </p>
            <p>
              <strong className="text-ivory">
                Past performance is not indicative of future results.
              </strong>{' '}
              No figure published on this site — whether a signal, a historical example, or an
              indicative return range — is a promise, projection, or guarantee of any outcome.
            </p>
            <p>Never commit capital you cannot afford to lose in full.</p>
          </Section>

          <Section id="eligibility" n="05" title="Eligibility">
            <p>
              You must be at least 18 years old and legally capable of entering into a binding
              contract. By using the service you confirm that you meet these requirements and
              that any information you provide us is accurate.
            </p>
            <p>
              We may decline or discontinue service to anyone, at our discretion, including
              where we believe the arrangement is unsuitable for you.
            </p>
          </Section>

          <Section id="subscriptions" n="06" title="Subscriptions and Payment">
            <p>
              Subscription plans grant access to signals, education and community channels for
              the stated billing period. Access begins on confirmation of payment and continues
              until the end of that period.
            </p>
            <p>
              Subscription fees are stated on the pricing section of the site and may change
              with notice. Changes do not affect a period you have already paid for.
            </p>
            <p>
              <strong className="text-ivory">
                Subscription fees are non-refundable once access has been granted
              </strong>
              , because the material is delivered immediately and in full. If you believe you
              have been charged in error, contact us and we will investigate.
            </p>
            <p>
              Sharing, reselling or redistributing your access is grounds for immediate
              termination without refund.
            </p>
          </Section>

          <Section id="managed-accounts" n="07" title="Account Handling Management">
            <p>
              Where you engage our Account Handling Management service, the following published
              terms apply. Full details are set out on the{' '}
              <Link
                href="/account-management"
                className="text-gold hover:underline decoration-gold/30 underline-offset-4"
              >
                Account Handling Management
              </Link>{' '}
              page.
            </p>
            <ul className="list-none space-y-3 my-6">
              {[
                `Minimum capital of ${minCapital}, with no upper limit.`,
                `A risk ceiling of ${riskOnCapital} of capital, being maximum drawdown exposure — not a return figure and not a guarantee that losses will stop at that level.`,
                `Profit is shared ${profitSplit.label}, with the client retaining ${profitSplit.client}% and ${SITE_CONFIG.name} receiving ${profitSplit.house}% as a performance fee on profit.`,
                `${payoutCycle} settlement of profit share.`,
                `An indicative return range of ${indicativeReturns}, which is indicative only and expressly not guaranteed.`,
                'A conservative, safety-first mandate is available on request.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.92rem] leading-[1.75]">
                  <span aria-hidden="true" className="text-gold-mid text-[0.7rem] mt-1.5 shrink-0">
                    ▸
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p>
              Trading decisions under this mandate are discretionary and made by us. Losses sit
              with your capital. We accept no liability for market losses incurred while
              managing your account, and nothing in this arrangement transfers that risk to us.
            </p>
            <p>
              Custody, funding, withdrawal terms and reporting are agreed with you directly
              before any capital is committed. Anything not confirmed with you in writing is not
              a term of your mandate, regardless of what may have been said in conversation.
            </p>
          </Section>

          <Section id="market-data" n="08" title="Market Data and Third-Party Sources">
            <p>
              Prices, charts, indicators and screener results are sourced from third parties
              including Binance, Yahoo Finance and TradingView. We do not originate this data
              and cannot warrant its accuracy, completeness, or timeliness.
            </p>
            <p>
              Index, futures and equity data may be delayed. Data may be interrupted, revised or
              withdrawn by its source without notice.{' '}
              <strong className="text-ivory">
                Always verify against your broker&apos;s own feed before acting on any price
                shown here.
              </strong>
            </p>
          </Section>

          <Section id="ai" n="09" title="AI Assistant and Signal Engine">
            <p>
              Our AI assistant produces automated responses and can be wrong, incomplete or out
              of date. It is an educational aid, not a source of advice, and its output should
              not be relied on without independent verification.
            </p>
            <p>
              The signal engine applies published technical indicators to live market data and
              reports how many of them agree on direction. It is deterministic technical
              analysis, not a prediction, and it deliberately publishes no confidence or
              accuracy figure. A signal is not a recommendation to trade.
            </p>
          </Section>

          <Section id="acceptable-use" n="10" title="Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-none space-y-3 my-4">
              {[
                'Copy, republish, resell or redistribute our content, signals or tools.',
                'Share your account credentials or community access with anyone else.',
                'Scrape, crawl or programmatically extract data from the site or its APIs.',
                'Attempt to disrupt, reverse engineer, or gain unauthorised access to the service.',
                'Represent yourself as affiliated with, or authorised to speak for, TheEthicalTrader.',
                'Use the service for unlawful purposes, including market manipulation.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.92rem] leading-[1.75]">
                  <span aria-hidden="true" className="text-gold-mid text-[0.7rem] mt-1.5 shrink-0">
                    ▸
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="ip" n="11" title="Intellectual Property">
            <p>
              All content on this site — written material, frameworks, charts, graphics, code
              and branding — belongs to {SITE_CONFIG.name} unless stated otherwise. Your
              subscription grants a personal, non-transferable, revocable licence to access it
              for your own use. It transfers no ownership and grants no right to reproduce or
              distribute it.
            </p>
          </Section>

          <Section id="liability" n="12" title="Limitation of Liability">
            <p>
              To the maximum extent permitted by law, {SITE_CONFIG.name}, its operators and
              associates are not liable for any trading loss, lost profit, lost opportunity, or
              any indirect, incidental or consequential damages arising from your use of the
              service, from reliance on any content, signal or figure published here, or from
              inaccurate or delayed market data.
            </p>
            <p>
              Where liability cannot lawfully be excluded, our total aggregate liability is
              limited to the amount you paid us in subscription fees in the three months
              preceding the claim.
            </p>
            <p>
              The service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
              basis. We do not warrant uninterrupted or error-free operation.
            </p>
          </Section>

          <Section id="indemnity" n="13" title="Indemnity">
            <p>
              You agree to indemnify and hold harmless {SITE_CONFIG.name} and its operators
              against any claim, loss, liability or expense arising from your use of the
              service, your breach of these terms, or your violation of any law or third-party
              right.
            </p>
          </Section>

          <Section id="termination" n="14" title="Termination">
            <p>
              You may stop using the service at any time. We may suspend or terminate your
              access without refund if you breach these terms, abuse the service or its
              community, or where we are required to do so by law.
            </p>
            <p>
              Sections covering risk, liability, indemnity and intellectual property survive
              termination.
            </p>
          </Section>

          <Section id="changes" n="15" title="Changes to These Terms">
            <p>
              We may update these terms from time to time. The revised version takes effect when
              posted here, and the &ldquo;last updated&rdquo; date above will change. Continued
              use of the service after that constitutes acceptance. Please review this page
              periodically.
            </p>
          </Section>

          <Section id="law" n="16" title="Governing Law and Jurisdiction">
            <p>
              These terms are governed by and construed in accordance with the laws of India.
              Any dispute arising out of or in connection with them is subject to the exclusive
              jurisdiction of the courts at Bengaluru, Karnataka, India, and you consent to that
              venue.
            </p>
          </Section>

          <Section id="contact" n="17" title="Contact">
            <p>
              Questions about these terms can be sent to{' '}
              <a
                href={`mailto:${SITE_CONFIG.links.supportEmail}`}
                className="text-gold hover:underline decoration-gold/30 underline-offset-4"
              >
                {SITE_CONFIG.links.supportEmail}
              </a>{' '}
              or raised on our{' '}
              <a
                href={SITE_CONFIG.links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline decoration-gold/30 underline-offset-4"
              >
                Telegram channel
              </a>
              . You can also use the{' '}
              <Link
                href="/contact"
                className="text-gold hover:underline decoration-gold/30 underline-offset-4"
              >
                contact form
              </Link>
              .
            </p>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-bear/25">
          <div className="text-[0.6rem] tracking-[0.25em] uppercase text-stone mb-4">
            Required Disclosure
          </div>
          <p className="font-serif text-[1rem] md:text-[1.15rem] leading-[1.6] text-ivory">
            {disclaimer}
          </p>
        </div>
      </div>
    </main>
  );
}
