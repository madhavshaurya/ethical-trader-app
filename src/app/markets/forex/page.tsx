import { Metadata } from 'next';
import ChartWidget from '@/components/trading/ChartWidget';

export const metadata: Metadata = {
  title: 'Forex Trading Intelligence | The Ethical Trader',
  description: 'Master the Forex markets with ICT and SMC logic. Analyze EUR/USD, GBP/USD, and other major pairs with our real-time terminal and institutional insights.',
};

export default function ForexMarketPage() {
  return (
    <main className="pt-32 pb-20 bg-void min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-16 md:mb-20">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-[0.6rem] md:text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-6 before:content-[''] before:block before:w-10 before:h-[1px] before:bg-amber">
              Asset Class
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] text-ivory mb-8">
              Foreign <em className="italic text-gold-mid">Exchange</em>
            </h1>
            <p className="text-parchment leading-[1.8] text-[1.1rem] mb-10 max-w-[600px]">
              The Forex market is the largest financial market in the world. We specialize in teaching traders how to identify institutional footprints in major currency pairs, focusing on liquidity runs and structural shifts.
            </p>
            <ul className="space-y-4 text-stone text-[0.9rem] md:text-[0.95rem]">
              <li className="flex items-center gap-3"><span className="text-gold">▸</span> EUR/USD Institutional Flow</li>
              <li className="flex items-center gap-3"><span className="text-gold">▸</span> GBP/USD Liquidity Sweeps</li>
              <li className="flex items-center gap-3"><span className="text-gold">▸</span> Macro-Economic Interplay</li>
            </ul>
          </div>
          
          <div className="w-full lg:w-[500px] h-[350px] md:h-[400px] rounded-2xl border border-border-subtle overflow-hidden bg-onyx relative shadow-2xl shrink-0">
             <ChartWidget symbol="EUR-USD" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">Precision Timing</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">Understanding London and New York sessions is critical for Forex success. We teach you when to strike.</p>
           </div>
           <div className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">Risk Management</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">Currency markets can be volatile. Our framework prioritizes capital preservation through algorithmic stops.</p>
           </div>
           <div className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">Price Action</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">Forget indicators. Learn to read the raw candles and the narrative of the market makers.</p>
           </div>
        </div>
      </div>
    </main>
  );
}
