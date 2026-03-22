'use client';

import { useState } from 'react';

const TABS = [
  { id: 'structure', label: 'Market Structure' },
  { id: 'orderblocks', label: 'Order Blocks' },
  { id: 'liquidity', label: 'Liquidity' },
  { id: 'fvg', label: 'Fair Value Gaps' },
  { id: 'killzones', label: 'Killzones' },
  { id: 'timeprice', label: 'Time & Price' }
];

const CARDS = {
  // ... existing cards ...
  structure: [
    { icon: '📈', title: 'Market Structure Shift (MSS)', desc: 'The first structural signal that institutional bias has reversed. Price violates a significant swing leaving a displacement candle and FVG. MSS + liquidity sweep = the highest-probability ICT entry model.' },
    { icon: '🔄', title: 'Break of Structure (BOS)', desc: 'Confirms trend continuation. Each successive BOS in trend direction validates institutional order flow. Trade with BOS, never against it unless a CHoCH precedes it.' },
    { icon: '↕️', title: 'Change of Character (CHoCH)', desc: 'The first warning of reversal — a shift against the prevailing trend. Unlike BOS which confirms trend, CHoCH warns of exhaustion forming at premium or discount zones.' },
    { icon: '🎯', title: 'Inducement & Fake Moves', desc: 'Smart Money engineers fake breakouts to harvest retail stop losses. Identifying inducement before the real move separates consistently profitable traders from the crowd.' }
  ],
  orderblocks: [
    { icon: '🧱', title: 'Bullish Order Block', desc: 'The last bearish candle before a significant up-move. Institutional buy orders remain embedded here. When price returns, those orders trigger — producing a high-probability long entry with a tight stop.' },
    { icon: '🧱', title: 'Bearish Order Block', desc: 'The last bullish candle before a significant down-move. Institutional sell orders live here. Price returning to this zone offers premium short entries with clearly defined risk.' },
    { icon: '💎', title: 'Mitigation Block', desc: 'An order block partially mitigated — price visited but didn\'t fully react. Remaining unfilled orders create a potent second-reaction zone, often more powerful than the original block.' },
    { icon: '🔁', title: 'Breaker Block', desc: 'A failed order block that\'s been broken through. When price returns, the broken structure flips and acts as resistance/support in the opposite direction.' }
  ],
  liquidity: [
    { icon: '🎯', title: 'Buy-Side Liquidity (BSL)', desc: 'Stop losses of short traders cluster above swing highs and equal highs. Institutions hunt this liquidity before reversing down — selling directly into retail buy orders at the top.' },
    { icon: '🎯', title: 'Sell-Side Liquidity (SSL)', desc: 'Stop losses of long traders cluster below swing lows. Institutions sweep these stops, collecting inventory at discounted prices before the real bullish move begins.' },
    { icon: '💧', title: 'Equal Highs / Equal Lows', desc: 'When price forms two or more equal highs/lows, retail places orders just beyond them. This creates a precision liquidity pool that institutions specifically target.' },
    { icon: '🌊', title: 'Liquidity Sweep Protocol', desc: 'The full sequence: sweep liquidity → engulf → create displacement → leave MSS. This four-step pattern is the highest-probability ICT entry model in any timeframe.' }
  ],
  fvg: [
    { icon: '📊', title: 'Fair Value Gap (FVG)', desc: 'A 3-candle pattern where candle 1\'s high and candle 3\'s low don\'t overlap. Price moved so aggressively that an imbalance remains. Price gravitates back to fill this gap.' },
    { icon: '⚡', title: 'Inverse FVG (IFVG)', desc: 'When a bullish FVG is violated bearishly, it inverts to resistance. When a bearish FVG is violated bullishly, it becomes support. IFVGs mark the most precise entry zones.' },
    { icon: '🔷', title: 'Consequent Encroachment (CE)', desc: 'The 50% midpoint of a Fair Value Gap. Price typically reaches the CE before rejecting or filling fully. CE is a key target and precision entry refinement level.' },
    { icon: '💥', title: 'Volume Imbalance', desc: 'Identified on candle bodies. Shows where price transacted so rapidly that two-way business wasn\'t conducted — a strong magnet for price to return and rebalance.' }
  ],
  killzones: [
    { icon: '🌅', title: 'London Killzone (2–5 AM EST)', desc: 'The highest-probability window. London desks open their books, hunting Asian session highs/lows. The London sweep + reversal is one of the most reliable setups in forex trading.' },
    { icon: '🌆', title: 'New York Killzone (7–10 AM EST)', desc: 'The second most powerful window. NY open creates displacement moves as US participants enter. The first 2–3 hours define daily bias and produce the day\'s cleanest setups.' },
    { icon: '🌙', title: 'Asian Range & Consolidation', desc: 'Asia builds the range that London and New York hunt. Equal highs and lows formed during Asian consolidation become primary liquidity pools for London\'s opening sweeps.' },
    { icon: '📅', title: 'NWOG & NDOG', desc: 'New Week and New Day Opening Gaps are powerful price magnets defining key premium/discount zones for daily and weekly trade objectives.' }
  ],
  timeprice: [
    { icon: '⏳', title: 'ICT Time & Price Theory', desc: 'The foundational law: Time defines WHERE price will go. Institutional algorithms operate on specific time cycles (Daily/Weekly/Monthly) to hunt liquidity and rebalance inefficiencies.' },
    { icon: '📊', title: 'Monthly Open Importance', desc: 'The Monthly Open price acts as a "Gravity Well". Trading above it is Premium (Sell Zone), trading below it is Discount (Buy Zone). All institutional bias stems from this single level.' },
    { icon: '🧭', title: 'HTF Directional Bias', desc: 'Use Monthly and Weekly charts to define the Institutional Order Flow. If the Monthly is bullish, you ONLY look for discount buys on lower timeframes during specific Killzones.' },
    { icon: '🔗', title: 'Multi-Timeframe Integration', desc: 'The bridge between HTF bias and LTF execution. Aligning Monthly direction with Daily displacement and 15m entry models produces the highest risk-to-reward setups.' }
  ]
};

export default function IctSmc() {
  const [activeTab, setActiveTab] = useState('structure');

  return (
    <>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-border-mid to-transparent" />
      <section id="ict" className="relative z-1 py-28 px-6 lg:px-16 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-5 before:content-[''] before:block before:w-7 before:h-[1px] before:bg-amber">
          Smart Money Concepts
        </div>
        <h2 className="font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-[1.1] text-ivory mb-5">
          The ICT / SMC <em className="italic text-gold-mid font-light">Framework</em>
        </h2>
        <p className="text-parchment max-w-[520px] mb-14 leading-[1.8]">
          The same playbook used by institutional desks at the world's largest banks — decoded for the independent trader.
        </p>

        <div className="flex gap-0 border-b border-border-subtle mb-10 overflow-x-auto custom-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 bg-transparent border-none border-b-2 font-sans text-[0.75rem] font-semibold tracking-[0.08em] uppercase whitespace-nowrap transition-all outline-none ${
                activeTab === tab.id 
                  ? 'text-gold-light border-gold' 
                  : 'text-stone border-transparent hover:text-cream'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-[fade-up_0.3s_ease_forwards]">
          {CARDS[activeTab as keyof typeof CARDS].map((card, i) => (
            <div 
              key={i} 
              className="bg-onyx border border-border-subtle rounded-[10px] p-7 md:px-8 cursor-pointer transition-all hover:border-border-mid hover:translate-x-1 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-transparent transition-colors group-hover:bg-gradient-to-b group-hover:from-gold group-hover:to-amber z-10" />
              <div className="text-[1.5rem] mb-4">{card.icon}</div>
              <div className="font-serif text-[1.1rem] font-semibold text-ivory leading-snug mb-2">{card.title}</div>
              <div className="text-[0.82rem] text-parchment leading-[1.7]">{card.desc}</div>
            </div>
          ))}
        </div>
      </section>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-border-mid to-transparent" />
    </>
  );
}
