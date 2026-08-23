import ChartWidget from '@/components/trading/ChartWidget';
import type { MarketContent } from '@/lib/markets-content';

/**
 * Shared layout for the four /markets pages. The markup is unchanged from the four
 * copies it replaces — only the strings differ, and those now come from
 * lib/markets-content.
 */
export default function MarketPage({ market }: { market: MarketContent }) {
  return (
    <main className="pt-32 pb-20 bg-void min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-16 md:mb-20">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-[0.6rem] md:text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-6 before:content-[''] before:block before:w-10 before:h-[1px] before:bg-amber">
              Asset Class
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] text-ivory mb-8">
              {market.headingLead} <em className="italic text-gold-mid">{market.headingEmphasis}</em>
            </h1>
            <p className="text-parchment leading-[1.8] text-[1.1rem] mb-10 max-w-[600px]">
              {market.intro}
            </p>
            <ul className="space-y-4 text-stone text-[0.9rem] md:text-[0.95rem]">
              {market.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3"><span className="text-gold">▸</span> {bullet}</li>
              ))}
            </ul>
          </div>
          
          <div className="w-full lg:w-[500px] h-[350px] md:h-[400px] rounded-2xl border border-border-subtle overflow-hidden bg-onyx relative shadow-2xl shrink-0">
             <ChartWidget symbol={market.chartSymbol} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {market.cards.map((card) => (
           <div key={card.title} className="p-10 bg-onyx border border-border-subtle rounded-xl">
              <h3 className="font-serif text-[1.4rem] text-ivory mb-4">{card.title}</h3>
              <p className="text-stone text-[0.9rem] leading-relaxed">{card.body}</p>
           </div>
          ))}
        </div>
      </div>
    </main>
  );
}
