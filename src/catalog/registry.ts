/**
 * Registro central del catálogo. NO editar desde los paquetes: cada paquete solo rellena
 * su propio assets/<paquete>/index.ts (export default de un arreglo).
 */
import type { CatalogItem, DollBase, HairStyle, MakeupKind, MakeupStyle, StickerDef, WearSlot } from '@/types';
import dolls from '@/assets/dolls';
import hair from '@/assets/hair';
import makeup from '@/assets/makeup';
import stickers from '@/assets/stickers';
import clothes from '@/assets/clothes';
import accessories from '@/assets/accessories';

function byId<T extends { id: string }>(list: T[]) {
  const m = new Map<string, T>();
  for (const x of list) m.set(x.id, x);
  return m;
}

const items: CatalogItem[] = [...clothes, ...accessories];
const maps = {
  dolls: byId(dolls), hair: byId(hair), makeup: byId(makeup), stickers: byId(stickers), items: byId(items),
};

export const catalog = {
  dolls: dolls as DollBase[],
  hairStyles: hair as HairStyle[],
  makeupStyles: makeup as MakeupStyle[],
  stickers: stickers as StickerDef[],
  items,
  doll: (id: string) => maps.dolls.get(id),
  hair: (id: string) => maps.hair.get(id),
  makeup: (id: string) => maps.makeup.get(id),
  sticker: (id: string) => maps.stickers.get(id),
  item: (id: string) => maps.items.get(id),
  itemsForSlot: (slot: WearSlot, dollId?: string) =>
    items.filter((i) => i.slot === slot && (!i.compat?.dolls || !dollId || i.compat.dolls.includes(dollId))),
  makeupOfKind: (k: MakeupKind) => (makeup as MakeupStyle[]).filter((m) => m.kind === k),
};
export type Catalog = typeof catalog;
