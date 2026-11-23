/**
 * pattern-next — "¿qué sigue?".
 * Una fila de 4 elementos que repite un patrón, y un hueco. Se toca la opción que sigue.
 * Nivel 1: AB con colores (2 opciones) · 2: AAB o ABB con figuras (3) ·
 * 3: ABC con frutas o animales (3) · 4: AB/AAB/ABB de tamaño grande/pequeño (2).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActivityRoundProps, ColorName, ShapeName } from '@/types';
import { ChoiceButton } from '../../kit/ChoiceButton';
import { ANIMALS, Animal, ColorBlob, FRUITS, Fruit, ShapeToken, type AnimalKind, type FruitKind } from '../../kit/art';
import { makeRng } from '../../kit/rng';
import './phrases';

/** Elementos visibles antes del hueco. */
export const SHOWN = 4;
const BASIC: ColorName[] = ['rojo', 'azul', 'amarillo', 'verde'];
const FIG_COLORS: ColorName[] = ['rojo', 'azul', 'amarillo', 'verde', 'naranja', 'morado', 'rosa'];
const SHAPES: ShapeName[] = ['circulo', 'cuadrado', 'triangulo', 'estrella', 'corazon'];

/** Un elemento de la fila. `id` identifica el símbolo (dos elementos iguales comparten id). */
export interface Sym {
  id: string;
  color?: ColorName;
  shape?: ShapeName;
  animal?: AnimalKind;
  fruit?: FruitKind;
  /** Solo nivel 4: grande (true) o pequeño (false). */
  big?: boolean;
}
export type PatternKind = 'color' | 'shape' | 'object' | 'size';
export interface PatternPlan {
  kind: PatternKind;
  /** Unidad del patrón con letras: 'AB', 'AAB', 'ABB' o 'ABC'. */
  unit: string;
  /** Elementos visibles seguidos de la respuesta (última posición). */
  visible: Sym[];
  answer: Sym;
  options: Sym[];
}

const colorSym = (color: ColorName): Sym => ({ id: `c-${color}`, color });
const shapeSym = (shape: ShapeName, color: ColorName): Sym => ({ id: `s-${shape}-${color}`, shape, color });
const animalSym = (animal: AnimalKind): Sym => ({ id: `a-${animal}`, animal });
const fruitSym = (fruit: FruitKind): Sym => ({ id: `f-${fruit}`, fruit });

/** Plan puro (determinista por semilla) de una ronda. */
export function planPattern(level: number, seed: number): PatternPlan {
  const rng = makeRng(seed);
  const lvl = Math.min(4, Math.max(1, Math.round(level)));
  let kind: PatternKind;
  let unit: string;
  let syms: Sym[];
  let extra: Sym[] = [];
  if (lvl === 1) {
    kind = 'color';
    unit = 'AB';
    syms = rng.sample(BASIC, 2).map(colorSym);
  } else if (lvl === 2) {
    kind = 'shape';
    unit = rng.pick(['AAB', 'ABB']);
    const shapes = rng.sample(SHAPES, 3);
    const colors = rng.sample(FIG_COLORS, 3);
    syms = [shapeSym(shapes[0], colors[0]), shapeSym(shapes[1], colors[1])];
    extra = [shapeSym(shapes[2], colors[2])];
  } else if (lvl === 3) {
    kind = 'object';
    unit = 'ABC';
    syms = rng.pick(['animales', 'frutas'] as const) === 'animales'
      ? rng.sample(ANIMALS, 3).map(animalSym)
      : rng.sample(FRUITS, 3).map(fruitSym);
  } else {
    kind = 'size';
    unit = rng.pick(['AB', 'AAB', 'ABB']);
    const shape = rng.pick(SHAPES);
    const color = rng.pick(FIG_COLORS);
    syms = [
      { id: `grande-${shape}-${color}`, shape, color, big: true },
      { id: `pequeno-${shape}-${color}`, shape, color, big: false },
    ];
  }

  const offset = rng.int(0, unit.length - 1);
  const cells = Array.from({ length: SHOWN + 1 }, (_, i) => syms[unit.charCodeAt((i + offset) % unit.length) - 65]);
  const answer = cells[SHOWN];
  const want = lvl === 2 || lvl === 3 ? 3 : 2;
  const others = rng.shuffle([...syms.filter((s) => s.id !== answer.id), ...extra]);
  const options = rng.shuffle([answer, ...others.slice(0, want - 1)]);
  return { kind, unit, visible: cells.slice(0, SHOWN), answer, options };
}

/** Dibujo de un elemento. `size` es el lado en px; los pequeños de nivel 4 son ~45 %. */
export function SymArt({ sym, size }: { sym: Sym; size: number }) {
  if (sym.animal) return <Animal kind={sym.animal} size={size} />;
  if (sym.fruit) return <Fruit kind={sym.fruit} size={size} />;
  if (sym.shape) return <ShapeToken shape={sym.shape} color={sym.color!} size={sym.big === false ? Math.round(size * 0.45) : size} />;
  return <ColorBlob color={sym.color!} size={size} />;
}

export function PatternNextRound({ level, seed, voice, sfx, onRoundDone, reportMistake }: ActivityRoundProps) {
  const plan = useMemo(() => planPattern(level, seed), [level, seed]);
  const [found, setFound] = useState(false);
  const mistakes = useRef(0);
  const t0 = useRef(Date.now());
  const cell = 96;
  const optSize = plan.options.length <= 2 ? 150 : 130;

  useEffect(() => { void voice.say('pn.instr'); }, [plan, voice]);

  useEffect(() => {
    if (!found) return;
    const id = setTimeout(() => onRoundDone({ mistakes: mistakes.current, ms: Date.now() - t0.current }), 650);
    return () => clearTimeout(id);
  }, [found, onRoundDone]);

  return (
    <div className="pn-round" data-testid="pattern-next-round" data-kind={plan.kind}>
      <div className="pn-row" data-testid="pn-row">
        {plan.visible.map((s, i) => (
          <div key={i} className="pn-cell" data-testid={`pn-cell-${i}`}>
            <SymArt sym={s} size={cell - 20} />
          </div>
        ))}
        <div className={`pn-cell pn-hole ${found ? 'filled' : ''}`} data-testid="pn-hole">
          {found && <SymArt sym={plan.answer} size={cell - 20} />}
        </div>
      </div>
      <div className="pn-options">
        {plan.options.map((o, i) => {
          const right = o.id === plan.answer.id;
          return (
            <ChoiceButton key={o.id} testId={`pn-option-${i}`} label="opción" size={optSize}
              isAnswer={right} done={found && right} disabled={found && !right}
              onPress={() => {
                if (found) return;
                if (right) { sfx.play('pop'); setFound(true); }
                else { mistakes.current += 1; reportMistake(); }
              }}>
              <SymArt sym={o} size={optSize - 30} />
            </ChoiceButton>
          );
        })}
      </div>
    </div>
  );
}
