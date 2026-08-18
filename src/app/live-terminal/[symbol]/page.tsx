import LiveTerminalClient from '@/components/trading/LiveTerminalClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trading Terminal | Screener',
  description: 'Live charting, screener and watchlist across Indian equity, F&O, forex and crypto.',
  // Unbounded symbol permutations with no indexable prose, so keep it out of the
  // index. Without an explicit canonical it would also inherit the layout's "/".
  robots: { index: false, follow: true },
  alternates: { canonical: undefined },
};

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default async function LiveTerminalPage({ params }: PageProps) {
  const { symbol } = await params;
  const decodedSymbol = decodeURIComponent(symbol);

  return <LiveTerminalClient initialSymbol={decodedSymbol} />;
}
