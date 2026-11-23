/**
 * memory-pairs — memoria de parejas.
 * Nivel 1: 2 parejas · 2: 3 · 3: 4 · 4: 6. Temas: animales, frutas, vestidos, flores.
 * Solo cuenta como error volver a fallar una pareja cuya carta ya había visto (no la exploración).
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ActivityRoundProps, ColorName } from '@/types';
import { ChoiceButton } from '../../kit/ChoiceButton';
import { ANIMALS, Animal, CardBack, FRUITS, Flower, Fruit, Garment } from '../../kit/art';
import { makeRng } from '../../kit/rng';
import './phrases';

export const PAIRS_BY_LEVEL = [2, 3, 4, 6];
const COLORS6: ColorName[] = ['rojo', 'azul', 'amarillo', 'verde', 'morado', 'rosa'];
type Theme = 'animales' | 'frutas' | 'vestidos' | 'flores';
const THEMES: Theme[] = ['animales', 'frutas', 'vestidos', 'flores'];

function face(theme: Theme, k: number): ReactNode {
  switch (theme) {
    case 'animales': return <Animal kind={ANIMALS[k]} />;
    case 'frutas': return <Fruit kind={FRUITS[k]} />;
    case 'vestidos': return <Garment slot="dress" color={COLORS6[k]} />;
    case 'flores': return <Flower color={COLORS6[k]} />;
  }
}

export interface MemoryPlan { theme: Theme; cards: number[] }
export function planMemory(level: number, seed: number): MemoryPlan {
  const rng = makeRng(seed);
  const pairs = PAIRS_BY_LEVEL[Math.min(PAIRS_BY_LEVEL.length, Math.max(1, level)) - 1];
  const keys = rng.sample([0, 1, 2, 3, 4, 5], pairs);
  return { theme: rng.pick(THEMES), cards: rng.shuffle([...keys, ...keys]) };
}

export function MemoryRound({ level, seed, voice, sfx, onRoundDone, reportMistake }: ActivityRoundProps) {
  const plan = useMemo(() => planMemory(level, seed), [level, seed]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(() => new Set());
  const [hintIdx, setHintIdx] = useState<number | null>(null);
  const seen = useRef(new Set<number>());
  const mistakes = useRef(0);
  const t0 = useRef(Date.now());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => { void voice.say('mp.find'); }, [voice]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const allDone = matched.size === plan.cards.length;
  useEffect(() => {
    if (!allDone) return;
    const id = setTimeout(() => onRoundDone({ mistakes: mistakes.current, ms: Date.now() - t0.current }), 700);
    return () => clearTimeout(id);
  }, [allDone, onRoundDone]);

  const partnerOf = (i: number) => plan.cards.findIndex((k, j) => j !== i && k === plan.cards[i]);

  const tap = (i: number) => {
    if (matched.has(i) || open.includes(i) || open.length >= 2) return;
    sfx.play('tap');
    if (open.length === 0) { setOpen([i]); return; }
    const a = open[0];
    setOpen([a, i]);
    if (plan.cards[a] === plan.cards[i]) {
      sfx.play('chime');
      timers.current.push(setTimeout(() => {
        setMatched((m) => new Set([...m, a, i]));
        setOpen([]);
        setHintIdx(null);
      }, 450));
    } else {
      const p = partnerOf(a);
      if (seen.current.has(p)) {
        mistakes.current += 1;
        setHintIdx(p);
        reportMistake();
      }
      timers.current.push(setTimeout(() => setOpen([]), 1000));
    }
    seen.current.add(a); seen.current.add(i);
  };

  const n = plan.cards.length;
  const size = n <= 4 ? 180 : n <= 6 ? 165 : n <= 8 ? 145 : 125;
  const cols = n <= 4 ? 2 : n <= 6 ? 3 : 4;
  return (
    <div className="mp-round" data-testid="memory-round" data-theme={plan.theme}
      style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)` }}>
      {plan.cards.map((k, i) => {
        const up = open.includes(i) || matched.has(i);
        return (
          <ChoiceButton key={i} testId={`mp-card-${i}`} label="carta" size={size}
            isAnswer={hintIdx === i} done={matched.has(i)} onPress={() => tap(i)}>
            <div className={`mp-card ${up ? 'up' : ''}`} data-key={k} data-up={up ? 'yes' : 'no'}>
              {up ? face(plan.theme, k) : <CardBack />}
            </div>
          </ChoiceButton>
        );
      })}
    </div>
  );
}
