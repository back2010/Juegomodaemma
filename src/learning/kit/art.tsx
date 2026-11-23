/**
 * Dibujos reutilizables para actividades (SVG, viewBox 0 0 100 100, sin texto).
 * Todos siguen el estilo del kit: degradado de 3 paradas, contorno `outline(p)` y brillo `Gloss`.
 */
import type { ReactNode } from 'react';
import type { ColorName, Palette, ShapeName, WearSlot } from '@/types';
import { COLOR_HEX, GemShape, Gloss, LinGrad, RadGrad, makePalette, outline, paletteOf, useIdp } from '@/art/kit';

export type Tint = ColorName | Palette;
const pal = (t: Tint): Palette => (typeof t === 'string' ? (t in COLOR_HEX ? paletteOf(t as ColorName) : makePalette(t)) : t);
const INK = '#3b2147';

function Svg({ children, size, className }: { children: ReactNode; size?: number | string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`lk-art ${className ?? ''}`} aria-hidden="true">
      {children}
    </svg>
  );
}

/** Figura brillante (círculo, estrella, corazón...). */
export function ShapeToken({ shape, color, size }: { shape: ShapeName; color: Tint; size?: number | string }) {
  const idp = useIdp('sh');
  return <Svg size={size}><GemShape shape={shape} cx={50} cy={52} r={40} p={pal(color)} gid={idp('g')} /></Svg>;
}

/** Mancha de pintura del color indicado (para actividades de color). */
export function ColorBlob({ color, size }: { color: Tint; size?: number | string }) {
  const idp = useIdp('cb');
  const p = pal(color);
  return (
    <Svg size={size}>
      <defs><RadGrad id={idp('g')} p={p} /></defs>
      <path d="M50 8C66 8 70 20 82 24S96 44 90 58 86 84 70 90 46 96 32 88 8 76 10 58 6 34 18 22 36 8 50 8Z"
        fill={`url(#${idp('g')})`} stroke={outline(p)} strokeWidth={3} strokeLinejoin="round" />
      <Gloss cx={36} cy={30} rx={12} ry={6} o={0.6} />
      <circle cx={62} cy={26} r={3.5} fill="#fff" opacity={0.5} />
    </Svg>
  );
}

export type FruitKind = 'manzana' | 'platano' | 'fresa' | 'uvas' | 'naranja' | 'sandia';
export const FRUITS: FruitKind[] = ['manzana', 'platano', 'fresa', 'uvas', 'naranja', 'sandia'];

export function Fruit({ kind, size }: { kind: FruitKind; size?: number | string }) {
  const idp = useIdp('fr');
  const leafP = makePalette('#3ddc84');
  const leaf = (x: number, y: number, rot: number) => (
    <path d={`M${x} ${y}q12 -10 22 -2q-10 12 -22 2z`} fill={`url(#${idp('leaf')})`} stroke={outline(leafP)} strokeWidth={2.5}
      strokeLinejoin="round" transform={`rotate(${rot} ${x} ${y})`} />
  );
  const leafDef = <LinGrad id={idp('leaf')} p={leafP} />;
  switch (kind) {
    case 'manzana': {
      const p = paletteOf('rojo');
      return (
        <Svg size={size}><defs><RadGrad id={idp('g')} p={p} />{leafDef}</defs>
          <path d="M50 30C38 20 14 24 16 52s20 40 34 34c14 6 32-6 34-34S62 20 50 30Z" fill={`url(#${idp('g')})`} stroke={outline(p)} strokeWidth={3} strokeLinejoin="round" />
          <path d="M50 30q0-12 6-18" fill="none" stroke="#6b3f22" strokeWidth={4} strokeLinecap="round" />
          {leaf(54, 20, -20)}
          <Gloss cx={32} cy={44} rx={8} ry={12} o={0.5} rot={15} />
        </Svg>
      );
    }
    case 'platano': {
      const p = paletteOf('amarillo');
      return (
        <Svg size={size}><defs><LinGrad id={idp('g')} p={p} dir="d" /></defs>
          <path d="M20 24c-4 34 20 60 62 56 6 0 8-6 2-8-30 0-46-20-52-48-2-6-10-6-12 0z" fill={`url(#${idp('g')})`} stroke={outline(p)} strokeWidth={3} strokeLinejoin="round" />
          <path d="M20 24l-2-8" stroke="#6b3f22" strokeWidth={5} strokeLinecap="round" />
          <Gloss cx={30} cy={48} rx={4} ry={14} o={0.5} rot={-30} />
        </Svg>
      );
    }
    case 'fresa': {
      const p = paletteOf('rojo');
      return (
        <Svg size={size}><defs><RadGrad id={idp('g')} p={p} />{leafDef}</defs>
          <path d="M50 92C30 78 14 56 18 38c3-12 16-16 32-12 16-4 29 0 32 12 4 18-12 40-32 54z" fill={`url(#${idp('g')})`} stroke={outline(p)} strokeWidth={3} strokeLinejoin="round" />
          {[[36, 44], [50, 40], [64, 44], [42, 58], [58, 58], [50, 72], [30, 56], [70, 56]].map(([x, y]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={2} ry={3} fill="#ffe680" />
          ))}
          <path d="M30 30l10-4 10-10 10 10 10 4-12 4-8 6-8-6z" fill={`url(#${idp('leaf')})`} stroke={outline(leafP)} strokeWidth={2.5} strokeLinejoin="round" />
        </Svg>
      );
    }
    case 'uvas': {
      const p = paletteOf('morado');
      const pts = [[38, 34], [56, 34], [30, 50], [48, 50], [66, 50], [38, 66], [56, 66], [47, 82]];
      return (
        <Svg size={size}><defs><RadGrad id={idp('g')} p={p} />{leafDef}</defs>
          <path d="M48 24q0-10 6-14" fill="none" stroke="#6b3f22" strokeWidth={4} strokeLinecap="round" />
          {leaf(52, 16, -10)}
          {pts.map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r={11} fill={`url(#${idp('g')})`} stroke={outline(p)} strokeWidth={2.5} />
              <circle cx={x - 4} cy={y - 4} r={3} fill="#fff" opacity={0.55} />
            </g>
          ))}
        </Svg>
      );
    }
    case 'naranja': {
      const p = paletteOf('naranja');
      return (
        <Svg size={size}><defs><RadGrad id={idp('g')} p={p} />{leafDef}</defs>
          <circle cx={50} cy={56} r={34} fill={`url(#${idp('g')})`} stroke={outline(p)} strokeWidth={3} />
          {leaf(50, 24, -25)}
          <circle cx={50} cy={24} r={3} fill="#6b3f22" />
          {[[40, 50], [60, 64], [56, 44], [42, 70]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.6} fill={p.shade} opacity={0.5} />)}
          <Gloss cx={36} cy={42} rx={9} ry={6} o={0.55} />
        </Svg>
      );
    }
    case 'sandia': {
      const rind = paletteOf('verde');
      const flesh = makePalette('#ff4d6d');
      return (
        <Svg size={size}><defs><LinGrad id={idp('r')} p={rind} /><RadGrad id={idp('f')} p={flesh} cy={0.1} /></defs>
          <path d="M8 34h84a42 42 0 0 1-84 0z" fill={`url(#${idp('r')})`} stroke={outline(rind)} strokeWidth={3} strokeLinejoin="round" />
          <path d="M16 34h68a34 34 0 0 1-68 0z" fill="#fbf7e4" />
          <path d="M20 34h60a30 30 0 0 1-60 0z" fill={`url(#${idp('f')})`} />
          {[[36, 44], [50, 52], [64, 44], [44, 58], [58, 58]].map(([x, y]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={2.2} ry={3.4} fill={INK} />)}
        </Svg>
      );
    }
  }
}

export type AnimalKind = 'gato' | 'perro' | 'conejo' | 'pollito' | 'pez' | 'rana';
export const ANIMALS: AnimalKind[] = ['gato', 'perro', 'conejo', 'pollito', 'pez', 'rana'];

function Face({ y = 54, dx = 12 }: { y?: number; dx?: number }) {
  return (
    <g>
      <circle cx={50 - dx} cy={y} r={4.5} fill={INK} /><circle cx={50 + dx} cy={y} r={4.5} fill={INK} />
      <circle cx={50 - dx + 1.5} cy={y - 1.5} r={1.4} fill="#fff" /><circle cx={50 + dx + 1.5} cy={y - 1.5} r={1.4} fill="#fff" />
      <ellipse cx={50 - dx - 7} cy={y + 9} rx={5} ry={3} fill="#ff8ac6" opacity={0.6} />
      <ellipse cx={50 + dx + 7} cy={y + 9} rx={5} ry={3} fill="#ff8ac6" opacity={0.6} />
    </g>
  );
}

export function Animal({ kind, size }: { kind: AnimalKind; size?: number | string }) {
  const idp = useIdp('an');
  const body = (p: Palette, d: string, gid = 'g') => (
    <path d={d} fill={`url(#${idp(gid)})`} stroke={outline(p)} strokeWidth={3} strokeLinejoin="round" />
  );
  switch (kind) {
    case 'gato': {
      const p = makePalette('#ff9f43');
      return (
        <Svg size={size}><defs><RadGrad id={idp('g')} p={p} /></defs>
          {body(p, 'M20 40L18 12L40 28ZM80 40L82 12L60 28Z')}
          {body(p, 'M50 26c24 0 36 14 36 32S70 88 50 88 14 76 14 58 26 26 50 26z')}
          <path d="M22 20l4 12M78 20l-4 12" stroke="#ff8ac6" strokeWidth={4} strokeLinecap="round" />
          <Face y={56} />
          <path d="M46 64l4 3 4-3M50 67q-4 6-8 4M50 67q4 6 8 4" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28 66H12M28 70l-14 5M72 66h16M72 70l14 5" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    }
    case 'perro': {
      const p = makePalette('#c98656');
      const ear = makePalette('#8a5a33');
      return (
        <Svg size={size}><defs><RadGrad id={idp('g')} p={p} /><LinGrad id={idp('e')} p={ear} /></defs>
          {body(p, 'M50 22c22 0 34 14 34 34S70 88 50 88 16 76 16 56 28 22 50 22z')}
          {body(ear, 'M22 26c-12 4-14 30-6 40 6-6 10-18 14-34zM78 26c12 4 14 30 6 40-6-6-10-18-14-34z', 'e')}
          <Face y={52} />
          <ellipse cx={50} cy={68} rx={12} ry={9} fill="#fbe3cc" />
          <ellipse cx={50} cy={64} rx={6} ry={4.5} fill={INK} />
          <path d="M50 68v6M44 76q6 4 12 0" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </Svg>
      );
    }
    case 'conejo': {
      const p = makePalette('#f4eee8');
      return (
        <Svg size={size}><defs><RadGrad id={idp('g')} p={p} /></defs>
          {body(p, 'M30 46C24 26 26 4 36 4s12 22 8 40ZM70 46c6-20 4-42-6-42s-12 22-8 40Z')}
          <path d="M35 40c-4-14-2-28 2-30M65 40c4-14 2-28-2-30" stroke="#ff8ac6" strokeWidth={6} strokeLinecap="round" />
          {body(p, 'M50 36c22 0 32 14 32 28S68 92 50 92 18 80 18 64 28 36 50 36z')}
          <Face y={62} dx={11} />
          <path d="M46 70l4 3 4-3M50 73v4M46 80h8" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    }
    case 'pollito': {
      const p = paletteOf('amarillo');
      const beak = paletteOf('naranja');
      return (
        <Svg size={size}><defs><RadGrad id={idp('g')} p={p} /></defs>
          <path d="M44 16q6-10 8 2q6-8 6 4" fill="none" stroke={p.shade} strokeWidth={4} strokeLinecap="round" />
          {body(p, 'M50 18c22 0 36 18 36 38S72 92 50 92 14 76 14 56 28 18 50 18z')}
          <path d="M14 60q-8 6 2 14M86 60q8 6-2 14" fill="none" stroke={outline(p)} strokeWidth={3} strokeLinecap="round" />
          <Face y={48} dx={13} />
          <path d="M42 58l8-4 8 4-8 8z" fill={beak.main} stroke={outline(beak)} strokeWidth={2.5} strokeLinejoin="round" />
        </Svg>
      );
    }
    case 'pez': {
      const p = makePalette('#3a8bff');
      const fin = makePalette('#22d3c5');
      return (
        <Svg size={size}><defs><RadGrad id={idp('g')} p={p} /><LinGrad id={idp('f')} p={fin} /></defs>
          {body(fin, 'M70 50l24-20v40zM44 24q10-14 20 0z', 'f')}
          {body(p, 'M10 50c10-22 46-30 64 0-18 30-54 22-64 0z')}
          <path d="M44 34q-6 16 0 32M54 36q-6 14 0 28" fill="none" stroke={p.light} strokeWidth={3} strokeLinecap="round" />
          <circle cx={26} cy={46} r={5} fill={INK} /><circle cx={27.5} cy={44.5} r={1.6} fill="#fff" />
          <path d="M16 56q4 3 8 0" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={8} cy={30} r={3} fill="#bfe8ff" /><circle cx={14} cy={20} r={4} fill="#bfe8ff" />
        </Svg>
      );
    }
    case 'rana': {
      const p = paletteOf('verde');
      return (
        <Svg size={size}><defs><RadGrad id={idp('g')} p={p} /></defs>
          {body(p, 'M32 18a14 14 0 1 1 0 28a14 14 0 1 1 0-28zM68 18a14 14 0 1 1 0 28a14 14 0 1 1 0-28z')}
          {body(p, 'M50 34c26 0 40 16 40 30S74 90 50 90 10 78 10 64 24 34 50 34z')}
          <circle cx={32} cy={30} r={8} fill="#fff" stroke={INK} strokeWidth={2} /><circle cx={68} cy={30} r={8} fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx={33} cy={31} r={4.5} fill={INK} /><circle cx={67} cy={31} r={4.5} fill={INK} />
          <path d="M30 66q20 16 40 0" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <ellipse cx={24} cy={62} rx={6} ry={3.5} fill="#ff8ac6" opacity={0.6} /><ellipse cx={76} cy={62} rx={6} ry={3.5} fill="#ff8ac6" opacity={0.6} />
        </Svg>
      );
    }
  }
}

/** Flor de 5 pétalos del color dado. */
export function Flower({ color, size }: { color: Tint; size?: number | string }) {
  const idp = useIdp('fl');
  const p = pal(color);
  const c = paletteOf('amarillo');
  const stem = paletteOf('verde');
  return (
    <Svg size={size}><defs><RadGrad id={idp('p')} p={p} cx={0.5} cy={0.8} /><RadGrad id={idp('c')} p={c} /></defs>
      <path d="M50 54V96" stroke={stem.main} strokeWidth={6} strokeLinecap="round" />
      <path d="M50 80q-16-10-22-2q10 10 22 2z" fill={stem.main} stroke={outline(stem)} strokeWidth={2.5} strokeLinejoin="round" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={50} cy={22} rx={13} ry={18} fill={`url(#${idp('p')})`} stroke={outline(p)} strokeWidth={2.5} transform={`rotate(${a} 50 42)`} />
      ))}
      <circle cx={50} cy={42} r={11} fill={`url(#${idp('c')})`} stroke={outline(c)} strokeWidth={2.5} />
      <Gloss cx={46} cy={38} rx={4} ry={2.5} o={0.7} />
    </Svg>
  );
}

const GARMENT_PATHS: Record<WearSlot, string> = {
  dress: 'M38 10h24l-2 14 8 10-6 6 22 50H14l22-50-6-6 8-10z',
  top: 'M34 16l-22 12 8 18 10-4v44h40V42l10 4 8-18-22-12q-16 12-32 0z',
  bottom: 'M28 18h44l16 66q-38 10-76 0z',
  outer: 'M34 12l-20 10-4 66h22l4-50 2 50h24l2-50 4 50h22l-4-66-20-10-16 18z',
  shoes: 'M8 64c0-12 6-20 14-20l8 10q10 4 16 10c2 8-2 12-8 12H14q-6 0-6-12zM54 64c0-12 6-20 14-20l8 10q10 4 16 10c2 8-2 12-8 12H60q-6 0-6-12z',
  necklace: 'M50 58a10 10 0 1 1 0 20a10 10 0 1 1 0-20z',
  earrings: 'M30 50a12 12 0 1 1 0 24a12 12 0 1 1 0-24zM70 50a12 12 0 1 1 0 24a12 12 0 1 1 0-24z',
  bracelet: 'M50 26c24 0 40 10 40 24S74 74 50 74 10 64 10 50 26 26 50 26zm0 12c-18 0-28 6-28 12s10 12 28 12 28-6 28-12-10-12-28-12z',
  ring: 'M50 40c16 0 28 10 28 24S66 88 50 88 22 78 22 64s12-24 28-24zm0 10c-10 0-18 6-18 14s8 14 18 14 18-6 18-14-8-14-18-14z',
  glasses: 'M8 44h34v18q0 12-17 12T8 62zM58 44h34v18q0 12-17 12T58 62z',
  hairAcc: 'M50 50L14 28q-8 22 0 44zM50 50l36-22q8 22 0 44zM42 42h16v16H42z',
  hat: 'M30 52q0-30 20-30t20 30zM6 58q44-14 88 0q-44 16-88 0z',
  bag: 'M18 40h64l-6 48H24z',
};

/** Prenda o accesorio simple coloreado (para retos, memoria y clasificación). */
export function Garment({ slot, color, size }: { slot: WearSlot; color: Tint; size?: number | string }) {
  const idp = useIdp('ga');
  const p = pal(color);
  const gold = makePalette('#ffd23f');
  return (
    <Svg size={size}><defs><LinGrad id={idp('g')} p={p} dir="d" /><RadGrad id={idp('r')} p={p} /></defs>
      {slot === 'necklace' && <path d="M22 20q28 50 56 0" fill="none" stroke={gold.shade} strokeWidth={4} strokeLinecap="round" />}
      {slot === 'earrings' && <path d="M30 30v20M70 30v20" stroke={gold.shade} strokeWidth={4} strokeLinecap="round" />}
      {slot === 'bag' && <path d="M34 40q0-24 16-24t16 24" fill="none" stroke={outline(p)} strokeWidth={5} strokeLinecap="round" />}
      {slot === 'glasses' && <path d="M42 50q8-6 16 0" fill="none" stroke={outline(p)} strokeWidth={4} strokeLinecap="round" />}
      <path d={GARMENT_PATHS[slot]} fill={`url(#${idp(slot === 'necklace' || slot === 'earrings' ? 'r' : 'g')})`} fillRule="evenodd"
        stroke={outline(p)} strokeWidth={3} strokeLinejoin="round" />
      {slot === 'ring' && <path d="M50 22l10 10-10 12-10-12z" fill="#bff3ff" stroke="#3a8bff" strokeWidth={2.5} strokeLinejoin="round" />}
      {slot === 'dress' && <path d="M34 44h32" stroke={p.light} strokeWidth={5} strokeLinecap="round" />}
      {slot === 'hat' && <path d="M30 50q20 6 40 0" fill="none" stroke={p.light} strokeWidth={5} strokeLinecap="round" />}
      <Gloss cx={38} cy={slot === 'shoes' ? 54 : 34} rx={7} ry={4} o={0.45} />
    </Svg>
  );
}

/** Carta boca abajo (memoria). */
export function CardBack({ size }: { size?: number | string }) {
  const idp = useIdp('cbk');
  const p = makePalette('#9b4dff');
  const s = makePalette('#ffd23f');
  return (
    <Svg size={size}><defs><LinGrad id={idp('g')} p={p} dir="d" /></defs>
      <rect x={4} y={4} width={92} height={92} rx={16} fill={`url(#${idp('g')})`} stroke={outline(p)} strokeWidth={3} />
      <rect x={12} y={12} width={76} height={76} rx={10} fill="none" stroke={p.light} strokeWidth={2.5} strokeDasharray="6 6" />
      <GemShape shape="estrella" cx={50} cy={52} r={22} p={s} gid={idp('s')} />
    </Svg>
  );
}
