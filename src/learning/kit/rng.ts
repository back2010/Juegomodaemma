/** Generador aleatorio determinista con semilla (mulberry32) y utilidades. */
export interface Rng {
  /** Flotante en [0,1). */
  next(): number;
  /** Entero en [min, max] (ambos incluidos). */
  int(min: number, max: number): number;
  pick<T>(list: readonly T[]): T;
  shuffle<T>(list: readonly T[]): T[];
  /** n elementos distintos (sin repetir) de la lista. */
  sample<T>(list: readonly T[], n: number): T[];
  /** true con probabilidad p. */
  chance(p: number): boolean;
}

export function makeRng(seed: number): Rng {
  let a = seed >>> 0 || 0x9e3779b9;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));
  const shuffle = <T,>(list: readonly T[]) => {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  return {
    next,
    int,
    pick: (list) => list[Math.floor(next() * list.length)],
    shuffle,
    sample: (list, n) => shuffle(list).slice(0, Math.max(0, n)),
    chance: (p) => next() < p,
  };
}

/** Semilla nueva no determinista (para iniciar sesiones). */
export const freshSeed = () => (Math.floor(Math.random() * 2 ** 31) ^ Date.now()) >>> 0;
