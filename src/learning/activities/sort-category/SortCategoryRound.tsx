/**
 * sort-category — "agrupa por tipo" (arrastrar cada cosa a su canasta).
 * Grupos: animales, frutas, prendas, flores y vehículos. Cada canasta muestra un ejemplo del grupo.
 * Nivel 1: 2 grupos y 4 objetos · 2: 3 grupos y 6 objetos. Dos objetos por grupo.
 * Soltar en la canasta equivocada cuenta como error; soltar fuera no cuenta.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ActivityRoundProps, ColorName, WearSlot } from '@/types';
import { LinGrad, makePalette, useIdp } from '@/art/kit';
import { ANIMALS, Animal, type AnimalKind, Flower, FRUITS, Fruit, type FruitKind, Garment } from '../../kit/art';
import { Draggable, DropZone } from '../../kit/drag';
import { useHint } from '../../kit/hint';
import { makeRng } from '../../kit/rng';
import { Vehicle, VEHICLES, type VehicleKind } from './Vehicles';
import './phrases';

export type Group = 'animales' | 'frutas' | 'prendas' | 'flores' | 'vehiculos';
export const GROUPS: Group[] = ['animales', 'frutas', 'prendas', 'flores', 'vehiculos'];
const COLORS: ColorName[] = ['rojo', 'azul', 'amarillo', 'verde', 'morado', 'rosa'];
const GARMENTS: WearSlot[] = ['top', 'dress', 'bottom', 'shoes', 'outer'];

/** Dibujo de un objeto (datos puros, para que el plan sea comprobable). */
export type Art =
  | { kind: 'animal'; animal: AnimalKind }
  | { kind: 'fruit'; fruit: FruitKind }
  | { kind: 'garment'; slot: WearSlot; color: ColorName }
  | { kind: 'flower'; color: ColorName }
  | { kind: 'vehicle'; vehicle: VehicleKind; color: ColorName };

export interface CatItem { id: string; group: Group; art: Art }
export interface SortCategoryPlan { groups: Group[]; items: CatItem[] }

/** Ejemplo fijo que muestra la canasta de cada grupo. */
export const EXAMPLE: Record<Group, Art> = {
  animales: { kind: 'animal', animal: 'gato' },
  frutas: { kind: 'fruit', fruit: 'manzana' },
  prendas: { kind: 'garment', slot: 'dress', color: 'rosa' },
  flores: { kind: 'flower', color: 'morado' },
  vehiculos: { kind: 'vehicle', vehicle: 'coche', color: 'rojo' },
};

function members(group: Group, rng: ReturnType<typeof makeRng>): Art[] {
  switch (group) {
    case 'animales': return rng.sample(ANIMALS, 2).map((animal) => ({ kind: 'animal' as const, animal }));
    case 'frutas': return rng.sample(FRUITS, 2).map((fruit) => ({ kind: 'fruit' as const, fruit }));
    case 'prendas': return rng.sample(GARMENTS, 2).map((slot) => ({ kind: 'garment' as const, slot, color: rng.pick(COLORS) }));
    case 'flores': return rng.sample(COLORS, 2).map((color) => ({ kind: 'flower' as const, color }));
    case 'vehiculos': return rng.sample(VEHICLES, 2).map((vehicle) => ({ kind: 'vehicle' as const, vehicle, color: rng.pick(COLORS) }));
  }
}

/** Plan puro (determinista por semilla) de una ronda. */
export function planSortCategory(level: number, seed: number): SortCategoryPlan {
  const rng = makeRng(seed);
  const groups = rng.sample(GROUPS, level <= 1 ? 2 : 3);
  const items = groups.flatMap((g) => members(g, rng).map((art, i) => ({ id: `${g}-${i}`, group: g, art })));
  return { groups, items: rng.shuffle(items) };
}

function ArtView({ art, size }: { art: Art; size: number }) {
  switch (art.kind) {
    case 'animal': return <Animal kind={art.animal} size={size} />;
    case 'fruit': return <Fruit kind={art.fruit} size={size} />;
    case 'garment': return <Garment slot={art.slot} color={art.color} size={size} />;
    case 'flower': return <Flower color={art.color} size={size} />;
    case 'vehicle': return <Vehicle kind={art.vehicle} color={art.color} size={size} />;
  }
}

/** Canasta de mimbre con un ejemplo del grupo y los objetos ya guardados. */
function Basket({ group, size, hint, children }: { group: Group; size: number; hint: boolean; children: ReactNode }) {
  const idp = useIdp('bk');
  const pulse = useHint();
  const wood = makePalette('#d9a066');
  return (
    <DropZone id={group} hint={pulse && hint} className="sct-basket" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="lk-art sct-basket-back" aria-hidden="true">
        <defs><LinGrad id={idp('g')} p={wood} /></defs>
        <path d="M22 42Q50 6 78 42" fill="none" stroke="#b5703f" strokeWidth={6} strokeLinecap="round" />
        <path d="M12 40H88L78 92H22Z" fill={`url(#${idp('g')})`} stroke="#8a4f26" strokeWidth={3} strokeLinejoin="round" />
        <path d="M18 56H82M20 72H80" stroke="#8a4f26" strokeWidth={2} opacity={0.35} />
      </svg>
      <div className="sct-example"><ArtView art={EXAMPLE[group]} size={size * 0.42} /></div>
      <div className="sct-placed">{children}</div>
    </DropZone>
  );
}

export function SortCategoryRound({ level, seed, voice, sfx, onRoundDone, reportMistake }: ActivityRoundProps) {
  const plan = useMemo(() => planSortCategory(level, seed), [level, seed]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [hintFor, setHintFor] = useState<Group | null>(null);
  const mistakes = useRef(0);
  const t0 = useRef(Date.now());
  const total = plan.items.length;
  const allDone = placed.length === total;

  useEffect(() => { void voice.say('sct.instr'); }, [plan, voice]);

  useEffect(() => {
    if (!allDone) return;
    const id = setTimeout(() => onRoundDone({ mistakes: mistakes.current, ms: Date.now() - t0.current }), 650);
    return () => clearTimeout(id);
  }, [allDone, onRoundDone]);

  const drop = (item: CatItem, dropId: string | null) => {
    if (dropId === null || placed.includes(item.id)) return; // fuera de canastas: vuelve sola, sin error
    if (dropId === item.group) {
      sfx.play('pop');
      setPlaced((p) => [...p, item.id]);
    } else {
      mistakes.current += 1;
      setHintFor(item.group);
      reportMistake();
    }
  };

  const basketSize = plan.groups.length <= 2 ? 250 : 210;
  const itemSize = total <= 4 ? 140 : 116;
  return (
    <div className="sct-round" data-testid="sort-category-round">
      <div className="sct-baskets">
        {plan.groups.map((group) => (
          <Basket key={group} group={group} size={basketSize} hint={hintFor === group}>
            {plan.items
              .filter((it) => it.group === group && placed.includes(it.id))
              .map((it) => <div key={it.id} className="sct-saved"><ArtView art={it.art} size={46} /></div>)}
          </Basket>
        ))}
      </div>
      <div className="sct-tray" data-testid="sct-tray">
        {plan.items.filter((it) => !placed.includes(it.id)).map((it) => (
          <Draggable key={it.id} label="objeto" testId={`sct-item-${it.id}`} className="sct-item" onDrop={(d) => drop(it, d)}>
            <ArtView art={it.art} size={itemSize} />
          </Draggable>
        ))}
      </div>
    </div>
  );
}
