/** Lentes (abs; leen doll.anchors.eyeL/eyeR y earL/earR). */
import type { CatalogItem, PartProps } from '@/types';
import { Gloss, LinGrad, outline, roundRect, shapePath, variantsOf } from '@/art/kit';

type Lens = (cx: number, cy: number) => string;

/** Fabrica lentes: path de cada lente, grosor del marco y lentes oscuros opcionales. */
function makeGlasses(lens: Lens, opts: { w?: number; dark?: boolean; reach?: number; glossDx?: number } = {}) {
  const { w = 9, dark = false, reach = 46 } = opts;
  return function Glasses({ doll, palette: p, idp }: PartProps) {
    const o = outline(p);
    const { eyeL, eyeR, earL, earR } = doll.anchors;
    const cy = (e: { y: number }) => e.y + 2;
    return (
      <g strokeLinejoin="round" strokeLinecap="round">
        <defs>
          <LinGrad id={idp('f')} p={p} />
          <linearGradient id={idp('d')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a3a5c" /><stop offset="0.5" stopColor="#2b2036" /><stop offset="1" stopColor="#150f1c" />
          </linearGradient>
        </defs>
        {/* patillas */}
        <path d={`M${eyeL.x - reach} ${eyeL.y - 4}L${earL.x + 4} ${earL.y - 18}`} stroke={o} strokeWidth={6} fill="none" />
        <path d={`M${eyeR.x + reach} ${eyeR.y - 4}L${earR.x - 4} ${earR.y - 18}`} stroke={o} strokeWidth={6} fill="none" />
        {/* puente */}
        <path d={`M${eyeL.x + reach - 6} ${eyeL.y - 6}Q300 ${eyeL.y - 26} ${eyeR.x - reach + 6} ${eyeR.y - 6}`} stroke={o} strokeWidth={7} fill="none" />
        {[eyeL, eyeR].map((e, i) => {
          const d = lens(e.x, cy(e));
          return (
            <g key={i}>
              <path d={d} fill={dark ? `url(#${idp('d')})` : p.light} fillOpacity={dark ? 0.94 : 0.22} stroke={o} strokeWidth={w + 3} />
              <path d={d} fill="none" stroke={`url(#${idp('f')})`} strokeWidth={w} />
              <Gloss cx={e.x - 18} cy={e.y - 14} rx={dark ? 14 : 10} ry={dark ? 5 : 4.5} o={dark ? 0.35 : 0.55} rot={-28} />
            </g>
          );
        })}
      </g>
    );
  };
}

const GlassesStar = makeGlasses((cx, cy) => shapePath('estrella', cx, cy + 3, 50), { w: 8, reach: 46 });
const GlassesRound = makeGlasses((cx, cy) => shapePath('circulo', cx, cy, 43), { w: 8 });
const GlassesSquare = makeGlasses((cx, cy) => roundRect(cx - 43, cy - 38, 86, 76, 16), { w: 8, reach: 43 });
const GlassesSun = makeGlasses((cx, cy) => `M${cx - 46} ${cy - 6}C${cx - 46} ${cy - 34} ${cx + 46} ${cy - 34} ${cx + 46} ${cy - 6}C${cx + 44} ${cy + 36} ${cx - 44} ${cy + 36} ${cx - 46} ${cy - 6}Z`, { w: 8, dark: true });

const thumb: [number, number, number, number] = [160, 214, 280, 124];

export const glasses: CatalogItem[] = [
  { id: 'glasses-estrella', slot: 'glasses', kind: 'lentes', spokenName: 'lentes de estrella', theme: 'fantasia', shapeTag: 'estrella', count: 2,
    variants: variantsOf('amarillo', 'rosa', 'azul', 'morado'), parts: { glasses: GlassesStar }, thumb },
  { id: 'glasses-redondos', slot: 'glasses', kind: 'lentes', spokenName: 'lentes redondos', theme: 'casual', shapeTag: 'circulo', count: 2,
    variants: variantsOf('rojo', 'azul', 'verde', 'negro', 'naranja'), parts: { glasses: GlassesRound }, thumb },
  { id: 'glasses-cuadrados', slot: 'glasses', kind: 'lentes', spokenName: 'lentes cuadrados', theme: 'casual', shapeTag: 'cuadrado', count: 2,
    variants: variantsOf('morado', 'verde', 'rosa', 'cafe'), parts: { glasses: GlassesSquare }, thumb },
  { id: 'glasses-sol', slot: 'glasses', kind: 'lentes de sol', spokenName: 'lentes de sol', theme: 'playa', shapeTag: 'ovalo', count: 2,
    variants: variantsOf('rosa', 'amarillo', 'azul', 'rojo', 'blanco'), parts: { glasses: GlassesSun }, thumb },
];
