import LiveTerminalClient from '@/components/trading/LiveTerminalClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trading Terminal | Screener',
};

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default async function LiveTerminalPage({ params }: PageProps) {
  const { symbol } = await params;
  const decodedSymbol = decodeURIComponent(symbol);

  return <LiveTerminalClient initialSymbol={decodedSymbol} />;
}
