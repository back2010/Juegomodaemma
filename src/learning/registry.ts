/**
 * Registro de actividades educativas (P5).
 * Para añadir una actividad: crea src/learning/activities/<id>/ siguiendo docs/ACTIVIDADES.md,
 * impórtala aquí y agrégala al arreglo `activities` (una línea por actividad).
 */
import type { ActivityDef, LearningCategory } from '@/types';
import { colorFind } from './activities/color-find';
import { memoryPairs } from './activities/memory-pairs';
import { colorBucket } from './activities/color-bucket';
import { sortColor } from './activities/sort-color';
import { shapeFind } from './activities/shape-find';
import { shapeShadow } from './activities/shape-shadow';
import { countObjects } from './activities/count-objects';
import { numberTap } from './activities/number-tap';
import { patternNext } from './activities/pattern-next';
import { sortShape } from './activities/sort-shape';
import { sortCategory } from './activities/sort-category';

export const activities: ActivityDef[] = [
  // ── Colores ──
  colorFind,
  colorBucket,
  // ── Figuras ──
  shapeFind,
  shapeShadow,
  // ── Números ──
  countObjects,
  numberTap,
  // ── Memoria ──
  memoryPairs,
  // ── Patrones ──
  patternNext,
  // ── Clasificación ──
  sortColor,
  sortShape,
  sortCategory,
];
export const getActivity = (id: string) => activities.find((a) => a.id === id);
export const activitiesOf = (c: LearningCategory) => activities.filter((a) => a.category === c);
