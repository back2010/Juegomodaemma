import type { Palette } from '@/types';

interface GradProps { id: string; p: Palette; dir?: 'v' | 'h' | 'd'; reverse?: boolean }

/** Degradado de 3 paradas light → main → shade (regla de estilo obligatoria). */
export function LinGrad({ id, p, dir = 'v', reverse }: GradProps) {
  const [x2, y2] = dir === 'v' ? ['0', '1'] : dir === 'h' ? ['1', '0'] : ['1', '1'];
  const stops = [p.light, p.main, p.shade];
  if (reverse) stops.reverse();
  return (
    <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
      <stop offset="0" stopColor={stops[0]} />
      <stop offset="0.45" stopColor={stops[1]} />
      <stop offset="1" stopColor={stops[2]} />
    </linearGradient>
  );
}

/** Degradado radial (centro claro). cx/cy relativos 0..1. */
export function RadGrad({ id, p, cx = 0.35, cy = 0.3, r = 0.75 }: { id: string; p: Palette; cx?: number; cy?: number; r?: number }) {
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r}>
      <stop offset="0" stopColor={p.light} />
      <stop offset="0.55" stopColor={p.main} />
      <stop offset="1" stopColor={p.shade} />
    </radialGradient>
  );
}

/** Degradado de dos colores arbitrarios. */
export function TwoGrad({ id, a, b, dir = 'v' }: { id: string; a: string; b: string; dir?: 'v' | 'h' }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={dir === 'h' ? '1' : '0'} y2={dir === 'v' ? '1' : '0'}>
      <stop offset="0" stopColor={a} />
      <stop offset="1" stopColor={b} />
    </linearGradient>
  );
}

export const RAINBOW = ['#ff3b5c', '#ff9a1f', '#ffd21f', '#3ddc84', '#3a8bff', '#9b4dff'];
export function RainbowGrad({ id, dir = 'v' }: { id: string; dir?: 'v' | 'h' }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={dir === 'h' ? '1' : '0'} y2={dir === 'v' ? '1' : '0'}>
      {RAINBOW.map((c, i) => <stop key={c} offset={i / (RAINBOW.length - 1)} stopColor={c} />)}
    </linearGradient>
  );
}

/** Brillo especular: elipse blanca semitransparente. */
export function Gloss({ cx, cy, rx, ry, rot = -20, o = 0.5 }: { cx: number; cy: number; rx: number; ry: number; rot?: number; o?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" opacity={o} transform={`rotate(${rot} ${cx} ${cy})`} />;
}

/** Destello de 4 puntas. */
export function Sparkle({ x, y, r, fill = '#fff', o = 0.95 }: { x: number; y: number; r: number; fill?: string; o?: number }) {
  const k = r * 0.22;
  return (
    <path
      d={`M${x} ${y - r} Q${x + k} ${y - k} ${x + r} ${y} Q${x + k} ${y + k} ${x} ${y + r} Q${x - k} ${y + k} ${x - r} ${y} Q${x - k} ${y - k} ${x} ${y - r}Z`}
      fill={fill}
      opacity={o}
    />
  );
}

/** Filtro de desenfoque suave (permitido solo para rubor y brillos). */
export function SoftBlur({ id, s = 6 }: { id: string; s?: number }) {
  return (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation={s} />
    </filter>
  );
}
