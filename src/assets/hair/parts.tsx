/**
 * Piezas compartidas de peinados (P3): mechones, brillos, trenzas, rizos, chongos y ligas.
 * Todo usa `fill` (masa de cabello) y palette.shade/light (mechones y brillos).
 */
import type { Palette } from '@/types';
import { Gloss, outline } from '@/art/kit';

type P = [number, number];

/** Atributos de contorno estándar del cabello. */
export function line(p: Palette, w = 3.5) {
  return { stroke: outline(p), strokeWidth: w, strokeLinejoin: 'round' as const };
}

/** Mechones (trazos en tono sombra). */
export function Strands({ d, p, w = 3.5, o = 0.55 }: { d: string; p: Palette; w?: number; o?: number }) {
  return <path d={d} stroke={p.shade} strokeWidth={w} fill="none" strokeLinecap="round" opacity={o} />;
}

/** Brillo (trazo claro). */
export function Shine({ d, p, w = 8, o = 0.5 }: { d: string; p: Palette; w?: number; o?: number }) {
  return <path d={d} stroke={p.light} strokeWidth={w} fill="none" strokeLinecap="round" opacity={o} />;
}

/**
 * Contorno "nube": une los puntos con curvas que abultan `h` px hacia la izquierda del avance
 * (hacia afuera si se recorre en sentido horario; usa h negativo para abultar hacia adentro).
 */
export function scallop(pts: P[], h: number, closed = true): string {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  const all = closed ? [...pts, pts[0]] : pts;
  for (let i = 1; i < all.length; i++) {
    const [ax, ay] = all[i - 1], [bx, by] = all[i];
    const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1;
    const cx = (ax + bx) / 2 + (dy / l) * h * 1.6, cy = (ay + by) / 2 - (dx / l) * h * 1.6;
    d += `Q${Math.round(cx)} ${Math.round(cy)} ${bx} ${by}`;
  }
  return closed ? `${d}Z` : d;
}

/** Puntos sobre una elipse (ángulos en grados, 0 = derecha, sentido horario en pantalla). */
export function ellipsePts(cx: number, cy: number, rx: number, ry: number, from: number, to: number, n: number): P[] {
  const out: P[] = [];
  for (let i = 0; i <= n; i++) {
    const a = ((from + ((to - from) * i) / n) * Math.PI) / 180;
    out.push([Math.round(cx + rx * Math.cos(a)), Math.round(cy + ry * Math.sin(a))]);
  }
  return out;
}

/** Espiral de rizo centrada en (cx, cy). */
export function curlD(cx: number, cy: number, r: number): string {
  const f = (n: number) => Math.round(n * 10) / 10;
  return `M${f(cx + r * 0.15)} ${f(cy)}a${f(r * 0.22)} ${f(r * 0.22)} 0 1 0 ${f(-r * 0.3)} ${f(-r * 0.2)}`
    + `a${f(r * 0.5)} ${f(r * 0.5)} 0 1 1 ${f(r * 0.8)} ${f(r * 0.45)}`;
}

/** Rizo redondo: bolita con espiral y brillo. */
export function Curl({ cx, cy, r, fill, p }: { cx: number; cy: number; r: number; fill: string; p: Palette }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} {...line(p, 3)} />
      <path d={curlD(cx, cy, r)} stroke={p.shade} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
      <Gloss cx={cx - r * 0.35} cy={cy - r * 0.45} rx={r * 0.32} ry={r * 0.14} o={0.45} />
    </g>
  );
}

/**
 * Cadena de lóbulos a lo largo de `pts` (de arriba a abajo).
 * mode 'braid': lóbulos alternados (trenza); 'ringlet': todos inclinados (tirabuzón).
 */
export function Chain({ pts, w, fill, p, mode = 'braid', sw = 3 }: {
  pts: P[]; w: number; fill: string; p: Palette; mode?: 'braid' | 'ringlet'; sw?: number;
}) {
  const segs = pts.map((c, i) => {
    const n = pts[Math.min(i + 1, pts.length - 1)];
    const pv = pts[Math.max(i - 1, 0)];
    const dx = n[0] - pv[0], dy = n[1] - pv[1];
    const len = Math.hypot(dx, dy) / (i === 0 || i === pts.length - 1 ? 1 : 2) || w;
    const dir = (Math.atan2(dx, dy) * 180) / Math.PI;
    const side = mode === 'braid' ? (i % 2 ? 1 : -1) : 1;
    const tilt = mode === 'braid' ? 30 : 34;
    const rot = -dir + side * tilt;
    const off = mode === 'braid' ? side * w * 0.14 : 0;
    const nx = dy / (Math.hypot(dx, dy) || 1), ny = -dx / (Math.hypot(dx, dy) || 1);
    return { cx: c[0] + nx * off, cy: c[1] + ny * off, rx: w / 2, ry: len * 0.78, rot, side };
  });
  return (
    <g>
      {[...segs].reverse().map((s, k) => (
        <g key={k} transform={`translate(${s.cx.toFixed(1)} ${s.cy.toFixed(1)}) rotate(${s.rot.toFixed(1)})`}>
          <ellipse rx={s.rx} ry={s.ry} fill={fill} {...line(p, sw)} />
          {mode === 'braid'
            ? <path d={`M${-s.rx * 0.1} ${-s.ry * 0.7}Q${s.rx * 0.25} 0 ${-s.rx * 0.1} ${s.ry * 0.7}`} stroke={p.shade} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.55} />
            : <path d={`M${-s.rx * 0.8} ${s.ry * 0.1}Q0 ${s.ry * 0.75} ${s.rx * 0.8} ${s.ry * 0.1}`} stroke={p.shade} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.6} />}
          <ellipse cx={-s.rx * 0.3} cy={-s.ry * 0.3} rx={s.rx * 0.22} ry={s.ry * 0.3} fill={p.light} opacity={0.55} />
        </g>
      ))}
    </g>
  );
}

/** Chongo redondo con vueltas de cabello. */
export function Bun({ cx, cy, r, fill, p }: { cx: number; cy: number; r: number; fill: string; p: Palette }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} {...line(p)} />
      <path
        d={`M${cx - r * 0.8} ${cy + r * 0.15}C${cx - r * 0.6} ${cy - r * 0.7} ${cx + r * 0.5} ${cy - r * 0.8} ${cx + r * 0.75} ${cy - r * 0.1}`
          + `M${cx - r * 0.7} ${cy + r * 0.5}C${cx - r * 0.3} ${cy - r * 0.2} ${cx + r * 0.5} ${cy - r * 0.25} ${cx + r * 0.8} ${cy + r * 0.35}`
          + `M${cx - r * 0.35} ${cy + r * 0.85}C${cx - r * 0.1} ${cy + r * 0.3} ${cx + r * 0.4} ${cy + r * 0.3} ${cx + r * 0.6} ${cy + r * 0.7}`}
        stroke={p.shade} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.55} />
      <path d={`M${cx - r * 0.55} ${cy - r * 0.45}A${r * 0.75} ${r * 0.75} 0 0 1 ${cx + r * 0.25} ${cy - r * 0.72}`}
        stroke={p.light} strokeWidth={Math.max(4, r * 0.14)} fill="none" strokeLinecap="round" opacity={0.55} />
      <Gloss cx={cx - r * 0.4} cy={cy - r * 0.35} rx={r * 0.2} ry={r * 0.09} o={0.5} />
    </g>
  );
}

/** Liga de cabello (en tono sombra con brillo), girada `rot` grados. */
export function Tie({ cx, cy, rx = 12, ry = 7, rot = 0, p }: { cx: number; cy: number; rx?: number; ry?: number; rot?: number; p: Palette }) {
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <rect x={cx - rx} y={cy - ry} width={rx * 2} height={ry * 2} rx={ry} fill={p.shade} {...line(p, 2.5)} />
      <rect x={cx - rx * 0.7} y={cy - ry * 0.6} width={rx * 0.9} height={ry * 0.5} rx={ry * 0.25} fill="#fff" opacity={0.45} />
    </g>
  );
}

/** Cabello de nuca pequeño (detrás de la cabeza) para peinados recogidos. */
export function NapeBack({ p, fill, bottom = 330 }: { p: Palette; fill: string; bottom?: number }) {
  return (
    <g>
      <path d={`M300 90C404 88 452 160 448 250C446 290 440 ${bottom - 20} 428 ${bottom}L172 ${bottom}C160 ${bottom - 20} 154 290 152 250C148 160 196 88 300 90Z`}
        fill={fill} {...line(p)} />
    </g>
  );
}

/** Espeja horizontalmente (x → 600 − x) un trazado con comandos absolutos M L C Q S T Z. */
export function mirrorD(d: string): string {
  const toks = d.match(/[MLCQSTZ]|-?\d*\.?\d+/g) ?? [];
  let i = 0, out = '';
  for (const t of toks) {
    if (/[A-Z]/.test(t)) { out += t; i = 0; continue; }
    const n = Number(t);
    out += `${out && !/[A-Z]$/.test(out) ? ' ' : ''}${i % 2 === 0 ? 600 - n : n}`;
    i++;
  }
  return out;
}
export const mirrorPts = (pts: P[]): P[] => pts.map(([x, y]) => [600 - x, y]);

/** Corona con raya al centro (cubre la parte alta de la cabeza). */
export const CROWN_PART = 'M156 300C144 156 212 86 300 86C388 86 456 156 444 300C436 262 426 228 408 200C384 166 344 150 300 158C256 150 216 166 192 200C174 228 164 262 156 300Z';
/** Corona peinada hacia atrás (frente despejada). */
export const CROWN_SLEEK = 'M156 300C144 156 212 86 300 86C388 86 456 156 444 300C434 246 414 198 378 174C354 160 328 156 300 156C272 156 246 160 222 174C186 198 166 246 156 300Z';

/** Brillos y mechones estándar para una corona. */
export function CrownDetails({ p, part = false, to = [300, 96] }: { p: Palette; part?: boolean; to?: P }) {
  return (
    <g>
      {part
        ? <Strands p={p} d="M300 158C298 132 300 110 302 90M262 154C236 168 210 200 198 250M338 154C364 168 390 200 402 250" />
        : <Strands p={p} d={`M214 180C232 140 262 112 ${to[0] - 14} ${to[1] + 4}M256 156C268 128 284 110 ${to[0] - 4} ${to[1] + 2}M386 180C368 140 338 112 ${to[0] + 14} ${to[1] + 4}M344 156C332 128 316 110 ${to[0] + 4} ${to[1] + 2}M180 240C186 190 210 150 244 128M420 240C414 190 390 150 356 128`} />}
      <Shine p={p} d="M208 132Q252 104 290 100M310 100Q350 104 392 132" w={10} o={0.5} />
      <Gloss cx={244} cy={122} rx={22} ry={8} rot={-24} o={0.45} />
    </g>
  );
}

/** Puntas abiertas al final de una trenza o coleta, apuntando hacia abajo desde (x, y). */
export function tuftD(x: number, y: number, w = 12, l = 40): string {
  return `M${x - w} ${y}C${x - w * 2} ${y + l * 0.6} ${x - w * 0.6} ${y + l * 0.9} ${x - w * 0.2} ${y + l}`
    + `C${x} ${y + l * 0.8} ${x + w * 0.4} ${y + l * 0.95} ${x + w * 0.6} ${y + l * 0.9}C${x + w * 1.8} ${y + l * 0.6} ${x + w * 1.6} ${y + l * 0.2} ${x + w} ${y}Z`;
}
