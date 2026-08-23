'use client';

import { useState } from 'react';
import { IctIcon } from './IctIcons';
import { TABS, CARDS, type IctTabId } from '@/lib/ict-content';

export default function IctSmc() {
  const [activeTab, setActiveTab] = useState<IctTabId>('structure');

  return (
    <>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-border-mid to-transparent" />
      <section id="ict" className="relative z-1 py-28 px-6 lg:px-16 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-5 before:content-[''] before:block before:w-7 before:h-[1px] before:bg-amber">
          Smart Money Concepts
        </div>
        <h2 className="font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-[1.1] text-ivory mb-5">
          The ICT / SMC <em className="italic text-gold-mid font-light">Framework</em>
        </h2>
        <p className="text-parchment max-w-[520px] mb-14 leading-[1.8]">
          The same playbook used by institutional desks at the world's largest banks — decoded for the independent trader.
        </p>

        <div className="flex gap-0 border-b border-border-subtle mb-10 overflow-x-auto custom-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 bg-transparent border-none border-b-2 font-sans text-[0.75rem] font-semibold tracking-[0.08em] uppercase whitespace-nowrap transition-all outline-none ${
                activeTab === tab.id 
                  ? 'text-gold-light border-gold' 
                  : 'text-stone border-transparent hover:text-cream'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Every panel is rendered, with the inactive ones display:none rather than
            unmounted, so all 24 concepts are in the server-rendered HTML for crawlers
            and agents that do not execute JavaScript. Going from display:none back to
            grid restarts the fade-up animation, so switching tabs still animates. */}
        {TABS.map((tab) => (
          <div
            key={tab.id}
            className={
              activeTab === tab.id
                ? 'grid grid-cols-1 md:grid-cols-2 gap-5 animate-[fade-up_0.3s_ease_forwards]'
                : 'hidden'
            }
          >
            {CARDS[tab.id].map((card, i) => (
              <div
                key={i}
                className="bg-onyx border border-border-subtle rounded-[10px] p-7 md:px-8 cursor-pointer transition-all hover:border-border-mid hover:translate-x-1 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-transparent transition-colors group-hover:bg-gradient-to-b group-hover:from-gold group-hover:to-amber z-10" />
                <div className="mb-4 text-gold-mid transition-colors group-hover:text-gold-light">
                  <IctIcon name={card.icon} />
                </div>
                <h3 className="font-serif text-[1.1rem] font-semibold text-ivory leading-snug mb-2">{card.title}</h3>
                <div className="text-[0.82rem] text-parchment leading-[1.7]">{card.desc}</div>
              </div>
            ))}
          </div>
        ))}
      </section>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-border-mid to-transparent" />
    </>
  );
}
