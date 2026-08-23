/**
 * Education Center curriculum.
 *
 * Lives in lib rather than in the client component so the Markdown representation
 * served to agents and the rendered page read from one source. `body` is the lesson
 * HTML injected into the modal.
 */

export interface Lesson {
  id: string;
  badge: string;
  color: 'found' | 'ict' | 'flow' | 'adv';
  title: string;
  desc: string;
  /** Display string for lesson count and duration, e.g. "18 lessons · 4.2 hrs". */
  meta: string;
  hasPreview: boolean;
  body: string;
}

export const LESSONS: Record<string, Lesson> = {
  basics: {
    id: 'basics',
    badge: 'Foundations',
    color: 'found' as const,
    title: 'Market Fundamentals & Candlestick Mastery',
    desc: 'How markets move, how to read price action, and why candlesticks reveal the entire buyer/seller battle in a single bar.',
    meta: '18 lessons · 4.2 hrs',
    hasPreview: true,
    body: `
    <h2>What is a Financial Market?</h2>
    <p>A financial market is where buyers and sellers exchange instruments — currencies, stocks, commodities, crypto. Every price movement is the result of the constant battle between bulls and bears. Your job is to read that battle before it ends.</p>
    <div class="lesson-hl">"Every candle tells a story. A large bullish body says buyers won decisively. A long upper wick says sellers rejected higher prices. Read the story — don't just see a chart."</div>
    <h2>The Four Candle Components</h2>
    <ul><li>Open — where price started in this period</li><li>Close — where price ended (determines bull/bear colour)</li><li>High & Low — the wicks, showing the extremes reached</li><li>Body — larger body = stronger conviction from buyers or sellers</li></ul>
    <h2>Key Patterns to Master</h2>
    <p>Doji (indecision), Engulfing (reversal), Hammer (bullish rejection), Pin Bar (strong rejection of a level). In ICT methodology, patterns alone mean nothing — context is everything. A hammer at a swept SSL level after a CHoCH is a sniper entry. The same hammer at a random price is noise.</p>
    <h2>Market Sessions</h2>
    <p>Asian session is calm and builds the range. London session is aggressive and hunts that range. New York session confirms or reverses the London move. Understanding this rhythm is the foundation of all time-based ICT analysis.</p>
    `
  },
  ict: {
    id: 'ict',
    badge: 'ICT / SMC',
    color: 'ict' as const,
    title: 'Order Blocks, Fair Value Gaps & Liquidity',
    desc: 'How Smart Money moves markets — order blocks, FVGs, liquidity sweeps, breaker blocks, and the full ICT model.',
    meta: '32 lessons · 8.5 hrs',
    hasPreview: true,
    body: `
    <h2>The ICT Philosophy</h2>
    <p>Inner Circle Trader methodology teaches you to see markets as institutions see them. Banks move billions. They cannot hide their footprints. Those footprints — in order blocks, FVGs, and liquidity pools — are exactly what we trade.</p>
    <div class="lesson-hl">"Smart Money doesn't chase breakouts. They engineer them to fill orders against retail flow. The moment you understand this, the market becomes transparent."</div>
    <h2>The Three ICT Pillars</h2>
    <ul><li>Premium & Discount — always buy below the 50% equilibrium, sell above it</li><li>Institutional Order Flow — establish HTF bias first, then drop to LTF for entry</li><li>Time & Price Theory — certain times (killzones) produce the most reliable setups</li></ul>
    <h2>Order Blocks</h2>
    <p>An order block is the last opposing candle before a significant impulsive move. Bullish OB = last down candle before a strong up-move. When price returns, institutional orders trigger and create a reaction. Entry zone with stop below OB low.</p>
    <h2>Fair Value Gaps</h2>
    <p>When candle 1's high and candle 3's low don't overlap — an FVG exists. Price moved so fast that two-way business wasn't conducted. Price gravitates back to fill this imbalance. FVG + OB + liquidity sweep = the holy trinity of ICT setups.</p>
    `
  },
  orderflow: {
    id: 'orderflow',
    badge: 'Order Flow',
    color: 'flow' as const,
    title: 'Order Flow, Delta & Depth of Market',
    desc: 'Footprint charts, cumulative delta, volume profiles, and DOM ladder reading — see what price action deliberately hides.',
    meta: '24 lessons · 6.1 hrs',
    hasPreview: true,
    body: `
    <h2>What Order Flow Reveals</h2>
    <p>Candlestick charts show you the result of trading. Order flow shows you the process — who bought, who sold, at what price, in what volume. This is the closest retail traders get to seeing the actual institutional order book.</p>
    <div class="lesson-hl">"Delta divergence is one of the most powerful confirmation signals. Price making a new high while delta makes a lower high means the move was driven by passive sellers — not aggressive buyers. A reversal is forming."</div>
    <h2>Cumulative Delta</h2>
    <p>Delta = Aggressive Buy Volume minus Aggressive Sell Volume. Positive rising delta = buyers in control. Negative falling = sellers dominate. Divergence between price and delta reveals hidden pressure about to manifest in price movement.</p>
    <h2>Depth of Market (DOM)</h2>
    <p>The DOM shows all pending limit orders at each price level. Large clusters mark where institutions defend positions. When a massive bid wall is eaten through, it triggers a cascade. Reading the DOM tells you where the fight happens before price arrives.</p>
    <h2>Volume Profile</h2>
    <p>Shows volume distribution across price levels. The Point of Control (POC) is the highest-volume price — a strong magnet. Price outside the Value Area has a strong statistical tendency to return inside it.</p>
    `
  },
  forex: {
    id: 'forex',
    badge: 'Forex',
    color: 'found' as const,
    title: 'Forex Deep Dive: Pairs, Sessions & Macro',
    desc: 'Pairs, pip values, session overlaps, central bank dynamics, COT reports, and macroeconomic drivers explained clearly.',
    meta: '22 lessons · 5.0 hrs',
    hasPreview: false,
    body: `
    <h2>Currency Pairs Explained</h2>
    <p>EUR/USD means you buy Euros, sell US Dollars. Base currency first, quote currency second. Major pairs (EUR/USD, GBP/USD, USD/JPY) have the tightest spreads and deepest liquidity. Understand both currencies independently before trading crosses.</p>
    <div class="lesson-hl">"The best forex traders are economists first, technicians second. Understanding why a currency should move gives you the conviction to stay in trades. The chart tells you when. The macro tells you where it's ultimately going."</div>
    <h2>Central Bank Dynamics</h2>
    <p>Central banks set interest rates and drive long-term currency trends. Higher rates attract capital (currency appreciates). Understanding Fed, ECB, BOE, and BOJ policy cycles is essential for weekly and monthly directional bias.</p>
    <h2>COT Report</h2>
    <p>The Commitment of Traders report reveals positioning of commercials (smart money), large speculators (funds), and small speculators (retail). When commercials are heavily net long and retail is net short — that's your highest-conviction directional trade.</p>
    `
  },
  risk: {
    id: 'risk',
    badge: 'Risk',
    color: 'adv' as const,
    title: 'Risk Management & Trade Psychology',
    desc: 'The 2% rule, position sizing, expectancy formulas, max drawdown thresholds, and building an unbreakable trading mindset.',
    meta: '16 lessons · 3.8 hrs',
    hasPreview: false,
    body: `
    <h2>The Foundation of Survival</h2>
    <p>No edge can save a trader with poor risk management. The goal is not to never lose — it's to ensure losses can never destroy you. A temporary drawdown is recoverable. A blown account is not.</p>
    <div class="lesson-hl">"Risk 2% per trade. At 2%, you need 50 consecutive losing trades to blow your account. A strategy with 50% win rate would need extraordinary bad luck to produce that — and it gives your edge the time it needs to play out."</div>
    <h2>Position Sizing Formula</h2>
    <p>Risk Amount ($) ÷ (Stop Loss in pips × Pip Value) = Lot Size. Example: $200 risk ÷ (20 pips × $10/pip) = 1.0 lot. Always calculate before entering. Never size by feel.</p>
    <h2>Expectancy</h2>
    <p>Expectancy = (Win Rate × Average Win) − (Loss Rate × Average Loss). A 40% win rate strategy with 3:1 R:R gives: (0.4 × 3) − (0.6 × 1) = 0.6. Every $1 risked returns $0.60 on average. Positive expectancy + consistent execution = long-term profitability.</p>
    <h2>The Psychology Traps</h2>
    <ul><li>Revenge trading — taking impulsive trades after losses to "make it back"</li><li>FOMO — entering late because you fear missing the move</li><li>Moving stops — widening stops when the market moves against you</li><li>Overtrading — low-quality setups just to stay active</li></ul>
    `
  },
  advanced: {
    id: 'advanced',
    badge: 'Advanced',
    color: 'adv' as const,
    title: 'CISD, MSS & Optimal Trade Entry',
    desc: 'Change in State of Delivery, Market Structure Shifts, OTE Fibonacci model, and multi-timeframe confluence stacking.',
    meta: '28 lessons · 7.2 hrs',
    hasPreview: false,
    body: `
    <h2>Change in State of Delivery (CISD)</h2>
    <p>CISD is the earliest confirmation of a directional change. A candle closing below the open of a previous bullish displacement candle. CISD combined with a liquidity sweep is the sniper-precision entry model in ICT.</p>
    <div class="lesson-hl">"CISD is your confirmation. Liquidity sweep is your context. FVG is your entry zone. When all three align on the correct timeframe at the correct session time — that is the ICT entry model at its highest probability."</div>
    <h2>Optimal Trade Entry (OTE)</h2>
    <p>Draw Fibonacci from a significant swing low to swing high. The OTE zone is between 61.8% and 79% retracement — where institutions re-enter in the trend direction after pulling back to induce retail breakout traders. OTE combined with an order block is the most precise entry available.</p>
    <h2>Multi-Timeframe Analysis</h2>
    <p>Monthly/Weekly establishes draw on liquidity and macro bias. Daily/4H identifies the order blocks and FVGs price is targeting. 1H/15m/5m provides the precise entry trigger. Never take a LTF signal that conflicts with HTF bias.</p>
    <h2>The Judas Swing</h2>
    <p>The fake move in the first 30–60 minutes of London or New York. Price moves aggressively in the wrong direction, triggering retail stops and inducing breakout traders, then reverses hard. Fading the Judas Swing is one of the cleanest ICT setups in existence.</p>
    `
  }
};
