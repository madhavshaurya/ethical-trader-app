import * as React from 'react';

/**
 * Diagrammatic icons for the ICT / SMC framework cards.
 *
 * Each one draws the actual price-action shape the concept describes — a structure
 * break really breaks a level, an FVG really shows the three-candle gap — so the icon
 * carries meaning instead of decorating the card. Emoji cannot do that, and they also
 * render in the OS colour palette, which fights the obsidian/gold system.
 *
 * All glyphs share a 24x24 grid, inherit colour via `currentColor`, and are decorative
 * (the card title carries the meaning for assistive tech).
 */

const LEVEL = { strokeDasharray: '2 2' } as const;

function Ico({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Zone rectangle (order block / gap band). */
function Zone(props: React.SVGProps<SVGRectElement>) {
  return <rect {...props} fill="currentColor" fillOpacity="0.18" strokeWidth="1" />;
}

/* ---------------------------- Market structure ---------------------------- */

// Downtrend making lower highs, then price breaks up through the last one.
const MSS = () => (
  <Ico>
    <line x1="2.5" y1="9" x2="21.5" y2="9" {...LEVEL} />
    <path d="M2.5 5 L6 12 L9 9 L12.5 16 L15.5 13 L21 3.5" />
    <path d="M21 3.5 L17.4 4.2 M21 3.5 L20.6 7" />
  </Ico>
);

// Uptrend making higher highs; the next one takes out the prior high — continuation.
const BOS = () => (
  <Ico>
    <line x1="2.5" y1="7" x2="21.5" y2="7" {...LEVEL} />
    <path d="M2.5 20 L6.5 13.5 L9.5 16.5 L13 8.5 L16 12 L21 3.5" />
    <path d="M21 3.5 L17.4 4.2 M21 3.5 L20.6 7" />
  </Ico>
);

// Uptrend that fails — the first leg back through the prior higher low.
const CHOCH = () => (
  <Ico>
    <line x1="2.5" y1="15" x2="21.5" y2="15" {...LEVEL} />
    <path d="M2.5 19 L6 12 L9 15 L12.5 7 L15.5 11 L21 20.5" />
    <path d="M21 20.5 L17.4 19.8 M21 20.5 L20.6 17" />
  </Ico>
);

// Stops resting above a level, swept by a spike, then price reverses away.
const INDUCEMENT = () => (
  <Ico>
    <line x1="2.5" y1="9" x2="21.5" y2="9" {...LEVEL} />
    <path d="M2.5 17 L6.5 13 L10.5 3.5 L12.5 10 L16 15 L21 19" />
    <path d="M14.5 5.2 L17 7.7 M17 5.2 L14.5 7.7" />
    <path d="M18.5 5.2 L21 7.7 M21 5.2 L18.5 7.7" />
  </Ico>
);

/* ------------------------------ Order blocks ------------------------------ */

// The last down candle before an up-move; price leaves the zone and rallies.
const OB_BULL = () => (
  <>
    <Zone x="2.5" y="14" width="7" height="6.5" rx="1" />
    <path d="M2.5 14 L2.5 20.5 L9.5 20.5 L9.5 14 Z" />
    <path d="M9.5 15.5 L14 10 L17 12.5 L21 4" />
    <path d="M21 4 L17.4 4.8 M21 4 L20.5 7.5" />
  </>
);

// The last up candle before a down-move.
const OB_BEAR = () => (
  <>
    <Zone x="2.5" y="3.5" width="7" height="6.5" rx="1" />
    <path d="M2.5 3.5 L2.5 10 L9.5 10 L9.5 3.5 Z" />
    <path d="M9.5 8.5 L14 14 L17 11.5 L21 20" />
    <path d="M21 20 L17.4 19.2 M21 20 L20.5 16.5" />
  </>
);

// Price taps only part of the zone, leaving unfilled orders behind.
const MITIGATION = () => (
  <>
    <Zone x="2.5" y="8" width="19" height="7" rx="1" />
    <line x1="2.5" y1="11.5" x2="21.5" y2="11.5" {...LEVEL} />
    <path d="M3 3.5 L8 3.5 L11.5 10.5 L15 3.5 L21 3.5" />
  </>
);

// A zone broken through; price returns and it holds from the other side.
const BREAKER = () => (
  <>
    <Zone x="2.5" y="9" width="19" height="6" rx="1" />
    <path d="M3.5 20.5 L9 20.5 L12 3.5 L15.5 12 L21 12" />
    <path d="M21 12 L18 10.6 M21 12 L18 13.4" />
  </>
);

/* -------------------------------- Liquidity ------------------------------- */

// Stop losses pooled above equal highs.
const BSL = () => (
  <Ico>
    <line x1="2.5" y1="6.5" x2="21.5" y2="6.5" {...LEVEL} />
    <path d="M4.5 3.5 L4.5 5.5 M9 3.5 L9 5.5 M13.5 3.5 L13.5 5.5 M18 3.5 L18 5.5" />
    <path d="M2.5 20 L7 12 L10.5 15.5 L14.5 6.8 L18 11 L21.5 6.8" />
  </Ico>
);

// Stop losses pooled below equal lows.
const SSL = () => (
  <Ico>
    <line x1="2.5" y1="17.5" x2="21.5" y2="17.5" {...LEVEL} />
    <path d="M4.5 18.5 L4.5 20.5 M9 18.5 L9 20.5 M13.5 18.5 L13.5 20.5 M18 18.5 L18 20.5" />
    <path d="M2.5 4 L7 12 L10.5 8.5 L14.5 17.2 L18 13 L21.5 17.2" />
  </Ico>
);

// Two highs and two lows printed at the same price — a precision liquidity pool.
const EQUAL_HL = () => (
  <Ico>
    <line x1="2.5" y1="6" x2="21.5" y2="6" {...LEVEL} />
    <line x1="2.5" y1="18" x2="21.5" y2="18" {...LEVEL} />
    <path d="M3 18 L7 6 L11 18 L15 6 L19 18 L21.5 12" />
  </Ico>
);

// Sweep the level, then displace hard the other way.
const SWEEP = () => (
  <Ico>
    <line x1="2.5" y1="8" x2="21.5" y2="8" {...LEVEL} />
    <path d="M2.5 14 L7 10 L10.5 3.5 L12.5 9.5 L15 13" strokeWidth="1.4" />
    <path d="M15 13 L20.5 20.5" strokeWidth="2.4" />
    <path d="M20.5 20.5 L16.9 19.6 M20.5 20.5 L19.8 17" strokeWidth="2.4" />
  </Ico>
);

/* ---------------------------- Fair value gaps ----------------------------- */

// Three candles where candle 1's high and candle 3's low never overlap.
const FVG = () => (
  <>
    <Zone x="2.5" y="10" width="19" height="4.5" rx="0.5" />
    <path d="M5.5 20.5 L5.5 14.5 M5.5 17 L8.5 17 L8.5 20.5 L5.5 20.5" />
    <path d="M12 14.5 L12 10 M10.5 14.5 L13.5 14.5 L13.5 10 L10.5 10 Z" />
    <path d="M18 10 L18 3.5 M15.5 10 L18.5 10 L18.5 6 L15.5 6 Z" />
  </>
);

// A gap that gets violated and flips polarity.
const IFVG = () => (
  <>
    <Zone x="2.5" y="9.5" width="19" height="5" rx="0.5" />
    <path d="M6 20 L6 4" />
    <path d="M6 4 L4 6.5 M6 4 L8 6.5" />
    <path d="M17 4 L17 20" />
    <path d="M17 20 L15 17.5 M17 20 L19 17.5" />
  </>
);

// The 50% midpoint of the gap.
const CE = () => (
  <>
    <Zone x="2.5" y="7" width="19" height="10" rx="0.5" />
    <line x1="2.5" y1="12" x2="21.5" y2="12" {...LEVEL} strokeWidth="1.6" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    <path d="M3 20.5 L21 20.5 M3 3.5 L21 3.5" strokeWidth="1" />
  </>
);

// Bodies that never traded against each other.
const VOL_IMBALANCE = () => (
  <>
    <path d="M7 20.5 L7 4 M4.5 17.5 L9.5 17.5 L9.5 8 L4.5 8 Z" />
    <path d="M17 20 L17 3.5 M14.5 16 L19.5 16 L19.5 6.5 L14.5 6.5 Z" />
    <Zone x="9.5" y="8" width="5" height="8" rx="0.5" />
  </>
);

/* -------------------------------- Killzones ------------------------------- */

function Clock({ hand }: { hand: string }) {
  return (
    <Ico>
      <circle cx="12" cy="12" r="8.5" />
      <path d={hand} strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </Ico>
  );
}

// London: early session — hands toward the top-left quadrant.
const LONDON = () => <Clock hand="M12 12 L12 6 M12 12 L7.5 14" />;
// New York: mid-morning — hands toward the top-right quadrant.
const NEWYORK = () => <Clock hand="M12 12 L12 6 M12 12 L16.5 14" />;

// A tight consolidation range that later sessions hunt.
const ASIAN_RANGE = () => (
  <Ico>
    <line x1="2.5" y1="8.5" x2="21.5" y2="8.5" {...LEVEL} />
    <line x1="2.5" y1="15.5" x2="21.5" y2="15.5" {...LEVEL} />
    <path d="M3 12 L5.5 9.5 L8 14.5 L10.5 10 L13 15 L15.5 10.5 L18 14 L21 11.5" />
  </Ico>
);

// The gap between one session's close and the next session's open.
const OPENING_GAP = () => (
  <>
    <Zone x="9.5" y="6" width="5" height="12" rx="0.5" />
    <path d="M2.5 18 L5 15 L7.5 17 L9.5 14" />
    <path d="M14.5 10 L16.5 7 L19 9.5 L21.5 6" />
    <path d="M9.5 3.5 L9.5 20.5 M14.5 3.5 L14.5 20.5" strokeWidth="1" {...LEVEL} />
  </>
);

/* ------------------------------ Time & price ------------------------------ */

// Time on one axis, price on the other.
const TIME_PRICE = () => (
  <Ico>
    <circle cx="8.5" cy="8.5" r="5.5" />
    <path d="M8.5 5.5 L8.5 8.5 L10.8 9.8" strokeWidth="1.6" />
    <path d="M3 20.5 L21 20.5 M21 20.5 L18.5 19 M21 20.5 L18.5 22" />
    <path d="M13.5 18 L16.5 13.5 L19 16" />
  </Ico>
);

// A single level splitting premium from discount.
const MONTHLY_OPEN = () => (
  <Ico>
    <line x1="2.5" y1="12" x2="21.5" y2="12" strokeWidth="1.8" />
    <path d="M6 8.5 L6 4 M6 4 L4.3 6 M6 4 L7.7 6" />
    <path d="M18 15.5 L18 20 M18 20 L16.3 18 M18 20 L19.7 18" />
    <path d="M11 6 L15.5 6 M11 18 L15.5 18" {...LEVEL} strokeWidth="1" />
  </Ico>
);

// Higher-timeframe direction governing the lower ones.
const HTF_BIAS = () => (
  <Ico>
    <path d="M4 19 L20 5" strokeWidth="2" />
    <path d="M20 5 L14.5 5.6 M20 5 L19.4 10.5" strokeWidth="2" />
    <path d="M4 13 L9 8" strokeWidth="1" />
    <path d="M4 8 L7 5" strokeWidth="1" />
  </Ico>
);

// HTF bias, mid-timeframe displacement and LTF entry stacked together.
const MULTI_TF = () => (
  <Ico>
    <line x1="2.5" y1="5.5" x2="21.5" y2="5.5" strokeWidth="1.9" />
    <line x1="4.5" y1="12" x2="19.5" y2="12" strokeWidth="1.4" />
    <line x1="7" y1="18.5" x2="17" y2="18.5" strokeWidth="1" />
    <path d="M12 7 L12 10.5 M12 13.5 L12 17" {...LEVEL} />
    <path d="M12 17 L10.5 15 M12 17 L13.5 15" />
  </Ico>
);

/* -------------------------------------------------------------------------- */

const RAW: Record<string, () => React.JSX.Element> = {
  mss: MSS,
  bos: BOS,
  choch: CHOCH,
  inducement: INDUCEMENT,
  obBull: OB_BULL,
  obBear: OB_BEAR,
  mitigation: MITIGATION,
  breaker: BREAKER,
  bsl: BSL,
  ssl: SSL,
  equalHighsLows: EQUAL_HL,
  sweep: SWEEP,
  fvg: FVG,
  ifvg: IFVG,
  ce: CE,
  volumeImbalance: VOL_IMBALANCE,
  london: LONDON,
  newYork: NEWYORK,
  asianRange: ASIAN_RANGE,
  openingGap: OPENING_GAP,
  timePrice: TIME_PRICE,
  monthlyOpen: MONTHLY_OPEN,
  htfBias: HTF_BIAS,
  multiTimeframe: MULTI_TF,
};

// Icons whose shapes are declared without their own <Ico> wrapper get one here.
const NEEDS_WRAPPER = new Set([
  'obBull',
  'obBear',
  'mitigation',
  'breaker',
  'fvg',
  'ifvg',
  'ce',
  'volumeImbalance',
  'openingGap',
]);

export type IctIconName = keyof typeof RAW;

export function IctIcon({ name }: { name: string }) {
  const Glyph = RAW[name];
  if (!Glyph) return null;
  return NEEDS_WRAPPER.has(name) ? (
    <Ico>
      <Glyph />
    </Ico>
  ) : (
    <Glyph />
  );
}
