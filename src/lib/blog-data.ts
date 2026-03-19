export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  content: string[];
}

export const posts: BlogPost[] = [
  {
    id: 1,
    slug: 'liquidity-landscape-institutions-hunt',
    title: 'The Liquidity Landscape: Where Institutions Hunt',
    category: 'SMC Logic',
    date: 'Mar 15, 2026',
    excerpt: 'Understanding the mechanics of liquidity pools and how they dictate market direction in the modern era of high-frequency trading.',
    image: '/blog/liquidity.png',
    content: [
      "In the world of high-frequency trading and institutional algorithms, the term 'liquidity' is more than just a buzzword—it's the fuel that drives every significant market move. To the retail eye, support and resistance levels are stable floors and ceilings. To the institutional algorithm, these same levels are 'liquidity pools' filled with stop-loss orders waiting to be triggered.",
      "Smart Money Concepts (SMC) teach us that the market moves from one area of liquidity to another. Before a major trend can begin, the institutions must 'clear the board.' This often manifests as a fake breakout or a 'liquidity sweep' that lures retail traders into the wrong direction before the real move occurs.",
      "How do we identify these hunting grounds? Look for 'Equal Highs' and 'Equal Lows.' These are magnetic areas where thousands of stop-losses cluster. When the price 'sweeps' these levels, it provides the necessary volume for institutions to enter their massive positions without causing massive slippage. By waiting for the sweep and a subsequent shift in market structure, we can align ourselves with the true institutional direction."
    ]
  },
  {
    id: 2,
    slug: 'precision-execution-order-flow',
    title: 'Precision Execution using Order Flow',
    category: 'Technicals',
    date: 'Mar 10, 2026',
    excerpt: 'How to use the Depth of Market (DOM) and Footprint charts to identify where the real volume is entering the market.',
    image: '/blog/orderflow.png',
    content: [
      "While a candlestick chart tells you what happened in the past, Order Flow tells you what is happening right now. It is the raw data of market transactions, revealing the battle between buyers and sellers at every micro-price level. For the precision trader, Order Flow is the final filter before pulling the trigger.",
      "The Depth of Market (DOM) is your most powerful weapon. It shows the limit orders sitting in the order book, providing a 'heat map' of potential resistance and support. However, the DOM can be deceptive—institutions use 'spoofing' to lure traders. This is why we cross-reference the DOM with the 'Footprint' or 'Tape' to verify if those orders are actually being executed.",
      "Key patterns to watch for include 'Absorption' and 'Aggressive Participation.' If you see a massive seller repeatedly hitting a price level but the price refuses to drop, you are witnessing absorption—a buyer is quietly soaking up all that supply. Once the seller is exhausted, the price will snap back violently in the opposite direction. This is the hallmark of professional execution."
    ]
  },
  {
    id: 3,
    slug: 'psychology-ethical-trader',
    title: 'The Psychology of the Ethical Trader',
    category: 'Mindset',
    date: 'Mar 05, 2026',
    excerpt: 'Why discipline is the only true edge in a world of random variables. Mastering the internal game of trading.',
    image: '/blog/psychology.png',
    content: [
      "You can have the most advanced terminal and the deepest understanding of SMC, but if you cannot control your internal state, the market will eventually take everything from you. Trading is perhaps the only profession where your biggest opponent is not the 'market players,' but your own biological hard-wiring.",
      "Our brains are evolved to seek safety and avoid pain. In trading, this manifests as ' revenge trading' after a loss or 'cutting winners early' out of fear that the profit will vanish. The Ethical Trader understands that trading is a game of probabilities, not certainties. Each individual trade is just one of a thousand in a lifelong series.",
      "To master the psychological edge, you must embrace 'Radical Acceptance.' Accept that every setup carries a risk of loss. Accept that you have no control over the market—only over your own reaction to it. By disconnecting your self-worth from your PnL and focusing strictly on process and discipline, you become immune to the emotional swings that destroy most retail participants."
    ]
  }
];
