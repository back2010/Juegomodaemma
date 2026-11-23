import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_SETTINGS, type Settings } from '@/types';

interface SettingsStore extends Settings {
  updateScheduler(p: Partial<Settings['scheduler']>): void;
  updateAudio(p: Partial<Settings['audio']>): void;
  updateGame(p: Partial<Settings['game']>): void;
  resetSettings(): void;
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...structuredClone(DEFAULT_SETTINGS),
      updateScheduler: (p) => set((s) => ({ scheduler: { ...s.scheduler, ...p } })),
      updateAudio: (p) => set((s) => ({ audio: { ...s.audio, ...p } })),
      updateGame: (p) => set((s) => ({ game: { ...s.game, ...p } })),
      resetSettings: () => set(structuredClone(DEFAULT_SETTINGS)),
    }),
    {
      name: 'emma.settings',
      version: 1,
      partialize: (s) => ({ v: s.v, scheduler: s.scheduler, audio: s.audio, game: s.game }),
      // Fusión profunda: claves nuevas de DEFAULT_SETTINGS aparecen aunque haya datos viejos.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Settings>;
        return {
          ...current,
          scheduler: { ...current.scheduler, ...p.scheduler, categories: { ...current.scheduler.categories, ...p.scheduler?.categories } },
          audio: { ...current.audio, ...p.audio },
          game: { ...current.game, ...p.game },
        };
      },
      migrate: (state) => state as Settings,
    },
  ),
);

/** Acceso no reactivo (fuera de componentes). */
export const getSettings = (): Settings => {
  const { v, scheduler, audio, game } = useSettings.getState();
  return { v, scheduler, audio, game };
};
