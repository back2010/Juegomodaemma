/**
 * ActivitySelector (ARQUITECTURA §F): categorías habilitadas → anti-repetición → peso por horas sin jugar
 * → sorteo ponderado con semilla. Función pura.
 */
import type { ActivityDef, ActivityProgress, HistoryEntry, LearningCategory } from '@/types';

export interface SelectorInput {
  activities: ActivityDef[];
  categories: Record<LearningCategory, boolean>;
  /** Historial (más antiguo primero). */
  history: HistoryEntry[];
  perActivity?: Record<string, ActivityProgress>;
  now: number;
  seed: number;
}

const HOUR = 3_600_000;

/** PRNG determinista (mulberry32). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Candidatas tras aplicar habilitación y anti-repetición (relajando la regla si no queda ninguna). */
export function candidateActivities(i: Omit<SelectorInput, 'seed' | 'now'>): ActivityDef[] {
  const enabled = i.activities.filter((a) => i.categories[a.category]);
  if (!enabled.length) return [];
  const recent = [...i.history].reverse();
  const recentCats = new Set(recent.slice(0, 2).map((h) => h.category));
  const recentActs = new Set(recent.slice(0, 3).map((h) => h.activityId));
  const strict = enabled.filter((a) => !recentCats.has(a.category) && !recentActs.has(a.id));
  if (strict.length) return strict;
  const noActs = enabled.filter((a) => !recentActs.has(a.id));
  if (noActs.length) return noActs;
  // Evita al menos la última actividad si hay alternativa.
  const last = recent[0]?.activityId;
  const notLast = enabled.filter((a) => a.id !== last);
  return notLast.length ? notLast : enabled;
}

export function lastPlayedOf(id: string, history: HistoryEntry[], perActivity?: Record<string, ActivityProgress>): number {
  let t = perActivity?.[id]?.lastPlayed ?? 0;
  for (const h of history) if (h.activityId === id && h.at > t) t = h.at;
  return t;
}

export function activityWeight(id: string, i: Pick<SelectorInput, 'history' | 'perActivity' | 'now'>): number {
  const last = lastPlayedOf(id, i.history, i.perActivity);
  const hours = last > 0 ? Math.max(0, (i.now - last) / HOUR) : 48;
  return 1 + Math.min(48, hours);
}

export function pickActivity(i: SelectorInput): ActivityDef | undefined {
  const cands = candidateActivities(i);
  if (!cands.length) return undefined;
  const weights = cands.map((a) => activityWeight(a.id, i));
  const total = weights.reduce((s, w) => s + w, 0);
  let r = seededRandom(i.seed)() * total;
  for (let k = 0; k < cands.length; k++) {
    r -= weights[k];
    if (r < 0) return cands[k];
  }
  return cands[cands.length - 1];
}
