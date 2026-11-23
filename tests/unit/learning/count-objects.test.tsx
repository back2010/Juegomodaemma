import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { ActivityRoundProps, RoundResult } from '@/types';
import { CountObjectsRound, countWord, planCountObjects } from '@/learning/activities/count-objects/CountObjectsRound';

vi.mock('@/audio', async () => (await import('./audioMock')).audioMock());

function props(level: number, seed = 123) {
  return {
    level, seed,
    voice: { say: vi.fn(async (_k: string, _p?: Record<string, string | number>) => {}), repeatLast: vi.fn(), stop: vi.fn() },
    sfx: { play: vi.fn() },
    onRoundDone: vi.fn((_r: RoundResult) => {}), reportMistake: vi.fn(() => {}),
  } satisfies ActivityRoundProps;
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('count-objects · plan', () => {
  it.each([[1, 3], [2, 5], [3, 10]])('nivel %i → cantidades entre 1 y %i', (level, max) => {
    const counts = new Set<number>();
    for (let s = 1; s < 200; s++) {
      const { count } = planCountObjects(level, s);
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(max);
      counts.add(count);
    }
    expect(counts.size).toBe(max);
  });

  it('rota el tipo de objeto con la semilla', () => {
    const kinds = new Set(Array.from({ length: 60 }, (_, s) => planCountObjects(1, s + 1).kind));
    expect(kinds.size).toBe(3);
  });

  it('palabras de conteo', () => {
    expect(countWord(1)).toBe('uno');
    expect(countWord(3)).toBe('tres');
    expect(countWord(10)).toBe('diez');
  });
});

describe('count-objects · ronda', () => {
  it('cuenta en orden, ignora los ya contados y termina al tocar todos', () => {
    const p = props(3, 42);
    const plan = planCountObjects(3, 42);
    render(<CountObjectsRound {...p} />);
    expect(p.voice.say).toHaveBeenCalledWith('co.intro', expect.objectContaining({ things: expect.any(String) }));

    const objs = screen.getAllByTestId(/^co-obj-/);
    expect(objs).toHaveLength(plan.count);

    fireEvent.click(objs[0]);
    expect(p.voice.say).toHaveBeenLastCalledWith('co.num', { n: 'uno' }, { priority: 'feedback' });
    const before = p.voice.say.mock.calls.length;
    fireEvent.click(objs[0]); // ya contado: no hace nada
    expect(p.voice.say.mock.calls.length).toBe(before);
    expect(p.sfx.play).toHaveBeenCalledTimes(1);

    for (let i = 1; i < plan.count; i++) fireEvent.click(objs[i]);

    const calls = p.voice.say.mock.calls as unknown as Array<[string, Record<string, string> | undefined, { priority?: string } | undefined]>;
    const nums = calls.filter((c) => c[0] === 'co.num');
    expect(nums.map((c) => c[1]?.n)).toEqual(Array.from({ length: plan.count }, (_, k) => countWord(k + 1)));
    expect(nums.every((c) => c[2]?.priority === 'feedback')).toBe(true);
    expect(p.onRoundDone).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).toHaveBeenCalledTimes(1);
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 0 }));
    expect(p.reportMistake).not.toHaveBeenCalled();
  });
});
