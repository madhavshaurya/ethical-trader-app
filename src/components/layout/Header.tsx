'use client';

import Link from 'next/link';
import Ticker from './Ticker';
import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '@/lib/constants';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <Ticker />
      
      {/* Mobile Sidebar - Fully Opaque & Layered Above All */}
      <div className={`fixed inset-0 w-full h-full bg-[#040305] z-[1100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-full'}`}>
        
        {/* Dedicated Close Button inside the menu */}
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-10 right-6 w-12 h-12 flex items-center justify-center bg-onyx/50 border border-border-subtle rounded-full text-gold-light hover:text-gold transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center h-full space-y-12 px-6">
          <div className="flex flex-col items-center gap-10">
            {['Learn', 'Terminal', 'ICT / SMC', 'Pricing'].map((item, idx) => (
              <Link 
                key={item}
                href={`/#${item === 'ICT / SMC' ? 'ict' : item.toLowerCase().replace(/\s|\//g, '')}`}
                onClick={() => setIsMenuOpen(false)}
                className={`group flex flex-col items-center transition-all duration-700 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <span className="block italic opacity-40 text-[0.7rem] font-sans tracking-[0.4em] uppercase mb-1">{item}</span>
                <span className="font-serif text-[2.6rem] font-light text-ivory group-hover:text-gold-light transition-colors">{item}</span>
              </Link>
            ))}
          </div>
          
          <Link
            href={SITE_CONFIG.links.telegram}
            target="_blank"
            onClick={() => setIsMenuOpen(false)}
            className="px-14 py-5 bg-gold text-void rounded-sm font-bold uppercase tracking-[0.2em] text-[0.85rem] transition-all hover:bg-gold-light shadow-[0_10px_30px_rgba(201,149,42,0.1)]"
          >
            Join community
          </Link>
        </div>
      </div>

      <header className="fixed top-8 left-0 right-0 z-[1050] h-14 md:h-16 bg-[#040305E6] backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-6 md:px-16">
          <Link href="/" className="flex items-center gap-3.5 no-underline group shrink-0">
            <div className="w-9 h-9 border border-gold border-opacity-60 rounded-md flex items-center justify-center bg-gradient-to-br from-gold/15 to-transparent flex-shrink-0 group-hover:border-opacity-100 transition-all duration-300">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
                <path d="M2 14L6 8.5L10 11.5L16 4" stroke="currentColor" className="text-gold-light" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="16" cy="4" r="1.5" fill="currentColor" className="text-gold-light"/>
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-serif text-[1.1rem] md:text-[1.15rem] font-semibold text-gold-light leading-none tracking-tight">
                TheEthicalTrader
              </span>
              <span className="text-[0.55rem] font-medium tracking-[0.25em] uppercase text-stone leading-none opacity-80">
                Trade with Integrity
              </span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <ul className="list-none hidden md:flex items-center gap-10">
            {['Learn', 'Terminal', 'ICT / SMC', 'Pricing'].map((item) => (
              <li key={item}>
                <Link 
                  href={`/#${item === 'ICT / SMC' ? 'ict' : item.toLowerCase().replace(/\s|\//g, '')}`} 
                  className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-stone hover:text-gold transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex gap-4 items-center">
            <Link
              href={SITE_CONFIG.links.telegram}
              target="_blank"
              className="hidden sm:flex px-6 py-2 bg-gradient-gold text-void font-bold text-[0.7rem] uppercase tracking-wider rounded-sm"
            >
              Join Telegram
            </Link>

            {/* Mobile Menu Button - Locked to top of all layers */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col items-center justify-center gap-2 w-10 h-10 bg-onyx/50 border border-border-subtle rounded-md cursor-pointer z-[1200] relative"
              aria-label="Toggle Menu"
            >
              <span className={`w-5 h-[1.5px] bg-gold-light transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
              <span className={`w-5 h-[1.5px] bg-gold-light transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
