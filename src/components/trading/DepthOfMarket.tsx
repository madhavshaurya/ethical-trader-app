'use client';
import { useEffect, useState } from 'react';

export default function DepthOfMarket({ symbol }: { symbol: string }) {
  const [dom, setDom] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate mock DOM data
    const generate = () => {
      const data = [];
      const basePrice = symbol.includes('BTC') ? 64000 : 1.087;
      const step = symbol.includes('BTC') ? 10 : 0.0001;
      
      for(let i=0; i<15; i++) {
        data.push({
          price: basePrice + step * (7-i),
          bid: Math.random() > 0.4 ? Math.floor(Math.random() * 100) : 0,
          ask: Math.random() > 0.4 ? Math.floor(Math.random() * 100) : 0,
          bidSize: Math.random() * 50,
          askSize: Math.random() * 50
        });
      }
      setDom(data);
    };
    generate();
    const intv = setInterval(generate, 1000);
    return () => clearInterval(intv);
  }, [symbol]);

  return (
    <div className="flex flex-col relative flex-1 min-h-[300px]">
      <div className="flex items-center justify-between py-3 px-5 border-b border-border-subtle bg-[rgba(0,0,0,0.2)] sticky top-0 z-20">
        <span className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-stone">Depth of Market</span>
      </div>
      <div className="grid grid-cols-[1fr_80px_1fr] py-1.5 text-[0.58rem] tracking-[0.1em] uppercase text-ash border-b border-border-subtle sticky top-[41px] bg-onyx z-20">
        <span className="pl-4">Bid Size</span>
        <span className="text-center">Price</span>
        <span className="text-right pr-4">Ask Size</span>
      </div>
      <div className="flex flex-col py-2 overflow-y-auto">
        {dom.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_1fr] relative py-[3px] group hover:bg-white/5">
            <div className="absolute left-0 top-0 bottom-0 bg-bull/10 transition-all" style={{ width: `${row.bidSize}%` }} />
            <div className="absolute right-0 top-0 bottom-0 bg-bear/10 transition-all" style={{ width: `${row.askSize}%` }} />
            <div className="px-4 text-bull font-mono text-[0.68rem] relative z-10">{row.bid || '-'}</div>
            <div className="text-center text-parchment font-mono text-[0.65rem] relative z-10">
              {row.price > 1000 ? row.price.toLocaleString(undefined, { minimumFractionDigits: 1 }) : row.price.toFixed(5)}
            </div>
            <div className="text-right px-4 text-bear font-mono text-[0.68rem] relative z-10">{row.ask || '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
