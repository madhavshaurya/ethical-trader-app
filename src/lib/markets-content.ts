/**
 * Content for the four asset-class pages under /markets.
 *
 * The pages were four near-identical copies of the same markup with different strings.
 * Holding the strings here lets the route files render one shared component and lets
 * the Markdown representation served to agents describe exactly what the page shows.
 */

export type MarketSlug = 'forex' | 'indices' | 'commodities' | 'crypto';

export interface MarketCard {
  title: string;
  body: string;
}

export interface MarketContent {
  slug: MarketSlug;
  metaTitle: string;
  metaDescription: string;
  /** Heading renders as `${headingLead} ${headingEmphasis}`, the second word italicised. */
  headingLead: string;
  headingEmphasis: string;
  intro: string;
  bullets: string[];
  /** Symbol handed to ChartWidget for the page's live chart. */
  chartSymbol: string;
  cards: MarketCard[];
}

export const MARKETS: Record<MarketSlug, MarketContent> = {
  forex: {
    slug: 'forex',
    metaTitle: 'Forex Trading Intelligence | The Ethical Trader',
    metaDescription:
      'Master the Forex markets with ICT and SMC logic. Analyze EUR/USD, GBP/USD, and other major pairs with our real-time terminal and institutional insights.',
    headingLead: 'Foreign',
    headingEmphasis: 'Exchange',
    intro:
      'The Forex market is the largest financial market in the world. We specialize in teaching traders how to identify institutional footprints in major currency pairs, focusing on liquidity runs and structural shifts.',
    bullets: [
      'EUR/USD Institutional Flow',
      'GBP/USD Liquidity Sweeps',
      'Macro-Economic Interplay',
    ],
    chartSymbol: 'EUR-USD',
    cards: [
      {
        title: 'Precision Timing',
        body: 'Understanding London and New York sessions is critical for Forex success. We teach you when to strike.',
      },
      {
        title: 'Risk Management',
        body: 'Currency markets can be volatile. Our framework prioritizes capital preservation through algorithmic stops.',
      },
      {
        title: 'Price Action',
        body: 'Forget indicators. Learn to read the raw candles and the narrative of the market makers.',
      },
    ],
  },
  indices: {
    slug: 'indices',
    metaTitle: 'Stock Indices Analysis | The Ethical Trader',
    metaDescription:
      'Master the S&P 500 (ES) and Nasdaq 100 (NQ). Join the elite traders who utilize institutional logic to trade market indices with precision.',
    headingLead: 'Equity',
    headingEmphasis: 'Indices',
    intro:
      'Stock indices are the barometer of global markets. We teach the intricacies of the S&P 500 and Nasdaq, focusing on how institutional hedging and liquidity drives index movements.',
    bullets: [
      'S&P 500 (ES) Market Structure',
      'Nasdaq (NQ) Volatility Management',
      'Index Rebalancing Insights',
    ],
    chartSymbol: 'NQ1-USD',
    cards: [
      {
        title: 'Market Correlations',
        body: 'Understanding how bonds, currencies, and indices move in tandem is the key to institutional trading.',
      },
      {
        title: 'Volume Analysis',
        body: 'Index trading is a volume-driven game. We show you how to read the commitment of traders and dark pool activity.',
      },
      {
        title: 'Algorithmic Cycles',
        body: 'The indices follow robotic, preset cycles. Learn to identify and trade alongside the market algorithms.',
      },
    ],
  },
  commodities: {
    slug: 'commodities',
    metaTitle: 'Commodities Trading | The Ethical Trader',
    metaDescription:
      'Analyze Gold (XAU) and Crude Oil through the lens of institutional liquidity and SMC logic. Trade hard assets with precision and discipline.',
    headingLead: 'Hard',
    headingEmphasis: 'Commodities',
    intro:
      'Commodities like Gold and Oil are essential to global trade. We show you how these assets react to inflation, geopolitical shifts, and institutional liquidity pools.',
    bullets: [
      'Gold (XAU/USD) Safe Haven Logic',
      'Crude Oil (WTI) Supply/Demand Zones',
      'Global Macro Analysis',
    ],
    chartSymbol: 'XAU-USD',
    cards: [
      {
        title: 'Macro Influences',
        body: 'Understand how interest rates and inflation drive the pricing of hard assets globally.',
      },
      {
        title: 'Precision Levels',
        body: 'Commodities trade between massive institutional levels. Learn to spot and trade these key transition zones.',
      },
      {
        title: 'Liquidity Sweeps',
        body: 'Gold is famous for its liquidity hunts. We teach you how to avoid being the target and trade with the hunters.',
      },
    ],
  },
  crypto: {
    slug: 'crypto',
    metaTitle: 'Cryptocurrency Trading Intelligence | The Ethical Trader',
    metaDescription:
      'Master the Bitcoin and Ethereum markets with institutional SMC logic. Trade crypto with precision, clarity, and discipline using our live terminal.',
    headingLead: 'Digital',
    headingEmphasis: 'Assets',
    intro:
      'The crypto markets never sleep. We teach you how to apply institutional SMC logic to Bitcoin, Ethereum, and major altcoins, identifying where liquidity resides in a decentralized landscape.',
    bullets: [
      'Bitcoin (BTC) Institutional Order Blocks',
      'Ethereum (ETH) Liquidity Sweeps',
      'On-Chain Volume Analysis',
    ],
    chartSymbol: 'BTC-USD',
    cards: [
      {
        title: '24/7 Market Cycles',
        body: 'Crypto operates on a continuous cycle. Learn how to manage risk around the clock with precision.',
      },
      {
        title: 'Sentiment Logic',
        body: 'Understand the interplay between retail FOMO and institutional accumulation/distribution phases.',
      },
      {
        title: 'Volatility Edge',
        body: 'Volatility is the friend of the disciplined trader. Learn how to use it to your advantage, not your detriment.',
      },
    ],
  },
};

export const MARKET_SLUGS = Object.keys(MARKETS) as MarketSlug[];
