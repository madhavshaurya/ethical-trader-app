import { Metadata } from 'next';
import { pageOpenGraph } from '@/lib/site';
import MarketPage from '@/components/markets/MarketPage';
import { MARKETS } from '@/lib/markets-content';

const market = MARKETS.commodities;

export const metadata: Metadata = {
  title: market.metaTitle,
  description: market.metaDescription,
  alternates: {
    canonical: '/markets/commodities',
  },
  openGraph: pageOpenGraph({
    title: market.metaTitle,
    description: market.metaDescription,
    url: '/markets/commodities',
  }),
};

export default function CommoditiesMarketPage() {
  return <MarketPage market={market} />;
}
