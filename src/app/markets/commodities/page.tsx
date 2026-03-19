import { Metadata } from 'next';
import ChartWidget from '@/components/trading/ChartWidget';

export const metadata: Metadata = {
  title: 'Commodities Trading | The Ethical Trader',
  description: 'Analyze Gold (XAU) and Crude Oil through the lens of institutional liquidity and SMC logic. Trade hard assets with precision and discipline.',
};

export default function CommoditiesMarketPage() {
  return (
    <main className="pt-32 pb-20 bg-void min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-16 md:mb-20">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-[0.6rem] md:text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-6 before:content-[''] before:block before:w-10 before:h-[1px] before:bg-amber">
              Asset Class
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] text-ivory mb-8">
              Hard <em className="italic text-gold-mid">Commodities</em>
            </h1>
            <p className="text-parchment leading-[1.8] text-[1.1rem] mb-10 max-w-[600px]">
              Commodities like Gold and Oil are essential to global trade. We show you how these assets react to inflation, geopolitical shifts, and institutional liquidity pools.
            </p>
            <ul className="space-y-4 text-stone text-[0.9rem] md:text-[0.95rem]">
              <li className="flex items-center gap-3"><span className="text-gold">▸</span> Gold (XAU/USD) Safe Haven Logic</li>
              <li className="flex items-center gap-3"><span className="text-gold">▸</span> Crude Oil (WTI) Supply/Demand Zones</li>
              <li className="flex items-center gap-3"><span className="text-gold">▸</span> Global Macro Analysis</li>
            </ul>
          </div>
          
          <div className="w-full lg:w-[500px] h-[350px] md:h-[400px] rounded-2xl border border-border-subtle overflow-hidden bg-onyx relative shadow-2xl shrink-0">
             <ChartWidget symbol="XAU-USD" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">Macro Influences</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">Understand how interest rates and inflation drive the pricing of hard assets globally.</p>
           </div>
           <div className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">Precision Levels</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">Commodities trade between massive institutional levels. Learn to spot and trade these key transition zones.</p>
           </div>
           <div className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">Liquidity Sweeps</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">Gold is famous for its liquidity hunts. We teach you how to avoid being the target and trade with the hunters.</p>
           </div>
        </div>
      </div>
    </main>
  );
}
