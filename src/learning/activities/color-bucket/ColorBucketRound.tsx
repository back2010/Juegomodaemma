/**
 * color-bucket — arrastrar cada objeto de color a su balde.
 * Nivel 1: 2 baldes, 2 objetos · Nivel 2: 3 baldes, 3 objetos · Nivel 3: 3 baldes, 5 objetos.
 * La ronda termina cuando todos los objetos están en su balde. Soltar fuera no cuenta como error.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActivityRoundProps, ColorName, WearSlot } from '@/types';
import { Draggable, DropZone } from '../../kit/drag';
import { useHint } from '../../kit/hint';
import { ColorBlob, Flower, Garment } from '../../kit/art';
import { makeRng } from '../../kit/rng';
import { LinGrad, Gloss, outline, paletteOf, useIdp } from '@/art/kit';
import './phrases';
import './styles.css';

const BASIC: ColorName[] = ['rojo', 'azul', 'amarillo', 'verde'];
const MORE: ColorName[] = [...BASIC, 'naranja', 'morado', 'rosa'];
const LEVELS = [
  { buckets: 2, items: 2 },
  { buckets: 3, items: 3 },
  { buckets: 3, items: 5 },
];
export const COLOR_BUCKET_MAX_LEVEL = LEVELS.length;

export type ItemKind = 'blob' | 'flower' | 'top' | 'dress' | 'bottom';
const KINDS: ItemKind[] = ['blob', 'flower', 'top', 'dress', 'bottom'];
export interface BucketItem { id: string; color: ColorName; kind: ItemKind }
export interface ColorBucketPlan { buckets: ColorName[]; items: BucketItem[] }

/** Plan puro (determinista por semilla) de una ronda. Cada balde recibe al menos un objeto. */
export function planColorBucket(level: number, seed: number): ColorBucketPlan {
  const rng = makeRng(seed);
  const cfg = LEVELS[Math.min(LEVELS.length, Math.max(1, level)) - 1];
  const buckets = rng.sample(level <= 2 ? BASIC : MORE, cfg.buckets);
  const colors: ColorName[] = [...buckets];
  while (colors.length < cfg.items) colors.push(rng.pick(buckets));
  const items = rng.shuffle(colors).map((color, i) => ({ id: `i${i}`, color, kind: rng.pick(KINDS) }));
  return { buckets, items };
}

export function ItemArt({ item, size }: { item: BucketItem; size?: number }) {
  if (item.kind === 'blob') return <ColorBlob color={item.color} size={size} />;
  if (item.kind === 'flower') return <Flower color={item.color} size={size} />;
  return <Garment slot={item.kind as WearSlot} color={item.color} size={size} />;
}

/** Balde de colores (SVG sin texto) en el color indicado. */
export function BucketArt({ color }: { color: ColorName }) {
  const idp = useIdp('bk');
  const p = paletteOf(color);
  return (
    <svg viewBox="0 0 100 100" className="lk-art cb-bucket-art" aria-hidden="true">
      <defs><LinGrad id={idp('g')} p={p} dir="d" /></defs>
      <path d="M28 40Q50 8 72 40" fill="none" stroke={outline(p)} strokeWidth={4} strokeLinecap="round" />
      <path d="M12 38H88L78 92Q77 96 72 96H28Q23 96 22 92Z" fill={`url(#${idp('g')})`}
        stroke={outline(p)} strokeWidth={3.5} strokeLinejoin="round" />
      <Gloss cx={28} cy={58} rx={4} ry={12} o={0.5} />
    </svg>
  );
}

export function ColorBucketRound({ level, seed, voice, sfx, onRoundDone, reportMistake }: ActivityRoundProps) {
  const plan = useMemo(() => planColorBucket(level, seed), [level, seed]);
  const [placed, setPlaced] = useState<Set<string>>(() => new Set());
  const hintOn = useHint();
  const mistakes = useRef(0);
  const t0 = useRef(Date.now());

  useEffect(() => { void voice.say('cb.instr'); }, [voice]);

  const pending = plan.items.filter((it) => !placed.has(it.id));
  const allDone = pending.length === 0;
  useEffect(() => {
    if (!allDone) return;
    const id = setTimeout(() => onRoundDone({ mistakes: mistakes.current, ms: Date.now() - t0.current }), 650);
    return () => clearTimeout(id);
  }, [allDone, onRoundDone]);

  const drop = (item: BucketItem, dropId: string | null) => {
    if (dropId === null) return; // soltó fuera: vuelve solo, no es error
    if (dropId === item.color) {
      sfx.play('pop');
      setPlaced((s) => new Set([...s, item.id]));
    } else {
      mistakes.current += 1;
      reportMistake();
    }
  };

  const answerColor = pending[0]?.color;
  return (
    <div className="cb-round" data-testid="color-bucket-round">
      <div className="cb-buckets">
        {plan.buckets.map((color) => (
          <DropZone key={color} id={color} className="cb-bucket" hint={hintOn && color === answerColor}>
            <BucketArt color={color} />
            <div className="cb-placed">
              {plan.items.filter((it) => placed.has(it.id) && it.color === color).map((it) => (
                <div key={it.id} className="cb-placed-item" data-testid={`cb-placed-${it.id}`}>
                  <ItemArt item={it} />
                </div>
              ))}
            </div>
          </DropZone>
        ))}
      </div>
      <div className="cb-tray">
        {pending.map((it) => (
          <Draggable key={it.id} testId={`cb-item-${it.id}`} label={`objeto ${it.id}`} onDrop={(d) => drop(it, d)}>
            <ItemArt item={it} />
          </Draggable>
        ))}
      </div>
    </div>
  );
}
