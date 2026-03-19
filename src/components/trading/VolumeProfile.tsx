'use client';
import { useEffect, useState } from 'react';

export default function VolumeProfile({ symbol }: { symbol: string }) {
  const [levels, setLevels] = useState<{price: number, vol: number}[]>([]);
  
  useEffect(() => {
    const generate = () => {
      const data = [];
      const basePrice = symbol.includes('BTC') ? 64000 : 1.087;
      const step = symbol.includes('BTC') ? 20 : 0.0002;
      
      for(let i=0; i<25; i++) {
        const distFromCenter = Math.abs(12 - i);
        const volume = (25 - distFromCenter * 1.5) * Math.random() * 10;
        data.push({
          price: basePrice + step * (12-i),
          vol: Math.max(volume, 2)
        });
      }
      setLevels(data);
    };
    generate();
  }, [symbol]);

  const maxVol = Math.max(...levels.map(l => l.vol), 1);

  return (
    <div className="p-5 pt-3">
      <div className="text-stone text-[0.65rem] font-bold uppercase tracking-[0.15em] mb-4">Volume Profile</div>
      <div className="flex flex-col gap-[1px] h-[160px] relative">
        {levels.map((lvl, i) => {
          const isPoc = lvl.vol === maxVol;
          return (
            <div key={i} className="flex-1 flex items-center relative group w-full">
              <div 
                className={`absolute left-0 top-0 bottom-0 ${isPoc ? 'bg-[rgba(201,149,42,0.4)] border-r-2 border-gold' : 'bg-[rgba(255,255,255,0.06)]'} transition-all group-hover:bg-[rgba(255,255,255,0.12)] z-0`} 
                style={{ width: `${(lvl.vol / maxVol) * 100}%` }} 
              />
              {isPoc && <div className="absolute right-2 text-[0.55rem] text-gold-light z-10 font-sans tracking-widest font-bold">POC</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
