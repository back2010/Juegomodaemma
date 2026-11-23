/** Reglas puras del runner: número de rondas y progresión silenciosa de nivel. */
import type { ActivityProgress, DurationMin } from '@/types';

export const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

/** clamp(round(durationMin*60/estRoundSec), 2, 12). */
export function roundsFor(durationMin: DurationMin | number, estRoundSec: number): number {
  return clamp(Math.round((durationMin * 60) / Math.max(1, estRoundSec)), 2, 12);
}

/**
 * Aplica una ronda terminada al progreso:
 *  - 3 rondas seguidas sin errores → nivel +1.
 *  - 2 rondas con ≥2 errores (sin una ronda limpia entre ellas) → nivel −1.
 * Una ronda con 1 error corta la racha pero no cuenta como dificultad.
 */
export function applyRound(p: ActivityProgress, mistakes: number, maxLevel: number): ActivityProgress {
  let { level, streak, struggle } = p;
  level = clamp(level, 1, maxLevel);
  if (mistakes === 0) {
    streak += 1;
    struggle = 0;
    if (streak >= 3) { level = Math.min(maxLevel, level + 1); streak = 0; }
  } else {
    streak = 0;
    if (mistakes >= 2) {
      struggle += 1;
      if (struggle >= 2) { level = Math.max(1, level - 1); struggle = 0; }
    }
  }
  return { ...p, level, streak, struggle };
}
