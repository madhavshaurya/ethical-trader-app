/**
 * The ICT / SMC concept library rendered by the framework section on the home page.
 *
 * Extracted from the client component so the Markdown representation served to agents
 * lists the same 24 concepts the page shows, from one source.
 */

export type IctTabId =
  | 'structure'
  | 'orderblocks'
  | 'liquidity'
  | 'fvg'
  | 'killzones'
  | 'timeprice';

export interface IctTab {
  id: IctTabId;
  label: string;
}

export interface IctConcept {
  /** Key into the IctIcon sprite set. */
  icon: string;
  title: string;
  desc: string;
}

export const TABS: IctTab[] = [
  { id: 'structure', label: 'Market Structure' },
  { id: 'orderblocks', label: 'Order Blocks' },
  { id: 'liquidity', label: 'Liquidity' },
  { id: 'fvg', label: 'Fair Value Gaps' },
  { id: 'killzones', label: 'Killzones' },
  { id: 'timeprice', label: 'Time & Price' }
];

export const CARDS: Record<IctTabId, IctConcept[]> = {
  structure: [
    { icon: 'mss', title: 'Market Structure Shift (MSS)', desc: 'The first structural signal that institutional bias has reversed. Price violates a significant swing leaving a displacement candle and FVG. MSS + liquidity sweep = the highest-probability ICT entry model.' },
    { icon: 'bos', title: 'Break of Structure (BOS)', desc: 'Confirms trend continuation. Each successive BOS in trend direction validates institutional order flow. Trade with BOS, never against it unless a CHoCH precedes it.' },
    { icon: 'choch', title: 'Change of Character (CHoCH)', desc: 'The first warning of reversal — a shift against the prevailing trend. Unlike BOS which confirms trend, CHoCH warns of exhaustion forming at premium or discount zones.' },
    { icon: 'inducement', title: 'Inducement & Fake Moves', desc: 'Smart Money engineers fake breakouts to harvest retail stop losses. Identifying inducement before the real move separates consistently profitable traders from the crowd.' }
  ],
  orderblocks: [
    { icon: 'obBull', title: 'Bullish Order Block', desc: 'The last bearish candle before a significant up-move. Institutional buy orders remain embedded here. When price returns, those orders trigger — producing a high-probability long entry with a tight stop.' },
    { icon: 'obBear', title: 'Bearish Order Block', desc: 'The last bullish candle before a significant down-move. Institutional sell orders live here. Price returning to this zone offers premium short entries with clearly defined risk.' },
    { icon: 'mitigation', title: 'Mitigation Block', desc: 'An order block partially mitigated — price visited but didn\'t fully react. Remaining unfilled orders create a potent second-reaction zone, often more powerful than the original block.' },
    { icon: 'breaker', title: 'Breaker Block', desc: 'A failed order block that\'s been broken through. When price returns, the broken structure flips and acts as resistance/support in the opposite direction.' }
  ],
  liquidity: [
    { icon: 'bsl', title: 'Buy-Side Liquidity (BSL)', desc: 'Stop losses of short traders cluster above swing highs and equal highs. Institutions hunt this liquidity before reversing down — selling directly into retail buy orders at the top.' },
    { icon: 'ssl', title: 'Sell-Side Liquidity (SSL)', desc: 'Stop losses of long traders cluster below swing lows. Institutions sweep these stops, collecting inventory at discounted prices before the real bullish move begins.' },
    { icon: 'equalHighsLows', title: 'Equal Highs / Equal Lows', desc: 'When price forms two or more equal highs/lows, retail places orders just beyond them. This creates a precision liquidity pool that institutions specifically target.' },
    { icon: 'sweep', title: 'Liquidity Sweep Protocol', desc: 'The full sequence: sweep liquidity → engulf → create displacement → leave MSS. This four-step pattern is the highest-probability ICT entry model in any timeframe.' }
  ],
  fvg: [
    { icon: 'fvg', title: 'Fair Value Gap (FVG)', desc: 'A 3-candle pattern where candle 1\'s high and candle 3\'s low don\'t overlap. Price moved so aggressively that an imbalance remains. Price gravitates back to fill this gap.' },
    { icon: 'ifvg', title: 'Inverse FVG (IFVG)', desc: 'When a bullish FVG is violated bearishly, it inverts to resistance. When a bearish FVG is violated bullishly, it becomes support. IFVGs mark the most precise entry zones.' },
    { icon: 'ce', title: 'Consequent Encroachment (CE)', desc: 'The 50% midpoint of a Fair Value Gap. Price typically reaches the CE before rejecting or filling fully. CE is a key target and precision entry refinement level.' },
    { icon: 'volumeImbalance', title: 'Volume Imbalance', desc: 'Identified on candle bodies. Shows where price transacted so rapidly that two-way business wasn\'t conducted — a strong magnet for price to return and rebalance.' }
  ],
  killzones: [
    { icon: 'london', title: 'London Killzone (2–5 AM EST)', desc: 'The highest-probability window. London desks open their books, hunting Asian session highs/lows. The London sweep + reversal is one of the most reliable setups in forex trading.' },
    { icon: 'newYork', title: 'New York Killzone (7–10 AM EST)', desc: 'The second most powerful window. NY open creates displacement moves as US participants enter. The first 2–3 hours define daily bias and produce the day\'s cleanest setups.' },
    { icon: 'asianRange', title: 'Asian Range & Consolidation', desc: 'Asia builds the range that London and New York hunt. Equal highs and lows formed during Asian consolidation become primary liquidity pools for London\'s opening sweeps.' },
    { icon: 'openingGap', title: 'NWOG & NDOG', desc: 'New Week and New Day Opening Gaps are powerful price magnets defining key premium/discount zones for daily and weekly trade objectives.' }
  ],
  timeprice: [
    { icon: 'timePrice', title: 'ICT Time & Price Theory', desc: 'The foundational law: Time defines WHERE price will go. Institutional algorithms operate on specific time cycles (Daily/Weekly/Monthly) to hunt liquidity and rebalance inefficiencies.' },
    { icon: 'monthlyOpen', title: 'Monthly Open Importance', desc: 'The Monthly Open price acts as a "Gravity Well". Trading above it is Premium (Sell Zone), trading below it is Discount (Buy Zone). All institutional bias stems from this single level.' },
    { icon: 'htfBias', title: 'HTF Directional Bias', desc: 'Use Monthly and Weekly charts to define the Institutional Order Flow. If the Monthly is bullish, you ONLY look for discount buys on lower timeframes during specific Killzones.' },
    { icon: 'multiTimeframe', title: 'Multi-Timeframe Integration', desc: 'The bridge between HTF bias and LTF execution. Aligning Monthly direction with Daily displacement and 15m entry models produces the highest risk-to-reward setups.' }
  ]
};
