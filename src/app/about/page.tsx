import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About The Ethical Trader | Our Mission and Philosophy',
  description: 'Learn about The Ethical Trader, our mission for integrity-first trading, and how we empower traders with ICT, SMC, and Order Flow intelligence.',
};

export default function AboutPage() {
  return (
    <main className="pt-32 pb-20 px-6 lg:px-16 min-h-screen bg-void relative overflow-hidden">
      {/* Decorative gradient spot */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[800px] mx-auto relative z-10">
        <div className="flex items-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-6 before:content-[''] before:block before:w-10 before:h-[1px] before:bg-amber">
          Our Philosophy
        </div>
        
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] text-ivory mb-10">
          Trading with <em className="italic text-gold-mid">Uncompromising Integrity</em>
        </h1>
        
        <div className="space-y-8 text-parchment leading-[1.8] text-[1.05rem]">
          <p>
            At The Ethical Trader, we believe that the financial markets are not just a place for profit, but a arena for discipline, character, and continuous growth. Our platform was born from a simple observation: most traders fail not because they lack data, but because they lack a systematic, ethical framework for risk.
          </p>
          
          <h2 className="font-serif text-[1.8rem] text-ivory font-light mt-12 mb-6">The "Ethical" in Trading</h2>
          <p>
            Being an "Ethical Trader" means more than just following rules. It means trading with a conscience—understanding that every position has a consequence, and that long-term success requires a radical commitment to transparency and risk management. 
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
            <div className="p-8 rounded-xl bg-onyx border border-border-subtle hover:border-gold/30 transition-colors">
              <div className="text-gold-light text-[1.5rem] mb-4 opacity-70">◈</div>
              <h3 className="font-serif text-[1.3rem] text-ivory mb-3">Education First</h3>
              <p className="text-[0.9rem] text-stone leading-relaxed">
                We don't sell "get rich quick" schemes. We provide the tools and logic (ICT, SMC, Order Flow) to decode market behavior.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-onyx border border-border-subtle hover:border-gold/30 transition-colors">
              <div className="text-gold-light text-[1.5rem] mb-4 opacity-70">◈</div>
              <h3 className="font-serif text-[1.3rem] text-ivory mb-3">Institutional Logic</h3>
              <p className="text-[0.9rem] text-stone leading-relaxed">
                We empower retail traders by teaching them how institutions move liquidity and engineer price action.
              </p>
            </div>
          </div>
          
          <p>
            Join a community that values deep analysis over gambling, and discipline over luck. This is the new standard of retail trading intelligence.
          </p>
        </div>
      </div>
    </main>
  );
}
