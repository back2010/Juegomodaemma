/** Celebración animada (estrellas y confeti). Solo visual; el sonido lo pone quien la muestra. */
import { useMemo } from 'react';
import { GemShape, makePalette, BRAND, useIdp } from '@/art/kit';
import type { ShapeName } from '@/types';

const COLORS = Object.values(BRAND);
const SHAPES: ShapeName[] = ['estrella', 'corazon', 'circulo', 'estrella'];

export function Confetti({ count = 18, seed = 1 }: { count?: number; seed?: number }) {
  const idp = useIdp('cf');
  const bits = useMemo(() => Array.from({ length: count }, (_, i) => {
    const k = (i * 9301 + seed * 49297) % 233280;
    return { left: (k / 233280) * 100, delay: (i % 6) * 0.08, dur: 1 + ((i * 7) % 5) / 10, rot: (i * 47) % 360,
      color: COLORS[i % COLORS.length], shape: SHAPES[i % SHAPES.length] };
  }), [count, seed]);
  return (
    <div className="lk-confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <svg key={i} viewBox="0 0 40 40" style={{ left: `${b.left}%`, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s`, rotate: `${b.rot}deg` }}>
          <GemShape shape={b.shape} cx={20} cy={20} r={15} p={makePalette(b.color)} gid={idp(`c${i}`)} />
        </svg>
      ))}
    </div>
  );
}

/** Estrella grande que salta + confeti. `big` para el final de la sesión. */
export function Celebration({ big = false, seed = 1 }: { big?: boolean; seed?: number }) {
  const idp = useIdp('cel');
  return (
    <div className={`lk-celebration ${big ? 'big' : ''}`} data-testid={big ? 'session-finale' : 'round-celebration'} aria-hidden="true">
      <Confetti count={big ? 32 : 16} seed={seed} />
      <svg className="lk-cel-star" viewBox="0 0 200 200">
        <GemShape shape="estrella" cx={100} cy={104} r={86} p={makePalette(BRAND.amarillo)} gid={idp('s')} />
        <circle cx={80} cy={100} r={8} fill="#3b2147" />
        <circle cx={120} cy={100} r={8} fill="#3b2147" />
        <path d="M80 122q20 18 40 0" fill="none" stroke="#3b2147" strokeWidth={6} strokeLinecap="round" />
        <ellipse cx={66} cy={118} rx={10} ry={6} fill="#ff8ac6" opacity={0.7} />
        <ellipse cx={134} cy={118} rx={10} ry={6} fill="#ff8ac6" opacity={0.7} />
      </svg>
      {big && [0, 1, 2, 3, 4].map((i) => (
        <svg key={i} className="lk-cel-orbit" viewBox="0 0 60 60" style={{ animationDelay: `${i * 0.15}s`, ['--a' as string]: `${i * 72}deg` }}>
          <GemShape shape={i % 2 ? 'corazon' : 'estrella'} cx={30} cy={30} r={24} p={makePalette(COLORS[i % COLORS.length])} gid={idp(`o${i}`)} />
        </svg>
      ))}
    </div>
  );
}
