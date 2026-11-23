/** Pulseras (local: muñeca en 0,0; brazo ≈18px de ancho) y anillos (local: mano izquierda en 0,0). */
import type { CatalogItem, PartProps } from '@/types';
import { GemShape, LinGrad, outline, variantsOf } from '@/art/kit';
import { Bead, GOLD } from './_common';

function BraceletHearts({ palette: p, idp }: PartProps) {
  return (
    <g>
      <path d="M-12 -2Q0 5 12 -2" stroke={GOLD.line} strokeWidth={4.4} fill="none" strokeLinecap="round" />
      <path d="M-12 -2Q0 5 12 -2" stroke={GOLD.main} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <GemShape shape="corazon" cx={-6.5} cy={3} r={6.5} p={p} gid={idp('a')} />
      <GemShape shape="corazon" cx={6.5} cy={3} r={6.5} p={p} gid={idp('b')} />
    </g>
  );
}

function BraceletBeads({ palette: p, idp }: PartProps) {
  return (
    <g>
      <path d="M-12 -4Q0 3 12 -4" stroke={GOLD.line} strokeWidth={2.4} fill="none" />
      {[-9, 0, 9].map((x, i) => <Bead key={i} cx={x} cy={i === 1 ? 0 : -2} r={5.2} p={p} gid={idp(`c${i}`)} />)}
    </g>
  );
}

function BraceletBand({ palette: p, idp }: PartProps) {
  const o = outline(p);
  return (
    <g>
      <defs><LinGrad id={idp('g')} p={p} /></defs>
      <path d="M-11.5 -9L11.5 -9L12.5 2Q0 9 -12.5 2Z" fill={`url(#${idp('g')})`} stroke={o} strokeWidth={2} strokeLinejoin="round" />
      <path d="M-11.8 -3Q0 4 11.8 -3" stroke={p.light} strokeWidth={2} fill="none" opacity={0.85} />
      <path d="M-12 1Q0 8 12 1" stroke={p.shade} strokeWidth={1.4} fill="none" opacity={0.7} />
      <circle cx={0} cy={3.5} r={2.6} fill={GOLD.main} stroke={GOLD.line} strokeWidth={1} />
    </g>
  );
}

function RingGem({ shape }: { shape: 'corazon' | 'circulo' }) {
  return function Ring({ palette: p, idp }: PartProps) {
    return (
      <g>
        <ellipse cx={0} cy={10} rx={8} ry={3} fill="none" stroke={GOLD.line} strokeWidth={4.6} />
        <ellipse cx={0} cy={10} rx={8} ry={3} fill="none" stroke={GOLD.main} strokeWidth={2.8} />
        <GemShape shape={shape} cx={-1} cy={4} r={shape === 'corazon' ? 8.5 : 7} p={p} gid={idp('g')} />
      </g>
    );
  };
}

const pair = { pair: ['wristL', 'wristR'] } as CatalogItem['placement'];
const thumbB: [number, number, number, number] = [-20, -18, 40, 30];

export const jewelry: CatalogItem[] = [
  { id: 'bracelet-corazones', slot: 'bracelet', kind: 'pulseras', spokenName: 'pulseras de corazón', theme: 'fiesta', shapeTag: 'corazon', count: 4,
    variants: variantsOf('rosa', 'rojo', 'morado', 'azul'), parts: { bracelet: BraceletHearts }, placement: pair, thumb: thumbB },
  { id: 'bracelet-cuentas', slot: 'bracelet', kind: 'pulseras', spokenName: 'pulseras de cuentas', theme: 'casual', shapeTag: 'circulo', count: 6,
    variants: variantsOf('verde', 'naranja', 'azul', 'rosa', 'amarillo'), parts: { bracelet: BraceletBeads }, placement: pair, thumb: thumbB },
  { id: 'bracelet-brazalete', slot: 'bracelet', kind: 'brazaletes', spokenName: 'brazaletes', theme: 'deporte', count: 2,
    variants: variantsOf('amarillo', 'azul', 'rojo', 'verde', 'negro'), parts: { bracelet: BraceletBand }, placement: pair, thumb: thumbB },
  { id: 'ring-corazon', slot: 'ring', kind: 'anillo', spokenName: 'anillo de corazón', theme: 'fiesta', shapeTag: 'corazon', count: 1,
    variants: variantsOf('rosa', 'rojo', 'morado', 'azul'), parts: { ring: RingGem({ shape: 'corazon' }) }, placement: { anchor: 'handL' } },
  { id: 'ring-circulo', slot: 'ring', kind: 'anillo', spokenName: 'anillo redondo', theme: 'casual', shapeTag: 'circulo', count: 1,
    variants: variantsOf('verde', 'azul', 'naranja', 'amarillo'), parts: { ring: RingGem({ shape: 'circulo' }) }, placement: { anchor: 'handL' } },
];
