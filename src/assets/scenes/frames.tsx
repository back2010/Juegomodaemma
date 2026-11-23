/** Marcos de foto (0 0 1600 1200). Solo dibujan el borde; el centro queda transparente. */
import type { ReactNode } from 'react';

const W = 1600, H = 1200;
const O = { stroke: '#3b2147', strokeWidth: 3, strokeLinejoin: 'round' as const };
const star = (x: number, y: number, r: number) => {
  const k = r * 0.25;
  return `M${x} ${y - r}Q${x + k} ${y - k} ${x + r} ${y}Q${x + k} ${y + k} ${x} ${y + r}Q${x - k} ${y + k} ${x - r} ${y}Q${x - k} ${y - k} ${x} ${y - r}Z`;
};
const heart = (x: number, y: number, s: number) =>
  `M${x} ${y + 36 * s}C${x - 60 * s} ${y - 4 * s} ${x - 30 * s} ${y - 44 * s} ${x} ${y - 14 * s}C${x + 30 * s} ${y - 44 * s} ${x + 60 * s} ${y - 4 * s} ${x} ${y + 36 * s}Z`;

/** Posiciones a lo largo del borde (margen m). */
function border(step: number, m: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let x = m; x <= W - m; x += step) { pts.push([x, m]); pts.push([x, H - m]); }
  for (let y = m + step; y < H - m; y += step) { pts.push([m, y]); pts.push([W - m, y]); }
  return pts;
}
const Band = ({ id, c, w = 56 }: { id: string; c: string[]; w?: number }) => (
  <>
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1">{c.map((x, i) => <stop key={i} offset={i / (c.length - 1)} stopColor={x} />)}</linearGradient></defs>
    <path fillRule="evenodd" fill={`url(#${id})`} {...O} strokeWidth={4}
      d={`M0 0H${W}V${H}H0Z M${w} ${w}V${H - w}H${W - w}V${w}Z`} />
    <rect x={w} y={w} width={W - 2 * w} height={H - 2 * w} fill="none" stroke="#fff" strokeWidth="5" opacity="0.7" />
  </>
);

export function FrameHearts() {
  const pts = border(120, 34);
  return (
    <g>
      <Band id="fr-hea-b" c={['#ffb8e0', '#ff5fb0', '#d11a79']} />
      {pts.map(([x, y], i) => (
        <g key={i}><path d={heart(x, y, 0.9)} fill={['#ff2d95', '#ff8ac6', '#ffe3f3', '#ff6f61'][i % 4]} {...O} />
          <ellipse cx={x - 14} cy={y - 14} rx="7" ry="4" fill="#fff" opacity="0.8" transform={`rotate(-30 ${x - 14} ${y - 14})`} /></g>
      ))}
    </g>
  );
}

export function FrameStars() {
  const pts = border(110, 34);
  return (
    <g>
      <Band id="fr-sta-b" c={['#5b2a8f', '#9b4dff', '#3b1a7a']} />
      {pts.map(([x, y], i) => <path key={i} d={star(x, y, 36 + (i % 3) * 6)} fill={['#ffd23f', '#fff', '#ffe9a0'][i % 3]} {...O} />)}
      {[[90, 90], [W - 90, 90], [90, H - 90], [W - 90, H - 90]].map(([x, y], i) => <path key={i} d={star(x, y, 70)} fill="#ffd23f" {...O} strokeWidth={4} />)}
    </g>
  );
}

export function FrameFlowers() {
  const pts = border(120, 34);
  const cols = ['#ff5fb0', '#ffd23f', '#fff', '#9b4dff', '#ff8a1f'];
  return (
    <g>
      <Band id="fr-flo-b" c={['#9be9a0', '#3ddc84', '#1f9b3e']} />
      {pts.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-20" rx="12" ry="18" fill={cols[i % 5]} {...O} strokeWidth={2} transform={`rotate(${a})`} />)}
          <circle r="11" fill="#ffd23f" {...O} strokeWidth={2} />
        </g>
      ))}
    </g>
  );
}

export function FrameGold() {
  const w = 70;
  return (
    <g>
      <Band id="fr-gol-b" c={['#fff3a8', '#ffd23f', '#c98a14', '#ffd23f']} w={w} />
      <rect x={w - 14} y={w - 14} width={W - 2 * w + 28} height={H - 2 * w + 28} fill="none" stroke="#a8700a" strokeWidth="6" />
      <rect x="18" y="18" width={W - 36} height={H - 36} fill="none" stroke="#fff" strokeWidth="5" opacity="0.7" />
      {[[w, w], [W - w, w], [w, H - w], [W - w, H - w]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="48" fill="#ffd23f" {...O} strokeWidth={4} /><circle cx={x} cy={y} r="28" fill="#ff2d95" {...O} /><circle cx={x - 9} cy={y - 9} r="8" fill="#fff" opacity="0.8" /></g>
      ))}
      {[400, 800, 1200].map((x) => <g key={x}><circle cx={x} cy="35" r="14" fill="#fff3a8" {...O} /><circle cx={x} cy={H - 35} r="14" fill="#fff3a8" {...O} /></g>)}
    </g>
  );
}

export function FrameRainbow() {
  const cols = ['#ff3b5c', '#ff9a1f', '#ffd21f', '#3ddc84', '#3a8bff', '#9b4dff'];
  return (
    <g>
      {cols.map((c, i) => (
        <rect key={c} x={i * 14 + 7} y={i * 14 + 7} width={W - i * 28 - 14} height={H - i * 28 - 14} rx={40 - i * 4} fill="none" stroke={c} strokeWidth="14" />
      ))}
      {[[110, 110], [W - 110, 110], [110, H - 110], [W - 110, H - 110]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="44" fill="#fff" {...O} /><circle cx={x - 22} cy={y + 8} r="22" fill="#fff" {...O} /><circle cx={x + 22} cy={y + 8} r="22" fill="#fff" {...O} />
          <rect x={x - 44} y={y + 2} width="88" height="30" fill="#fff" /></g>
      ))}
    </g>
  );
}

export function FrameSparkles() {
  const pts = border(80, 40);
  return (
    <g>
      <defs><radialGradient id="fr-spa-g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient></defs>
      <Band id="fr-spa-b" c={['#d4f6ff', '#c9a1ff', '#ffc2e6']} w={50} />
      {pts.map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="34" fill="url(#fr-spa-g)" /><path d={star(x, y, 14 + (i % 4) * 8)} fill={['#fff', '#ffd23f', '#ff8ac6', '#22d3c5'][i % 4]} {...O} strokeWidth={2} /></g>
      ))}
      {[[130, 130], [W - 130, 130], [130, H - 130], [W - 130, H - 130]].map(([x, y], i) => <path key={i} d={star(x, y, 76)} fill="#fff" {...O} strokeWidth={4} />)}
    </g>
  );
}

export const FRAME_LIST: { id: string; Component: () => ReactNode; swatch: string }[] = [
  { id: 'fr-hearts', Component: FrameHearts, swatch: '#ff5fb0' },
  { id: 'fr-stars', Component: FrameStars, swatch: '#9b4dff' },
  { id: 'fr-flowers', Component: FrameFlowers, swatch: '#3ddc84' },
  { id: 'fr-gold', Component: FrameGold, swatch: '#ffd23f' },
  { id: 'fr-rainbow', Component: FrameRainbow, swatch: '#3a8bff' },
  { id: 'fr-sparkles', Component: FrameSparkles, swatch: '#c9a1ff' },
];
