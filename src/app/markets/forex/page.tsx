import { Metadata } from 'next';
import { pageOpenGraph } from '@/lib/site';
import MarketPage from '@/components/markets/MarketPage';
import { MARKETS } from '@/lib/markets-content';

const market = MARKETS.forex;

export const metadata: Metadata = {
  title: market.metaTitle,
  description: market.metaDescription,
  alternates: {
    canonical: '/markets/forex',
  },
  openGraph: pageOpenGraph({
    title: market.metaTitle,
    description: market.metaDescription,
    url: '/markets/forex',
  }),
};

export default function ForexMarketPage() {
  return <MarketPage market={market} />;
}
