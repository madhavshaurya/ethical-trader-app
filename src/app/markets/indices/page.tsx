import { Metadata } from 'next';
import { pageOpenGraph } from '@/lib/site';
import MarketPage from '@/components/markets/MarketPage';
import { MARKETS } from '@/lib/markets-content';

const market = MARKETS.indices;

export const metadata: Metadata = {
  title: market.metaTitle,
  description: market.metaDescription,
  alternates: {
    canonical: '/markets/indices',
  },
  openGraph: pageOpenGraph({
    title: market.metaTitle,
    description: market.metaDescription,
    url: '/markets/indices',
  }),
};

export default function IndicesMarketPage() {
  return <MarketPage market={market} />;
}
