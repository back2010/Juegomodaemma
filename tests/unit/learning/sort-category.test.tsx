import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { ActivityRoundProps, RoundResult } from '@/types';
import { planSortCategory, SortCategoryRound } from '@/learning/activities/sort-category/SortCategoryRound';
import { VEHICLES } from '@/learning/activities/sort-category/Vehicles';

vi.mock('@/audio', async () => (await import('./audioMock')).audioMock());

function props(level: number, seed = 123) {
  return {
    level, seed,
    voice: { say: vi.fn(async (_k: string, _p?: Record<string, string | number>) => {}), repeatLast: vi.fn(), stop: vi.fn() },
    sfx: { play: vi.fn() },
    onRoundDone: vi.fn((_r: RoundResult) => {}), reportMistake: vi.fn(() => {}),
  } satisfies ActivityRoundProps;
}

/** jsdom no tiene elementsFromPoint: el punto de soltar cae siempre sobre `zone`. */
function dropOn(obj: HTMLElement, zone: Element | null) {
  document.elementsFromPoint = vi.fn(() => (zone ? [zone] : [])) as unknown as Document['elementsFromPoint'];
  fireEvent.pointerDown(obj, { clientX: 0, clientY: 0, pointerId: 1 });
  fireEvent.pointerUp(obj, { clientX: 0, clientY: 0, pointerId: 1 });
}
const basketOf = (group: string) => document.querySelector(`[data-drop-id="${group}"]`);

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('sort-category: plan', () => {
  it.each([[1, 2, 4], [2, 3, 6]])('nivel %i → %i grupos y %i objetos, dos por grupo', (level, groups, items) => {
    for (let s = 1; s < 30; s++) {
      const p = planSortCategory(level, s);
      expect(p.groups).toHaveLength(groups);
      expect(p.items).toHaveLength(items);
      for (const g of p.groups) expect(p.items.filter((it) => it.group === g)).toHaveLength(items / groups);
      expect(p.items.every((it) => p.groups.includes(it.group))).toBe(true);
    }
  });

  it('incluye vehículos (coche y avión) en el grupo vehiculos', () => {
    expect(VEHICLES).toEqual(['coche', 'avion']);
    const kinds = new Set<string>();
    for (let s = 1; s < 200; s++) {
      for (const it of planSortCategory(2, s).items) {
        if (it.art.kind === 'vehicle') kinds.add(it.art.vehicle);
      }
    }
    expect([...kinds].sort()).toEqual(['avion', 'coche']);
  });
});

describe('sort-category: ronda', () => {
  it('lleva cada objeto a su canasta y completa la ronda sin errores', () => {
    const p = props(2, 5);
    render(<SortCategoryRound {...p} />);
    expect(p.voice.say).toHaveBeenCalledWith('sct.instr');
    const plan = planSortCategory(2, 5);
    for (const it of plan.items) dropOn(screen.getByTestId(`sct-item-${it.id}`), basketOf(it.group));
    expect(p.reportMistake).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).toHaveBeenCalledTimes(1);
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 0 }));
  });

  it('canasta equivocada cuenta como error; fuera no', () => {
    const p = props(1, 9);
    render(<SortCategoryRound {...p} />);
    const plan = planSortCategory(1, 9);
    const it = plan.items[0];
    const wrong = plan.groups.find((g) => g !== it.group)!;
    dropOn(screen.getByTestId(`sct-item-${it.id}`), basketOf(wrong));
    expect(p.reportMistake).toHaveBeenCalledTimes(1);
    dropOn(screen.getByTestId(`sct-item-${it.id}`), null);
    expect(p.reportMistake).toHaveBeenCalledTimes(1);
  });
});
