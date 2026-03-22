import { create } from 'zustand';

interface EducationState {
  activeLessonId: string | null;
  setActiveLessonId: (id: string | null) => void;
}

export const useEducationStore = create<EducationState>((set) => ({
  activeLessonId: null,
  setActiveLessonId: (id) => set({ activeLessonId: id }),
}));
