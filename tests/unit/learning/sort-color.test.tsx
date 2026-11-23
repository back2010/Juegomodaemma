import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { ActivityRoundProps, RoundResult } from '@/types';
import { SortColorRound, planSortColor } from '@/learning/activities/sort-color/SortColorRound';

vi.mock('@/audio', async () => (await import('./audioMock')).audioMock());

function props(level: number, seed = 123) {
  return {
    level, seed,
    voice: { say: vi.fn(async (_k: string, _p?: Record<string, string | number>) => {}), repeatLast: vi.fn(), stop: vi.fn() },
    sfx: { play: vi.fn() },
    onRoundDone: vi.fn((_r: RoundResult) => {}), reportMistake: vi.fn(() => {}),
  } satisfies ActivityRoundProps;
}

/** Simula arrastrar una prenda y soltarla sobre el grupo de `color` (jsdom no tiene elementsFromPoint). */
function dragTo(itemEl: HTMLElement, color: string | null) {
  const target = color ? document.querySelector(`[data-drop-id="${color}"]`) : null;
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

describe('sort-color plan', () => {
  it.each([[1, 2, 4], [2, 3, 6]])('nivel %i → %i grupos y %i prendas', (level, groups, n) => {
    for (let s = 1; s < 30; s++) {
      const p = planSortColor(level, s);
      expect(p.groups).toHaveLength(groups);
      expect(new Set(p.groups).size).toBe(groups);
      expect(p.garments).toHaveLength(n);
      for (const g of p.groups) {
        expect(p.garments.filter((x) => x.color === g)).toHaveLength(n / groups);
      }
    }
  });

  it('es determinista por semilla', () => {
    expect(planSortColor(2, 42)).toEqual(planSortColor(2, 42));
  });
});

describe('sort-color round', () => {
  it('dice la instrucción, reporta error en grupo equivocado y termina al clasificar todo', () => {
    const p = props(1, 8);
    const plan = planSortColor(1, 8);
    render(<SortColorRound {...p} />);
    expect(p.voice.say).toHaveBeenCalledWith('sc.instr');
    expect(screen.getAllByTestId(/^sc-item-/)).toHaveLength(4);

    const first = plan.garments[0];
    const wrong = plan.groups.find((c) => c !== first.color)!;
    dragTo(screen.getByTestId(`sc-item-${first.id}`), wrong);
    expect(p.reportMistake).toHaveBeenCalledTimes(1);

    dragTo(screen.getByTestId(`sc-item-${first.id}`), null);
    expect(p.reportMistake).toHaveBeenCalledTimes(1);

    for (const g of plan.garments) dragTo(screen.getByTestId(`sc-item-${g.id}`), g.color);
    expect(screen.queryAllByTestId(/^sc-item-/)).toHaveLength(0);
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).toHaveBeenCalledTimes(1);
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 1 }));
  });

  it('nivel 2 renderiza 3 grupos y 6 prendas', () => {
    const p = props(2, 4);
    const { container } = render(<SortColorRound {...p} />);
    expect(container.querySelectorAll('[data-drop-id]')).toHaveLength(3);
    expect(screen.getAllByTestId(/^sc-item-/)).toHaveLength(6);
  });
});
