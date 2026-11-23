/** Estudio de peinados. Versión base de P0 (P3 la amplía). */
import type { HairColor } from '@/types';
import { catalog } from '@/catalog/registry';
import { HAIR_HEX } from '@/art/kit';
import { useDolls, useCurrentLook } from '@/store/dollStore';
import { ItemGrid } from '@/components/DollEditor/ItemGrid';
import { ColorSwatches } from '@/components/DollEditor/ColorSwatches';
import { HairPreview } from '@/components/DollEditor/Preview';
import { hairPaintCss } from '@/components/DollEditor/paint';

export const HAIR_COLORS: { key: string; color: HairColor }[] = [
  ...Object.entries(HAIR_HEX).map(([k, a]) => ({ key: k, color: { mode: 'solid', a } as HairColor })),
  { key: 'rubio-rosa', color: { mode: 'gradient', a: HAIR_HEX.rubio, b: HAIR_HEX.rosa } },
  { key: 'morado-azul', color: { mode: 'gradient', a: HAIR_HEX.morado, b: HAIR_HEX.turquesa } },
  { key: 'castano-caramelo', color: { mode: 'gradient', a: HAIR_HEX.castano, b: HAIR_HEX.caramelo } },
  { key: 'rosa-morado', color: { mode: 'two', a: HAIR_HEX.rosa, b: HAIR_HEX.morado } },
  { key: 'arcoiris', color: { mode: 'rainbow' } },
];
const same = (a: HairColor, b: HairColor) => JSON.stringify(a) === JSON.stringify(b);

export function HairStudio() {
  const look = useCurrentLook();
  const { setHairStyle, setHairColor } = useDolls.getState();
  return (
    <div className="studio-body">
      <ItemGrid testId="item-grid" tiles={catalog.hairStyles.map((h) => ({
        key: h.id, label: h.spokenName, selected: look.hair.styleId === h.id,
        preview: <HairPreview styleId={h.id} color={look.hair.color} dollId={look.dollId} />,
        onPick: () => setHairStyle(h.id),
      }))} />
      <ColorSwatches testId="hair-colors" swatches={HAIR_COLORS.map((c) => ({
        key: c.key, label: c.key, paint: hairPaintCss(c.color), selected: same(c.color, look.hair.color),
        onPick: () => setHairColor(c.color),
      }))} />
    </div>
  );
}
