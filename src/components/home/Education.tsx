'use client';

import { useState, useEffect, useRef } from 'react';

const LESSONS = {
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

const COLOR_MAP = {
  found: { bg: 'bg-[rgba(34,201,122,0.08)]', text: 'text-bull', border: 'border-[rgba(34,201,122,0.18)]' },
  ict: { bg: 'bg-[rgba(201,149,42,0.08)]', text: 'text-gold-light', border: 'border-[rgba(201,149,42,0.18)]' },
  flow: { bg: 'bg-[rgba(184,98,26,0.08)]', text: 'text-amber-lt', border: 'border-[rgba(184,98,26,0.18)]' },
  adv: { bg: 'bg-[rgba(200,131,78,0.08)]', text: 'text-copper-lt', border: 'border-[rgba(200,131,78,0.18)]' }
};

export default function Education() {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const activeLesson = activeLessonId ? LESSONS[activeLessonId as keyof typeof LESSONS] : null;
  
  useEffect(() => {
    if (activeLessonId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeLessonId]);

  return (
    <>
      <section id="learn" className="border-t border-border-subtle bg-void relative z-1">
        <div className="max-w-[1440px] mx-auto py-20 px-6 lg:px-16">
          <div className="flex items-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-5 before:content-[''] before:block before:w-7 before:h-[1px] before:bg-amber">
            Education Center
          </div>
          <h2 className="font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-[1.1] text-ivory mb-5">
            From Zero to <em className="italic text-gold-mid font-light">Institutional Edge</em>
          </h2>
          <p className="text-parchment max-w-[520px] mb-14 leading-[1.8]">
            Every lesson built by professional traders. No fluff, no theory for theory's sake — only what actually works in live markets.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.values(LESSONS).map((lesson) => (
              <LessonCard 
                key={lesson.id}
                {...lesson} 
                onClick={() => setActiveLessonId(lesson.id)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lesson Modal */}
      {activeLesson && (
        <div 
          className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-void/90 backdrop-blur-md transition-opacity"
          onClick={() => setActiveLessonId(null)}
        >
          <div 
            className="bg-onyx border border-border-mid rounded-xl w-full max-w-[840px] max-h-[85vh] flex flex-col relative shadow-[0_40px_100px_rgba(0,0,0,0.9)] animate-[fade-up_0.3s_ease_out] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#c9952a] before:via-[#e6c27a] before:to-[#c9952a] before:rounded-t-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex-none p-6 md:p-[2.25rem] pb-6 border-b border-border-subtle relative bg-carbon rounded-t-xl pr-14 md:pr-[2.25rem]">
              <button 
                onClick={() => setActiveLessonId(null)} 
                className="absolute top-5 right-5 md:top-6 md:right-6 w-8 h-8 flex items-center justify-center text-stone hover:text-ivory bg-void rounded-full border border-border-subtle hover:border-gold-mid transition-colors text-[0.8rem]"
              >
                ✕
              </button>
              <div className="mb-4">
                <span className={`inline-flex items-center px-2 py-[2px] rounded-sm text-[0.58rem] font-bold tracking-[0.15em] uppercase border ${COLOR_MAP[activeLesson.color].bg} ${COLOR_MAP[activeLesson.color].text} ${COLOR_MAP[activeLesson.color].border}`}>
                  {activeLesson.badge}
                </span>
              </div>
              <h2 className="font-serif text-xl md:text-[1.8rem] font-semibold text-ivory leading-tight">{activeLesson.title}</h2>
            </div>
            
            {/* Modal Body with injected HTML */}
            <div className="flex-1 overflow-y-auto p-6 md:p-[2.25rem] bg-onyx rounded-b-xl custom-scrollbar">
              <div 
                className="text-[0.88rem] text-parchment leading-[1.85] break-words [&>h2]:font-serif [&>h2]:text-[1.15rem] [&>h2]:font-semibold [&>h2]:text-gold-light [&>h2]:mt-7 [&>h2]:mb-3 [&>h2:first-child]:mt-0 [&>p]:mb-4 [&>ul]:list-none [&>ul]:mb-4 [&>ul>li]:relative [&>ul>li]:pl-5 [&>ul>li]:mb-1.5 [&>ul>li]:text-[0.86rem] [&>ul>li]:before:content-['▸'] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:text-amber-lt [&>.lesson-hl]:bg-[rgba(201,149,42,0.06)] [&>.lesson-hl]:border-l-[3px] [&>.lesson-hl]:border-gold-deep [&>.lesson-hl]:px-5 [&>.lesson-hl]:py-4 [&>.lesson-hl]:rounded-r-lg [&>.lesson-hl]:my-6 [&>.lesson-hl]:text-[0.95rem] [&>.lesson-hl]:text-ivory [&>.lesson-hl]:leading-[1.75] [&>.lesson-hl]:font-serif [&>.lesson-hl]:italic"
                dangerouslySetInnerHTML={{ __html: activeLesson.body }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LessonCard({ id, badge, title, desc, meta, color, hasPreview, onClick }: any) {
  const c = COLOR_MAP[color as keyof typeof COLOR_MAP];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!hasPreview || !canvasRef.current) return;
    
    // Slight delay to ensure layout computation is complete
    const timeoutId = setTimeout(() => {
      const cv = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext('2d');
      if (!ctx) return;
      
      cv.width = cv.offsetWidth || 330;
      cv.height = 150;
      const W = cv.width;
      const H = cv.height;

      if (id === 'basics') {
        const d = Array.from({length:20},()=>{const o=.4+Math.random()*.35,c=.4+Math.random()*.35;return{o,c,h:Math.max(o,c)+Math.random()*.12,l:Math.min(o,c)-Math.random()*.08}});
        const all = d.flatMap(x=>[x.h,x.l]), mn = Math.min(...all), mx = Math.max(...all), rng = mx-mn||.1;
        const py = (v: number) => 14+(H-24)-((v-mn)/rng)*(H-24), bw = (W-16)/20*.68;
        d.forEach((x,i)=>{const cx2=8+i*(W-16)/20+bw/2,b=x.c>=x.o;ctx.strokeStyle=b?'#22C97A':'#E04545';ctx.lineWidth=.75;ctx.beginPath();ctx.moveTo(cx2,py(x.h));ctx.lineTo(cx2,py(x.l));ctx.stroke();ctx.fillStyle=b?'rgba(34,201,122,.78)':'rgba(224,69,69,.78)';ctx.fillRect(cx2-bw/2,Math.min(py(x.o),py(x.c)),bw,Math.max(1,Math.abs(py(x.o)-py(x.c))))});
        ctx.fillStyle='rgba(201,149,42,.6)';ctx.font='10px Fira Code,monospace';ctx.fillText('Candlestick Chart',10,14);
      } 
      else if (id === 'ict') {
        ctx.fillStyle='rgba(34,201,122,.06)';ctx.strokeStyle='rgba(34,201,122,.35)';ctx.lineWidth=1;
        ctx.fillRect(W*.25,H*.48,W*.24,H*.38);ctx.strokeRect(W*.25,H*.48,W*.24,H*.38);
        ctx.fillStyle='rgba(34,201,122,.55)';ctx.font='9px Fira Code';ctx.fillText('OB',W*.27,H*.65);
        ctx.fillStyle='rgba(201,149,42,.07)';ctx.strokeStyle='rgba(201,149,42,.38)';
        ctx.fillRect(W*.52,H*.17,W*.2,H*.18);ctx.strokeRect(W*.52,H*.17,W*.2,H*.18);
        ctx.fillStyle='rgba(201,149,42,.6)';ctx.fillText('FVG',W*.54,H*.29);
        const pts=[.04,.84,.25,.66,.32,.34,.52,.22,.46,.5,.68,.26,.96,.08];
        ctx.beginPath();ctx.strokeStyle='rgba(201,149,42,.65)';ctx.lineWidth=1.4;
        for(let i=0;i<pts.length;i+=2) i===0?ctx.moveTo(pts[i]*W,pts[i+1]*H):ctx.lineTo(pts[i]*W,pts[i+1]*H);
        ctx.stroke();
        ctx.fillStyle='rgba(201,149,42,.6)';ctx.font='10px Fira Code';ctx.fillText('ICT Structure',10,14);
      }
      else if (id === 'orderflow') {
        const cols=13, cw2=W/cols;
        for(let i=0;i<cols;i++){const b=Math.random()*.7+.1,a=Math.random()*.6+.1;ctx.fillStyle='rgba(34,201,122,.3)';ctx.fillRect(i*cw2,H-b*(H*.42),cw2*.45,b*(H*.42));ctx.fillStyle='rgba(224,69,69,.3)';ctx.fillRect(i*cw2+cw2*.5,H-a*(H*.42),cw2*.45,a*(H*.42))}
        ctx.fillStyle='rgba(184,98,26,.6)';ctx.font='10px Fira Code';ctx.fillText('Footprint / Order Flow',10,14);
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [id, hasPreview]);

  return (
    <div 
      onClick={onClick}
      className={`bg-onyx border border-border-subtle rounded-[10px] overflow-hidden cursor-pointer transition-all hover:border-border-mid hover:-translate-y-[6px] hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)] relative group flex flex-col`}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-gold group-hover:to-amber-mid transition-all z-10" />
      
      {hasPreview && (
        <div className="h-[150px] bg-carbon relative flex items-center justify-center shrink-0 border-b border-border-subtle overflow-hidden">
          <canvas ref={canvasRef} style={{ width: '100%', height: '150px', display: 'block' }}></canvas>
        </div>
      )}
      
      <div className={`p-5 pb-7 flex flex-col flex-1 ${!hasPreview ? 'pt-7' : ''}`}>
        <div>
          <span className={`inline-flex items-center px-2 py-[2px] rounded-sm text-[0.58rem] font-bold tracking-[0.15em] uppercase border mb-3 ${c.bg} ${c.text} ${c.border}`}>
            {badge}
          </span>
          <div className="font-serif text-[1.1rem] font-semibold text-ivory leading-[1.3] mb-[0.6rem]">{title}</div>
          <div className="text-[0.8rem] text-parchment leading-[1.7] mb-4">{desc}</div>
        </div>
        <div className="mt-auto pt-4 flex justify-between items-center text-[0.68rem] text-stone">
          <span>{meta}</span>
          <span className="font-bold tracking-[0.08em] text-gold flex items-center gap-1">Open lesson →</span>
        </div>
      </div>
    </div>
  );
}
