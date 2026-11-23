import type { Palette, ShapeName } from '@/types';
import { RadGrad, Gloss } from './gradients';
import { outline } from './palette';

/** Path de una figura centrada en (cx,cy) con "radio" r. */
export function shapePath(shape: ShapeName, cx: number, cy: number, r: number): string {
  switch (shape) {
    case 'circulo':
      return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
    case 'ovalo': {
      const rx = r * 0.7;
      return `M${cx - rx} ${cy}a${rx} ${r} 0 1 0 ${2 * rx} 0a${rx} ${r} 0 1 0 ${-2 * rx} 0Z`;
    }
    case 'cuadrado': {
      const s = r * 0.85, k = r * 0.12;
      return roundRect(cx - s, cy - s, 2 * s, 2 * s, k);
    }
    case 'rectangulo': {
      const w = r * 1.0, h = r * 0.6, k = r * 0.1;
      return roundRect(cx - w, cy - h, 2 * w, 2 * h, k);
    }
    case 'triangulo': {
      const h = r * 1.0;
      return `M${cx} ${cy - h}L${cx + r * 0.95} ${cy + h * 0.72}L${cx - r * 0.95} ${cy + h * 0.72}Z`;
    }
    case 'estrella': {
      const pts: string[] = [];
      for (let i = 0; i < 10; i++) {
        const rr = i % 2 === 0 ? r : r * 0.45;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`);
      }
      return `M${pts.join('L')}Z`;
    }
    case 'corazon': {
      const s = r / 1.0;
      return `M${cx} ${cy + s * 0.85}C${cx - s * 0.3} ${cy + s * 0.6} ${cx - s} ${cy + s * 0.15} ${cx - s} ${cy - s * 0.3}`
        + `C${cx - s} ${cy - s * 0.8} ${cx - s * 0.4} ${cy - s * 0.95} ${cx} ${cy - s * 0.5}`
        + `C${cx + s * 0.4} ${cy - s * 0.95} ${cx + s} ${cy - s * 0.8} ${cx + s} ${cy - s * 0.3}`
        + `C${cx + s} ${cy + s * 0.15} ${cx + s * 0.3} ${cy + s * 0.6} ${cx} ${cy + s * 0.85}Z`;
    }
  }
}

export function roundRect(x: number, y: number, w: number, h: number, k: number): string {
  return `M${x + k} ${y}H${x + w - k}Q${x + w} ${y} ${x + w} ${y + k}V${y + h - k}Q${x + w} ${y + h} ${x + w - k} ${y + h}`
    + `H${x + k}Q${x} ${y + h} ${x} ${y + h - k}V${y + k}Q${x} ${y} ${x + k} ${y}Z`;
}

/** Figura "brillante" del kit: degradado radial + contorno + brillo. */
export function GemShape({ shape, cx, cy, r, p, gid, stroke = true }: {
  shape: ShapeName; cx: number; cy: number; r: number; p: Palette; gid: string; stroke?: boolean;
}) {
  return (
    <g>
      <defs><RadGrad id={gid} p={p} /></defs>
      <path d={shapePath(shape, cx, cy, r)} fill={`url(#${gid})`}
        stroke={stroke ? outline(p) : 'none'} strokeWidth={Math.max(1.2, r * 0.09)} strokeLinejoin="round" />
      <Gloss cx={cx - r * 0.3} cy={cy - r * 0.35} rx={r * 0.28} ry={r * 0.14} o={0.55} />
    </g>
  );
}
