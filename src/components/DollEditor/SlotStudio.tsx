/** Estudio genérico por slots (ropa y accesorios). Wardrobe y Accessories lo usan o lo reemplazan. */
import type { WearSlot } from '@/types';
import { catalog } from '@/catalog/registry';
import { useDolls, useCurrentLook } from '@/store/dollStore';
import { ItemGrid } from './ItemGrid';
import { ColorSwatches } from './ColorSwatches';
import { SubTabs } from './SubTabs';
import { ItemPreview } from './Preview';
import { swatchPaint } from './paint';

export function SlotStudio({ slots }: { slots: WearSlot[] }) {
  const look = useCurrentLook();
  const subTab = useDolls((s) => s.subTab);
  const { setSubTab, equip, unequip } = useDolls.getState();
  const available = slots.filter((s) => catalog.itemsForSlot(s, look.dollId).length > 0);
  const slot = (available.includes(subTab as WearSlot) ? subTab : available[0]) as WearSlot | undefined;
  if (!slot) return null;
  const items = catalog.itemsForSlot(slot, look.dollId);
  const eq = look.outfit[slot];
  const eqItem = eq && catalog.item(eq.itemId);
  return (
    <div className="studio-body">
      <SubTabs value={slot} onChange={setSubTab} tabs={available.map((s) => {
        const first = catalog.itemsForSlot(s, look.dollId)[0];
        return { key: s, label: first.kind, icon: <ItemPreview item={first} dollId={look.dollId} /> };
      })} />
      <ItemGrid testId="item-grid" onNone={() => unequip(slot)} noneSelected={!eq}
        tiles={items.map((it) => ({
          key: it.id, label: it.spokenName, selected: eq?.itemId === it.id,
          preview: <ItemPreview item={it} variantId={eq?.itemId === it.id ? eq.variantId : undefined} dollId={look.dollId} />,
          onPick: () => {
            const keep = eq && it.variants.find((v) => v.id === eq.variantId);
            equip(slot, it.id, keep ? keep.id : it.variants[0].id);
          },
        }))} />
      {eqItem && (
        <ColorSwatches testId="variant-swatches" swatches={eqItem.variants.map((v) => ({
          key: v.id, label: v.colorTags[0], selected: v.id === eq!.variantId,
          paint: swatchPaint(v.palette.main), onPick: () => equip(slot, eqItem.id, v.id),
        }))} />
      )}
    </div>
  );
}
