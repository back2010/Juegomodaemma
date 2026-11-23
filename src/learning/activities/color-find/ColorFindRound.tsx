/**
 * color-find — "toca el color pedido".
 * Nivel 1: 2 opciones · Nivel 2: 3 · Nivel 3: 5 · Nivel 4: combinar color + figura ("la estrella roja").
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActivityRoundProps, ColorName, ShapeName } from '@/types';
import { ChoiceButton } from '../../kit/ChoiceButton';
import { ColorBlob, Flower, ShapeToken } from '../../kit/art';
import { makeRng } from '../../kit/rng';
import { SHAPE_NOUN, colorName, nounWithColor } from '../../kit/words';
import './phrases';

const BASIC: ColorName[] = ['rojo', 'azul', 'amarillo', 'verde'];
const MORE: ColorName[] = [...BASIC, 'naranja', 'morado', 'rosa'];
const ALL: ColorName[] = [...MORE, 'cafe', 'negro'];
const STYLES = ['blob', 'flower', 'circulo', 'corazon', 'estrella'] as const;
const COMBO_SHAPES: ShapeName[] = ['circulo', 'cuadrado', 'triangulo', 'estrella', 'corazon'];

export interface ColorOption { color: ColorName; shape?: ShapeName; answer: boolean }
export interface ColorFindPlan { style: (typeof STYLES)[number] | 'combo'; options: ColorOption[]; target: ColorOption }

/** Plan puro (determinista por semilla) de una ronda. */
export function planColorFind(level: number, seed: number): ColorFindPlan {
  const rng = makeRng(seed);
  if (level >= 4) {
    const [c1, c2, c3] = rng.sample(MORE, 3);
    const [s1, s2, s3] = rng.sample(COMBO_SHAPES, 3);
    const target = { color: c1, shape: s1, answer: true };
    // Distractores: mismo color/otra figura, misma figura/otro color, y otros.
    const options = rng.shuffle<ColorOption>([
      target,
      { color: c1, shape: s2, answer: false },
      { color: c2, shape: s1, answer: false },
      { color: c3, shape: s3, answer: false },
      { color: c2, shape: s2 === s1 ? s3 : s2, answer: false },
    ]);
    return { style: 'combo', options, target };
  }
  const n = level <= 1 ? 2 : level === 2 ? 3 : 5;
  const pool = level <= 1 ? BASIC : level === 2 ? MORE : ALL;
  const colors = rng.sample(pool, n);
  const options = colors.map((color, i) => ({ color, answer: i === 0 }));
  return { style: rng.pick(STYLES), options: rng.shuffle(options), target: options[0] };
}

function OptionArt({ o, style }: { o: ColorOption; style: ColorFindPlan['style'] }) {
  if (style === 'combo') return <ShapeToken shape={o.shape!} color={o.color} />;
  if (style === 'blob') return <ColorBlob color={o.color} />;
  if (style === 'flower') return <Flower color={o.color} />;
  return <ShapeToken shape={style} color={o.color} />;
}

export function ColorFindRound({ level, seed, voice, sfx, onRoundDone, reportMistake }: ActivityRoundProps) {
  const plan = useMemo(() => planColorFind(level, seed), [level, seed]);
  const [found, setFound] = useState(false);
  const mistakes = useRef(0);
  const t0 = useRef(Date.now());

  useEffect(() => {
    const t = plan.target;
    if (plan.style === 'combo') void voice.say('cf.combo', { thing: nounWithColor(SHAPE_NOUN[t.shape!], t.color) });
    else void voice.say('cf.find', { color: colorName(t.color) });
  }, [plan, voice]);

  useEffect(() => {
    if (!found) return;
    const id = setTimeout(() => onRoundDone({ mistakes: mistakes.current, ms: Date.now() - t0.current }), 650);
    return () => clearTimeout(id);
  }, [found, onRoundDone]);

  const size = plan.options.length <= 3 ? 190 : 150;
  return (
    <div className="cf-round" data-testid="color-find-round">
      {plan.options.map((o, i) => (
        <ChoiceButton key={`${o.color}-${o.shape ?? ''}-${i}`} testId={`cf-option-${i}`} label={o.color} size={size}
          isAnswer={o.answer} done={found && o.answer} disabled={found && !o.answer}
          onPress={() => {
            if (found) return;
            if (o.answer) { sfx.play('pop'); setFound(true); }
            else { mistakes.current += 1; reportMistake(); }
          }}>
          <OptionArt o={o} style={plan.style} />
        </ChoiceButton>
      ))}
    </div>
  );
}
