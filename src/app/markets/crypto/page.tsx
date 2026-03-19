import { Metadata } from 'next';
import ChartWidget from '@/components/trading/ChartWidget';

export const metadata: Metadata = {
  title: 'Cryptocurrency Trading Intelligence | The Ethical Trader',
  description: 'Master the Bitcoin and Ethereum markets with institutional SMC logic. Trade crypto with precision, clarity, and discipline using our live terminal.',
};

export default function CryptoMarketPage() {
  return (
    <main className="pt-32 pb-20 bg-void min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-16 md:mb-20">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-[0.6rem] md:text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-6 before:content-[''] before:block before:w-10 before:h-[1px] before:bg-amber">
              Asset Class
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] text-ivory mb-8">
              Digital <em className="italic text-gold-mid">Assets</em>
            </h1>
            <p className="text-parchment leading-[1.8] text-[1.1rem] mb-10 max-w-[600px]">
              The crypto markets never sleep. We teach you how to apply institutional SMC logic to Bitcoin, Ethereum, and major altcoins, identifying where liquidity resides in a decentralized landscape.
            </p>
            <ul className="space-y-4 text-stone text-[0.9rem] md:text-[0.95rem]">
              <li className="flex items-center gap-3"><span className="text-gold">▸</span> Bitcoin (BTC) Institutional Order Blocks</li>
              <li className="flex items-center gap-3"><span className="text-gold">▸</span> Ethereum (ETH) Liquidity Sweeps</li>
              <li className="flex items-center gap-3"><span className="text-gold">▸</span> On-Chain Volume Analysis</li>
            </ul>
          </div>
          
          <div className="w-full lg:w-[500px] h-[350px] md:h-[400px] rounded-2xl border border-border-subtle overflow-hidden bg-onyx relative shadow-2xl shrink-0">
             <ChartWidget symbol="BTC-USD" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">24/7 Market Cycles</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">Crypto operates on a continuous cycle. Learn how to manage risk around the clock with precision.</p>
           </div>
           <div className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">Sentiment Logic</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">Understand the interplay between retail FOMO and institutional accumulation/distribution phases.</p>
           </div>
           <div className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">Volatility Edge</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">Volatility is the friend of the disciplined trader. Learn how to use it to your advantage, not your detriment.</p>
           </div>
        </div>
      </div>
    </main>
  );
}
