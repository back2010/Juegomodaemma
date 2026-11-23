/** Bolsas (abs). La mano derecha de pantalla está en ≈(408,668); el asa pasa por ahí. */
import type { CatalogItem, PartProps } from '@/types';
import { Gloss, RadGrad, outline, shapePath, variantsOf, variant } from '@/art/kit';
import { GOLD } from './_common';

const HANDLE = 'M396 722C394 650 446 650 444 722';

function Handle({ o, p }: { o: string; p: PartProps['palette'] }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={HANDLE} stroke={o} strokeWidth={9} />
      <path d={HANDLE} stroke={p.light} strokeWidth={4.4} />
    </g>
  );
}

function makeBag(shape: 'corazon' | 'estrella' | 'circulo', cy: number, r: number) {
  return function Bag({ palette: p, idp }: PartProps) {
    const o = outline(p);
    const d = shapePath(shape, 420, cy, r);
    return (
      <g strokeLinejoin="round">
        <defs><RadGrad id={idp('b')} p={p} /></defs>
        <Handle o={o} p={p} />
        <path d={d} fill={`url(#${idp('b')})`} stroke={o} strokeWidth={3.5} />
        {shape === 'circulo' && <path d={`M${420 - r + 4} ${cy - 6}Q420 ${cy + 8} ${420 + r - 4} ${cy - 6}`} stroke={p.shade} strokeWidth={2.5} fill="none" />}
        {shape === 'estrella' && <path d={shapePath('estrella', 420, cy + 2, r * 0.5)} fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={2.5} />}
        {shape === 'corazon' && <path d={shapePath('corazon', 420, cy, r * 0.58)} fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={2.5} />}
        <circle cx={420} cy={shape === 'estrella' ? cy - r + 18 : cy - r * 0.45} r={6} fill={GOLD.main} stroke={GOLD.line} strokeWidth={1.6} />
        <Gloss cx={420 - r * 0.45} cy={cy - r * 0.35} rx={r * 0.2} ry={r * 0.1} o={0.55} />
      </g>
    );
  };
}

const thumb: [number, number, number, number] = [366, 630, 124, 160];

export const bags: CatalogItem[] = [
  { id: 'bag-corazon', slot: 'bag', kind: 'bolsa', spokenName: 'bolsa de corazón', theme: 'fiesta', shapeTag: 'corazon', count: 1,
    variants: variantsOf('rosa', 'rojo', 'morado', 'azul'), parts: { bag: makeBag('corazon', 748, 42) }, thumb },
  { id: 'bag-estrella', slot: 'bag', kind: 'bolsa', spokenName: 'bolsa de estrella', theme: 'fantasia', shapeTag: 'estrella', count: 1,
    variants: variantsOf('amarillo', 'morado', 'azul', 'rosa', 'naranja'), parts: { bag: makeBag('estrella', 750, 50) }, thumb },
  { id: 'bag-redonda', slot: 'bag', kind: 'bolsa', spokenName: 'bolsa redonda', theme: 'casual', shapeTag: 'circulo', count: 1,
    variants: [...variantsOf('verde', 'naranja', 'azul', 'rojo'), variant('cafe', '#8a5a33', 'cafe')], parts: { bag: makeBag('circulo', 746, 38) }, thumb },
];
