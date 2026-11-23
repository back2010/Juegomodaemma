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

export const activities: ActivityDef[] = [
  // ── Colores ──
  colorFind,
  colorBucket,
  // ── Figuras ──
  shapeFind,
  shapeShadow,
  // ── Números ──
  // count-objects, number-tap → aquí
  // ── Memoria ──
  memoryPairs,
  // ── Patrones ──
  // pattern-next → aquí
  // ── Clasificación ──
  sortColor,
  // sort-shape, sort-category → aquí
];
export const getActivity = (id: string) => activities.find((a) => a.id === id);
export const activitiesOf = (c: LearningCategory) => activities.filter((a) => a.category === c);
