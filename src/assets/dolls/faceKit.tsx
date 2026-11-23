/**
 * Rostros personalizados de las muñecas (P1). Basado en makeFace del kit, con rasgos propios:
 * pestañas base, nariz, boca, lunar y pecas naturales. No edita el kit.
 */
import type { DollBase, PartProps, Pt } from '@/types';
import { eyePath, shift, SoftBlur } from '@/art/kit';

type EyeShape = DollBase['eyes']['shape'];

export interface FaceOpts {
  eye: EyeShape;
  /** Pestañas base visibles (0 = solo delineado del kit). */
  lashes?: 0 | 1 | 2 | 3;
  /** Pestañas inferiores suaves. */
  lowerLashes?: boolean;
  nose?: 'curve' | 'button' | 'soft';
  mouth?: 'classic' | 'full' | 'smile' | 'petite';
  /** Lunar en coordenadas absolutas del viewBox. */
  mole?: Pt;
  /** Pecas naturales sobre nariz y mejillas. */
  freckles?: string;
  /** Color del párpado/delineado base. */
  lid?: string;
}

function lidPath(shape: EyeShape): string {
  switch (shape) {
    case 'round': return 'M-36 -2C-32 -30 -12 -42 2 -42C24 -42 38 -26 38 -2';
    case 'upturned': return 'M-44 -12C-28 -40 26 -40 40 -2';
    default: return 'M-43 2C-28 -34 28 -38 42 -6';
  }
}

/** Pestañas base: salen del extremo exterior (izquierda en coords locales). */
const LASHES: Record<EyeShape, [number, number, number][]> = {
  almond: [[-42, 2, -170], [-38, -8, -155], [-30, -19, -140]],
  round: [[-36, -4, -170], [-33, -16, -155], [-26, -28, -138]],
  upturned: [[-44, -12, -165], [-39, -21, -150], [-31, -29, -135]],
};

const MOUTHS = {
  classic: ['M-24 0Q-12 -11 0 -4Q12 -11 24 0Q0 5 -24 0Z', 'M-24 0Q0 5 24 0Q14 19 0 20Q-14 19 -24 0Z'],
  full: ['M-26 0Q-14 -14 0 -6Q14 -14 26 0Q0 6 -26 0Z', 'M-26 0Q0 6 26 0Q16 24 0 25Q-16 24 -26 0Z'],
  smile: ['M-26 -3Q-12 -12 0 -6Q12 -12 26 -3Q0 6 -26 -3Z', 'M-26 -3Q0 6 26 -3Q16 18 0 19Q-16 18 -26 -3Z'],
  petite: ['M-19 0Q-9 -10 0 -4Q9 -10 19 0Q0 4 -19 0Z', 'M-19 0Q0 4 19 0Q11 16 0 17Q-11 16 -19 0Z'],
} as const;

export function makeCustomFace(o: FaceOpts) {
  const shape = o.eye;
  const nLash = o.lashes ?? 1;
  const lid = o.lid ?? '#2a1a26';
  return function CustomFace({ doll, idp }: PartProps) {
    const ir = doll.eyes.iris;
    const sk = doll.skin;
    const { eyeL, eyeR, nose, mouth, cheekL, cheekR } = doll.anchors;
    const lipLine = shift(sk.lip, -0.2);
    const eye = (a: Pt, mirror: boolean) => (
      <g transform={`translate(${a.x} ${a.y})${mirror ? ' scale(-1 1)' : ''}`}>
        <path d={eyePath(shape)} fill="#fff" stroke="#3a2533" strokeWidth={2} strokeLinejoin="round" />
        <g clipPath={`url(#${idp('eyeclip')})`}>
          <circle cx={3} cy={2} r={27} fill={`url(#${idp('iris')})`} stroke={ir.shade} strokeWidth={3} />
          <circle cx={3} cy={2} r={19} fill="none" stroke={ir.light} strokeWidth={1.5} opacity={0.5} strokeDasharray="3 4" />
          <circle cx={3} cy={4} r={13} fill="#1d1420" />
          <path d="M-16 18a22 22 0 0 0 36 0" stroke={ir.light} strokeWidth={4} fill="none" opacity={0.7} />
          <circle cx={-7} cy={-8} r={8} fill="#fff" />
          <circle cx={12} cy={12} r={3.5} fill="#fff" opacity={0.9} />
          <path d={eyePath(shape)} fill="none" stroke="#c9b3c9" strokeWidth={8} opacity={0.35} transform="translate(0 -6)" />
        </g>
        <path d={lidPath(shape)} stroke={lid} strokeWidth={5.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {LASHES[shape].slice(0, Math.max(1, nLash)).map(([x, y, ang], i) => {
          const r = (ang * Math.PI) / 180, L = 11 + i * 2 + (nLash > 1 ? 3 : 0);
          return <path key={i} d={`M${x} ${y}l${(Math.cos(r) * L).toFixed(1)} ${(Math.sin(r) * L).toFixed(1)}`}
            stroke={lid} strokeWidth={4 - i * 0.4} strokeLinecap="round" />;
        })}
        {o.lowerLashes && (
          <path d="M-22 30l-3 6M-8 34l-1 6M8 34l1 6" stroke={lid} strokeWidth={2} strokeLinecap="round" opacity={0.55} />
        )}
      </g>
    );
    const noseD = o.nose === 'button'
      ? `M${nose.x - 8} ${nose.y + 1}Q${nose.x - 9} ${nose.y + 9} ${nose.x - 2} ${nose.y + 8}M${nose.x + 8} ${nose.y + 1}Q${nose.x + 9} ${nose.y + 9} ${nose.x + 2} ${nose.y + 8}`
      : o.nose === 'soft'
        ? `M${nose.x - 4} ${nose.y - 10}Q${nose.x - 7} ${nose.y + 2} ${nose.x} ${nose.y + 6}`
        : `M${nose.x - 7} ${nose.y + 2}Q${nose.x} ${nose.y + 9} ${nose.x + 7} ${nose.y + 2}`;
    const [top, bottom] = MOUTHS[o.mouth ?? 'classic'];
    const freckles: [number, number, number][] = [
      [-30, -8, 2.6], [-14, -2, 2.2], [-22, 8, 2.4], [-2, -10, 2], [-36, 4, 2], [-8, 10, 1.8],
    ];
    return (
      <g data-part="face">
        <defs>
          <radialGradient id={idp('iris')} cx="0.5" cy="0.35" r="0.65">
            <stop offset="0" stopColor={ir.light} /><stop offset="0.55" stopColor={ir.main} /><stop offset="1" stopColor={ir.shade} />
          </radialGradient>
          <clipPath id={idp('eyeclip')} clipPathUnits="userSpaceOnUse"><path d={eyePath(shape)} /></clipPath>
          <linearGradient id={idp('lip')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={shift(sk.lip, 0.1)} /><stop offset="0.5" stopColor={sk.lip} /><stop offset="1" stopColor={shift(sk.lip, -0.12)} />
          </linearGradient>
          <radialGradient id={idp('mole')} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor={shift(sk.shade, 0.05)} /><stop offset="0.6" stopColor={shift(sk.shade, -0.1)} /><stop offset="1" stopColor={shift(sk.shade, -0.2)} />
          </radialGradient>
          <SoftBlur id={idp('frk')} s={0.6} />
        </defs>
        {o.freckles && (
          <g fill={o.freckles} opacity={0.7} filter={`url(#${idp('frk')})`}>
            {freckles.map(([x, y, r], i) => (
              <g key={i}>
                <circle cx={cheekL.x + 18 + x} cy={cheekL.y - 12 + y} r={r} />
                <circle cx={cheekR.x - 18 - x} cy={cheekR.y - 12 + y} r={r} />
              </g>
            ))}
            <circle cx={nose.x - 6} cy={nose.y - 10} r={1.8} />
            <circle cx={nose.x + 5} cy={nose.y - 13} r={1.6} />
          </g>
        )}
        {eye(eyeL, false)}
        {eye(eyeR, true)}
        <path d={noseD} stroke={sk.shade} strokeWidth={3} fill="none" strokeLinecap="round" />
        <g transform={`translate(${mouth.x} ${mouth.y})`}>
          <path d={top} fill={`url(#${idp('lip')})`} stroke={lipLine} strokeWidth={1.8} strokeLinejoin="round" />
          <path d={bottom} fill={`url(#${idp('lip')})`} stroke={lipLine} strokeWidth={1.8} strokeLinejoin="round" />
          {o.mouth === 'smile' && (
            <path d="M-29 -6q3 2 3 4M29 -6q-3 2 -3 4" stroke={sk.shade} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7} />
          )}
          <ellipse cx={-6} cy={9} rx={7} ry={3} fill="#fff" opacity={0.45} />
        </g>
        {o.mole && (
          <g>
            <circle cx={o.mole.x} cy={o.mole.y} r={4} fill={`url(#${idp('mole')})`} />
            <circle cx={o.mole.x - 1.2} cy={o.mole.y - 1.2} r={1.1} fill="#fff" opacity={0.35} />
          </g>
        )}
      </g>
    );
  };
}
