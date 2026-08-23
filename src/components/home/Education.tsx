'use client';

import { useEffect, useRef } from 'react';
import { useEducationStore } from '@/lib/educationStore';
import { LESSONS } from '@/lib/education-content';


export const COLOR_MAP: Record<string, any> = {
  found: { bg: 'bg-[rgba(34,201,122,0.08)]', text: 'text-bull', border: 'border-[rgba(34,201,122,0.18)]' },
  ict: { bg: 'bg-[rgba(201,149,42,0.08)]', text: 'text-gold-light', border: 'border-[rgba(201,149,42,0.18)]' },
  flow: { bg: 'bg-[rgba(184,98,26,0.08)]', text: 'text-amber-lt', border: 'border-[rgba(184,98,26,0.18)]' },
  adv: { bg: 'bg-[rgba(200,131,78,0.08)]', text: 'text-copper-lt', border: 'border-[rgba(200,131,78,0.18)]' }
};

export default function Education() {
  const { activeLessonId, setActiveLessonId } = useEducationStore();
  
  useEffect(() => {
    if (activeLessonId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeLessonId]);

  return (
    <>
      <section id="learn" className="border-t border-border-subtle bg-void relative z-1">
        <div className="max-w-[1440px] mx-auto py-20 px-6 lg:px-16">
          <div className="flex items-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-5 before:content-[''] before:block before:w-7 before:h-[1px] before:bg-amber">
            Education Center
          </div>
          <h2 className="font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-[1.1] text-ivory mb-5">
            From Zero to <em className="italic text-gold-mid font-light">Institutional Edge</em>
          </h2>
          <p className="text-parchment max-w-[520px] mb-14 leading-[1.8]">
            Every lesson built by professional traders. No fluff, no theory for theory's sake — only what actually works in live markets.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.values(LESSONS).map((lesson) => (
              <LessonCard 
                key={lesson.id}
                {...lesson} 
                onClick={() => setActiveLessonId(lesson.id)} 
              />
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

function LessonCard({ id, badge, title, desc, meta, color, hasPreview, onClick }: any) {
  const c = COLOR_MAP[color as keyof typeof COLOR_MAP];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!hasPreview || !canvasRef.current) return;
    
    // Slight delay to ensure layout computation is complete
    const timeoutId = setTimeout(() => {
      const cv = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext('2d');
      if (!ctx) return;
      
      cv.width = cv.offsetWidth || 330;
      cv.height = 150;
      const W = cv.width;
      const H = cv.height;

      if (id === 'basics') {
        const d = Array.from({length:20},()=>{const o=.4+Math.random()*.35,c=.4+Math.random()*.35;return{o,c,h:Math.max(o,c)+Math.random()*.12,l:Math.min(o,c)-Math.random()*.08}});
        const all = d.flatMap(x=>[x.h,x.l]), mn = Math.min(...all), mx = Math.max(...all), rng = mx-mn||.1;
        const py = (v: number) => 14+(H-24)-((v-mn)/rng)*(H-24), bw = (W-16)/20*.68;
        d.forEach((x,i)=>{const cx2=8+i*(W-16)/20+bw/2,b=x.c>=x.o;ctx.strokeStyle=b?'#22C97A':'#E04545';ctx.lineWidth=.75;ctx.beginPath();ctx.moveTo(cx2,py(x.h));ctx.lineTo(cx2,py(x.l));ctx.stroke();ctx.fillStyle=b?'rgba(34,201,122,.78)':'rgba(224,69,69,.78)';ctx.fillRect(cx2-bw/2,Math.min(py(x.o),py(x.c)),bw,Math.max(1,Math.abs(py(x.o)-py(x.c))))});
        ctx.fillStyle='rgba(201,149,42,.6)';ctx.font='10px Fira Code,monospace';ctx.fillText('Candlestick Chart',10,14);
      } 
      else if (id === 'ict') {
        ctx.fillStyle='rgba(34,201,122,.06)';ctx.strokeStyle='rgba(34,201,122,.35)';ctx.lineWidth=1;
        ctx.fillRect(W*.25,H*.48,W*.24,H*.38);ctx.strokeRect(W*.25,H*.48,W*.24,H*.38);
        ctx.fillStyle='rgba(34,201,122,.55)';ctx.font='9px Fira Code';ctx.fillText('OB',W*.27,H*.65);
        ctx.fillStyle='rgba(201,149,42,.07)';ctx.strokeStyle='rgba(201,149,42,.38)';
        ctx.fillRect(W*.52,H*.17,W*.2,H*.18);ctx.strokeRect(W*.52,H*.17,W*.2,H*.18);
        ctx.fillStyle='rgba(201,149,42,.6)';ctx.fillText('FVG',W*.54,H*.29);
        const pts=[.04,.84,.25,.66,.32,.34,.52,.22,.46,.5,.68,.26,.96,.08];
        ctx.beginPath();ctx.strokeStyle='rgba(201,149,42,.65)';ctx.lineWidth=1.4;
        for(let i=0;i<pts.length;i+=2) i===0?ctx.moveTo(pts[i]*W,pts[i+1]*H):ctx.lineTo(pts[i]*W,pts[i+1]*H);
        ctx.stroke();
        ctx.fillStyle='rgba(201,149,42,.6)';ctx.font='10px Fira Code';ctx.fillText('ICT Structure',10,14);
      }
      else if (id === 'orderflow') {
        const cols=13, cw2=W/cols;
        for(let i=0;i<cols;i++){const b=Math.random()*.7+.1,a=Math.random()*.6+.1;ctx.fillStyle='rgba(34,201,122,.3)';ctx.fillRect(i*cw2,H-b*(H*.42),cw2*.45,b*(H*.42));ctx.fillStyle='rgba(224,69,69,.3)';ctx.fillRect(i*cw2+cw2*.5,H-a*(H*.42),cw2*.45,a*(H*.42))}
        ctx.fillStyle='rgba(184,98,26,.6)';ctx.font='10px Fira Code';ctx.fillText('Footprint / Order Flow',10,14);
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [id, hasPreview]);

  return (
    <div 
      onClick={onClick}
      className={`bg-onyx border border-border-subtle rounded-[10px] overflow-hidden cursor-pointer transition-all hover:border-border-mid hover:-translate-y-[6px] hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)] relative group flex flex-col`}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-gold group-hover:to-amber-mid transition-all z-10" />
      
      {hasPreview && (
        <div className="h-[150px] bg-carbon relative flex items-center justify-center shrink-0 border-b border-border-subtle overflow-hidden">
          <canvas ref={canvasRef} style={{ width: '100%', height: '150px', display: 'block' }}></canvas>
        </div>
      )}
      
      <div className={`p-5 pb-7 flex flex-col flex-1 ${!hasPreview ? 'pt-7' : ''}`}>
        <div>
          <span className={`inline-flex items-center px-2 py-[2px] rounded-sm text-[0.58rem] font-bold tracking-[0.15em] uppercase border mb-3 ${c.bg} ${c.text} ${c.border}`}>
            {badge}
          </span>
          <h3 className="font-serif text-[1.1rem] font-semibold text-ivory leading-[1.3] mb-[0.6rem]">{title}</h3>
          <div className="text-[0.8rem] text-parchment leading-[1.7] mb-4">{desc}</div>
        </div>
        <div className="mt-auto pt-4 flex justify-between items-center text-[0.68rem] text-stone">
          <span>{meta}</span>
          <span className="font-bold tracking-[0.08em] text-gold flex items-center gap-1">Open lesson →</span>
        </div>
      </div>
    </div>
  );
}
