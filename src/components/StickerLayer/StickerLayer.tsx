/**
 * Stickers: selector (StickerStudio) y capa de interacción sobre la muñeca (StickerLayer).
 * Versión base de P0: tocar un sticker lo coloca; P2 añade arrastrar/soltar con zonas y lock.
 */
import type { ReactNode } from 'react';
import type { StickerZone } from '@/types';
import { catalog } from '@/catalog/registry';
import { useDolls, useCurrentLook } from '@/store/dollStore';
import { newId } from '@/store/galleryStore';
import { ItemGrid } from '@/components/DollEditor/ItemGrid';
import { StickerPreview } from '@/components/DollEditor/Preview';
import { IconTrash } from '@/components/Shell/icons';

/** Zona según la posición en la muñeca (viewBox 0 0 600 1000). */
export function zoneAt(x: number, y: number): StickerZone {
  if (y < 200 || (y < 520 && (x < 175 || x > 425))) return 'hair';
  if (y < 400 && x >= 175 && x <= 425) return 'face';
  if (y < 1000 && x > 140 && x < 460) return 'body';
  return 'free';
}

export function StickerStudio() {
  const look = useCurrentLook();
  const { addSticker, removeSticker } = useDolls.getState();
  const n = look.stickers.length;
  return (
    <div className="studio-body">
      <ItemGrid testId="item-grid" tiles={[
        ...catalog.stickers.map((s) => ({
          key: s.id, label: s.shapeTag, preview: <StickerPreview def={s} />,
          onPick: () => {
            const x = 200 + ((n * 67) % 200), y = 110 + ((n * 41) % 90);
            addSticker({ uid: newId(), stickerId: s.id, x, y, scale: 0.6, rot: ((n * 23) % 40) - 20, zone: zoneAt(x, y) });
          },
        })),
        ...(n ? [{ key: 'trash', label: 'quitar', preview: <IconTrash />, onPick: () => removeSticker(look.stickers[n - 1].uid) }] : []),
      ]} />
    </div>
  );
}

/** Envoltorio de la muñeca en el escenario. P2 implementa el arrastre aquí. */
export function StickerLayer({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
