import { Metadata } from 'next';
import { pageOpenGraph } from '@/lib/site';
import MarketPage from '@/components/markets/MarketPage';
import { MARKETS } from '@/lib/markets-content';

const market = MARKETS.crypto;

export const metadata: Metadata = {
  title: market.metaTitle,
  description: market.metaDescription,
  alternates: {
    canonical: '/markets/crypto',
  },
  openGraph: pageOpenGraph({
    title: market.metaTitle,
    description: market.metaDescription,
    url: '/markets/crypto',
  }),
};

export default function CryptoMarketPage() {
  return <MarketPage market={market} />;
}
