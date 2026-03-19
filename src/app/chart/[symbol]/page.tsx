import ChartWidget from '@/components/trading/ChartWidget';
import DepthOfMarket from '@/components/trading/DepthOfMarket';
import DeltaHistogram from '@/components/trading/DeltaHistogram';
import VolumeProfile from '@/components/trading/VolumeProfile';

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default async function ChartPage({ params }: PageProps) {
  // Await the params due to Next.js 15 behavior with dynamic route params passing Promises
  const { symbol } = await params;
  const decodedSymbol = decodeURIComponent(symbol);
  
  return (
    <div className="pt-[96px] min-h-screen bg-void flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row border-t border-border-subtle" style={{ height: 'calc(100vh - 96px)' }}>
        {/* Main Chart Area */}
        <div className="flex-1 border-r border-border-subtle flex flex-col min-h-[500px]">
          <ChartWidget symbol={decodedSymbol} />
        </div>
        
        {/* Order Flow Sidebar */}
        <div className="w-full lg:w-[380px] flex flex-col bg-onyx overflow-y-auto border-l border-border-subtle">
          <DepthOfMarket symbol={decodedSymbol} />
          <div className="border-t border-border-subtle">
            <DeltaHistogram symbol={decodedSymbol} />
          </div>
          <div className="border-t border-border-subtle">
            <VolumeProfile symbol={decodedSymbol} />
          </div>
        </div>
      </div>
    </div>
  );
}
