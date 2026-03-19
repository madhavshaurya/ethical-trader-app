import { Metadata } from 'next';
import ChartWidget from '@/components/trading/ChartWidget';

export const metadata: Metadata = {
  title: 'Stock Indices Analysis | The Ethical Trader',
  description: 'Master the S&P 500 (ES) and Nasdaq 100 (NQ). Join the elite traders who utilize institutional logic to trade market indices with precision.',
};

export default function IndicesMarketPage() {
  return (
    <main className="pt-32 pb-20 bg-void min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-16 md:mb-20">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-[0.6rem] md:text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-6 before:content-[''] before:block before:w-10 before:h-[1px] before:bg-amber">
              Asset Class
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] text-ivory mb-8">
              Equity <em className="italic text-gold-mid">Indices</em>
            </h1>
            <p className="text-parchment leading-[1.8] text-[1.1rem] mb-10 max-w-[600px]">
              Stock indices are the barometer of global markets. We teaching the intricacies of the S&P 500 and Nasdaq, focusing on how institutional hedging and liquidity drives index movements.
            </p>
            <ul className="space-y-4 text-stone text-[0.9rem] md:text-[0.95rem]">
              <li className="flex items-center gap-3"><span className="text-gold">▸</span> S&P 500 (ES) Market Structure</li>
              <li className="flex items-center gap-3"><span className="text-gold">▸</span> Nasdaq (NQ) Volatility Management</li>
              <li className="flex items-center gap-3"><span className="text-gold">▸</span> Index Rebalancing Insights</li>
            </ul>
          </div>
          
          <div className="w-full lg:w-[500px] h-[350px] md:h-[400px] rounded-2xl border border-border-subtle overflow-hidden bg-onyx relative shadow-2xl shrink-0">
             <ChartWidget symbol="NQ1-USD" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">Market Correlations</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">Understanding how bonds, currencies, and indices move in tandem is the key to institutional trading.</p>
           </div>
           <div className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">Volume Analysis</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">Index trading is a volume-driven game. We show you how to read the commitment of traders and dark pool activity.</p>
           </div>
           <div className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">Algorithmic Cycles</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">The indices follow robotic, preset cycles. Learn to identify and trade alongside the market algorithms.</p>
           </div>
        </div>
      </div>
    </main>
  );
}
