import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/lib/constants';

export default function Pricing() {
  return (
    <section id="pricing" className="bg-void border-t border-border-subtle relative z-1">
      <div className="max-w-[1440px] mx-auto py-20 px-6 lg:px-16 text-center">
        <div className="flex items-center justify-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-5 before:content-[''] before:block before:w-7 before:h-[1px] before:bg-amber after:content-[''] after:block after:w-7 after:h-[1px] after:bg-amber">
          Membership Plan
        </div>
        <h2 className="font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-[1.1] text-ivory mb-5">
          Invest in Your <em className="italic text-gold-mid font-light">Trading Edge</em>
        </h2>
        <p className="text-parchment max-w-[520px] mx-auto mb-14 leading-[1.8]">
          Get full access to the education library, live terminal, AI signals, and order flow tools in one comprehensive package.
        </p>

        <div className="max-w-md mx-auto relative group">
          <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 z-10">
            <div className="bg-gold text-void text-[0.62rem] font-black tracking-[0.25em] uppercase px-6 py-2 rounded-[50px] shadow-[0_4px_25px_rgba(201,149,42,0.4)] whitespace-nowrap">
              Most Popular
            </div>
          </div>
          
          <div className="bg-[#110E18] border border-gold/40 rounded-2xl p-12 relative shadow-[0_40px_100px_rgba(0,0,0,0.6)] group-hover:border-gold transition-colors duration-500">
            <div className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-stone mb-4">Pro Trader</div>
            
            <div className="flex flex-col items-center mb-10">
              <div className="flex items-start">
                <span className="font-serif text-[1.4rem] text-gold-mid mt-2.5 mr-1.5 opacity-80">$</span>
                <div className="font-serif text-[6.5rem] font-normal text-gold-light leading-[0.9] tracking-[-0.04em]">
                  149
                </div>
              </div>
              <div className="text-[0.75rem] italic text-stone mt-4">per month</div>
            </div>
            
            <ul className="list-none mb-12 text-left flex flex-col gap-2">
              {[
                'Full Education Library',
                'Candlestick & Forex Basics',
                'Live Market Charts',
                'Community Access',
                'AI Signal Engine (All Pairs)',
                'Order Flow + Delta Charts',
                'Depth of Market (DOM)',
                'ICT/SMC Strategy Screener',
                'Volume Profile Tools',
                'Priority Support'
              ].map((feature, i) => (
                <li key={i} className="text-[0.95rem] text-parchment py-1.5 flex items-center gap-4 opacity-80 group hover:opacity-100 transition-opacity">
                  <span className="text-gold-mid text-[0.8rem] shrink-0 transform scale-150 relative -top-[1px]">▸</span>
                  {feature}
                </li>
              ))}
            </ul>
            
            <a 
              href={SITE_CONFIG.links.telegram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full"
            >
              <Button 
                variant="gold" 
                className="w-full py-5 rounded-md text-[0.75rem] font-extrabold tracking-[0.14em] uppercase transition-all hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(201,149,42,0.4)]"
              >
                Get Started Now
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
