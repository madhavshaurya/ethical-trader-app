import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG, ACCOUNT_MANAGEMENT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Account Handling Management | Managed Trading Accounts',
  description:
    'Professional traders manage your capital across Indian Equity, F&O and Forex. Minimum ₹1,00,000, a 20% risk ceiling, and a 60/40 profit split settled weekly. Not SEBI Registered.',
  alternates: {
    canonical: '/account-management',
  },
  openGraph: {
    title: 'Account Handling Management | TheEthicalTrader',
    description:
      'Your capital, managed by professional traders across Indian Equity, F&O and Forex. Every commercial term published up front. Not SEBI Registered — market risks apply.',
    url: '/account-management',
    type: 'website',
  },
};

const {
  minCapital,
  maxCapital,
  riskOnCapital,
  payoutCycle,
  profitSplit,
  indicativeReturns,
  markets,
  disclaimer,
} = ACCOUNT_MANAGEMENT;

/* ------------------------------------------------------------------ */
/* Content — every figure below resolves from ACCOUNT_MANAGEMENT so    */
/* the page and the chatbot can never publish different terms.         */
/* ------------------------------------------------------------------ */

const HERO_STATS = [
  { label: 'Minimum Capital', value: minCapital, note: 'entry floor' },
  { label: 'Risk on Capital', value: riskOnCapital, note: 'maximum exposure', tone: 'risk' },
  { label: 'You Keep', value: `${profitSplit.client}%`, note: 'of profit' },
  { label: 'Settlement', value: payoutCycle, note: 'paid out' },
] as const;

const LEDGER_ROWS: {
  label: string;
  value: string;
  tone?: 'risk';
  stamp?: string;
}[] = [
  { label: 'Minimum capital', value: minCapital },
  { label: 'Maximum capital', value: `${maxCapital} — depends on you` },
  { label: 'Risk on capital', value: `${riskOnCapital} — maximum drawdown exposure`, tone: 'risk' },
  {
    label: 'Profit share',
    value: `${profitSplit.client}% client / ${profitSplit.house}% TheEthicalTrader`,
  },
  { label: 'Settlement frequency', value: payoutCycle },
  { label: 'Performance fee basis', value: 'Applies to profit only' },
  { label: 'Markets traded', value: markets.join(' · ') },
  { label: 'Method', value: 'Discretionary — strategy and experience based' },
  { label: 'Mandate options', value: 'Standard, or conservative on request' },
  { label: 'Indicative return', value: indicativeReturns, stamp: 'Indicative · Not guaranteed' },
  { label: 'Regulatory status', value: 'Not SEBI Registered', tone: 'risk' },
];

const SPLIT_POINTS = [
  'Weekly settlement, not quarterly — you see the outcome while it is still recent enough to act on.',
  'Payout mechanics, timing and record-keeping are yours to settle before any capital is committed — ask for them explicitly and get the answers confirmed.',
];

const QUALIFY = [
  'You have at least ₹1,00,000 you can leave deployed, and it is genuinely surplus capital.',
  'You accept a 20% risk ceiling on that capital, and you understand it is a discipline rather than a guarantee.',
  'You want exposure to Indian Equity, F&O and Forex without running the trades, the screens or the decisions yourself.',
  'You would rather read the terms on a public page than be walked through them by a salesperson.',
  'You have read the risk statement above and you are proceeding with your eyes open on our regulatory standing.',
];

const DISQUALIFY = [
  'The ₹1,00,000 is borrowed, is your emergency fund, or is money you will need back on a fixed date.',
  'You want a guaranteed, fixed or assured monthly return. Nobody can honestly offer you that, and we will not.',
  'A 20% drawdown on this capital would cause you real financial or personal harm.',
  'A losing week would cause you to panic, or to fall out with us. There will be losing weeks.',
  'You want the final say on individual trades. This is a discretionary mandate — if you want to pull the trigger yourself, take our education route instead.',
  'You are trying to recover previous market losses quickly. That is the worst possible reason to hand capital to anyone, including us.',
  'You require a SEBI-regulated structure with statutory protection. Use a SEBI-registered portfolio manager instead — that is the correct answer for you, and we will tell you so.',
];

const PROCESS = [
  {
    step: '01',
    title: 'Conversation',
    body: 'Message us on Telegram and tell us what you are considering placing, what you want from it, and what you are afraid of. Ask everything — custody, access, withdrawals, reporting, worst case. You get straight answers before you are asked for anything, and we will tell you plainly when the answer is that this is not right for you.',
  },
  {
    step: '02',
    title: 'Mandate',
    body: 'Ask for every term before you commit anything — capital, the 20% risk ceiling, the 60 / 40 weekly split, custody, access, withdrawal, and the operating arrangement for your account — and get each answer confirmed. If you want the conservative, safety-first mandate, this is where you ask for it. If any answer is vague, do not proceed until it is not.',
  },
  {
    step: '03',
    title: 'Funding and Deployment',
    body: 'Only once the mandate is agreed does anything get traded. You fund from ₹1,00,000 upward — there is no upper limit, and that part depends on you. From that point your capital is worked across Indian Equity, F&O and Forex as setups present themselves.',
  },
  {
    step: '04',
    title: 'Weekly Settlement',
    body: 'At the end of each week, profit is calculated and split 60 / 40, and your 60% is settled. Where there is no profit, there is no performance fee. Adding to, reducing or stopping the mandate follows the terms you agree before you fund.',
  },
];

const METHOD_CARDS = [
  {
    index: 'Market 01',
    title: 'Indian Equity',
    body: 'Positions in Indian listed equity, selected on structure and sized against the same risk ceiling that governs everything else in the account.',
  },
  {
    index: 'Market 02',
    title: 'F&O (Futures & Options)',
    body: 'Index and stock derivatives, used to express a view with defined risk rather than to stack leverage for its own sake. That leverage is exactly why the 20% ceiling is the most important number in the mandate.',
  },
  {
    index: 'Market 03',
    title: 'Forex',
    body: 'Major currency pairs, traded on the same setup discipline that governs the rest of the book.',
  },
];

const METHOD_TAGS = [
  'Best-possible setups',
  'Low risk, high reward',
  'Strategy and experience led',
  'No trade is a position',
];

const FAQS: { q: string; a: string[]; flagged?: boolean }[] = [
  {
    q: 'Who actually holds the money?',
    a: [
      'Custody, access and the operating arrangement for your account are not something we will reduce to a one-line marketing answer on a web page — they are settled with you directly. Ask on Telegram, and insist on a clear answer before you are ever asked to send anything. If the answer is vague, that is your signal, not ours.',
    ],
  },
  {
    q: 'Can I withdraw my capital?',
    a: [
      'The capital is yours. Withdrawal terms — notice, timing, and how it interacts with an open book — are not published here, so treat them as unsettled until you have settled them. If a specific withdrawal condition matters to you, raise it in the first conversation and get the answer in writing. Do not fund on an assumption.',
    ],
  },
  {
    q: 'What happens if you lose my money?',
    a: [
      'The 20% figure is the maximum drawdown exposure the mandate is built to work within. But losses sit with your capital — that is exactly what “we do not take any responsibility for your loss” means, and we are not going to phrase it more gently than that.',
      'There is no clause anywhere in this arrangement that makes us liable for a market loss. What we can tell you is that our 40% is a performance fee and it applies to profit only.',
    ],
  },
  {
    q: 'Why are you not SEBI Registered?',
    flagged: true,
    a: [
      'Because we are not, and we would rather say so in display type near the top of this page than hide it in grey at the bottom. SEBI registration as a research analyst, investment adviser or portfolio manager is a specific licence, and we do not hold one.',
      'In practice that means no regulated redress, no statutory protection, and no SEBI-supervised structure around this mandate. You would be working with us on the strength of the published terms, the transparency, and your own judgement — nothing else. If you need a regulated structure, the correct decision is a SEBI-registered portfolio manager, and we will say that to your face.',
    ],
  },
  {
    q: 'Is 10–20% per month guaranteed?',
    a: [
      'No. It is indicative — a range this mandate works toward in a normal month — and it varies entirely with the setups available. Some months the market simply does not offer them. Anyone quoting you an assured monthly return on market capital is either misinformed or lying to you.',
    ],
  },
  {
    q: 'Do you publish a track record?',
    a: [
      'No. There are no performance screenshots, verified statements or historical results on this page, and you should treat that absence as information rather than gloss over it. Every figure here is a stated term of the mandate, not a result we are claiming to have produced. Ask us directly on Telegram how we trade and judge the answers for yourself.',
    ],
  },
  {
    q: 'Can I start with less than ₹1,00,000?',
    a: [
      'No. ₹1,00,000 is the floor and it is not negotiable — below it, the position sizing needed to run a controlled mandate stops working. There is no upper limit; how far beyond the minimum you go is entirely your decision.',
    ],
  },
  {
    q: 'Can you trade my account more conservatively?',
    a: [
      'Yes. A conservative, safety-first mandate is available on request. Ask for it before capital is deployed and the terms are set accordingly.',
    ],
  },
];

const TERM_LINE = [
  `${minCapital} minimum`,
  'No upper limit',
  `${riskOnCapital} risk ceiling`,
  `${profitSplit.label} split`,
  'Settled weekly',
];

/* ------------------------------------------------------------------ */
/* Local primitives                                                     */
/* ------------------------------------------------------------------ */

function Rail({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-stone mb-5">
      ◈ {children}
    </div>
  );
}

function AlertIcon({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */

export default function AccountManagementPage() {
  return (
    <main className="pt-32 pb-24 px-6 lg:px-16 min-h-screen bg-void relative overflow-hidden">
      {/* Decorative gradient spot */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto relative z-10">
        {/* ============================= HERO ============================= */}
        <section className="max-w-[820px] animate-[fade-up_0.7s_ease_forwards]">
          <div className="flex items-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-6 before:content-[''] before:block before:w-10 before:h-[1px] before:bg-amber">
            Account Handling Management
          </div>

          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] text-ivory mb-4">
            Your Capital. <em className="italic text-gold-mid">Our Expertise.</em>
          </h1>

          <div className="font-mono text-[0.68rem] tracking-[0.28em] uppercase text-gold-mid/80 mb-8 leading-[2]">
            Trade Smart. Trade Ethically.
          </div>

          <p className="text-parchment leading-[1.8] text-[1.02rem] max-w-[62ch] mb-10">
            Professional traders manage your capital on your behalf across Indian Equity, F&amp;O and
            Forex. Every term of that mandate is printed on this page — the minimum, the risk
            ceiling, the split, the settlement cycle and our regulatory standing. You should not
            have to ask for any of it, and nothing about this service is disclosed only after you
            have funded it.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-subtle rounded-xl overflow-hidden border border-border-subtle mb-10">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="bg-onyx px-5 py-6 text-center">
                <div className="text-[0.55rem] font-bold tracking-[0.28em] uppercase text-stone mb-2">
                  {stat.label}
                </div>
                <div
                  className={`font-mono text-[1.15rem] md:text-[1.35rem] leading-none ${
                    'tone' in stat ? 'text-bear' : 'text-gold-light'
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-[0.6rem] text-stone mt-2 italic">{stat.note}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <Button
              variant="primary"
              href={SITE_CONFIG.links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-10"
            >
              Discuss Your Mandate on Telegram
            </Button>
            <a
              href="#terms"
              className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-parchment hover:text-gold-light transition-colors inline-flex items-center justify-center gap-2"
            >
              Read the full terms <span aria-hidden="true">↓</span>
            </a>
          </div>

          <p className="mt-6 flex items-start gap-3 text-[0.78rem] text-bear leading-relaxed max-w-[62ch]">
            <AlertIcon size={14} className="shrink-0 mt-[3px]" />
            <span>
              {disclaimer} Read the full risk statement below before you send anything to anyone —
              including us.
            </span>
          </p>
        </section>

        {/* ============================ TERMS ============================ */}
        <section id="terms" className="scroll-mt-32 mt-24 md:mt-32">
          <Rail>01 — Terms</Rail>
          <h2 className="font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] font-light text-ivory mb-4">
            The Complete Commercial Terms
          </h2>
          <p className="text-parchment leading-[1.8] text-[0.95rem] max-w-[640px] mb-12">
            Every commercial term of this mandate is listed below. There is no separate schedule, no
            tier, and no clause that appears only once you have funded.
          </p>

          <div className="rounded-xl border border-border-mid bg-onyx overflow-hidden">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />
            <dl className="divide-y divide-border-subtle">
              {LEDGER_ROWS.map((row) => (
                <div
                  key={row.label}
                  className="px-6 md:px-8 py-5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4"
                >
                  <dt className="flex items-baseline gap-4 flex-1 text-[0.6rem] font-bold tracking-[0.22em] uppercase text-stone after:content-[''] after:hidden sm:after:block after:flex-1 after:border-b after:border-dotted after:border-border-subtle after:-translate-y-[3px]">
                    {row.label}
                  </dt>
                  <dd
                    className={`font-mono text-[0.9rem] md:text-[0.95rem] sm:text-right shrink-0 ${
                      row.tone === 'risk' ? 'text-bear' : 'text-gold-light'
                    }`}
                  >
                    {row.value}
                    {row.stamp && (
                      <span className="block sm:inline-flex items-center rotate-[-4deg] sm:rotate-[-6deg] border border-amber/50 rounded-full px-3 py-1 text-[0.55rem] font-bold tracking-[0.25em] uppercase text-amber-lt bg-amber-glow mt-2 sm:mt-0 sm:ml-3 sm:align-middle w-fit">
                        {row.stamp}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-8 border-l-2 border-gold-deep pl-5 text-[0.85rem] leading-[1.75] text-parchment max-w-[640px]">
            {riskOnCapital} is a risk figure, not a return figure. It describes how much of your
            capital can be exposed to loss — not what you should expect to make. Those two numbers
            are confused constantly in this industry, and the confusion always favours whoever is
            selling. We would rather you read it correctly and walk away than misread it and stay.
          </p>
        </section>

        {/* ====================== RISK STATEMENT ========================= */}
        <section className="mt-24 md:mt-32">
          <div className="relative rounded-2xl border border-bear/35 bg-bear-dim p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[repeating-linear-gradient(135deg,#E04545_0px,#E04545_1px,transparent_1px,transparent_11px)]" />
            <div className="absolute top-4 left-4 w-5 h-5 border-l border-t border-bear/60 pointer-events-none" />
            <div className="absolute top-4 right-4 w-5 h-5 border-r border-t border-bear/60 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-5 h-5 border-l border-b border-bear/60 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-r border-b border-bear/60 pointer-events-none" />

            <div className="relative z-10 max-w-[720px]">
              <div className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-stone mb-4">
                ◈ 02 — Regulatory Standing
              </div>
              <div className="flex items-center gap-3 text-[0.6rem] font-bold tracking-[0.3em] uppercase text-bear mb-6">
                <AlertIcon size={16} className="shrink-0" />
                Risk Statement — Read This
              </div>

              {/* Rendered from the constant, never retyped — this is the sentence that
                  must stay character-for-character identical everywhere it appears. */}
              <h2 className="font-serif text-[clamp(1.5rem,3.4vw,2.35rem)] font-light leading-[1.35] text-ivory mb-7">
                {disclaimer}
              </h2>

              <div className="text-parchment text-[0.92rem] leading-[1.85] space-y-4">
                <p>
                  That sentence appears three times on this page — in the hero, here, and above the
                  final call to action — printed in full and unabbreviated each time, because it is
                  the most important thing on it. We are not a SEBI-registered research
                  analyst, investment adviser or portfolio manager. This is not a regulated portfolio
                  management service, and it carries no statutory protection, no regulated grievance
                  route and no compensation mechanism.
                </p>
                <p>
                  Every rupee placed under this mandate is exposed to market risk, including the risk
                  of losing it. The {riskOnCapital} figure above is the exposure the mandate is built
                  to work within — it is not a guarantee that a loss will stop there, and no honest
                  trader would tell you otherwise. Losses sit with your capital. That is the plain
                  meaning of the sentence above, and we are not going to soften it.
                </p>
                <p>
                  If that is not a trade-off you are willing to make with this money, do not proceed.
                  We would genuinely rather you stopped reading here than found this out later.
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-bear/20">
                <div className="text-[0.6rem] font-bold tracking-[0.3em] uppercase text-gold-mid mb-4">
                  Our Side of It
                </div>
                <p className="text-[0.9rem] text-cream leading-[1.8]">
                  Anything not written on this page is not a promise we have made. If anyone quotes
                  you a return, a guarantee, a timeline or a term that does not appear above —
                  including us, in conversation — treat it as unverified until you have it in
                  writing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= PROFIT SPLIT ========================== */}
        <section className="mt-24 md:mt-32">
          <Rail>03 — Profit Sharing</Rail>
          <h2 className="font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] font-light text-ivory mb-4">
            You keep sixty. <em className="italic text-gold-mid">Settled weekly.</em>
          </h2>
          <p className="text-parchment leading-[1.8] text-[0.95rem] max-w-[620px] mb-14">
            Profit is split {profitSplit.label} in your favour and settled every week — not every
            quarter, and not at some distant exit. The {profitSplit.house}% is a performance fee and
            it applies to profit only.
          </p>

          {/* Signature device — the Split Meridian. The 6/4 flex ratio IS the number. */}
          <div className="relative max-w-[900px]">
            <div className="flex items-end mb-5">
              <div className="flex-[6] min-w-0 flex items-baseline gap-3">
                <span className="font-serif text-[clamp(3.2rem,8vw,6.5rem)] font-light leading-[0.8] text-gold-light">
                  {profitSplit.client}
                </span>
                <span className="font-mono text-[0.55rem] sm:text-[0.6rem] tracking-[0.28em] uppercase text-parchment">
                  Yours
                </span>
              </div>
              <div className="flex-[4] min-w-0 flex items-baseline justify-end gap-3">
                <span className="font-mono text-[0.55rem] sm:text-[0.6rem] tracking-[0.28em] uppercase text-stone">
                  Ours
                </span>
                <span className="font-serif text-[clamp(1.5rem,3vw,2.4rem)] font-light leading-[0.8] text-stone">
                  {profitSplit.house}
                </span>
              </div>
            </div>

            <div className="flex h-[64px] md:h-[78px] rounded-lg overflow-hidden border border-border-mid">
              <div className="basis-[60%] grow-0 shrink-0 min-w-0 bg-gradient-gold flex items-center px-3 md:px-7">
                <span className="font-mono text-[0.55rem] md:text-[0.6rem] font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase text-[#050300] whitespace-nowrap">
                  Client · {profitSplit.client}%
                </span>
              </div>
              <div className="basis-[40%] grow-0 shrink-0 min-w-0 bg-onyx flex items-center px-3 md:px-7 border-l border-gold/50 bg-[repeating-linear-gradient(45deg,rgba(201,149,42,0.09)_0px,rgba(201,149,42,0.09)_1px,transparent_1px,transparent_7px)]">
                <span className="font-mono text-[0.55rem] md:text-[0.6rem] tracking-[0.2em] md:tracking-[0.25em] uppercase text-parchment whitespace-nowrap">
                  <span className="lg:hidden">TET</span>
                  <span className="hidden lg:inline">TheEthicalTrader</span> · {profitSplit.house}%
                </span>
              </div>
            </div>

            <div className="hidden md:block absolute left-[60%] top-full">
              <div className="w-[1px] h-7 bg-gold/60" />
              <div className="-translate-x-1/2 mt-2 font-mono text-[0.58rem] tracking-[0.28em] uppercase text-gold-mid whitespace-nowrap">
                Weekly settlement
              </div>
            </div>
          </div>

          <ul className="list-none mt-16 space-y-4 max-w-[620px]">
            {SPLIT_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[0.88rem] text-cream leading-[1.7]">
                <span aria-hidden="true" className="text-gold-mid text-[0.7rem] mt-1 shrink-0">▸</span>
                {point}
              </li>
            ))}
          </ul>

          <p className="mt-10 font-mono text-[0.62rem] tracking-[0.15em] uppercase text-stone">
            {profitSplit.label} is the split of profit. It is not a return, and it applies to profit
            only.
          </p>
        </section>

        {/* ======================= RISK CEILING ========================== */}
        <section className="mt-24 md:mt-32 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 lg:gap-24 items-center">
          <div>
            <Rail>04 — Risk Architecture</Rail>
            <h2 className="font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-light text-ivory mb-8 leading-[1.25]">
              A ceiling you agreed to{' '}
              <em className="italic text-gold-mid">before we started.</em>
            </h2>

            <div className="space-y-6 text-parchment leading-[1.8] text-[1rem] max-w-[560px]">
              <p>
                Twenty percent is a limit on exposure — not a target, not a forecast, and not a
                number we aim to use. It defines how much of your capital can stand in front of the
                market at the worst point of a drawdown, and it is what governs position size on
                every trade taken for you.
              </p>
              <p>
                It is a discipline, not a guarantee. Markets gap, and no operator anywhere can
                honestly promise that a loss will stop at a stated line. We publish the ceiling in
                advance so that you can decide whether you are comfortable with it before a single
                trade is placed on your behalf, and so that you can hold us to it afterwards.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-border-subtle max-w-[560px]">
              <div className="text-[0.6rem] tracking-[0.25em] uppercase text-stone mb-4">
                Worked example
              </div>
              <div className="font-mono text-[1.05rem] md:text-[1.25rem] text-gold-light">
                {minCapital} × {riskOnCapital}
              </div>
              <p className="text-[0.85rem] text-parchment leading-[1.7] mt-4">
                On the minimum commitment, that is the slice of capital the mandate is built to keep
                exposure within — arithmetic, not a forecast. Scale the capital up and the ceiling
                scales with it. It stays a percentage at every size, which is why there is no upper
                limit.
              </p>
            </div>

            <p className="mt-8 border-l-2 border-bear/40 pl-5 font-serif italic text-[1.15rem] text-ivory leading-[1.6]">
              If a {riskOnCapital} drawdown on the capital you are considering would materially
              change your life, the correct amount to commit here is zero.
            </p>

            <div className="mt-10 p-7 rounded-xl bg-onyx border border-border-subtle hover:border-gold/30 transition-colors max-w-[560px]">
              <div aria-hidden="true" className="text-gold-light text-[1.4rem] mb-4 opacity-70">◈</div>
              <h3 className="font-serif text-[1.2rem] text-ivory mb-3">
                Conservative Mandate, On Request
              </h3>
              <p className="text-[0.88rem] text-parchment leading-relaxed">
                A safety-first version of this mandate is available if you ask for it: smaller
                position sizing, tighter exposure, fewer trades taken. Same weekly settlement, same{' '}
                {profitSplit.label} split — a slower, more defensive posture. Ask for it before
                anything is deployed. It is not a downgrade, and we will not try to talk you out of
                it.
              </p>
            </div>
          </div>

          {/* Signature device — the Capital Column. The 20% band IS the number. */}
          <div className="flex items-stretch gap-6 md:gap-8 mx-auto lg:mx-0">
            <div className="relative w-[66px] md:w-[92px] h-[300px] md:h-[400px] shrink-0 rounded-lg border border-border-mid bg-onyx overflow-hidden">
              <div className="h-[20%] w-full bg-bear-dim border-b border-bear/70 bg-[repeating-linear-gradient(-45deg,rgba(224,69,69,0.2)_0px,rgba(224,69,69,0.2)_1px,transparent_1px,transparent_6px)]" />
              <div className="h-[80%] w-full bg-gold-trace" />
            </div>
            <div className="flex flex-col justify-between py-1 text-left min-w-0">
              <div>
                <div className="w-7 h-[1px] bg-bear mb-3" />
                <div className="font-mono text-[0.6rem] tracking-[0.22em] uppercase text-bear">
                  {riskOnCapital} · Risk ceiling
                </div>
                <p className="text-[0.78rem] text-parchment leading-[1.6] mt-2 max-w-[160px]">
                  The maximum share of your capital exposed to the market.
                </p>
              </div>
              <div className="mt-auto">
                <div className="w-7 h-[1px] bg-gold/40 mb-3" />
                <div className="font-mono text-[0.6rem] tracking-[0.22em] uppercase text-parchment">
                  Capital base
                </div>
                <p className="text-[0.78rem] text-parchment leading-[1.6] mt-2 max-w-[160px]">
                  Sized, positioned and protected against that ceiling.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================== ELIGIBILITY ========================== */}
        <section className="mt-24 md:mt-32">
          <div className="text-center">
            <div className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-stone mb-5">
              ◈ 05 — Suitability
            </div>
            <h2 className="font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] font-light text-ivory mb-3">
              Two lists. Find yourself on one.
            </h2>
            <p className="text-parchment text-[0.95rem] max-w-[560px] mx-auto mb-14 opacity-80">
              This mandate suits a narrow kind of person. It is faster for both of us if you rule
              yourself out here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[980px] mx-auto items-stretch">
            <div className="p-8 rounded-xl bg-onyx border border-border-subtle hover:border-gold/30 transition-colors flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border-subtle">
                <div className="w-9 h-9 rounded-lg bg-carbon border border-border-subtle flex items-center justify-center shrink-0 text-gold-light">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-serif text-[1.25rem] text-ivory">
                  This is built for you if…
                </h3>
              </div>
              <ul className="list-none space-y-4">
                {QUALIFY.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.88rem] text-cream leading-[1.7]">
                    <span aria-hidden="true" className="text-gold-mid text-[0.7rem] mt-1 shrink-0">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-onyx border border-bear/20 hover:border-bear/40 transition-colors flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border-subtle">
                <div className="w-9 h-9 rounded-lg bg-carbon border border-border-subtle flex items-center justify-center shrink-0 text-bear">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
                  </svg>
                </div>
                <h3 className="font-serif text-[1.25rem] text-ivory">Do not proceed if…</h3>
              </div>
              <ul className="list-none space-y-4">
                {DISQUALIFY.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.88rem] text-parchment leading-[1.7]"
                  >
                    <span aria-hidden="true" className="text-bear/70 text-[0.7rem] mt-1 shrink-0">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ========================== PROCESS ============================ */}
        <section className="mt-24 md:mt-32 max-w-[900px]">
          <Rail>06 — How It Works</Rail>
          <h2 className="font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] font-light text-ivory mb-4">
            Four steps, and{' '}
            <em className="italic text-gold-mid">nothing moves until step three.</em>
          </h2>
          <p className="text-parchment text-[0.95rem] leading-[1.8] max-w-[560px] mb-14">
            No capital is committed on a phone call, and nothing about the arrangement is left
            verbal.
          </p>

          <ol className="list-none">
            {PROCESS.map((item) => (
              <li
                key={item.step}
                className="grid grid-cols-1 sm:grid-cols-[104px_1fr] gap-3 sm:gap-12 py-9 md:py-11 border-b border-border-subtle last:border-b-0"
              >
                <div className="font-serif text-[clamp(2.6rem,6vw,4rem)] font-light leading-[0.85] text-gold-deep sm:text-right sm:pt-1">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-serif text-[1.35rem] md:text-[1.5rem] text-ivory mb-3">
                    {item.title}
                  </h3>
                  <p className="text-parchment text-[0.94rem] leading-[1.8] max-w-[560px]">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* =========================== METHOD ============================ */}
        <section className="mt-24 md:mt-32">
          <div className="max-w-[720px] mb-14">
            <Rail>07 — Method &amp; Markets</Rail>
            <h2 className="font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] font-light text-ivory mb-6">
              Fewer trades. <em className="italic text-gold-mid">Better ones.</em>
            </h2>
            <div className="space-y-5 text-parchment leading-[1.8] text-[1rem]">
              <p>
                We trade on strategy and experience, not on volume. The best possible setups only —
                structurally clean, low risk against high reward, with the invalidation defined
                before entry. Where a setup is not clean, no trade is placed. Discretion is the
                method, and patience is most of the work.
              </p>
              <p>
                That is also why {indicativeReturns} is a range and not a figure. Return follows the
                setups the market actually offers, and the market does not offer them evenly. In a
                thin month we would rather take fewer positions than manufacture ones that were never
                there — sitting on our hands is part of the strategy, not a failure of it. There is
                no algorithm being sold here and no black box. A person makes each decision, and we
                can explain every one of them to you.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {METHOD_CARDS.map((card) => (
              <div
                key={card.title}
                className="p-8 lg:p-10 rounded-xl bg-onyx border border-border-subtle hover:border-gold/30 transition-colors flex flex-col"
              >
                <div className="w-10 h-[1px] bg-gradient-to-r from-gold to-transparent mb-6" />
                <div className="font-mono text-[0.58rem] tracking-[0.3em] uppercase text-stone mb-4">
                  {card.index}
                </div>
                <h3 className="font-serif text-[1.45rem] text-ivory mb-4">{card.title}</h3>
                <p className="text-[0.88rem] text-parchment leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6 text-[0.72rem] font-mono tracking-[0.16em] uppercase text-parchment">
            {METHOD_TAGS.map((tag, i) => (
              <span key={tag} className="flex items-center gap-3 sm:gap-6">
                {tag}
                {i < METHOD_TAGS.length - 1 && (
                  <span aria-hidden="true" className="hidden sm:inline text-gold-mid">
                    ▸
                  </span>
                )}
              </span>
            ))}
          </div>
        </section>

        {/* ============================ FAQ ============================== */}
        <section className="mt-24 md:mt-32 max-w-[860px] mx-auto">
          <div className="text-center">
            <div className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-stone mb-5">
              ◈ 08 — Objections
            </div>
            <h2 className="font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] font-light text-ivory mb-3">
              The questions you should be asking.
            </h2>
            <p className="text-parchment text-[0.95rem] mb-14 opacity-80">
              Including the two most people are too polite to ask.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className={`group rounded-xl bg-onyx border transition-colors overflow-hidden ${
                  faq.flagged
                    ? 'border-bear/25 open:border-bear/45'
                    : 'border-border-subtle open:border-gold/30'
                }`}
              >
                <summary className="list-none cursor-pointer flex items-start justify-between gap-6 p-6 md:px-7 select-none [&::-webkit-details-marker]:hidden">
                  <span className="font-serif text-[1.08rem] md:text-[1.15rem] text-ivory group-hover:text-gold-light transition-colors leading-snug flex items-start gap-3">
                    {faq.flagged && <AlertIcon size={16} className="shrink-0 mt-1 text-bear" />}
                    {faq.q}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    aria-hidden="true"
                    className="shrink-0 mt-1 text-gold-mid transition-transform duration-300 group-open:rotate-45"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </summary>
                <div className="px-6 md:px-7 pb-7 -mt-1">
                  <div className="h-px w-10 bg-border-mid mb-5" />
                  <div className="text-[0.88rem] text-parchment leading-[1.85] space-y-3">
                    {faq.a.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ========================= FINAL CTA =========================== */}
        <section className="mt-24 md:mt-32 relative rounded-2xl border border-border-mid bg-gradient-to-b from-carbon to-onyx px-6 py-14 md:px-14 md:py-20 text-center overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[420px] max-w-full h-[420px] bg-gold/[0.07] rounded-full blur-[110px] pointer-events-none" />

          <div className="relative z-10 max-w-[680px] mx-auto">
            <div className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-stone mb-5">
              ◈ 09 — Next Step
            </div>
            <div aria-hidden="true" className="text-gold-light text-[1.4rem] mb-6 opacity-70">◈</div>

            <h2 className="font-serif text-[clamp(2rem,4vw,3.1rem)] font-light leading-[1.15] text-ivory mb-6">
              Start with a conversation,{' '}
              <em className="italic text-gold-mid">not a transfer.</em>
            </h2>

            <p className="text-parchment leading-[1.8] text-[0.95rem] mb-8">
              There is no signup form on this page and no payment link, by design. The next step is a
              conversation on Telegram — bring every question raised above, ask for the conservative
              mandate if you want it, and get the terms confirmed in writing before any capital
              moves. If this is not right for you, we would rather establish that in the first ten
              minutes than in the first month.
            </p>

            <div className="font-mono text-[0.68rem] md:text-[0.72rem] tracking-[0.14em] uppercase text-parchment mb-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              {TERM_LINE.map((term, i) => (
                <span key={term} className="flex items-center gap-3">
                  {term}
                  {i < TERM_LINE.length - 1 && (
                    <span aria-hidden="true" className="text-gold/40">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>

            <Button
              variant="primary"
              href={SITE_CONFIG.links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-10"
            >
              Discuss Your Mandate on Telegram
            </Button>
            <div className="mt-4 text-[0.7rem] text-stone">
              Opens Telegram in a new tab · @TETscharts
            </div>

            <div className="mt-12 pt-8 border-t border-bear/25 max-w-[600px] mx-auto">
              <div className="text-[0.6rem] tracking-[0.25em] uppercase text-stone mb-4">
                Required Disclosure
              </div>
              <p className="font-serif text-[1rem] md:text-[1.15rem] leading-[1.6] text-ivory">
                {disclaimer}
              </p>
            </div>

            <div className="w-px h-10 bg-gradient-to-b from-transparent to-gold/40 mx-auto mt-12 mb-8" />
            <p className="font-serif italic text-[1.15rem] md:text-[1.35rem] text-gold-mid/85">
              Your Capital. Our Expertise. Trade Smart. Trade Ethically.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
