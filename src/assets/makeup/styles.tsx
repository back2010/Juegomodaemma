/**
 * Maquillaje (P2). Coordenadas LOCALES al anclaje; se dibuja el lado IZQUIERDO (exterior hacia −x).
 * 'sparkle' usa coordenadas absolutas del viewBox 0 0 600 1000 y dibuja ambos lados.
 */
import type { MakeupStyle, PartProps } from '@/types';
import { Sparkle, SoftBlur, shapePath, shift, hexToHsl, hslToHex, RAINBOW } from '@/art/kit';

/* ---------- utilidades ---------- */
const hueShift = (hex: string, d: number, dl = 0) => {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h + d, s, l + dl);
};
/** Punto de la curva del párpado superior (cúbica) para t en 0..1. */
const LID: [number, number][] = [[-43, 2], [-28, -34], [28, -38], [42, -6]];
function lidPt(t: number): [number, number] {
  const u = 1 - t;
  const f = (i: 0 | 1) => u * u * u * LID[0][i] + 3 * u * u * t * LID[1][i] + 3 * u * t * t * LID[2][i] + t * t * t * LID[3][i];
  return [f(0), f(1)];
}
const star = (cx: number, cy: number, r: number) => shapePath('estrella', cx, cy, r);
const heart = (cx: number, cy: number, r: number) => shapePath('corazon', cx, cy, r);

/* ---------- cejas ---------- */
const brow = (d: string, w = 1.5) => function Brow({ palette: p }: PartProps) {
  return <path d={d} fill={p.main} stroke={p.shade} strokeWidth={w} strokeLinejoin="round" />;
};
const BrowsArched = brow('M-34 8C-24 -14 4 -26 32 -4C27 -2 22 0 18 -1C2 -14 -20 -6 -34 8Z');
const BrowsThick = brow('M-37 11C-24 -12 8 -22 33 -7C31 2 25 7 18 7C0 -4 -20 1 -37 11Z', 1.8);
function BrowsThin({ palette: p }: PartProps) {
  return <path d="M-33 7C-19 -10 8 -15 30 -3" stroke={p.main} strokeWidth={3.6} fill="none" strokeLinecap="round" />;
}

/* ---------- sombras ---------- */
const SHADOW = 'M-46 0C-34 -54 34 -58 46 -8C34 -38 -30 -36 -46 0Z';
function ShadowSmoky({ palette: p, idp }: PartProps) {
  return (
    <g>
      <defs>
        <SoftBlur id={idp('bl')} s={3.5} />
        <radialGradient id={idp('rg')} cx="0.5" cy="0.75" r="0.8">
          <stop offset="0" stopColor={p.shade} /><stop offset="0.55" stopColor={p.main} /><stop offset="1" stopColor={p.light} stopOpacity={0.15} />
        </radialGradient>
      </defs>
      <path d="M-52 6C-42 -66 42 -68 52 -4C38 -46 -36 -44 -52 6Z" fill={`url(#${idp('rg')})`} filter={`url(#${idp('bl')})`} />
      <path d="M-50 4C-44 -20 -30 -34 -14 -38C-30 -28 -42 -14 -50 4Z" fill={p.shade} opacity={0.5} filter={`url(#${idp('bl')})`} />
    </g>
  );
}
function ShadowTwoTone({ palette: p, idp }: PartProps) {
  const top = hueShift(p.main, 40, 0.12);
  return (
    <g>
      <defs>
        <SoftBlur id={idp('bl')} s={1.6} />
        <linearGradient id={idp('lo')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={p.shade} /><stop offset="0.6" stopColor={p.main} /><stop offset="1" stopColor={p.main} stopOpacity={0.4} />
        </linearGradient>
        <linearGradient id={idp('hi')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={top} stopOpacity={0.1} /><stop offset="1" stopColor={top} />
        </linearGradient>
      </defs>
      <path d="M-46 0C-34 -56 34 -60 46 -8C34 -40 -30 -38 -46 0Z" fill={`url(#${idp('hi')})`} filter={`url(#${idp('bl')})`} />
      <path d="M-46 0C-34 -38 30 -40 46 -8C32 -28 -28 -26 -46 0Z" fill={`url(#${idp('lo')})`} />
    </g>
  );
}
function ShadowGlitter({ palette: p, idp }: PartProps) {
  return (
    <g>
      <defs>
        <linearGradient id={idp('sh')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={p.main} /><stop offset="1" stopColor={p.light} stopOpacity={0.25} />
        </linearGradient>
      </defs>
      <path d={SHADOW} fill={`url(#${idp('sh')})`} />
      <Sparkle x={-22} y={-24} r={7} />
      <Sparkle x={8} y={-34} r={9} />
      <Sparkle x={30} y={-22} r={5} />
      <circle cx={-34} cy={-12} r={2} fill="#fff" opacity={0.9} />
      <circle cx={-8} cy={-28} r={1.8} fill="#fff" opacity={0.9} />
      <circle cx={20} cy={-30} r={1.6} fill="#fff" opacity={0.9} />
      <circle cx={38} cy={-14} r={1.8} fill="#fff" opacity={0.9} />
    </g>
  );
}

/* ---------- delineador ---------- */
function LinerThin({ palette: p }: PartProps) {
  return <path d="M-43 2C-28 -34 28 -38 42 -6" stroke={p.main} strokeWidth={3.4} fill="none" strokeLinecap="round" />;
}
function LinerDots({ palette: p }: PartProps) {
  const ts = [0.1, 0.24, 0.38, 0.52, 0.66, 0.8, 0.92];
  return (
    <g>
      <path d="M-43 2C-28 -34 28 -38 42 -6" stroke={p.main} strokeWidth={3} fill="none" strokeLinecap="round" />
      {ts.map((t, i) => {
        const [x, y] = lidPt(t);
        return <circle key={i} cx={x} cy={y - 9 - (i % 2) * 3} r={i % 2 ? 2.2 : 3} fill={p.main} />;
      })}
    </g>
  );
}
function LinerWingBold({ palette: p }: PartProps) {
  return (
    <g>
      <path d="M-43 3C-28 -36 28 -40 42 -6" stroke={p.main} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M-40 -2C-50 -12 -58 -22 -64 -30C-52 -30 -44 -26 -38 -18Z" fill={p.main} stroke={p.main} strokeWidth={2} strokeLinejoin="round" />
    </g>
  );
}

/* ---------- pestañas ---------- */
const lashes = (pts: [number, number, number][], long: number, short: number, w: number, curl: number) =>
  function Lashes({ palette: p }: PartProps) {
    return (
      <g stroke={p.main} strokeWidth={w} strokeLinecap="round" fill="none">
        {pts.map(([x, y, a], i) => {
          const r = (a * Math.PI) / 180, L = i < 3 ? long : short;
          const x2 = x + Math.cos(r) * L, y2 = y + Math.sin(r) * L;
          return <path key={i} d={`M${x} ${y}Q${(x + x2) / 2 - curl} ${(y + y2) / 2 + curl * 0.3} ${x2.toFixed(1)} ${y2.toFixed(1)}`} />;
        })}
      </g>
    );
  };
const LashesLong = lashes([[-40, -8, -155], [-32, -20, -140], [-22, -29, -128], [-10, -35, -112], [4, -38, -98], [18, -35, -82], [32, -26, -66]], 26, 20, 3.2, 4);
function LashesDoll({ palette: p }: PartProps) {
  const pts: [number, number, number][] = [[-41, -6, -160], [-35, -17, -148], [-27, -26, -136], [-18, -32, -124], [-8, -36, -110], [2, -38, -98], [12, -37, -86], [22, -33, -74], [31, -27, -62], [38, -19, -50]];
  return (
    <g fill="none" strokeLinecap="round">
      <path d="M-43 2C-28 -34 28 -38 42 -6" stroke={p.main} strokeWidth={3.6} />
      <g stroke={p.main} strokeWidth={3.8}>
        {pts.map(([x, y, a], i) => {
          const r = (a * Math.PI) / 180, L = i < 5 ? 22 : 17;
          const x2 = x + Math.cos(r) * L, y2 = y + Math.sin(r) * L;
          return <path key={i} d={`M${x} ${y}Q${(x + x2) / 2 - 4} ${(y + y2) / 2 + 2} ${x2.toFixed(1)} ${y2.toFixed(1)}`} />;
        })}
      </g>
    </g>
  );
}
const LashesNatural2 = lashes([[-38, -10, -150], [-28, -24, -135], [-14, -33, -115], [2, -37, -100], [18, -34, -85], [32, -24, -70]], 14, 11, 2.6, 2);

/* ---------- rubor ---------- */
function BlushHeart({ palette: p, idp }: PartProps) {
  return (
    <g>
      <defs><SoftBlur id={idp('bl')} s={3.5} /></defs>
      <path d={heart(0, 0, 24)} fill={p.main} opacity={0.85} filter={`url(#${idp('bl')})`} />
      <path d={heart(-5, -5, 8)} fill={p.light} opacity={0.5} filter={`url(#${idp('bl')})`} />
    </g>
  );
}
function BlushStars({ palette: p, idp }: PartProps) {
  return (
    <g>
      <defs><SoftBlur id={idp('bl')} s={2.6} /></defs>
      <path d={star(0, 0, 24)} fill={p.main} opacity={0.85} filter={`url(#${idp('bl')})`} />
      <path d={star(-18, -14, 8)} fill={p.main} opacity={0.7} filter={`url(#${idp('bl')})`} />
      <path d={star(20, 12, 7)} fill={p.main} opacity={0.7} filter={`url(#${idp('bl')})`} />
    </g>
  );
}
function BlushSoft({ palette: p, idp }: PartProps) {
  return (
    <g>
      <defs>
        <radialGradient id={idp('bl')}>
          <stop offset="0" stopColor={p.main} stopOpacity={0.9} /><stop offset="0.6" stopColor={p.main} stopOpacity={0.45} /><stop offset="1" stopColor={p.main} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={0} rx={36} ry={22} fill={`url(#${idp('bl')})`} transform="rotate(-12)" />
    </g>
  );
}

/* ---------- labios ---------- */
const LIP_TOP = 'M-25 0Q-12 -12 0 -5Q12 -12 25 0Q0 6 -25 0Z';
const LIP_BOTTOM = 'M-25 0Q0 6 25 0Q14 20 0 21Q-14 20 -25 0Z';
const LIP_TOP_HEART = 'M-25 0Q-18 -14 -8 -12Q-2 -11 0 -4Q2 -11 8 -12Q18 -14 25 0Q0 6 -25 0Z';
const LIP_BOTTOM_FULL = 'M-25 0Q0 6 25 0Q16 23 0 24Q-16 23 -25 0Z';
function LipsHeart({ palette: p, idp }: PartProps) {
  const st = shift(p.shade, -0.05);
  return (
    <g>
      <defs>
        <linearGradient id={idp('lp')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.light} /><stop offset="0.5" stopColor={p.main} /><stop offset="1" stopColor={p.shade} />
        </linearGradient>
      </defs>
      <path d={LIP_TOP_HEART} fill={`url(#${idp('lp')})`} stroke={st} strokeWidth={1.6} strokeLinejoin="round" />
      <path d={LIP_BOTTOM_FULL} fill={`url(#${idp('lp')})`} stroke={st} strokeWidth={1.6} strokeLinejoin="round" />
      <path d={heart(0, 12, 5)} fill="#fff" opacity={0.6} />
    </g>
  );
}
function LipsOmbre({ palette: p, idp }: PartProps) {
  const st = shift(p.shade, -0.05);
  const pale = shift(p.light, 0.08);
  return (
    <g>
      <defs>
        <linearGradient id={idp('up')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.shade} /><stop offset="1" stopColor={p.main} />
        </linearGradient>
        <linearGradient id={idp('lo')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.main} /><stop offset="1" stopColor={pale} />
        </linearGradient>
      </defs>
      <path d={LIP_TOP} fill={`url(#${idp('up')})`} stroke={st} strokeWidth={1.6} strokeLinejoin="round" />
      <path d={LIP_BOTTOM} fill={`url(#${idp('lo')})`} stroke={st} strokeWidth={1.6} strokeLinejoin="round" />
      <ellipse cx={-6} cy={12} rx={7} ry={2.6} fill="#fff" opacity={0.55} />
    </g>
  );
}
function LipsMatte({ palette: p, idp }: PartProps) {
  const st = shift(p.shade, -0.05);
  return (
    <g>
      <defs>
        <linearGradient id={idp('lp')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.main} /><stop offset="1" stopColor={p.shade} />
        </linearGradient>
      </defs>
      <path d={LIP_TOP_HEART} fill={`url(#${idp('lp')})`} stroke={st} strokeWidth={1.6} strokeLinejoin="round" />
      <path d={LIP_BOTTOM} fill={`url(#${idp('lp')})`} stroke={st} strokeWidth={1.6} strokeLinejoin="round" />
    </g>
  );
}

/* ---------- gloss ---------- */
function GlossGlitter({ palette: p }: PartProps) {
  const dots: [number, number, number][] = [[-16, 8, 1.8], [-8, 14, 1.5], [0, 10, 2], [8, 15, 1.6], [15, 8, 1.8], [-12, -3, 1.5], [10, -4, 1.5], [-2, 17, 1.4], [20, 3, 1.4], [-20, 3, 1.4]];
  return (
    <g>
      <path d={LIP_BOTTOM} fill={p.light} opacity={0.3} />
      <path d={LIP_TOP} fill={p.light} opacity={0.2} />
      {dots.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.9} />)}
      <Sparkle x={-9} y={9} r={6} />
      <Sparkle x={12} y={12} r={5} fill={p.light} />
      <Sparkle x={14} y={-3} r={4} />
    </g>
  );
}
function GlossStar({ palette: p }: PartProps) {
  return (
    <g>
      <path d={LIP_BOTTOM} fill={p.light} opacity={0.35} />
      <ellipse cx={-9} cy={11} rx={7} ry={2.8} fill="#fff" opacity={0.75} />
      <path d={star(2, 11, 8)} fill="#fff" opacity={0.95} stroke={p.main} strokeWidth={0.8} strokeLinejoin="round" />
      <Sparkle x={17} y={-3} r={4.5} />
    </g>
  );
}

/* ---------- pecas ---------- */
const FR: [number, number, number][] = [[-14, -8, 1], [-2, -12, 0.85], [10, -6, 1.1], [-8, 4, 0.9], [6, 6, 0.8], [18, 2, 0.95], [-20, 2, 0.8]];
function FrecklesHearts({ palette: p }: PartProps) {
  return <g fill={p.main} opacity={0.85}>{FR.map(([x, y, s], i) => <path key={i} d={heart(x, y, 4.2 * s)} />)}</g>;
}
function FrecklesStars({ palette: p }: PartProps) {
  return <g fill={p.main} opacity={0.85} stroke={p.main} strokeWidth={0.6} strokeLinejoin="round">{FR.map(([x, y, s], i) => <path key={i} d={star(x, y, 4.6 * s)} />)}</g>;
}
function FrecklesMany({ palette: p }: PartProps) {
  const pts: [number, number, number][] = [...FR, [-24, -4, 0.8], [-10, 12, 0.9], [14, -14, 0.8], [22, -6, 0.8], [0, 0, 1], [-18, 10, 0.7], [12, 12, 0.8]].map(([x, y, s]) => [x, y, s]);
  return <g fill={p.main} opacity={0.75}>{pts.map(([x, y, s], i) => <circle key={i} cx={x} cy={y} r={2.2 * s} />)}</g>;
}

/* ---------- brillos en la cara (abs) ---------- */
function SparkleStars({ palette: p }: PartProps) {
  const L: [number, number, number][] = [[224, 232, 11], [216, 300, 7], [246, 204, 7], [236, 372, 6]];
  return (
    <g>
      {L.flatMap(([x, y, r], i) => [x, 600 - x].map((xx, j) => (
        <g key={`${i}-${j}`}>
          <path d={star(xx, y, r)} fill={p.main} stroke={p.shade} strokeWidth={1} strokeLinejoin="round" />
          <Sparkle x={xx + r * 1.3} y={y - r * 1.2} r={r * 0.5} />
        </g>
      )))}
      <path d={star(300, 190, 10)} fill={p.main} stroke={p.shade} strokeWidth={1} strokeLinejoin="round" />
      <Sparkle x={300} y={190} r={5} fill={p.light} />
    </g>
  );
}
function SparkleHearts({ palette: p }: PartProps) {
  const L: [number, number, number][] = [[224, 232, 11], [216, 300, 7], [246, 204, 7], [236, 372, 6]];
  return (
    <g>
      {L.flatMap(([x, y, r], i) => [x, 600 - x].map((xx, j) => (
        <g key={`${i}-${j}`}>
          <path d={heart(xx, y, r)} fill={p.main} stroke={p.shade} strokeWidth={1} strokeLinejoin="round" />
          <ellipse cx={xx - r * 0.35} cy={y - r * 0.4} rx={r * 0.25} ry={r * 0.14} fill="#fff" opacity={0.7} />
        </g>
      )))}
      <path d={heart(300, 192, 10)} fill={p.main} stroke={p.shade} strokeWidth={1} strokeLinejoin="round" />
    </g>
  );
}
function SparkleRainbow({ palette: p }: PartProps) {
  const arc = (cx: number, cy: number, s: number, key: string) => (
    <g key={key} fill="none" strokeLinecap="round" strokeWidth={3 * s}>
      {RAINBOW.slice(0, 5).map((c, i) => <path key={c} d={`M${cx - (22 - i * 3.6) * s} ${cy}A${(22 - i * 3.6) * s} ${(22 - i * 3.6) * s} 0 0 1 ${cx + (22 - i * 3.6) * s} ${cy}`} stroke={c} />)}
    </g>
  );
  return (
    <g>
      {arc(226, 226, 0.9, 'l')}{arc(374, 226, 0.9, 'r')}
      <Sparkle x={222} y={344} r={7} fill={p.light} />
      <Sparkle x={378} y={344} r={7} fill={p.light} />
      <Sparkle x={300} y={196} r={8} fill={p.main} />
    </g>
  );
}

export const extraMakeup: MakeupStyle[] = [
  { id: 'brows-arqueadas', kind: 'brows', spokenName: 'cejas arqueadas', Part: BrowsArched },
  { id: 'brows-gruesas', kind: 'brows', spokenName: 'cejas gruesas', Part: BrowsThick },
  { id: 'brows-finas', kind: 'brows', spokenName: 'cejas finas', Part: BrowsThin },
  { id: 'shadow-ahumada', kind: 'eyeshadow', spokenName: 'sombra ahumada', Part: ShadowSmoky },
  { id: 'shadow-dos-tonos', kind: 'eyeshadow', spokenName: 'sombra de dos tonos', Part: ShadowTwoTone },
  { id: 'shadow-brillitos', kind: 'eyeshadow', spokenName: 'sombra con brillitos', Part: ShadowGlitter },
  { id: 'liner-fino', kind: 'liner', spokenName: 'delineador fino', Part: LinerThin },
  { id: 'liner-puntitos', kind: 'liner', spokenName: 'delineador con puntitos', Part: LinerDots },
  { id: 'liner-ala-gruesa', kind: 'liner', spokenName: 'delineador de ala', Part: LinerWingBold },
  { id: 'lashes-largas', kind: 'lashes', spokenName: 'pestañas largas', Part: LashesLong },
  { id: 'lashes-muneca', kind: 'lashes', spokenName: 'pestañas de muñeca', Part: LashesDoll },
  { id: 'lashes-suaves', kind: 'lashes', spokenName: 'pestañas suaves', Part: LashesNatural2 },
  { id: 'blush-corazon', kind: 'blush', spokenName: 'rubor de corazón', shapeTag: 'corazon', Part: BlushHeart },
  { id: 'blush-estrellas', kind: 'blush', spokenName: 'rubor de estrellas', shapeTag: 'estrella', Part: BlushStars },
  { id: 'blush-suave', kind: 'blush', spokenName: 'rubor suave', shapeTag: 'ovalo', Part: BlushSoft },
  { id: 'lips-corazon', kind: 'lips', spokenName: 'labial de corazón', shapeTag: 'corazon', Part: LipsHeart },
  { id: 'lips-degradado', kind: 'lips', spokenName: 'labial degradado', Part: LipsOmbre },
  { id: 'lips-mate', kind: 'lips', spokenName: 'labial mate', Part: LipsMatte },
  { id: 'gloss-diamantina', kind: 'gloss', spokenName: 'diamantina', Part: GlossGlitter },
  { id: 'gloss-estrellita', kind: 'gloss', spokenName: 'estrellita', shapeTag: 'estrella', Part: GlossStar },
  { id: 'freckles-corazones', kind: 'freckles', spokenName: 'pecas de corazón', shapeTag: 'corazon', Part: FrecklesHearts },
  { id: 'freckles-estrellas', kind: 'freckles', spokenName: 'pecas de estrella', shapeTag: 'estrella', Part: FrecklesStars },
  { id: 'freckles-muchas', kind: 'freckles', spokenName: 'muchas pecas', Part: FrecklesMany },
  { id: 'sparkle-estrellas', kind: 'sparkle', spokenName: 'brillos de estrellas', shapeTag: 'estrella', Part: SparkleStars },
  { id: 'sparkle-corazones', kind: 'sparkle', spokenName: 'brillos de corazones', shapeTag: 'corazon', Part: SparkleHearts },
  { id: 'sparkle-arcoiris', kind: 'sparkle', spokenName: 'arcoíris', Part: SparkleRainbow },
];
