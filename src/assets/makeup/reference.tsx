/**
 * Maquillaje de referencia (P0): un estilo por tipo.
 * Coordenadas LOCALES respecto al anclaje (ver MAKEUP_PLACEMENT); se dibuja el lado IZQUIERDO de pantalla
 * (el lado exterior del ojo/ceja está hacia −x). 'sparkle' usa coordenadas absolutas.
 */
import type { MakeupStyle, PartProps } from '@/types';
import { Sparkle, shift } from '@/art/kit';

function Brows({ palette: p }: PartProps) {
  return <path d="M-34 8C-20 -10 8 -16 30 -4C26 0 22 2 18 2C0 -6 -18 -2 -34 8Z" fill={p.main} stroke={p.shade} strokeWidth={1.5} strokeLinejoin="round" />;
}

function Shadow({ palette: p, idp }: PartProps) {
  return (
    <g>
      <defs>
        <linearGradient id={idp('sh')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={p.main} /><stop offset="1" stopColor={p.light} stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <path d="M-46 0C-34 -54 34 -58 46 -8C34 -38 -30 -36 -46 0Z" fill={`url(#${idp('sh')})`} />
    </g>
  );
}

function Liner({ palette: p }: PartProps) {
  return (
    <g>
      <path d="M-43 2C-28 -34 28 -38 42 -6" stroke={p.main} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M-40 -2L-60 -18L-44 -10Z" fill={p.main} stroke={p.main} strokeWidth={3} strokeLinejoin="round" />
    </g>
  );
}

const LASH_PTS: [number, number, number][] = [[-38, -10, -150], [-28, -24, -135], [-14, -33, -115], [2, -37, -100], [18, -34, -85], [32, -24, -70]];
function Lashes({ palette: p }: PartProps) {
  return (
    <g stroke={p.main} strokeWidth={3.4} strokeLinecap="round" fill="none">
      {LASH_PTS.map(([x, y, a], i) => {
        const r = (a * Math.PI) / 180, L = i < 2 ? 16 : 12;
        const x2 = x + Math.cos(r) * L, y2 = y + Math.sin(r) * L;
        return <path key={i} d={`M${x} ${y}Q${(x + x2) / 2 - 3} ${(y + y2) / 2} ${x2.toFixed(1)} ${y2.toFixed(1)}`} />;
      })}
    </g>
  );
}

function Blush({ palette: p, idp }: PartProps) {
  return (
    <g>
      <defs>
        <radialGradient id={idp('bl')}>
          <stop offset="0" stopColor={p.main} stopOpacity={0.85} /><stop offset="1" stopColor={p.main} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={0} rx={30} ry={20} fill={`url(#${idp('bl')})`} />
    </g>
  );
}

const LIP_TOP = 'M-25 0Q-12 -12 0 -5Q12 -12 25 0Q0 6 -25 0Z';
const LIP_BOTTOM = 'M-25 0Q0 6 25 0Q14 20 0 21Q-14 20 -25 0Z';
function Lips({ palette: p, idp }: PartProps) {
  return (
    <g>
      <defs>
        <linearGradient id={idp('lp')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.light} /><stop offset="0.5" stopColor={p.main} /><stop offset="1" stopColor={p.shade} />
        </linearGradient>
      </defs>
      <path d={LIP_TOP} fill={`url(#${idp('lp')})`} stroke={shift(p.shade, -0.05)} strokeWidth={1.6} />
      <path d={LIP_BOTTOM} fill={`url(#${idp('lp')})`} stroke={shift(p.shade, -0.05)} strokeWidth={1.6} />
    </g>
  );
}

function Gloss({ palette: p }: PartProps) {
  return (
    <g>
      <path d={LIP_BOTTOM} fill={p.light} opacity={0.35} />
      <ellipse cx={-7} cy={10} rx={9} ry={3.5} fill="#fff" opacity={0.85} />
      <ellipse cx={9} cy={-4} rx={5} ry={2} fill="#fff" opacity={0.7} />
      <Sparkle x={16} y={9} r={5} />
    </g>
  );
}

const FRECKLES: [number, number, number][] = [[-14, -8, 2.6], [-2, -12, 2.2], [10, -6, 2.8], [-8, 4, 2.3], [6, 6, 2], [18, 2, 2.4], [-20, 2, 2]];
function Freckles({ palette: p }: PartProps) {
  return <g fill={p.main} opacity={0.75}>{FRECKLES.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>;
}

function SparkleFace({ palette: p }: PartProps) {
  return (
    <g>
      <Sparkle x={196} y={240} r={12} fill={p.light} />
      <Sparkle x={406} y={236} r={10} fill={p.light} />
      <Sparkle x={200} y={268} r={6} fill="#fff" />
      <Sparkle x={300} y={196} r={8} fill={p.main} />
    </g>
  );
}

export const referenceMakeup: MakeupStyle[] = [
  { id: 'brows-natural', kind: 'brows', spokenName: 'cejas', Part: Brows },
  { id: 'shadow-classic', kind: 'eyeshadow', spokenName: 'sombra', Part: Shadow },
  { id: 'liner-wing', kind: 'liner', spokenName: 'delineador', Part: Liner },
  { id: 'lashes-natural', kind: 'lashes', spokenName: 'pestañas', Part: Lashes },
  { id: 'blush-round', kind: 'blush', spokenName: 'rubor', shapeTag: 'circulo', Part: Blush },
  { id: 'lips-classic', kind: 'lips', spokenName: 'labial', Part: Lips },
  { id: 'gloss-shine', kind: 'gloss', spokenName: 'brillo de labios', Part: Gloss },
  { id: 'freckles-dots', kind: 'freckles', spokenName: 'pecas', Part: Freckles },
  { id: 'sparkle-face', kind: 'sparkle', spokenName: 'destellos', shapeTag: 'estrella', Part: SparkleFace },
];
