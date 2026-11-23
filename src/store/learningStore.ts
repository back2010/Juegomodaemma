import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ActivityProgress, HistoryEntry, LearningProgress } from '@/types';

/** Progreso local (no se presenta como evaluación). La lógica de progresión vive en learning/kit (P5). */
interface LearningStore extends LearningProgress {
  getProgress(activityId: string): ActivityProgress;
  setProgress(activityId: string, p: ActivityProgress): void;
  recordSession(e: HistoryEntry): void;
  resetProgress(): void;
}

export const NEW_PROGRESS: ActivityProgress = { level: 1, streak: 0, struggle: 0, plays: 0, lastPlayed: 0 };

export const useLearning = create<LearningStore>()(
  persist(
    (set, get) => ({
      v: 1,
      perActivity: {},
      history: [],
      getProgress: (id) => get().perActivity[id] ?? { ...NEW_PROGRESS },
      setProgress: (id, p) => set((s) => ({ perActivity: { ...s.perActivity, [id]: p } })),
      recordSession: (e) => set((s) => ({ history: [...s.history, e].slice(-20) })),
      resetProgress: () => set({ perActivity: {}, history: [] }),
    }),
    { name: 'emma.learning', version: 1, partialize: (s) => ({ v: s.v, perActivity: s.perActivity, history: s.history }) },
  ),
);
