/** Utilidades compartidas por los accesorios (no es un ítem del catálogo). */
import type { Palette } from '@/types';
import { Gloss, RadGrad, outline } from '@/art/kit';

export const GOLD = { main: '#f5d77a', light: '#fff3c4', shade: '#d0a548', line: '#b88d45' };

/** Punto de una curva cuadrática P0-P1-P2 en t (0..1). */
export function quadPt(p0: [number, number], p1: [number, number], p2: [number, number], t: number): [number, number] {
  const a = (1 - t) * (1 - t), b = 2 * t * (1 - t), c = t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
}

/** Cadena dorada (dos trazos para dar volumen). */
export function Chain({ d, w = 3.2 }: { d: string; w?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={GOLD.line} strokeWidth={w + 2.2} />
      <path d={d} stroke={GOLD.main} strokeWidth={w} />
    </g>
  );
}

/** Cuenta/perla esférica con brillo. */
export function Bead({ cx, cy, r, p, gid, o }: { cx: number; cy: number; r: number; p: Palette; gid: string; o?: string }) {
  return (
    <g>
      <defs><RadGrad id={gid} p={p} /></defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gid})`} stroke={o ?? outline(p)} strokeWidth={Math.max(1, r * 0.1)} />
      <Gloss cx={cx - r * 0.3} cy={cy - r * 0.35} rx={r * 0.32} ry={r * 0.17} o={0.7} />
    </g>
  );
}

/** Gancho dorado de arete (local: oreja en 0,0). */
export function EarHook({ to }: { to: number }) {
  return (
    <g>
      <circle cx={0} cy={19} r={3} fill={GOLD.main} stroke={GOLD.line} strokeWidth={1.2} />
      <path d={`M0 20L0 ${to}`} stroke={GOLD.line} strokeWidth={4.4} strokeLinecap="round" />
      <path d={`M0 20L0 ${to}`} stroke={GOLD.main} strokeWidth={2.6} strokeLinecap="round" />
    </g>
  );
}
