/** Accesorios de cabello. Coordenadas LOCALES: origen en headTop (300,112); el cabello sube hasta y≈-27. */
import type { CatalogItem, PartProps } from '@/types';
import { Gloss, GemShape, LinGrad, outline, shapePath, variantsOf } from '@/art/kit';
import { Bead, GOLD } from './_common';

const bowPath = (s: number) => ({
  wing: `M0 0C${-30 * s} ${-40 * s} ${-70 * s} ${-30 * s} ${-66 * s} ${4 * s}C${-62 * s} ${34 * s} ${-26 * s} ${26 * s} 0 0Z`,
  tail: `M${-6 * s} ${4 * s}L${-22 * s} ${46 * s}L${-8 * s} ${40 * s}L0 ${52 * s}L${4 * s} ${6 * s}Z`,
});

function SmallBow({ p, gid, s, rot }: { p: PartProps['palette']; gid: string; s: number; rot: number }) {
  const o = outline(p);
  const b = bowPath(s);
  return (
    <g transform={`rotate(${rot})`}>
      <defs><LinGrad id={gid} p={p} /></defs>
      <path d={b.wing} fill={`url(#${gid})`} stroke={o} strokeWidth={3} strokeLinejoin="round" />
      <path d={b.wing} fill={`url(#${gid})`} stroke={o} strokeWidth={3} strokeLinejoin="round" transform="scale(-1 1)" />
      <path d={b.tail} fill={p.main} stroke={o} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={0} cy={0} r={12 * s} fill={p.main} stroke={o} strokeWidth={3} />
      <Gloss cx={-42 * s} cy={-10 * s} rx={10 * s} ry={5 * s} o={0.55} />
      <Gloss cx={38 * s} cy={-14 * s} rx={10 * s} ry={5 * s} o={0.55} rot={20} />
    </g>
  );
}

function BowsDouble({ palette: p, idp }: PartProps) {
  return (
    <g>
      <g transform="translate(-100 30)"><SmallBow p={p} gid={idp('l')} s={0.62} rot={-18} /></g>
      <g transform="translate(100 30)"><SmallBow p={p} gid={idp('r')} s={0.62} rot={18} /></g>
    </g>
  );
}

/** Contorno curvo de la diadema (arco sobre el cabello). */
const BAND = 'M-122 78C-120 -16 -70 -30 0 -30C70 -30 120 -16 122 78';

function Band({ p, gid, w = 11 }: { p: PartProps['palette']; gid: string; w?: number }) {
  return (
    <g fill="none" strokeLinecap="round">
      <defs><LinGrad id={gid} p={p} /></defs>
      <path d={BAND} stroke={outline(p)} strokeWidth={w + 4} />
      <path d={BAND} stroke={`url(#${gid})`} strokeWidth={w} />
      <path d="M-100 -6C-80 -22 -50 -26 -20 -28" stroke="#fff" strokeOpacity={0.55} strokeWidth={2.6} />
    </g>
  );
}

function HeadbandStars({ palette: p, idp }: PartProps) {
  return (
    <g transform="translate(0 12)">
      <Band p={p} gid={idp('b')} />
      {[[-54, -24, 13], [0, -38, 17], [54, -24, 13]].map(([x, y, r], i) => (
        <GemShape key={i} shape="estrella" cx={x} cy={y} r={r} p={{ main: '#ffe27a', light: '#fff8cf', shade: '#d8a62e' }} gid={idp(`s${i}`)} />
      ))}
    </g>
  );
}

function HeadbandHeart({ palette: p, idp }: PartProps) {
  return (
    <g transform="translate(0 12)">
      <Band p={p} gid={idp('b')} />
      <GemShape shape="corazon" cx={0} cy={-38} r={24} p={{ main: '#ff7aa8', light: '#ffd0e0', shade: '#d63f78' }} gid={idp('h')} />
      <Bead cx={-52} cy={-26} r={6} p={{ main: '#f4eee8', light: '#ffffff', shade: '#c9bcb0' }} gid={idp('c1')} />
      <Bead cx={52} cy={-26} r={6} p={{ main: '#f4eee8', light: '#ffffff', shade: '#c9bcb0' }} gid={idp('c2')} />
    </g>
  );
}

function HeadbandEars({ palette: p, idp }: PartProps) {
  const o = outline(p);
  const ear = (s: 1 | -1, gid: string) => (
    <g transform={`scale(${s} 1)`}>
      <path d="M-88 -14L-80 -82L-34 -30Z" fill={`url(#${gid})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-76 -28L-72 -62L-50 -38Z" fill="#ffb6d1" stroke="#e57aa5" strokeWidth={2} strokeLinejoin="round" />
    </g>
  );
  return (
    <g transform="translate(0 12)">
      <defs><LinGrad id={idp('e')} p={p} /></defs>
      {ear(1, idp('e'))}{ear(-1, idp('e'))}
      <Band p={p} gid={idp('b')} w={10} />
    </g>
  );
}

const GOLDP = { main: GOLD.main, light: GOLD.light, shade: GOLD.shade };

/** Base de corona: banda curva con 5 puntas. */
const CROWN = 'M-78 30L-72 -30L-52 -2L-36 -44L-17 -6L0 -58L17 -6L36 -44L52 -2L72 -30L78 30Q0 6 -78 30Z';

function CrownHeart({ palette: p, idp }: PartProps) {
  return (
    <g transform="translate(0 12)">
      <defs><LinGrad id={idp('c')} p={GOLDP} /></defs>
      <path d={CROWN} fill={`url(#${idp('c')})`} stroke={GOLD.line} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-76 22Q0 0 76 22" stroke={GOLD.line} strokeWidth={2} fill="none" opacity={0.6} />
      <Gloss cx={-52} cy={6} rx={12} ry={4} o={0.55} rot={-8} />
      {[[-72, -34], [-36, -48], [36, -48], [72, -34]].map(([x, y], i) => (
        <Bead key={i} cx={x} cy={y} r={6} p={{ main: '#f4eee8', light: '#ffffff', shade: '#c9bcb0' }} gid={idp(`t${i}`)} />
      ))}
      <GemShape shape="corazon" cx={0} cy={4} r={19} p={p} gid={idp('h')} />
    </g>
  );
}

function CrownStars({ palette: p, idp }: PartProps) {
  const o = outline(p);
  return (
    <g transform="translate(0 12)">
      <defs><LinGrad id={idp('c')} p={p} /></defs>
      <path d={CROWN} fill={`url(#${idp('c')})`} stroke={o} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-76 22Q0 0 76 22" stroke={p.shade} strokeWidth={2} fill="none" opacity={0.7} />
      <Gloss cx={-52} cy={6} rx={12} ry={4} o={0.55} rot={-8} />
      {[[-44, 16], [0, 8], [44, 16]].map(([x, y], i) => (
        <GemShape key={i} shape="estrella" cx={x} cy={y} r={i === 1 ? 14 : 11} p={{ main: '#ffe27a', light: '#fff8cf', shade: '#d8a62e' }} gid={idp(`s${i}`)} />
      ))}
      {[[-72, -34], [0, -58], [72, -34]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={6.5} fill="#ffe27a" stroke="#c99a2e" strokeWidth={2} />
      ))}
    </g>
  );
}

function Clip({ shape, r }: { shape: 'estrella' | 'corazon'; r: number }) {
  return function HairClip({ palette: p, idp }: PartProps) {
    return (
      <g transform="translate(86 34) rotate(14)">
        <path d={`M${-r - 6} 0L${r + 6} 0`} stroke={GOLD.line} strokeWidth={7} strokeLinecap="round" />
        <path d={`M${-r - 6} 0L${r + 6} 0`} stroke={GOLD.main} strokeWidth={4.4} strokeLinecap="round" />
        <GemShape shape={shape} cx={0} cy={0} r={r} p={p} gid={idp('g')} />
        <path d={shapePath(shape, 0, 0, r * 0.45)} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={2} />
      </g>
    );
  };
}

const anchor = { anchor: 'headTop' } as CatalogItem['placement'];
const thumbW: [number, number, number, number] = [-150, -90, 300, 170];

export const hairAccessories: CatalogItem[] = [
  { id: 'bow-doble', slot: 'hairAcc', kind: 'moños', spokenName: 'moños', theme: 'fiesta', count: 2,
    variants: variantsOf('rosa', 'azul', 'morado', 'rojo', 'amarillo'), parts: { hairAcc: BowsDouble }, placement: anchor, thumb: [-150, -20, 300, 110] },
  { id: 'headband-estrellas', slot: 'hairAcc', kind: 'diadema', spokenName: 'diadema de estrellas', theme: 'fantasia', shapeTag: 'estrella', count: 3,
    variants: variantsOf('morado', 'azul', 'rosa', 'verde'), parts: { hairAcc: HeadbandStars }, placement: anchor, thumb: thumbW },
  { id: 'headband-corazon', slot: 'hairAcc', kind: 'diadema', spokenName: 'diadema de corazón', theme: 'fiesta', shapeTag: 'corazon', count: 1,
    variants: variantsOf('rosa', 'morado', 'azul', 'rojo'), parts: { hairAcc: HeadbandHeart }, placement: anchor, thumb: thumbW },
  { id: 'headband-orejas', slot: 'hairAcc', kind: 'diadema', spokenName: 'diadema de orejitas', theme: 'disfraz', shapeTag: 'triangulo', count: 2,
    variants: variantsOf('negro', 'cafe', 'blanco', 'rosa', 'naranja'), parts: { hairAcc: HeadbandEars }, placement: anchor, thumb: thumbW },
  { id: 'crown-corazon', slot: 'hairAcc', kind: 'corona', spokenName: 'corona de corazón', theme: 'fantasia', shapeTag: 'corazon', count: 1,
    variants: variantsOf('rojo', 'rosa', 'azul', 'morado', 'verde'), parts: { hairAcc: CrownHeart }, placement: anchor, thumb: [-100, -80, 200, 130] },
  { id: 'crown-estrellas', slot: 'hairAcc', kind: 'corona', spokenName: 'corona de estrellas', theme: 'fantasia', shapeTag: 'estrella', count: 3,
    variants: variantsOf('morado', 'rosa', 'azul', 'naranja', 'verde'), parts: { hairAcc: CrownStars }, placement: anchor, thumb: [-100, -80, 200, 130] },
  { id: 'clip-estrella', slot: 'hairAcc', kind: 'broche', spokenName: 'broche de estrella', theme: 'fantasia', shapeTag: 'estrella', count: 1,
    variants: variantsOf('amarillo', 'rosa', 'azul', 'morado'), parts: { hairAcc: Clip({ shape: 'estrella', r: 17 }) }, placement: anchor, thumb: [56, 4, 64, 64] },
  { id: 'clip-corazon', slot: 'hairAcc', kind: 'broche', spokenName: 'broche de corazón', theme: 'fiesta', shapeTag: 'corazon', count: 1,
    variants: variantsOf('rojo', 'rosa', 'morado', 'azul'), parts: { hairAcc: Clip({ shape: 'corazon', r: 16 }) }, placement: anchor, thumb: [56, 4, 64, 64] },
];
