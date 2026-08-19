import { Button } from '@/components/ui/Button';
import { SITE_CONFIG, PRICING_PLANS, perDayUsd } from '@/lib/constants';

export default function Pricing() {
  return (
    <section id="pricing" className="bg-void border-t border-border-subtle relative z-1">
      <div className="max-w-[1440px] mx-auto py-20 px-6 lg:px-16 text-center">
        <div className="flex items-center justify-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-5 before:content-[''] before:block before:w-7 before:h-[1px] before:bg-amber after:content-[''] after:block after:w-7 after:h-[1px] after:bg-amber">
          Membership Plans
        </div>
        <h2 className="font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-[1.1] text-ivory mb-5">
          Choose Your <em className="italic text-gold-mid font-light">Edge</em>
        </h2>
        <p className="text-parchment max-w-[650px] mx-auto mb-14 leading-[1.8] text-[0.95rem] opacity-80">
          All plans include direct Telegram access, real-time views, and defined guidance —
          built for traders serious about results.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative pt-10 items-start">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={
                plan.featured
                  ? 'bg-[#15121F] border-2 border-gold/70 rounded-2xl p-10 relative transition-all duration-500 flex flex-col items-center shadow-[0_20px_60px_rgba(201,149,42,0.15)] md:scale-105 z-10'
                  : 'bg-[#110E18] border border-border-subtle hover:border-gold-mid/40 rounded-2xl p-8 relative transition-all duration-500 flex flex-col items-center'
              }
            >
              {plan.featured ? (
                <div className="absolute -top-[16px] left-1/2 -translate-x-1/2">
                  <div className="bg-gold text-void text-[0.6rem] font-black tracking-[0.2em] uppercase px-5 py-2 rounded-full shadow-xl whitespace-nowrap">
                    {plan.badge}
                  </div>
                </div>
              ) : (
                <div className="text-[0.58rem] font-bold tracking-[0.25em] uppercase text-amber-lt mb-3">
                  {plan.badge}
                </div>
              )}

              <div
                className={`text-[0.58rem] font-medium tracking-[0.22em] uppercase mb-4 ${
                  plan.featured ? 'text-gold-mid' : 'text-stone'
                }`}
              >
                {plan.kicker}
              </div>

              <div className="font-serif text-[1.5rem] md:text-[1.65rem] font-normal text-ivory leading-tight mb-7">
                {plan.name}
              </div>

              <div className="flex flex-col items-center mb-8">
                <div className="text-[0.55rem] font-bold tracking-[0.28em] uppercase text-stone mb-2">
                  Monthly
                </div>
                <div className="flex items-start">
                  <span className="font-serif text-[1.2rem] text-gold-mid mt-2 mr-1">$</span>
                  <div className="font-serif text-[4.2rem] font-normal text-gold-light leading-none tracking-tight">
                    {plan.priceUsd}
                  </div>
                </div>
                <div className="text-[0.72rem] text-parchment mt-3 italic">
                  Just ${perDayUsd(plan.priceUsd)} a day
                </div>
              </div>

              <ul className="list-none mb-10 text-left w-full space-y-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-3 ${
                      plan.featured ? 'text-[0.82rem] text-ivory' : 'text-[0.8rem] text-parchment'
                    }`}
                  >
                    <span aria-hidden="true" className="text-gold-mid text-[0.7rem] mt-1 shrink-0">
                      ▸
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={SITE_CONFIG.links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-auto"
              >
                <Button
                  variant={plan.featured ? 'gold' : 'ghost'}
                  className={
                    plan.featured
                      ? 'w-full py-5 text-[0.7rem] font-black tracking-widest uppercase shadow-lg'
                      : 'w-full py-4 text-[0.65rem] font-bold tracking-widest uppercase border border-border-subtle'
                  }
                >
                  {plan.cta}
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
