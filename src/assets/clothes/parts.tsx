/** Utilidades compartidas por las prendas (geometría simétrica, degradados, estampados). */
import type { ReactNode } from 'react';
import type { Palette } from '@/types';
import { hexToHsl, shift, shapePath, outline } from '@/art/kit';
import type { ShapeName } from '@/types';

/** Refleja un path absoluto (M L C Q H V Z) respecto a x=300. */
export function mirror(d: string): string {
  return d.replace(/([MLCQHVZ])([^MLCQHVZ]*)/g, (_m, c: string, rest: string) => {
    const n = rest.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
    if (c === 'Z') return 'Z';
    if (c === 'V') return `V${n.join(' ')}`;
    if (c === 'H') return `H${n.map((x) => 600 - x).join(' ')}`;
    const out: number[] = [];
    for (let i = 0; i < n.length; i += 2) out.push(600 - n[i], n[i + 1]);
    return c + out.join(' ');
  });
}

/** Color que contrasta con la prenda (para lunares, estrellas, adornos). */
export function contrast(p: Palette): string {
  const l = hexToHsl(p.main)[2];
  return l > 0.72 ? shift(p.main, -0.32) : '#ffffff';
}

/** Degradado horizontal tipo cilindro (sombra, luz, sombra) en coordenadas absolutas. */
export function CylGrad({ id, p, x1 = 200, x2 = 400 }: { id: string; p: Palette; x1?: number; x2?: number }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1="0" x2={x2} y2="0">
      <stop offset="0" stopColor={p.shade} /><stop offset="0.3" stopColor={p.main} />
      <stop offset="0.45" stopColor={p.light} /><stop offset="0.7" stopColor={p.main} /><stop offset="1" stopColor={p.shade} />
    </linearGradient>
  );
}

/** Degradado vertical de 3 paradas en coordenadas absolutas. */
export function VGrad({ id, p, y1, y2 }: { id: string; p: Palette; y1: number; y2: number }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1={y1} x2="0" y2={y2}>
      <stop offset="0" stopColor={p.light} /><stop offset="0.45" stopColor={p.main} /><stop offset="1" stopColor={p.shade} />
    </linearGradient>
  );
}

/**
 * Pieza simétrica: `d` es la mitad izquierda cerrada pasando por la línea central x=300.
 * Dibuja contorno (por debajo) y relleno; `children` se recorta a la silueta (estampados).
 */
export function Sym({ d, fill, o, sw = 3.5, clip, children }: {
  d: string; fill: string; o: string; sw?: number; clip?: string; children?: ReactNode;
}) {
  const m = mirror(d);
  return (
    <g>
      {clip && <defs><clipPath id={clip}><path d={d} /><path d={m} /></clipPath></defs>}
      <path d={d} fill="none" stroke={o} strokeWidth={sw * 2} strokeLinejoin="round" />
      <path d={m} fill="none" stroke={o} strokeWidth={sw * 2} strokeLinejoin="round" />
      <path d={d} fill={fill} />
      <path d={m} fill={fill} />
      {clip && <g clipPath={`url(#${clip})`}>{children}</g>}
    </g>
  );
}

/** Dibuja dos veces: tal cual y reflejado (para detalles simétricos). */
export function Pair({ children }: { children: ReactNode }) {
  return (<g><g>{children}</g><g transform="translate(600 0) scale(-1 1)">{children}</g></g>);
}

/** Cuadrícula de motivos (lunares, estrellas, corazones) sobre una región. */
export function Motifs({ shape, p, x0, x1, y0, y1, step, r, color, o = 0.9 }: {
  shape: ShapeName; p: Palette; x0: number; x1: number; y0: number; y1: number; step: number; r: number; color?: string; o?: number;
}) {
  const c = color ?? contrast(p);
  const out: ReactNode[] = [];
  let row = 0;
  for (let y = y0; y <= y1; y += step * 0.9, row++) {
    for (let x = x0 + (row % 2 ? step / 2 : 0); x <= x1; x += step) {
      out.push(<path key={`${x}-${y}`} d={shapePath(shape, x, y, r)} fill={c} opacity={o} />);
    }
  }
  return <g>{out}</g>;
}

/** Brillos de cuerpo estándar. */
export const lineOf = outline;
