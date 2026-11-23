/** Aretes. Coordenadas LOCALES: oreja en (0,0), cuelgan hacia +y. count = piezas visibles (par = 2). */
import type { CatalogItem, PartProps } from '@/types';
import { GemShape, LinGrad, outline, variantsOf, variant } from '@/art/kit';
import { Bead, EarHook, GOLD } from './_common';

const mk = (shape: 'estrella' | 'corazon' | 'triangulo' | 'cuadrado', r: number, cy: number) =>
  function Earring({ palette: p, idp }: PartProps) {
    return (
      <g>
        <EarHook to={cy - r * 0.6} />
        <GemShape shape={shape} cx={0} cy={cy} r={r} p={p} gid={idp('g')} />
      </g>
    );
  };

const EarStar = mk('estrella', 15, 44);
const EarHeart = mk('corazon', 13, 43);
const EarTriangle = mk('triangulo', 13, 44);
const EarSquare = mk('cuadrado', 13, 42);

function EarHoop({ palette: p, idp }: PartProps) {
  return (
    <g>
      <defs><LinGrad id={idp('h')} p={p} dir="d" /></defs>
      <circle cx={0} cy={18} r={3} fill={GOLD.main} stroke={GOLD.line} strokeWidth={1.2} />
      <circle cx={0} cy={42} r={19} fill="none" stroke={outline(p)} strokeWidth={9.5} />
      <circle cx={0} cy={42} r={19} fill="none" stroke={`url(#${idp('h')})`} strokeWidth={6.5} />
      <path d="M-13 32A17 17 0 0 1 -2 25" stroke="#fff" strokeOpacity={0.6} strokeWidth={2.6} strokeLinecap="round" fill="none" />
    </g>
  );
}

function EarPearlsLong({ palette: p, idp }: PartProps) {
  return (
    <g>
      <EarHook to={30} />
      <path d="M0 30L0 56" stroke={GOLD.line} strokeWidth={3} strokeLinecap="round" />
      <Bead cx={0} cy={36} r={5.5} p={p} gid={idp('a')} />
      <Bead cx={0} cy={50} r={6.5} p={p} gid={idp('b')} />
      <Bead cx={0} cy={68} r={9} p={p} gid={idp('c')} />
    </g>
  );
}


export const earrings: CatalogItem[] = [
  { id: 'earrings-estrella', slot: 'earrings', kind: 'aretes', spokenName: 'aretes de estrella', theme: 'fantasia', shapeTag: 'estrella', count: 2,
    variants: variantsOf('amarillo', 'rosa', 'azul', 'morado'), parts: { earrings: EarStar }, placement: { pair: ['earL', 'earR'] } },
  { id: 'earrings-corazon', slot: 'earrings', kind: 'aretes', spokenName: 'aretes de corazón', theme: 'fiesta', shapeTag: 'corazon', count: 2,
    variants: variantsOf('rojo', 'rosa', 'morado', 'azul'), parts: { earrings: EarHeart }, placement: { pair: ['earL', 'earR'] } },
  { id: 'earrings-triangulo', slot: 'earrings', kind: 'aretes', spokenName: 'aretes de triángulo', theme: 'casual', shapeTag: 'triangulo', count: 2,
    variants: variantsOf('naranja', 'verde', 'azul', 'rojo'), parts: { earrings: EarTriangle }, placement: { pair: ['earL', 'earR'] } },
  { id: 'earrings-cuadrado', slot: 'earrings', kind: 'aretes', spokenName: 'aretes cuadrados', theme: 'casual', shapeTag: 'cuadrado', count: 2,
    variants: variantsOf('verde', 'morado', 'naranja', 'rosa'), parts: { earrings: EarSquare }, placement: { pair: ['earL', 'earR'] } },
  { id: 'earrings-aros', slot: 'earrings', kind: 'aros', spokenName: 'aros', theme: 'casual', shapeTag: 'circulo', count: 2,
    variants: [variant('dorado', '#f2c230', 'amarillo'), ...variantsOf('rosa', 'azul', 'rojo')],
    parts: { earrings: EarHoop }, placement: { pair: ['earL', 'earR'] } },
  { id: 'earrings-perlas-largas', slot: 'earrings', kind: 'aretes', spokenName: 'aretes de perlas largas', theme: 'fiesta', shapeTag: 'circulo', count: 6,
    variants: [variant('perla', '#f4eee8', 'blanco'), ...variantsOf('rosa', 'azul', 'morado')],
    parts: { earrings: EarPearlsLong }, placement: { pair: ['earL', 'earR'] } },
];
