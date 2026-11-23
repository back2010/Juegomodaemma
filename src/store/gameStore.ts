import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Overlay, PhotoState, Scene, Screen } from '@/types';

interface GameStore {
  screen: Screen;
  overlay: Overlay;
  photo: PhotoState;
  go(screen: Screen['name']): void;
  setOverlay(o: Overlay): void;
  setScene(p: Partial<Scene>): void;
  setPhoto(p: PhotoState): void;
  restore(s: { screen: Screen; photo: PhotoState }): void;
}

export const DEFAULT_SCENE: Scene = { backgroundId: 'bg-default', frameId: null };

export const useGame = create<GameStore>()(
  persist(
    (set) => ({
      screen: { name: 'home' },
      overlay: 'none',
      photo: { scene: DEFAULT_SCENE },
      go: (name) => set({ screen: { name } as Screen }),
      setOverlay: (overlay) => set({ overlay }),
      setScene: (p) => set((s) => ({ photo: { ...s.photo, scene: { ...s.photo.scene, ...p } } })),
      setPhoto: (photo) => set({ photo }),
      restore: (st) => set(structuredClone({ screen: st.screen, photo: st.photo })),
    }),
    { name: 'emma.game', version: 1, partialize: (s) => ({ screen: s.screen, photo: s.photo }) },
  ),
);
