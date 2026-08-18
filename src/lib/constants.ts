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
