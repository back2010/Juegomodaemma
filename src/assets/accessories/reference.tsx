/** Accesorios de referencia (P0): uno por slot. */
import type { CatalogItem, PartProps } from '@/types';
import { Gloss, GemShape, LinGrad, outline, roundRect, shapePath, variantsOf, variant } from '@/art/kit';

function NecklaceHeart({ palette: p, idp }: PartProps) {
  return (
    <g>
      <path d="M262 436Q300 492 338 436" stroke="#f5d77a" strokeWidth={3.5} fill="none" />
      <GemShape shape="corazon" cx={300} cy={482} r={16} p={p} gid={idp('g')} />
    </g>
  );
}

/** Local: anclaje earL/earR. */
function EarringsCircle({ palette: p, idp }: PartProps) {
  return (
    <g>
      <path d="M0 18L0 30" stroke="#f5d77a" strokeWidth={3} strokeLinecap="round" />
      <GemShape shape="circulo" cx={0} cy={40} r={11} p={p} gid={idp('g')} />
    </g>
  );
}

/** Local: anclaje wristL/wristR. */
function BraceletPearls({ palette: p, idp }: PartProps) {
  const xs = [-11, -5.5, 0, 5.5, 11];
  return (
    <g>
      <defs><radialGradient id={idp('b')} cx="0.35" cy="0.3"><stop offset="0" stopColor="#fff" /><stop offset="0.6" stopColor={p.light} /><stop offset="1" stopColor={p.main} /></radialGradient></defs>
      {xs.map((x, i) => <circle key={i} cx={x} cy={-4 + Math.abs(x) * -0.15} r={4.6} fill={`url(#${idp('b')})`} stroke={outline(p)} strokeWidth={1} />)}
    </g>
  );
}

/** Local: anclaje handL. */
function RingStar({ palette: p, idp }: PartProps) {
  return (
    <g>
      <ellipse cx={0} cy={10} rx={8} ry={3} fill="none" stroke="#f5d77a" strokeWidth={3} />
      <GemShape shape="estrella" cx={-1} cy={4} r={8} p={p} gid={idp('g')} />
    </g>
  );
}

function GlassesHeart({ doll, palette: p, idp }: PartProps) {
  const o = outline(p);
  const { eyeL, eyeR } = doll.anchors;
  return (
    <g>
      <defs><LinGrad id={idp('f')} p={p} /></defs>
      {[eyeL, eyeR].map((e, i) => (
        <g key={i}>
          <path d={shapePath('corazon', e.x, e.y + 2, 50)} fill={p.light} fillOpacity={0.25} stroke={`url(#${idp('f')})`} strokeWidth={9} strokeLinejoin="round" />
          <path d={shapePath('corazon', e.x, e.y + 2, 50)} fill="none" stroke={o} strokeWidth={1.5} />
          <Gloss cx={e.x - 18} cy={e.y - 16} rx={10} ry={5} o={0.5} />
        </g>
      ))}
      <path d={`M${eyeL.x + 44} ${eyeL.y - 10}Q300 ${eyeL.y - 24} ${eyeR.x - 44} ${eyeR.y - 10}`} stroke={o} strokeWidth={6} fill="none" />
    </g>
  );
}

/** Local: anclaje headTop. */
function BowBig({ palette: p, idp }: PartProps) {
  const o = outline(p);
  return (
    <g transform="translate(78 26) rotate(18)">
      <defs><LinGrad id={idp('b')} p={p} /></defs>
      <path d="M0 0C-30 -40 -70 -30 -66 4C-62 34 -26 26 0 0Z" fill={`url(#${idp('b')})`} stroke={o} strokeWidth={3} strokeLinejoin="round" />
      <path d="M0 0C30 -40 70 -30 66 4C62 34 26 26 0 0Z" fill={`url(#${idp('b')})`} stroke={o} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-6 4L-22 46L-8 40L0 52L4 6Z" fill={p.main} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={0} cy={0} r={12} fill={p.main} stroke={o} strokeWidth={3} />
      <Gloss cx={-42} cy={-10} rx={10} ry={5} o={0.55} />
      <Gloss cx={38} cy={-14} rx={10} ry={5} o={0.55} rot={20} />
    </g>
  );
}

function HatSun({ palette: p, idp }: PartProps) {
  const o = outline(p);
  return (
    <g transform="translate(0 20)">
      <defs>
        <LinGrad id={idp('h')} p={{ main: '#f6dca0', light: '#fff3d1', shade: '#d4ac63' }} />
      </defs>
      <ellipse cx={300} cy={142} rx={208} ry={40} fill={`url(#${idp('h')})`} stroke="#b88d45" strokeWidth={3.5} />
      <path d="M206 142C206 62 248 30 300 30C352 30 394 62 394 142Z" fill={`url(#${idp('h')})`} stroke="#b88d45" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M208 112C260 124 340 124 392 112L394 140C340 152 260 152 206 140Z" fill={p.main} stroke={o} strokeWidth={2.5} />
      <GemShape shape="corazon" cx={360} cy={128} r={14} p={p} gid={idp('g')} />
      <Gloss cx={252} cy={70} rx={20} ry={9} o={0.45} />
    </g>
  );
}

function BagSquare({ palette: p, idp }: PartProps) {
  const o = outline(p);
  return (
    <g>
      <defs><LinGrad id={idp('b')} p={p} /></defs>
      <path d="M386 704C386 646 452 646 452 704" stroke={o} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={roundRect(370, 700, 98, 74, 14)} fill={`url(#${idp('b')})`} stroke={o} strokeWidth={3.5} />
      <path d="M370 726L468 726" stroke={p.shade} strokeWidth={3} />
      <circle cx={419} cy={728} r={6} fill="#f5d77a" stroke={o} strokeWidth={1.5} />
      <Gloss cx={392} cy={714} rx={12} ry={5} o={0.5} />
    </g>
  );
}

export const referenceAccessories: CatalogItem[] = [
  { id: 'necklace-corazon', slot: 'necklace', kind: 'collar', spokenName: 'collar de corazón', theme: 'fiesta', shapeTag: 'corazon', count: 1,
    variants: variantsOf('rojo', 'rosa', 'morado', 'azul'), parts: { necklace: NecklaceHeart } },
  { id: 'earrings-circulo', slot: 'earrings', kind: 'aretes', spokenName: 'aretes redondos', theme: 'casual', shapeTag: 'circulo', count: 2,
    variants: [...variantsOf('azul', 'rosa', 'verde', 'amarillo'), variant('perla', '#f4eee8', 'blanco')],
    parts: { earrings: EarringsCircle }, placement: { pair: ['earL', 'earR'] } },
  { id: 'bracelet-perlas', slot: 'bracelet', kind: 'pulseras', spokenName: 'pulseras de perlas', theme: 'fiesta', count: 2,
    variants: [variant('perla', '#f4eee8', 'blanco'), ...variantsOf('rosa', 'morado', 'azul')],
    parts: { bracelet: BraceletPearls }, placement: { pair: ['wristL', 'wristR'] } },
  { id: 'ring-estrella', slot: 'ring', kind: 'anillo', spokenName: 'anillo de estrella', theme: 'fantasia', shapeTag: 'estrella', count: 1,
    variants: variantsOf('amarillo', 'rosa', 'azul', 'morado'), parts: { ring: RingStar }, placement: { anchor: 'handL' } },
  { id: 'glasses-corazon', slot: 'glasses', kind: 'lentes', spokenName: 'lentes de corazón', theme: 'playa', shapeTag: 'corazon',
    variants: variantsOf('rosa', 'rojo', 'morado', 'amarillo'), parts: { glasses: GlassesHeart } },
  { id: 'bow-grande', slot: 'hairAcc', kind: 'moño', spokenName: 'moño', theme: 'fiesta',
    variants: variantsOf('rosa', 'rojo', 'morado', 'azul', 'amarillo'), parts: { hairAcc: BowBig }, placement: { anchor: 'headTop' } },
  { id: 'hat-sol', slot: 'hat', kind: 'sombrero', spokenName: 'sombrero de sol', theme: 'playa', hairFit: 'over',
    variants: variantsOf('rosa', 'azul', 'verde', 'naranja'), parts: { hat: HatSun } },
  { id: 'bag-cuadrada', slot: 'bag', kind: 'bolsa', spokenName: 'bolsa', theme: 'casual', shapeTag: 'rectangulo',
    variants: variantsOf('rosa', 'rojo', 'amarillo', 'morado', 'negro'), parts: { bag: BagSquare } },
];
