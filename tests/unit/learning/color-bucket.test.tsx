import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { ActivityRoundProps, RoundResult } from '@/types';
import { ColorBucketRound, planColorBucket } from '@/learning/activities/color-bucket/ColorBucketRound';

vi.mock('@/audio', async () => (await import('./audioMock')).audioMock());

function props(level: number, seed = 123) {
  return {
    level, seed,
    voice: { say: vi.fn(async (_k: string, _p?: Record<string, string | number>) => {}), repeatLast: vi.fn(), stop: vi.fn() },
    sfx: { play: vi.fn() },
    onRoundDone: vi.fn((_r: RoundResult) => {}), reportMistake: vi.fn(() => {}),
  } satisfies ActivityRoundProps;
}

/** Simula arrastrar un objeto y soltarlo sobre el balde de `color` (jsdom no tiene elementsFromPoint). */
function dragTo(itemEl: HTMLElement, bucketColor: string | null) {
  const target = bucketColor ? document.querySelector(`[data-drop-id="${bucketColor}"]`) : null;
  (document as Document & { elementsFromPoint?: unknown }).elementsFromPoint = () => (target ? [target] : []);
  fireEvent.pointerDown(itemEl);
  fireEvent.pointerUp(itemEl);
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  Reflect.deleteProperty(document, "elementsFromPoint");
});

describe('color-bucket plan', () => {
  it.each([[1, 2, 2], [2, 3, 3], [3, 3, 5]])('nivel %i → %i baldes y %i objetos', (level, buckets, items) => {
    for (let s = 1; s < 30; s++) {
      const p = planColorBucket(level, s);
      expect(p.buckets).toHaveLength(buckets);
      expect(new Set(p.buckets).size).toBe(buckets);
      expect(p.items).toHaveLength(items);
      // cada balde tiene al menos un objeto de su color y todos los objetos tienen balde
      for (const b of p.buckets) expect(p.items.some((it) => it.color === b)).toBe(true);
      for (const it of p.items) expect(p.buckets).toContain(it.color);
    }
  });

  it('es determinista por semilla', () => {
    expect(planColorBucket(3, 42)).toEqual(planColorBucket(3, 42));
  });
});

describe('color-bucket round', () => {
  it('dice la instrucción, reporta error al soltar en otro balde y termina al colocar todo', () => {
    const p = props(1, 5);
    const plan = planColorBucket(1, 5);
    render(<ColorBucketRound {...p} />);
    expect(p.voice.say).toHaveBeenCalledWith('cb.instr');

    const first = plan.items[0];
    const wrong = plan.buckets.find((b) => b !== first.color)!;
    dragTo(screen.getByTestId(`cb-item-${first.id}`), wrong);
    expect(p.reportMistake).toHaveBeenCalledTimes(1);
    expect(p.sfx.play).not.toHaveBeenCalledWith('pop');

    // soltar fuera no es error
    dragTo(screen.getByTestId(`cb-item-${first.id}`), null);
    expect(p.reportMistake).toHaveBeenCalledTimes(1);

    for (const it of plan.items) {
      dragTo(screen.getByTestId(`cb-item-${it.id}`), it.color);
    }
    expect(p.sfx.play).toHaveBeenCalledWith('pop');
    expect(screen.queryAllByTestId(/^cb-item-/)).toHaveLength(0);
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).toHaveBeenCalledTimes(1);
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 1 }));
  });

  it('nivel 3 renderiza 3 baldes y 5 objetos', () => {
    const p = props(3, 11);
    const { container } = render(<ColorBucketRound {...p} />);
    expect(container.querySelectorAll('[data-drop-id]')).toHaveLength(3);
    expect(screen.getAllByTestId(/^cb-item-/)).toHaveLength(5);
  });
});
