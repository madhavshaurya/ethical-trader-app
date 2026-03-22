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
        <p className="text-parchment max-w-[650px] mx-auto mb-14 leading-[1.8] text-[0.95rem] opacity-80">
          Get access to premium Forex and FNO services at competitive prices, and capitalize on high-quality trade setups with a favorable risk-reward profile.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative group pt-10">
          
          {/* Forex Plan */}
          <div className="bg-[#110E18] border border-border-subtle hover:border-gold-mid/40 rounded-2xl p-8 relative transition-all duration-500 flex flex-col items-center">
            <div className="text-[0.62rem] font-bold tracking-[0.3em] uppercase text-stone mb-6">Forex Premium</div>
            <div className="flex items-start mb-8">
              <span className="font-serif text-[1.2rem] text-gold-mid mt-2 mr-1">$</span>
              <div className="font-serif text-[4.2rem] font-normal text-gold-light leading-none tracking-tight">149</div>
              <span className="text-[0.7rem] text-stone mt-8 ml-1 italic">/mo</span>
            </div>
            <ul className="list-none mb-10 text-left w-full space-y-3">
              {['All Forex Pairs', 'SMC/ICT Signals', 'Order Flow Tools', 'Live Terminal'].map((f, i) => (
                <li key={i} className="text-[0.8rem] text-parchment opacity-70 flex items-center gap-3">
                  <span className="text-gold-mid text-[0.6rem]">▸</span> {f}
                </li>
              ))}
            </ul>
            <a href={SITE_CONFIG.links.telegram} target="_blank" rel="noopener noreferrer" className="w-full mt-auto">
              <Button variant="ghost" className="w-full py-4 text-[0.65rem] font-bold tracking-widest uppercase border border-border-subtle">Subscribe Forex</Button>
            </a>
          </div>

          {/* Combined "Best Value" Plan */}
          <div className="bg-[#15121F] border-2 border-gold/70 rounded-2xl p-10 relative transition-all duration-500 flex flex-col items-center shadow-[0_20px_60px_rgba(201,149,42,0.15)] scale-105 z-10">
            <div className="absolute -top-[16px] left-1/2 -translate-x-1/2">
              <div className="bg-gold text-void text-[0.6rem] font-black tracking-[0.2em] uppercase px-5 py-2 rounded-full shadow-xl whitespace-nowrap">Combined Pro</div>
            </div>
            <div className="text-[0.62rem] font-bold tracking-[0.3em] uppercase text-gold-mid mb-6">Forex + FNO</div>
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-start">
                <span className="font-serif text-[1.2rem] text-gold-mid mt-2 mr-1">$</span>
                <div className="font-serif text-[4.2rem] font-normal text-gold-light leading-none tracking-tight">185</div>
                <span className="text-[0.7rem] text-stone mt-8 ml-1 italic">/mo</span>
              </div>
              <div className="text-[0.7rem] text-stone mt-2 italic font-mono uppercase tracking-[0.1em]">~ ₹15,000 per month</div>
            </div>
            <ul className="list-none mb-10 text-left w-full space-y-3">
              {['Full Forex Access', 'All FNO Options', 'AI Signal Engine', 'Priority Mentorship', 'Community Pro Hub'].map((f, i) => (
                <li key={i} className="text-[0.85rem] text-ivory flex items-center gap-3">
                  <span className="text-gold-mid text-[0.8rem]">▸</span> {f}
                </li>
              ))}
            </ul>
            <a href={SITE_CONFIG.links.telegram} target="_blank" rel="noopener noreferrer" className="w-full mt-auto">
              <Button variant="gold" className="w-full py-5 text-[0.7rem] font-black tracking-widest uppercase shadow-lg">Get Best Value</Button>
            </a>
          </div>

          {/* FNO Plan */}
          <div className="bg-[#110E18] border border-border-subtle hover:border-gold-mid/40 rounded-2xl p-8 relative transition-all duration-500 flex flex-col items-center">
            <div className="text-[0.62rem] font-bold tracking-[0.3em] uppercase text-stone mb-6">FNO Premium</div>
            <div className="flex items-start mb-8">
              <span className="font-serif text-[1.2rem] text-gold-mid mt-2 mr-1">$</span>
              <div className="font-serif text-[4.2rem] font-normal text-gold-light leading-none tracking-tight">55</div>
              <span className="text-[0.7rem] text-stone mt-8 ml-1 italic">/mo</span>
            </div>
            <ul className="list-none mb-10 text-left w-full space-y-3">
              {['Nifty/BankNifty FNO', 'Options Orderflow', 'Delta Analytics', 'Basics to Advanced'].map((f, i) => (
                <li key={i} className="text-[0.8rem] text-parchment opacity-70 flex items-center gap-3">
                  <span className="text-gold-mid text-[0.6rem]">▸</span> {f}
                </li>
              ))}
            </ul>
            <a href={SITE_CONFIG.links.telegram} target="_blank" rel="noopener noreferrer" className="w-full mt-auto">
              <Button variant="ghost" className="w-full py-4 text-[0.65rem] font-bold tracking-widest uppercase border border-border-subtle">Subscribe FNO</Button>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
