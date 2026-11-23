/**
 * count-objects — "vamos a contar las estrellas".
 * Nivel 1: 1–3 objetos · 2: 1–5 · 3: 1–10. Cada toque cuenta en voz alta (prioridad feedback).
 * Tocar un objeto ya contado no hace nada. No hay errores en esta actividad.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActivityRoundProps, ColorName } from '@/types';
import { ChoiceButton } from '../../kit/ChoiceButton';
import { Flower, ShapeToken } from '../../kit/art';
import { makeRng } from '../../kit/rng';
import { numberWord } from '../../kit/words';
import './phrases';

export type CountKind = 'estrella' | 'corazon' | 'flor';
export const COUNT_KINDS: CountKind[] = ['estrella', 'corazon', 'flor'];
export const KIND_PLURAL: Record<CountKind, string> = { estrella: 'estrellas', corazon: 'corazones', flor: 'flores' };
const KIND_COLOR: Record<CountKind, ColorName> = { estrella: 'amarillo', corazon: 'rojo', flor: 'rosa' };
const MAX_BY_LEVEL = [3, 5, 10];

export interface CountObjectsPlan { kind: CountKind; count: number }

/** Plan puro (determinista por semilla): tipo de objeto y cantidad. */
export function planCountObjects(level: number, seed: number): CountObjectsPlan {
  const rng = makeRng(seed);
  const max = MAX_BY_LEVEL[Math.min(MAX_BY_LEVEL.length, Math.max(1, level)) - 1];
  return { kind: rng.pick(COUNT_KINDS), count: rng.int(1, max) };
}

/** Palabra de conteo para la voz: "uno", "dos", … */
export const countWord = (k: number) => (k === 1 ? 'uno' : numberWord(k, 'm'));

export function CountItem({ kind, size }: { kind: CountKind; size: number }) {
  if (kind === 'flor') return <Flower color={KIND_COLOR[kind]} size={size} />;
  return <ShapeToken shape={kind} color={KIND_COLOR[kind]} size={size} />;
}

export function CountObjectsRound({ level, seed, voice, sfx, onRoundDone }: ActivityRoundProps) {
  const plan = useMemo(() => planCountObjects(level, seed), [level, seed]);
  const seen = useRef(new Set<number>());
  const [counted, setCounted] = useState<number[]>([]);
  const t0 = useRef(Date.now());
  const all = counted.length === plan.count;

  useEffect(() => { void voice.say('co.intro', { things: KIND_PLURAL[plan.kind] }); }, [plan, voice]);

  useEffect(() => {
    if (!all) return;
    const id = setTimeout(() => onRoundDone({ mistakes: 0, ms: Date.now() - t0.current }), 650);
    return () => clearTimeout(id);
  }, [all, onRoundDone]);

  const tap = (i: number) => {
    if (seen.current.has(i)) return;
    seen.current.add(i);
    sfx.play('tap');
    void voice.say('co.num', { n: countWord(seen.current.size) }, { priority: 'feedback' });
    setCounted((c) => [...c, i]);
  };

  const size = plan.count <= 3 ? 170 : plan.count <= 5 ? 150 : 124;
  return (
    <div className="co-round" data-testid="count-objects-round">
      {Array.from({ length: plan.count }, (_, i) => (
        <ChoiceButton key={i} testId={`co-obj-${i}`} label="objeto" size={size}
          done={counted.includes(i)} onPress={() => tap(i)}>
          <CountItem kind={plan.kind} size={Math.round(size * 0.8)} />
        </ChoiceButton>
      ))}
    </div>
  );
}
