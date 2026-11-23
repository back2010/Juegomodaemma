/** Collares (coordenadas absolutas; cuello ≈ (300,420), la cadena cuelga sobre el pecho). */
import type { CatalogItem, PartProps } from '@/types';
import { GemShape, Gloss, outline, variantsOf, variant } from '@/art/kit';
import { Bead, Chain, GOLD, quadPt } from './_common';

const L: [number, number] = [262, 436], R: [number, number] = [338, 436];
const C: [number, number] = [300, 492];
const CHAIN = `M${L[0]} ${L[1]}Q${C[0]} ${C[1]} ${R[0]} ${R[1]}`;
const at = (t: number) => quadPt(L, C, R, t);

function NecklaceStars({ palette: p, idp }: PartProps) {
  const pts: [number, number, number][] = [[0.2, 0, 14], [0.5, 5, 19], [0.8, 0, 14]].map(([t, dy, r]) => {
    const [x, y] = at(t); return [x, y + dy + 4, r];
  });
  return (
    <g>
      <Chain d={CHAIN} />
      {pts.map(([x, y, r], i) => <GemShape key={i} shape="estrella" cx={x} cy={y} r={r} p={p} gid={idp(`s${i}`)} />)}
    </g>
  );
}

const PEARL_CHAIN: [number, number] = [300, 512];
function NecklacePearls({ palette: p, idp }: PartProps) {
  const n = 11;
  const pts = Array.from({ length: n }, (_, i) => quadPt([258, 434], PEARL_CHAIN, [342, 434], 0.04 + (i * 0.92) / (n - 1)));
  return (
    <g>
      <path d={`M258 434Q${PEARL_CHAIN[0]} ${PEARL_CHAIN[1]} 342 434`} stroke={GOLD.line} strokeWidth={2.5} fill="none" />
      {pts.map(([x, y], i) => <Bead key={i} cx={x} cy={y} r={i === 5 ? 9.5 : 8} p={p} gid={idp(`p${i}`)} />)}
    </g>
  );
}

function Flower({ cx, cy, r, p, gid }: { cx: number; cy: number; r: number; p: PartProps['palette']; gid: string }) {
  const o = outline(p);
  return (
    <g>
      <defs>
        <radialGradient id={gid} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={p.light} /><stop offset="0.55" stopColor={p.main} /><stop offset="1" stopColor={p.shade} />
        </radialGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        return <circle key={i} cx={cx + Math.cos(a) * r * 0.62} cy={cy + Math.sin(a) * r * 0.62} r={r * 0.48} fill={`url(#${gid})`} stroke={o} strokeWidth={1.6} />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.34} fill="#ffe27a" stroke="#c99a2e" strokeWidth={1.5} />
      <Gloss cx={cx - r * 0.1} cy={cy - r * 0.12} rx={r * 0.13} ry={r * 0.07} o={0.7} />
    </g>
  );
}

function NecklaceFlowers({ palette: p, idp }: PartProps) {
  const spots = [at(0.18), at(0.5), at(0.82)];
  return (
    <g>
      <Chain d={CHAIN} w={2.6} />
      {spots.map(([x, y], i) => <Flower key={i} cx={x} cy={y + (i === 1 ? 8 : 4)} r={i === 1 ? 19 : 16} p={p} gid={idp(`f${i}`)} />)}
    </g>
  );
}

function NecklaceBeads({ palette: p, idp }: PartProps) {
  const pts = [0.12, 0.31, 0.5, 0.69, 0.88].map((t) => at(t));
  return (
    <g>
      <Chain d={CHAIN} w={2.6} />
      {pts.map(([x, y], i) => <Bead key={i} cx={x} cy={y + 5} r={i === 2 ? 11 : 9} p={p} gid={idp(`b${i}`)} />)}
    </g>
  );
}

function NecklaceDisc({ palette: p, idp }: PartProps) {
  const o = outline(p);
  return (
    <g>
      <Chain d={CHAIN} />
      <circle cx={300} cy={484} r={4} fill="none" stroke={GOLD.line} strokeWidth={2.5} />
      <GemShape shape="circulo" cx={300} cy={506} r={19} p={p} gid={idp('d')} />
      <circle cx={300} cy={506} r={11.5} fill="none" stroke={o} strokeWidth={1.8} opacity={0.7} />
      <circle cx={300} cy={506} r={7} fill={p.light} opacity={0.55} />
    </g>
  );
}

const thumb: [number, number, number, number] = [236, 408, 128, 120];

export const necklaces: CatalogItem[] = [
  { id: 'necklace-estrellas', slot: 'necklace', kind: 'collar', spokenName: 'collar de estrellas', theme: 'fantasia', shapeTag: 'estrella', count: 3,
    variants: variantsOf('amarillo', 'rosa', 'azul', 'morado', 'naranja'), parts: { necklace: NecklaceStars }, thumb },
  { id: 'necklace-perlas', slot: 'necklace', kind: 'collar', spokenName: 'collar de perlas', theme: 'fiesta', shapeTag: 'circulo',
    variants: [variant('perla', '#f4eee8', 'blanco'), ...variantsOf('rosa', 'azul', 'morado')], parts: { necklace: NecklacePearls }, thumb },
  { id: 'necklace-flores', slot: 'necklace', kind: 'collar', spokenName: 'collar de flores', theme: 'playa', count: 3,
    variants: variantsOf('rosa', 'amarillo', 'morado', 'naranja', 'rojo'), parts: { necklace: NecklaceFlowers }, thumb },
  { id: 'necklace-cuentas', slot: 'necklace', kind: 'collar', spokenName: 'collar de cuentas', theme: 'casual', shapeTag: 'circulo', count: 5,
    variants: variantsOf('verde', 'azul', 'naranja', 'rojo', 'morado'), parts: { necklace: NecklaceBeads }, thumb },
  { id: 'necklace-circulo', slot: 'necklace', kind: 'collar', spokenName: 'collar de círculo', theme: 'casual', shapeTag: 'circulo', count: 1,
    variants: variantsOf('azul', 'verde', 'rosa', 'naranja'), parts: { necklace: NecklaceDisc }, thumb },
];
