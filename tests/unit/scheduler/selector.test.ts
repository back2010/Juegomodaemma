import type { HistoryEntry, LearningCategory } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import { activityWeight, candidateActivities, pickActivity } from '@/scheduler/selector';
import { ALL_ACTS, act } from './helpers';

const NOW = 1_700_000_000_000;
const H = 3_600_000;
const allOn = () => ({ ...DEFAULT_SETTINGS.scheduler.categories });
const only = (...cs: LearningCategory[]) =>
  Object.fromEntries(Object.keys(allOn()).map((k) => [k, cs.includes(k as LearningCategory)])) as Record<LearningCategory, boolean>;
const h = (activityId: string, category: LearningCategory, at = NOW - H): HistoryEntry => ({ activityId, category, at });

describe('ActivitySelector', () => {
  it('respeta las categorías habilitadas', () => {
    for (let seed = 0; seed < 50; seed++) {
      const a = pickActivity({ activities: ALL_ACTS, categories: only('figuras', 'memoria'), history: [], now: NOW, seed });
      expect(['figuras', 'memoria']).toContain(a!.category);
    }
    expect(pickActivity({ activities: ALL_ACTS, categories: only(), history: [], now: NOW, seed: 1 })).toBeUndefined();
    expect(pickActivity({ activities: [], categories: allOn(), history: [], now: NOW, seed: 1 })).toBeUndefined();
  });

  it('excluye categorías de las 2 últimas sesiones y actividades de las 3 últimas', () => {
    const history = [h('memory-pairs', 'memoria'), h('color-find', 'colores'), h('count-objects', 'numeros')];
    const c = candidateActivities({ activities: ALL_ACTS, categories: allOn(), history });
    const ids = c.map((a) => a.id);
    expect(ids).not.toContain('color-find');
    expect(ids).not.toContain('color-bucket');
    expect(ids).not.toContain('count-objects');
    expect(ids).not.toContain('number-tap');
    expect(ids).not.toContain('memory-pairs');
    expect(ids).toContain('shape-find');
    for (let seed = 0; seed < 50; seed++) {
      const a = pickActivity({ activities: ALL_ACTS, categories: allOn(), history, now: NOW, seed })!;
      expect(['colores', 'numeros']).not.toContain(a.category);
    }
  });

  it('relaja la regla si no queda ninguna', () => {
    const acts = [act('color-find', 'colores'), act('color-bucket', 'colores')];
    const c = candidateActivities({ activities: acts, categories: allOn(), history: [h('color-find', 'colores')] });
    expect(c.map((a) => a.id)).toEqual(['color-bucket']);
    const single = [act('color-find', 'colores')];
    expect(candidateActivities({ activities: single, categories: allOn(), history: [h('color-find', 'colores')] })).toHaveLength(1);
  });

  it('pesa por horas sin jugar (máx. 48) y es determinista con semilla', () => {
    expect(activityWeight('x', { history: [h('x', 'colores', NOW - 2 * H)], now: NOW })).toBeCloseTo(3);
    expect(activityWeight('x', { history: [h('x', 'colores', NOW - 100 * H)], now: NOW })).toBe(49);
    expect(activityWeight('nunca', { history: [], now: NOW })).toBe(49);
    const inp = { activities: ALL_ACTS, categories: allOn(), history: [], now: NOW, seed: 7 };
    expect(pickActivity(inp)!.id).toBe(pickActivity(inp)!.id);
    // La recién jugada (pero fuera de la ventana anti-repetición) sale mucho menos.
    const acts = [act('a', 'colores'), act('b', 'figuras')];
    const history = [h('a', 'colores', NOW - 10), h('m1', 'memoria', NOW - 5), h('m2', 'patrones', NOW - 4), h('m3', 'numeros', NOW - 3)];
    let a = 0;
    for (let seed = 0; seed < 400; seed++) if (pickActivity({ activities: acts, categories: allOn(), history, now: NOW, seed })!.id === 'a') a++;
    expect(a).toBeLessThan(40);
  });
});
