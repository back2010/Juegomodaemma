/** Vehículos sencillos (coche y avión) en el estilo del kit: degradado, contorno y brillo. Sin texto. */
import type { ColorName } from '@/types';
import { makePalette, outline, paletteOf, RadGrad, useIdp } from '@/art/kit';

export type VehicleKind = 'coche' | 'avion';
export const VEHICLES: VehicleKind[] = ['coche', 'avion'];

const GLASS = makePalette('#bfe8ff');
const INK = '#3b2147';

function Wheel({ cx }: { cx: number }) {
  return (
    <g>
      <circle cx={cx} cy={76} r={9} fill={INK} />
      <circle cx={cx} cy={76} r={3.5} fill="#fff" opacity={0.8} />
    </g>
  );
}

export function Vehicle({ kind, color, size }: { kind: VehicleKind; color: ColorName; size?: number | string }) {
  const idp = useIdp('veh');
  const p = paletteOf(color);
  const body = `url(#${idp('g')})`;
  const glass = `url(#${idp('w')})`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="lk-art" aria-hidden="true">
      <defs>
        <RadGrad id={idp('g')} p={p} />
        <RadGrad id={idp('w')} p={GLASS} />
      </defs>
      {kind === 'coche' ? (
        <>
          <path d="M6 66Q6 54 18 52L34 34Q38 30 48 30H64Q70 30 74 36L86 52Q94 54 94 64V72Q94 76 90 76H10Q6 76 6 72Z"
            fill={body} stroke={outline(p)} strokeWidth={3} strokeLinejoin="round" />
          <path d="M38 52L44 38H54V52Z" fill={glass} stroke={outline(GLASS)} strokeWidth={2} strokeLinejoin="round" />
          <path d="M58 52V38H64L76 52Z" fill={glass} stroke={outline(GLASS)} strokeWidth={2} strokeLinejoin="round" />
          <Wheel cx={26} />
          <Wheel cx={74} />
        </>
      ) : (
        <>
          <path d="M14 46L8 26H18L30 46Z" fill={body} stroke={outline(p)} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M44 44L30 18H42L64 44Z" fill={body} stroke={outline(p)} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M44 56L30 82H42L64 56Z" fill={body} stroke={outline(p)} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M10 52Q10 44 20 44H76Q90 44 92 52Q90 60 76 60H20Q10 60 10 52Z"
            fill={body} stroke={outline(p)} strokeWidth={3} strokeLinejoin="round" />
          <circle cx={72} cy={52} r={4} fill={glass} stroke={outline(GLASS)} strokeWidth={1.5} />
          <circle cx={58} cy={52} r={3} fill={glass} stroke={outline(GLASS)} strokeWidth={1.5} />
        </>
      )}
    </svg>
  );
}
