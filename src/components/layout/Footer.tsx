import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-void py-16 px-6 lg:px-16 z-10 relative mt-20">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">
        <div className="max-w-[320px]">
          <Link href="/" className="flex items-center gap-3.5 no-underline mb-6 inline-flex group">
            <div className="w-9 h-9 border border-gold border-opacity-60 rounded-md flex items-center justify-center bg-gradient-to-br from-gold/15 to-transparent shrink-0 group-hover:border-opacity-100 transition-all duration-300">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
                <path d="M2 14L6 8.5L10 11.5L16 4" stroke="currentColor" className="text-gold-light" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="16" cy="4" r="1.5" fill="currentColor" className="text-gold-light"/>
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-serif text-[1.15rem] font-semibold text-gold-light leading-none tracking-tight">
                TheEthicalTrader
              </span>
              <span className="text-[0.55rem] font-medium tracking-[0.25em] uppercase text-stone leading-none opacity-80">
                Trade with Integrity
              </span>
            </div>
          </Link>
          <p className="text-[0.85rem] text-parchment leading-[1.8]">
            Transparent, disciplined, education-first trading intelligence. Master ICT/SMC, order flow, and execute with precision and integrity.
          </p>
        </div>

        <div>
          <div className="text-[0.62rem] font-bold tracking-[0.2em] uppercase text-stone mb-5">Platform</div>
          <ul className="list-none flex flex-col gap-3">
            <li><Link href="#learn" className="text-[0.8rem] text-parchment hover:text-gold-light transition-colors">Education</Link></li>
            <li><Link href="#terminal" className="text-[0.8rem] text-parchment hover:text-gold-light transition-colors">Terminal</Link></li>
            <li><Link href="#ict" className="text-[0.8rem] text-parchment hover:text-gold-light transition-colors">ICT Concepts</Link></li>
            <li><Link href="#pricing" className="text-[0.8rem] text-parchment hover:text-gold-light transition-colors">Pricing</Link></li>
          </ul>
        </div>
        
        <div>
          <div className="text-[0.62rem] font-bold tracking-[0.2em] uppercase text-stone mb-5">Markets</div>
          <ul className="list-none flex flex-col gap-3">
            <li><Link href="/markets/forex" className="text-[0.8rem] text-parchment hover:text-gold-light transition-colors">Forex</Link></li>
            <li><Link href="/markets/indices" className="text-[0.8rem] text-parchment hover:text-gold-light transition-colors">Indices</Link></li>
            <li><Link href="/markets/commodities" className="text-[0.8rem] text-parchment hover:text-gold-light transition-colors">Commodities</Link></li>
            <li><Link href="/markets/crypto" className="text-[0.8rem] text-parchment hover:text-gold-light transition-colors">Crypto</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-[0.62rem] font-bold tracking-[0.2em] uppercase text-stone mb-5">Company</div>
          <ul className="list-none flex flex-col gap-3">
            <li><Link href="/about" className="text-[0.8rem] text-parchment hover:text-gold-light transition-colors">About</Link></li>
            <li><Link href="/blog" className="text-[0.8rem] text-parchment hover:text-gold-light transition-colors">Blog</Link></li>
            <li><Link href="/contact" className="text-[0.8rem] text-parchment hover:text-gold-light transition-colors">Contact</Link></li>
            <li><Link href="/privacy" className="text-[0.8rem] text-parchment hover:text-gold-light transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto border-t border-border-subtle pt-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <span className="text-[0.68rem] text-stone shrink-0">© {new Date().getFullYear()} TheEthicalTrader. All rights reserved.</span>
        <p className="text-[0.6rem] text-ash leading-[1.6] max-w-[800px] md:text-right">
          Risk Disclosure: Trading involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results. AI signals are educational tools, not financial advice. Never trade more than you can afford to lose.
        </p>
      </div>
    </footer>
  );
}
