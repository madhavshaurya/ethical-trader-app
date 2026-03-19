'use client';
import { useEffect, useState } from 'react';

export default function DeltaHistogram({ symbol }: { symbol: string }) {
  const [bars, setBars] = useState<number[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const data = Array.from({length: 40}, () => (Math.random() * 200) - 100);
    setBars(data);
    
    const intv = setInterval(() => {
      setBars(prev => {
        const nextVal = (Math.random() * 200) - 100;
        setTotal(t => t + nextVal);
        const next = [...prev.slice(1), nextVal];
        return next;
      });
    }, 2000);
    
    return () => clearInterval(intv);
  }, [symbol]);

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-3">
        <div className="text-stone text-[0.65rem] font-bold uppercase tracking-[0.15em]">Cumulative Delta</div>
        <div className={`text-[0.65rem] font-mono ${total >= 0 ? 'text-bull' : 'text-bear'}`}>
          {total > 0 ? '+' : ''}{total.toFixed(0)}
        </div>
      </div>
      <div className="text-[0.6rem] text-stone tracking-[0.12em] uppercase mb-4">Buy vs Sell Pressure</div>
      <div className="h-[90px] w-full flex items-end gap-[2px]">
        {bars.map((val, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-t-sm transition-all duration-300 ${val > 0 ? 'bg-bull' : 'bg-bear'}`} 
            style={{ height: `${Math.max(5, Math.abs(val) / 2)}%`, opacity: 0.5 + (Math.abs(val)/200) * 0.5 }} 
          />
        ))}
      </div>
    </div>
  );
}
