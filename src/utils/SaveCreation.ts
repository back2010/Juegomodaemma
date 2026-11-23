import { newId, useGallery } from '@/store/galleryStore';
import type { Creation, DollLook, Scene } from '@/types';
import { withLock } from '@/scheduler/locks';
import { composeScene } from './ImageComposer';

export const FULL_SIZE = { width: 1600, height: 1200 };
export const THUMB_SIZE = { width: 320, height: 240 };

/** Guarda la foto en la galería (actualiza la creación si `editingId` existe). */
export function saveCreation(look: DollLook, scene: Scene, editingId?: string): Promise<Creation> {
  return withLock('save', async () => {
    const [png, thumb] = await Promise.all([composeScene(look, scene, FULL_SIZE), composeScene(look, scene, THUMB_SIZE)]);
    const gallery = useGallery.getState();
    const prev = editingId ? gallery.items.find((c) => c.id === editingId) : undefined;
    return gallery.save({
      id: prev?.id ?? newId(),
      look: structuredClone(look),
      scene: { ...scene },
      ...(prev?.title ? { title: prev.title } : {}),
      ...(prev?.parentId ? { parentId: prev.parentId } : {}),
    }, png, thumb);
  });
}
