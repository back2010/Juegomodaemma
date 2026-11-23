/** Dibujo del reto (sin texto): prenda coloreada, figura, cantidad o stickers en el cabello. */
import type { ShapeName } from '@/types';
import { BRAND, GemShape, makePalette, useIdp } from '@/art/kit';
import { Garment, ShapeToken } from '@/learning/kit/art';
import type { Challenge } from './engine';

const SHAPE_TINT = makePalette(BRAND.fucsia);
const BADGE_TINT = makePalette(BRAND.amarillo);

function HairWithShapes({ shape, n }: { shape: ShapeName; n: number }) {
  const idp = useIdp('chh');
  const hair = makePalette('#8a5a33');
  const spots = [[28, 30], [50, 18], [72, 30], [36, 46], [64, 46]];
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M12 80C6 40 24 10 50 10s44 30 38 70q-8 10-14 0-2-30-24-38-22 8-24 38-6 10-14 0z" fill={hair.main}
        stroke={hair.shade} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={50} cy={64} r={20} fill="#f6c9a4" stroke="#c98656" strokeWidth={2.5} />
      {spots.slice(0, n).map(([x, y], i) => (
        <GemShape key={i} shape={shape} cx={x} cy={y} r={11} p={makePalette(BRAND.amarillo)} gid={idp(`s${i}`)} />
      ))}
    </svg>
  );
}

export function ChallengeIcon({ c }: { c: Challenge }) {
  switch (c.type) {
    case 'itemColor':
      return <Garment slot={c.slot} color={c.color} />;
    case 'itemShape':
      return (
        <div className="ch-combo">
          <Garment slot={c.slot} color={SHAPE_TINT} />
          <span className="ch-badge"><ShapeToken shape={c.shape} color={BADGE_TINT} /></span>
        </div>
      );
    case 'accShape':
      return <ShapeToken shape={c.shape} color={SHAPE_TINT} />;
    case 'itemCount':
      return (
        <div className="ch-row">
          {Array.from({ length: c.n }, (_, i) => <Garment key={i} slot={c.slot} color={i % 2 ? 'morado' : 'rosa'} />)}
        </div>
      );
    case 'sticker':
      return <HairWithShapes shape={c.shape} n={c.n} />;
  }
}
