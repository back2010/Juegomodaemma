/**
 * shape-find — "¿Dónde está el círculo?".
 * Nivel 1: 2 opciones · 2: 3 · 3: 5 (colores distintos: lo que importa es la figura).
 * Nivel 4: escena 2x3 con 5-6 figuras dispersas; hay que tocar TODAS las de la figura pedida (2 o 3).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActivityRoundProps, ColorName, ShapeName } from '@/types';
import { SHAPE_NAMES } from '@/types';
import { ChoiceButton } from '../../kit/ChoiceButton';
import { ShapeToken } from '../../kit/art';
import { makeRng } from '../../kit/rng';
import { SHAPE_NOUN, article, shapePlural } from '../../kit/words';
import './phrases';

const BASIC: ColorName[] = ['rojo', 'azul', 'amarillo', 'verde'];
const MORE: ColorName[] = [...BASIC, 'naranja', 'morado', 'rosa'];
/** Sin blanco: no se vería sobre la tarjeta. */
const VISIBLE: ColorName[] = [...MORE, 'cafe', 'negro'];

export interface ShapeOption { shape: ShapeName; color: ColorName; answer: boolean; x?: number; y?: number }
export interface ShapeFindPlan { target: ShapeName; options: ShapeOption[]; scene: boolean }

/** Plan puro (determinista por semilla) de una ronda. */
export function planShapeFind(level: number, seed: number): ShapeFindPlan {
  const rng = makeRng(seed);
  const target = rng.pick(SHAPE_NAMES);
  const others = SHAPE_NAMES.filter((s) => s !== target);

  if (level >= 4) {
    const count = rng.int(2, 3);
    const total = rng.int(5, 6);
    // Escena 2 columnas x 3 filas: cada figura ocupa una celda distinta, con un poco de desorden.
    const cells = rng.sample([0, 1, 2, 3, 4, 5], total);
    const objects: ShapeOption[] = rng.shuffle([
      ...Array.from({ length: count }, () => ({ shape: target, color: rng.pick(MORE), answer: true })),
      ...Array.from({ length: total - count }, () => ({ shape: rng.pick(others), color: rng.pick(MORE), answer: false })),
    ]);
    const options = objects.map((o, i) => {
      const cell = cells[i];
      const jitter = () => Math.round((rng.next() * 10 - 5) * 10) / 10;
      return {
        ...o,
        x: Math.round(((cell % 2) * 50 + 25 + jitter()) * 10) / 10,
        y: Math.round((Math.floor(cell / 2) * (100 / 3) + 100 / 6 + jitter()) * 10) / 10,
      };
    });
    return { target, options, scene: true };
  }

  const n = level <= 1 ? 2 : level === 2 ? 3 : 5;
  const pool = level <= 1 ? BASIC : level === 2 ? MORE : VISIBLE;
  const shapes = [target, ...rng.sample(others, n - 1)];
  const colors = rng.sample(pool, n);
  const options = rng.shuffle(shapes.map((shape, i) => ({ shape, color: colors[i], answer: i === 0 })));
  return { target, options, scene: false };
}

/** "el círculo", "la estrella" (singular) o "los círculos", "las estrellas" (plural). */
export function shapeThing(s: ShapeName, plural: boolean): string {
  const n = SHAPE_NOUN[s];
  return plural ? `${article({ ...n, pl: true }, true)} ${shapePlural(s)}` : `${article(n, true)} ${n.w}`;
}

export function ShapeFindRound({ level, seed, voice, sfx, onRoundDone, reportMistake }: ActivityRoundProps) {
  const plan = useMemo(() => planShapeFind(level, seed), [level, seed]);
  const [found, setFound] = useState<Set<number>>(() => new Set());
  const mistakes = useRef(0);
  const t0 = useRef(Date.now());
  const need = plan.options.filter((o) => o.answer).length;
  const complete = found.size >= need;

  useEffect(() => {
    if (plan.scene) void voice.say('sf.all', { thing: shapeThing(plan.target, true) });
    else void voice.say('sf.find', { thing: shapeThing(plan.target, false) });
  }, [plan, voice]);

  useEffect(() => {
    if (!complete) return;
    const id = setTimeout(() => onRoundDone({ mistakes: mistakes.current, ms: Date.now() - t0.current }), 650);
    return () => clearTimeout(id);
  }, [complete, onRoundDone]);

  const tap = (i: number) => {
    if (complete || found.has(i)) return;
    if (!plan.options[i].answer) { mistakes.current += 1; reportMistake(); return; }
    sfx.play('pop');
    setFound((f) => new Set([...f, i]));
  };

  const size = plan.scene ? 120 : plan.options.length <= 3 ? 190 : 150;
  return (
    <div className={`sf-round ${plan.scene ? 'sf-scene' : ''}`} data-testid="shape-find-round">
      {plan.options.map((o, i) => (
        <ChoiceButton key={i} testId={`sf-option-${i}`} label={SHAPE_NOUN[o.shape].w} size={size}
          isAnswer={o.answer} done={found.has(i)} disabled={complete && !found.has(i)}
          style={plan.scene ? { position: 'absolute', left: `${o.x}%`, top: `${o.y}%`, transform: 'translate(-50%, -50%)' } : undefined}
          onPress={() => tap(i)}>
          <ShapeToken shape={o.shape} color={o.color} />
        </ChoiceButton>
      ))}
    </div>
  );
}
