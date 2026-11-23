/**
 * shape-shadow — emparejar una figura con su silueta gris.
 * Nivel 1: 2 opciones · 2: 3 · 3: 4 con figuras parecidas (círculo/óvalo, cuadrado/rectángulo).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActivityRoundProps, ColorName, ShapeName } from '@/types';
import { SHAPE_NAMES } from '@/types';
import { shapePath } from '@/art/kit';
import { ChoiceButton } from '../../kit/ChoiceButton';
import { ShapeToken } from '../../kit/art';
import { makeRng } from '../../kit/rng';
import { SHAPE_NOUN } from '../../kit/words';
import './phrases';

const BASIC: ColorName[] = ['rojo', 'azul', 'amarillo', 'verde'];
const MORE: ColorName[] = [...BASIC, 'naranja', 'morado', 'rosa'];
/** Sin blanco: no se vería sobre la tarjeta. */
const VISIBLE: ColorName[] = [...MORE, 'cafe', 'negro'];

/** Pares de figuras que se confunden fácilmente. */
export const LOOK_ALIKE: Partial<Record<ShapeName, ShapeName>> = {
  circulo: 'ovalo', ovalo: 'circulo', cuadrado: 'rectangulo', rectangulo: 'cuadrado',
};
const PAIR_SHAPES = Object.keys(LOOK_ALIKE) as ShapeName[];

export interface ShadowOption { shape: ShapeName; color: ColorName; answer: boolean }
export interface ShapeShadowPlan { target: ShapeName; options: ShadowOption[] }

/** Plan puro (determinista por semilla) de una ronda. */
export function planShapeShadow(level: number, seed: number): ShapeShadowPlan {
  const rng = makeRng(seed);
  const n = level <= 1 ? 2 : level === 2 ? 3 : 4;
  const pool = level <= 1 ? BASIC : level === 2 ? MORE : VISIBLE;
  let target: ShapeName;
  let shapes: ShapeName[];
  if (level >= 3) {
    target = rng.pick(PAIR_SHAPES);
    const twin = LOOK_ALIKE[target]!;
    shapes = [target, twin, ...rng.sample(SHAPE_NAMES.filter((s) => s !== target && s !== twin), n - 2)];
  } else {
    target = rng.pick(SHAPE_NAMES);
    shapes = [target, ...rng.sample(SHAPE_NAMES.filter((s) => s !== target), n - 1)];
  }
  const colors = rng.sample(pool, n);
  const options = rng.shuffle(shapes.map((shape, i) => ({ shape, color: colors[i], answer: shape === target })));
  return { target, options };
}

/** Silueta gris plana con la misma geometría que ShapeToken. */
export function Silhouette({ shape, size, className }: { shape: ShapeName; size?: number | string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`lk-art ${className ?? ''}`} aria-hidden="true">
      <path d={shapePath(shape, 50, 52, 40)} fill="#9a95a6" stroke="#6f6a7d" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

export function ShapeShadowRound({ level, seed, voice, sfx, onRoundDone, reportMistake }: ActivityRoundProps) {
  const plan = useMemo(() => planShapeShadow(level, seed), [level, seed]);
  const [found, setFound] = useState(false);
  const mistakes = useRef(0);
  const t0 = useRef(Date.now());

  useEffect(() => { void voice.say('ss.match'); }, [voice]);

  useEffect(() => {
    if (!found) return;
    const id = setTimeout(() => onRoundDone({ mistakes: mistakes.current, ms: Date.now() - t0.current }), 650);
    return () => clearTimeout(id);
  }, [found, onRoundDone]);

  const size = plan.options.length <= 3 ? 190 : 150;
  return (
    <div className="ss-round" data-testid="shape-shadow-round">
      <div className="ss-card" data-testid="shape-shadow-silhouette">
        <Silhouette shape={plan.target} className="ss-silhouette" />
      </div>
      <div className="ss-options">
        {plan.options.map((o, i) => (
          <ChoiceButton key={`${o.shape}-${i}`} testId={`ss-option-${i}`} label={SHAPE_NOUN[o.shape].w} size={size}
            isAnswer={o.answer} done={found && o.answer} disabled={found && !o.answer}
            onPress={() => {
              if (found) return;
              if (o.answer) { sfx.play('pop'); setFound(true); }
              else { mistakes.current += 1; reportMistake(); }
            }}>
            <ShapeToken shape={o.shape} color={o.color} />
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
}
