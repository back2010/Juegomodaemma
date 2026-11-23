/**
 * sort-shape — "lleva cada figura a su caja" (arrastrar y soltar).
 * Nivel 1: 2 cajas y 4 objetos · 2: 3 cajas y 6 objetos. Dos objetos por caja.
 * Los círculos pueden ser aretes o pulsera (accesorios redondos).
 * Soltar en la caja equivocada cuenta como error; soltar fuera no cuenta.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ActivityRoundProps, ColorName, ShapeName } from '@/types';
import { shapePath } from '@/art/kit';
import { Garment, ShapeToken } from '../../kit/art';
import { Draggable, DropZone } from '../../kit/drag';
import { useHint } from '../../kit/hint';
import { makeRng } from '../../kit/rng';
import './phrases';

const POOL: ShapeName[] = ['circulo', 'cuadrado', 'triangulo', 'estrella', 'corazon'];
const COLORS: ColorName[] = ['rojo', 'azul', 'amarillo', 'verde', 'naranja', 'morado', 'rosa'];

export interface ShapeObject {
  id: string;
  shape: ShapeName;
  color: ColorName;
  /** Accesorio redondo que representa un círculo (si no, es la figura). */
  accessory?: 'aretes' | 'pulsera';
}
export interface SortShapePlan { boxes: ShapeName[]; objects: ShapeObject[] }

/** Plan puro (determinista por semilla) de una ronda. */
export function planSortShape(level: number, seed: number): SortShapePlan {
  const rng = makeRng(seed);
  const boxes = rng.sample(POOL, level <= 1 ? 2 : 3);
  const objects: ShapeObject[] = [];
  for (const shape of boxes) {
    rng.sample(COLORS, 2).forEach((color, i) => {
      const accessory = shape === 'circulo' && i === 1 ? (rng.chance(0.5) ? 'aretes' : 'pulsera') : undefined;
      objects.push({ id: `${shape}-${i}`, shape, color, accessory });
    });
  }
  return { boxes, objects: rng.shuffle(objects) };
}

function ObjArt({ o, size }: { o: ShapeObject; size: number }) {
  if (o.accessory) return <Garment slot={o.accessory === 'aretes' ? 'earrings' : 'bracelet'} color={o.color} size={size} />;
  return <ShapeToken shape={o.shape} color={o.color} size={size} />;
}

/** Contorno guía de la figura de la caja. */
function Silhouette({ shape }: { shape: ShapeName }) {
  return (
    <svg viewBox="0 0 100 100" className="lk-art ssh-ghost" aria-hidden="true">
      <path d={shapePath(shape, 50, 52, 40)} fill="rgba(255, 255, 255, 0.55)" stroke="#9b4dff" strokeWidth={3}
        strokeDasharray="7 6" strokeLinejoin="round" />
    </svg>
  );
}

function Box({ shape, size, hint, children }: { shape: ShapeName; size: number; hint: boolean; children: ReactNode }) {
  const pulse = useHint();
  return (
    <DropZone id={shape} hint={pulse && hint} className="ssh-box" style={{ width: size, height: size }}>
      <Silhouette shape={shape} />
      <div className="ssh-box-items">{children}</div>
    </DropZone>
  );
}

export function SortShapeRound({ level, seed, voice, sfx, onRoundDone, reportMistake }: ActivityRoundProps) {
  const plan = useMemo(() => planSortShape(level, seed), [level, seed]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [hintFor, setHintFor] = useState<ShapeName | null>(null);
  const mistakes = useRef(0);
  const t0 = useRef(Date.now());
  const total = plan.objects.length;
  const allDone = placed.length === total;

  useEffect(() => { void voice.say('ssh.instr'); }, [plan, voice]);

  useEffect(() => {
    if (!allDone) return;
    const id = setTimeout(() => onRoundDone({ mistakes: mistakes.current, ms: Date.now() - t0.current }), 650);
    return () => clearTimeout(id);
  }, [allDone, onRoundDone]);

  const drop = (o: ShapeObject, dropId: string | null) => {
    if (dropId === null || placed.includes(o.id)) return; // fuera de cajas: vuelve sola, sin error
    if (dropId === o.shape) {
      sfx.play('pop');
      setPlaced((p) => [...p, o.id]);
    } else {
      mistakes.current += 1;
      setHintFor(o.shape);
      reportMistake();
    }
  };

  const boxSize = plan.boxes.length <= 2 ? 230 : 190;
  const objSize = total <= 4 ? 140 : 116;
  return (
    <div className="ssh-round" data-testid="sort-shape-round">
      <div className="ssh-boxes">
        {plan.boxes.map((shape) => (
          <Box key={shape} shape={shape} size={boxSize} hint={hintFor === shape}>
            {plan.objects
              .filter((o) => o.shape === shape && placed.includes(o.id))
              .map((o) => <div key={o.id} className="ssh-placed"><ObjArt o={o} size={70} /></div>)}
          </Box>
        ))}
      </div>
      <div className="ssh-tray" data-testid="ssh-tray">
        {plan.objects.filter((o) => !placed.includes(o.id)).map((o) => (
          <Draggable key={o.id} label="figura" testId={`ssh-obj-${o.id}`} className="ssh-obj" onDrop={(d) => drop(o, d)}>
            <ObjArt o={o} size={objSize} />
          </Draggable>
        ))}
      </div>
    </div>
  );
}
