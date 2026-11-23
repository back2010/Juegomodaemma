/**
 * sort-color — clasificar prendas por color en grupos.
 * Nivel 1: 2 grupos, 4 prendas · Nivel 2: 3 grupos, 6 prendas.
 * Cada grupo es una zona con una mancha de color grande. Soltar fuera no es error.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActivityRoundProps, ColorName, WearSlot } from '@/types';
import { Draggable, DropZone } from '../../kit/drag';
import { useHint } from '../../kit/hint';
import { ColorBlob, Garment } from '../../kit/art';
import { makeRng } from '../../kit/rng';
import './phrases';
import './styles.css';

const LEVELS = [
  { groups: 2, garments: 4 },
  { groups: 3, garments: 6 },
];
export const SORT_COLOR_MAX_LEVEL = LEVELS.length;
const POOL: ColorName[] = ['rojo', 'azul', 'amarillo', 'verde', 'naranja', 'morado'];
const SLOTS: WearSlot[] = ['top', 'dress', 'bottom'];

export interface GarmentItem { id: string; color: ColorName; slot: WearSlot }
export interface SortColorPlan { groups: ColorName[]; garments: GarmentItem[] }

/** Plan puro (determinista por semilla): cada grupo recibe el mismo número de prendas. */
export function planSortColor(level: number, seed: number): SortColorPlan {
  const rng = makeRng(seed);
  const cfg = LEVELS[Math.min(LEVELS.length, Math.max(1, level)) - 1];
  const groups = rng.sample(POOL, cfg.groups);
  const per = cfg.garments / cfg.groups;
  const colors = groups.flatMap((c) => Array.from({ length: per }, () => c));
  const garments = rng.shuffle(colors).map((color, i) => ({ id: `g${i}`, color, slot: rng.pick(SLOTS) }));
  return { groups, garments };
}

export function SortColorRound({ level, seed, voice, sfx, onRoundDone, reportMistake }: ActivityRoundProps) {
  const plan = useMemo(() => planSortColor(level, seed), [level, seed]);
  const [placed, setPlaced] = useState<Set<string>>(() => new Set());
  const hintOn = useHint();
  const mistakes = useRef(0);
  const t0 = useRef(Date.now());

  useEffect(() => { void voice.say('sc.instr'); }, [voice]);

  const pending = plan.garments.filter((g) => !placed.has(g.id));
  const allDone = pending.length === 0;
  useEffect(() => {
    if (!allDone) return;
    const id = setTimeout(() => onRoundDone({ mistakes: mistakes.current, ms: Date.now() - t0.current }), 650);
    return () => clearTimeout(id);
  }, [allDone, onRoundDone]);

  const drop = (g: GarmentItem, dropId: string | null) => {
    if (dropId === null) return; // soltó fuera: vuelve solo
    if (dropId === g.color) {
      sfx.play('pop');
      setPlaced((s) => new Set([...s, g.id]));
    } else {
      mistakes.current += 1;
      reportMistake();
    }
  };

  const answerColor = pending[0]?.color;
  return (
    <div className="sc-round" data-testid="sort-color-round">
      <div className="sc-groups">
        {plan.groups.map((color) => (
          <DropZone key={color} id={color} className="sc-group" hint={hintOn && color === answerColor}>
            <div className="sc-blob"><ColorBlob color={color} /></div>
            <div className="sc-placed">
              {plan.garments.filter((g) => placed.has(g.id) && g.color === color).map((g) => (
                <div key={g.id} className="sc-placed-item" data-testid={`sc-placed-${g.id}`}>
                  <Garment slot={g.slot} color={g.color} />
                </div>
              ))}
            </div>
          </DropZone>
        ))}
      </div>
      <div className="sc-tray">
        {pending.map((g) => (
          <Draggable key={g.id} testId={`sc-item-${g.id}`} label={`prenda ${g.id}`} onDrop={(d) => drop(g, d)}>
            <Garment slot={g.slot} color={g.color} />
          </Draggable>
        ))}
      </div>
    </div>
  );
}
