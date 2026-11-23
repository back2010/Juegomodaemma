import { create } from 'zustand';
import type { Creation } from '@/types';
import * as idb from '@/db/db';

export const newId = () => (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);

interface GalleryStore {
  items: Creation[];
  loaded: boolean;
  load(): Promise<void>;
  /** Guarda (crea o actualiza) una creación con su PNG y miniatura. */
  save(c: Omit<Creation, 'imageKey' | 'thumbKey' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & Partial<Creation>, png: Blob, thumb: Blob): Promise<Creation>;
  duplicate(id: string): Promise<Creation | null>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}

export const useGallery = create<GalleryStore>()((set, get) => ({
  items: [],
  loaded: false,
  load: async () => set({ items: await idb.listCreations(), loaded: true }),
  save: async (c, png, thumb) => {
    const now = Date.now();
    const prev = get().items.find((x) => x.id === c.id);
    const rec: Creation = {
      ...c, schemaVersion: 1,
      createdAt: prev?.createdAt ?? now, updatedAt: now,
      imageKey: `${c.id}.png`, thumbKey: `${c.id}.thumb.png`,
    } as Creation;
    await idb.putImage(rec.imageKey, png);
    await idb.putImage(rec.thumbKey, thumb);
    await idb.putCreation(rec);
    set((s) => ({ items: [rec, ...s.items.filter((x) => x.id !== rec.id)] }));
    return rec;
  },
  duplicate: async (id) => {
    const src = get().items.find((x) => x.id === id);
    if (!src) return null;
    const [png, thumb] = await Promise.all([idb.getImage(src.imageKey), idb.getImage(src.thumbKey)]);
    if (!png || !thumb) return null;
    return get().save({ ...structuredClone(src), id: newId(), parentId: src.id }, png, thumb);
  },
  remove: async (id) => { await idb.deleteCreation(id); set((s) => ({ items: s.items.filter((x) => x.id !== id) })); },
  clear: async () => { await idb.clearAll(); set({ items: [] }); },
}));
