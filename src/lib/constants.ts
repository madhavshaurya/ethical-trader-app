export const SITE_CONFIG = {
  name: "The Ethical Trader",
  links: {
    telegram: "https://t.me/TETscharts",
    supportEmail: "support@theethicaltrader.in",
    telegramCommunity: "https://t.me/TETscharts", // You can set a different one here if needed
  },
  socials: {
    // Add X/Twitter, Instagram etc here if needed
  }
};

/**
 * Single source of truth for the Account Handling Management offer.
 * The service page and the chatbot knowledge base both read from here so the
 * published terms can never drift apart. Changing a number here changes it everywhere.
 */
export const ACCOUNT_MANAGEMENT = {
  minCapital: "₹1,00,000",
  maxCapital: "No upper limit",
  riskOnCapital: "20%",
  payoutCycle: "Weekly",
  profitSplit: {
    client: 60,
    house: 40,
    label: "60 / 40",
  },
  indicativeReturns: "10–20% per month",
  markets: ["Indian Equity", "Futures & Options (F&O)", "Forex"],
  disclaimer:
    "We are not SEBI Registered. Market risks apply and we do not take any responsibility for your loss.",
} as const;

/**
 * Membership pricing. Single source of truth for the pricing cards and the chatbot
 * knowledge base — the bot previously quoted its own hardcoded copy of these numbers
 * and would have kept selling the old ones after a price change.
 *
 * Prices are monthly USD. `perDay` is derived, not stored, so it can never disagree.
 */
export const PRICING_PLANS = [
  {
    id: "fno",
    badge: "Indian Markets",
    kicker: "Futures · Options · Equities",
    name: "FNO & Index Views",
    priceUsd: 55,
    features: [
      "Nifty & BankNifty Views",
      "High-Conviction Stock Ideas",
      "Entry · Target · Stop Guidance",
    ],
    cta: "Subscribe FNO",
    featured: false,
  },
  {
    id: "combined",
    badge: "Best Value",
    kicker: "All Markets · Global + India",
    name: "Combined Premium",
    priceUsd: 155,
    features: [
      "Crypto, Forex + Indian Market Views",
      "Priority Guidance & Alerts",
      "All Assets · One Membership",
    ],
    cta: "Get Best Value",
    featured: true,
  },
  {
    id: "crypto-forex",
    badge: "Global Markets",
    kicker: "Crypto · Forex · Macro",
    name: "Crypto & Forex Premium",
    priceUsd: 200,
    features: [
      "Crypto & Forex Trade Ideas",
      "Round-the-Clock Global Coverage",
      "Macro-Driven Market Views",
    ],
    cta: "Subscribe Crypto & Forex",
    featured: false,
  },
] as const;

/** Indicative daily cost, derived from the monthly price over a 30-day month. */
export function perDayUsd(priceUsd: number): string {
  return (priceUsd / 30).toFixed(2);
}
