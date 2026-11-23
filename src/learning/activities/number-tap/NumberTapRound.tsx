/**
 * number-tap — asociar una cantidad con su representación visual.
 * Niveles 1–3: "Toca el grupo que tiene tres corazones" (cantidades 1–3 / 1–5 / 1–10; 2 / 3 / 3 grupos).
 * Nivel 4: "Pon cuatro estrellas en el vestido": arrastrar objetos al vestido hasta tener exactamente N.
 * Pasarse no es error: se quita tocando un objeto del vestido. Solo los grupos (niveles 1–3) cuentan errores.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActivityRoundProps, ColorName } from '@/types';
import { ChoiceButton } from '../../kit/ChoiceButton';
import { Draggable, DropZone } from '../../kit/drag';
import { Flower, Garment, ShapeToken } from '../../kit/art';
import { makeRng } from '../../kit/rng';
import { numberWord } from '../../kit/words';
import type { Gender } from '../../kit/words';
import './phrases';

export type NtKind = 'estrella' | 'corazon' | 'flor';
const KINDS: NtKind[] = ['estrella', 'corazon', 'flor'];
const KIND_COLOR: Record<NtKind, ColorName> = { estrella: 'amarillo', corazon: 'rojo', flor: 'rosa' };
const KIND_WORD: Record<NtKind, { g: Gender; sg: string; pl: string }> = {
  estrella: { g: 'f', sg: 'estrella', pl: 'estrellas' },
  corazon: { g: 'm', sg: 'corazón', pl: 'corazones' },
  flor: { g: 'f', sg: 'flor', pl: 'flores' },
};
const thing = (k: NtKind, n: number) => (n === 1 ? KIND_WORD[k].sg : KIND_WORD[k].pl);
const spokenN = (k: NtKind, n: number) => numberWord(n, KIND_WORD[k].g);

/** Niveles 1–3: cantidad máxima y número de grupos. */
const CHOICE_BY_LEVEL = [
  { max: 3, options: 2 },
  { max: 5, options: 3 },
  { max: 10, options: 3 },
];

export interface GroupOption { n: number; answer: boolean }
export interface ChoicePlan { mode: 'choice'; kind: NtKind; target: number; options: GroupOption[] }
export interface DressPlan { mode: 'drag'; kind: NtKind; target: number; total: number }
export type NumberTapPlan = ChoicePlan | DressPlan;

/** Plan puro (determinista por semilla) de una ronda. Nivel 4 = arrastrar; total = N + 2 objetos en la bandeja. */
export function planNumberTap(level: number, seed: number): NumberTapPlan {
  const rng = makeRng(seed);
  const kind = rng.pick(KINDS);
  if (level >= 4) {
    const target = rng.int(2, 5);
    return { mode: 'drag', kind, target, total: target + 2 };
  }
  const cfg = CHOICE_BY_LEVEL[Math.max(1, level) - 1];
  const all = Array.from({ length: cfg.max }, (_, i) => i + 1);
  const target = rng.int(1, cfg.max);
  const distractors = rng.sample(all.filter((n) => n !== target), cfg.options - 1);
  const options = rng.shuffle<GroupOption>([
    { n: target, answer: true },
    ...distractors.map((n) => ({ n, answer: false })),
  ]);
  return { mode: 'choice', kind, target, options };
}

function Item({ kind, size }: { kind: NtKind; size: number }) {
  if (kind === 'flor') return <Flower color={KIND_COLOR[kind]} size={size} />;
  return <ShapeToken shape={kind} color={KIND_COLOR[kind]} size={size} />;
}

/** Grupo de n objetos dentro de una opción. */
function Group({ kind, n }: { kind: NtKind; n: number }) {
  const cols = n <= 3 ? n : n <= 6 ? 3 : 4;
  const cell = n <= 3 ? 60 : n <= 6 ? 46 : 36;
  return (
    <div className="nt-group" style={{ gridTemplateColumns: `repeat(${cols}, ${cell}px)` }}>
      {Array.from({ length: n }, (_, i) => <Item key={i} kind={kind} size={cell} />)}
    </div>
  );
}

type Common = Pick<ActivityRoundProps, 'voice' | 'sfx' | 'onRoundDone' | 'reportMistake'>;

function PickGroups({ plan, voice, sfx, onRoundDone, reportMistake }: Common & { plan: ChoicePlan }) {
  const [found, setFound] = useState(false);
  const mistakes = useRef(0);
  const t0 = useRef(Date.now());

  useEffect(() => {
    void voice.say('nt.pick', { n: spokenN(plan.kind, plan.target), thing: thing(plan.kind, plan.target) });
  }, [plan, voice]);

  useEffect(() => {
    if (!found) return;
    const id = setTimeout(() => onRoundDone({ mistakes: mistakes.current, ms: Date.now() - t0.current }), 650);
    return () => clearTimeout(id);
  }, [found, onRoundDone]);

  const size = plan.options.length <= 2 ? 220 : 180;
  return (
    <div className="nt-round nt-pick" data-testid="number-tap-round">
      {plan.options.map((o, i) => (
        <ChoiceButton key={`${o.n}-${i}`} testId={`nt-option-${i}`} label="grupo" size={size}
          isAnswer={o.answer} done={found && o.answer} disabled={found && !o.answer}
          onPress={() => {
            if (found) return;
            if (o.answer) { sfx.play('pop'); setFound(true); }
            else { mistakes.current += 1; reportMistake(); }
          }}>
          <Group kind={plan.kind} n={o.n} />
        </ChoiceButton>
      ))}
    </div>
  );
}

function PutInDress({ plan, voice, sfx, onRoundDone }: Pick<Common, 'voice' | 'sfx' | 'onRoundDone'> & { plan: DressPlan }) {
  const [inDress, setInDress] = useState(0);
  const t0 = useRef(Date.now());
  const exact = inDress === plan.target;

  useEffect(() => {
    void voice.say('nt.put', { n: spokenN(plan.kind, plan.target), thing: thing(plan.kind, plan.target) });
  }, [plan, voice]);

  // Termina solo si se mantiene exactamente N un instante: si pone de más, el temporizador se cancela.
  useEffect(() => {
    if (!exact) return;
    const id = setTimeout(() => onRoundDone({ mistakes: 0, ms: Date.now() - t0.current }), 900);
    return () => clearTimeout(id);
  }, [exact, onRoundDone]);

  const drop = (dropId: string | null) => {
    if (dropId !== 'dress' || inDress >= plan.total) return;
    sfx.play(inDress + 1 === plan.target ? 'pop' : 'tap');
    setInDress(inDress + 1);
  };
  const take = () => {
    sfx.play('tap');
    setInDress((c) => Math.max(0, c - 1));
  };

  return (
    <div className="nt-round nt-drag" data-testid="number-tap-round">
      <DropZone id="dress" className="nt-dress">
        <Garment slot="dress" color="rosa" size="100%" />
        <div className="nt-dress-items">
          {Array.from({ length: inDress }, (_, i) => (
            <button key={i} type="button" className="nt-in" aria-label="quitar" data-testid={`nt-in-${i}`} onClick={take}>
              <Item kind={plan.kind} size={56} />
            </button>
          ))}
        </div>
      </DropZone>
      <div className="nt-tray">
        {Array.from({ length: plan.total - inDress }, (_, i) => (
          <Draggable key={i} label="objeto" testId={`nt-tray-${i}`} onDrop={drop}>
            <Item kind={plan.kind} size={84} />
          </Draggable>
        ))}
      </div>
    </div>
  );
}

export function NumberTapRound(props: ActivityRoundProps) {
  const plan = useMemo(() => planNumberTap(props.level, props.seed), [props.level, props.seed]);
  const { voice, sfx, onRoundDone, reportMistake } = props;
  return plan.mode === 'choice'
    ? <PickGroups plan={plan} voice={voice} sfx={sfx} onRoundDone={onRoundDone} reportMistake={reportMistake} />
    : <PutInDress plan={plan} voice={voice} sfx={sfx} onRoundDone={onRoundDone} />;
}
