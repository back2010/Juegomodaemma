/** Estudio de peinados (P3): grupos con miniaturas, estilos y colores (sólidos, mezclas, arcoíris). */
import type { HairColor, HairStyle } from '@/types';
import { catalog } from '@/catalog/registry';
import { HAIR_HEX } from '@/art/kit';
import { useDolls, useCurrentLook } from '@/store/dollStore';
import { ItemGrid } from '@/components/DollEditor/ItemGrid';
import { ColorSwatches } from '@/components/DollEditor/ColorSwatches';
import { SubTabs } from '@/components/DollEditor/SubTabs';
import { HairPreview } from '@/components/DollEditor/Preview';
import { hairPaintCss } from '@/components/DollEditor/paint';

export type HairGroup = 'largos' | 'rizos' | 'cortos' | 'recogidos' | 'fiesta';
export const HAIR_GROUPS: HairGroup[] = ['largos', 'rizos', 'cortos', 'recogidos', 'fiesta'];

/** Grupo de un peinado según sus tipos (fiesta > cortos > rizos > recogidos > largos). */
export function hairGroupOf(h: Pick<HairStyle, 'kinds'>): HairGroup {
  const k = new Set(h.kinds);
  if (k.has('fiesta')) return 'fiesta';
  if (k.has('corto')) return 'cortos';
  if (k.has('rizado')) return 'rizos';
  if (k.has('trenzas') || k.has('coletas') || k.has('chongo') || (k.has('recogido') && !k.has('largo'))) return 'recogidos';
  return 'largos';
}

const solid = (key: string, a: string) => ({ key, color: { mode: 'solid', a } as HairColor });
const grad = (key: string, a: string, b: string) => ({ key, color: { mode: 'gradient', a, b } as HairColor });
const two = (key: string, a: string, b: string) => ({ key, color: { mode: 'two', a, b } as HairColor });

/** Sólidos: naturales y de fantasía. */
export const HAIR_SOLIDS: { key: string; color: HairColor }[] = [
  solid('negro', HAIR_HEX.negro), solid('castano', HAIR_HEX.castano), solid('cafe', HAIR_HEX.cafe),
  solid('caramelo', HAIR_HEX.caramelo), solid('rubio', HAIR_HEX.rubio), solid('platino', '#f8e7b0'),
  solid('pelirrojo', HAIR_HEX.pelirrojo), solid('cobrizo', '#a84a2a'), solid('plata', HAIR_HEX.plata),
  solid('rosa', HAIR_HEX.rosa), solid('fucsia', '#ff2d95'), solid('coral', '#ff7a6b'), solid('lila', '#c9a3ff'),
  solid('morado', HAIR_HEX.morado), solid('azul', HAIR_HEX.azul), solid('turquesa', HAIR_HEX.turquesa),
  solid('menta', HAIR_HEX.menta), solid('lima', '#a8e04a'), solid('amarillo', '#ffd93b'),
];

/** Mezclas: degradados, dos colores y arcoíris. */
export const HAIR_MIXES: { key: string; color: HairColor }[] = [
  { key: 'arcoiris', color: { mode: 'rainbow' } },
  grad('rubio-rosa', HAIR_HEX.rubio, HAIR_HEX.rosa),
  grad('morado-azul', HAIR_HEX.morado, HAIR_HEX.turquesa),
  grad('castano-caramelo', HAIR_HEX.castano, HAIR_HEX.caramelo),
  grad('negro-azul', HAIR_HEX.negro, HAIR_HEX.azul),
  grad('rosa-lila', HAIR_HEX.rosa, '#c9a3ff'),
  grad('atardecer', '#ffd93b', '#ff6f61'),
  grad('menta-azul', HAIR_HEX.menta, HAIR_HEX.azul),
  grad('plata-lila', HAIR_HEX.plata, HAIR_HEX.morado),
  two('rosa-morado', HAIR_HEX.rosa, HAIR_HEX.morado),
  two('azul-rosa', HAIR_HEX.azul, HAIR_HEX.rosa),
  two('turquesa-rosa', HAIR_HEX.turquesa, '#ff2d95'),
  two('amarillo-morado', '#ffd93b', HAIR_HEX.morado),
  two('negro-rubio', HAIR_HEX.negro, HAIR_HEX.rubio),
];

export const HAIR_COLORS = [...HAIR_SOLIDS, ...HAIR_MIXES];
const same = (a: HairColor, b: HairColor) => JSON.stringify(a) === JSON.stringify(b);

export function HairStudio() {
  const look = useCurrentLook();
  const subTab = useDolls((s) => s.subTab);
  const { setHairStyle, setHairColor, setSubTab } = useDolls.getState();
  const styles = catalog.hairStyles;
  const groups = HAIR_GROUPS.filter((g) => styles.some((h) => hairGroupOf(h) === g));
  const current = catalog.hair(look.hair.styleId);
  const group = (groups.includes(subTab as HairGroup) ? subTab : current ? hairGroupOf(current) : groups[0]) as HairGroup;
  const shown = styles.filter((h) => hairGroupOf(h) === group);
  const swatches = (list: { key: string; color: HairColor }[]) => list.map((c) => ({
    key: c.key, label: c.key, paint: hairPaintCss(c.color), selected: same(c.color, look.hair.color),
    onPick: () => setHairColor(c.color),
  }));
  return (
    <div className="studio-body">
      <SubTabs value={group} onChange={setSubTab} tabs={groups.map((g) => ({
        key: g, label: g,
        icon: <HairPreview styleId={styles.find((h) => hairGroupOf(h) === g)!.id} color={look.hair.color} dollId={look.dollId} />,
      }))} />
      <ItemGrid testId="item-grid" tiles={shown.map((h) => ({
        key: h.id, label: h.spokenName, selected: look.hair.styleId === h.id,
        preview: <HairPreview styleId={h.id} color={look.hair.color} dollId={look.dollId} />,
        onPick: () => setHairStyle(h.id),
      }))} />
      <div data-testid="hair-colors" style={{ flex: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <ColorSwatches testId="hair-colors-solid" swatches={swatches(HAIR_SOLIDS)} />
        <ColorSwatches testId="hair-colors-mix" swatches={swatches(HAIR_MIXES)} />
      </div>
    </div>
  );
}
