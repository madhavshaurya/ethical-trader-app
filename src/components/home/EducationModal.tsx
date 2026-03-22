'use client';

import { useEducationStore } from '@/lib/educationStore';
import { LESSONS, COLOR_MAP } from '@/components/home/Education';

export default function EducationModal() {
  const { activeLessonId, setActiveLessonId } = useEducationStore();
  const activeLesson = activeLessonId ? LESSONS[activeLessonId] : null;

  if (!activeLesson) return null;

  return (
    <div 
      className="fixed inset-0 z-[2147483647] flex items-start justify-center p-4 md:p-10 pt-[120px] bg-void/95 backdrop-blur-md transition-opacity overflow-y-auto"
      onClick={() => setActiveLessonId(null)}
    >
      <div 
        className="bg-onyx border border-border-mid rounded-xl w-full max-w-[720px] my-auto flex flex-col relative shadow-[0_40px_100px_rgba(0,0,0,0.95)] animate-[fade-up_0.3s_ease_out] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#c9952a] before:via-[#e6c27a] before:to-[#c9952a] before:rounded-t-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex-none p-5 md:p-8 pb-5 border-b border-border-subtle relative bg-carbon rounded-t-xl pr-14 md:pr-16">
          <button 
            onClick={() => setActiveLessonId(null)} 
            className="absolute top-5 right-5 md:top-6 md:right-6 w-8 h-8 flex items-center justify-center text-stone hover:text-ivory bg-void rounded-full border border-border-subtle hover:border-gold-mid transition-colors text-[0.8rem]"
          >
            ✕
          </button>
          <div className="mb-4">
            <span className={`inline-flex items-center px-2 py-[2px] rounded-sm text-[0.58rem] font-bold tracking-[0.15em] uppercase border ${COLOR_MAP[activeLesson.color].bg} ${COLOR_MAP[activeLesson.color].text} ${COLOR_MAP[activeLesson.color].border}`}>
              {activeLesson.badge}
            </span>
          </div>
          <h2 className="font-serif text-xl md:text-[1.8rem] font-semibold text-ivory leading-tight">{activeLesson.title}</h2>
        </div>
        
        {/* Modal Body with injected HTML */}
        <div className="flex-1 overflow-y-auto p-6 md:p-[2.25rem] bg-onyx rounded-b-xl custom-scrollbar">
          <div 
            className="text-[0.88rem] text-parchment leading-[1.85] break-words [&>h2]:font-serif [&>h2]:text-[1.15rem] [&>h2]:font-semibold [&>h2]:text-gold-light [&>h2]:mt-7 [&>h2]:mb-3 [&>h2:first-child]:mt-0 [&>p]:mb-4 [&>ul]:list-none [&>ul]:mb-4 [&>ul>li]:relative [&>ul>li]:pl-5 [&>ul>li]:mb-1.5 [&>ul>li]:text-[0.86rem] [&>ul>li]:before:content-['▸'] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:text-amber-lt [&>.lesson-hl]:bg-[rgba(201,149,42,0.06)] [&>.lesson-hl]:border-l-[3px] [&>.lesson-hl]:border-gold-deep [&>.lesson-hl]:px-5 [&>.lesson-hl]:py-4 [&>.lesson-hl]:rounded-r-lg [&>.lesson-hl]:my-6 [&>.lesson-hl]:text-[0.95rem] [&>.lesson-hl]:text-ivory [&>.lesson-hl]:leading-[1.75] [&>.lesson-hl]:font-serif [&>.lesson-hl]:italic"
            dangerouslySetInnerHTML={{ __html: activeLesson.body }}
          />
        </div>
      </div>
    </div>
  );
}
