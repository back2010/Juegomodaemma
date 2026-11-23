import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { ActivityRoundProps, RoundResult } from '@/types';
import { planSortShape, SortShapeRound } from '@/learning/activities/sort-shape/SortShapeRound';

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
const zoneOf = (shape: string) => document.querySelector(`[data-drop-id="${shape}"]`);

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('sort-shape: plan', () => {
  it.each([[1, 2, 4], [2, 3, 6]])('nivel %i → %i cajas y %i objetos, dos por caja', (level, boxes, objects) => {
    for (let s = 1; s < 30; s++) {
      const p = planSortShape(level, s);
      expect(p.boxes).toHaveLength(boxes);
      expect(new Set(p.boxes).size).toBe(boxes);
      expect(p.objects).toHaveLength(objects);
      for (const b of p.boxes) expect(p.objects.filter((o) => o.shape === b)).toHaveLength(objects / boxes);
      expect(new Set(p.objects.map((o) => o.id)).size).toBe(objects);
    }
  });
});

describe('sort-shape: ronda', () => {
  it('lleva cada objeto a su caja y completa la ronda sin errores', () => {
    const p = props(1, 11);
    render(<SortShapeRound {...p} />);
    expect(p.voice.say).toHaveBeenCalledWith('ssh.instr');
    const plan = planSortShape(1, 11);
    for (const o of plan.objects) dropOn(screen.getByTestId(`ssh-obj-${o.id}`), zoneOf(o.shape));
    expect(p.reportMistake).not.toHaveBeenCalled();
    expect(p.sfx.play).toHaveBeenCalledWith('pop');
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).toHaveBeenCalledTimes(1);
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 0 }));
  });

  it('soltar en la caja equivocada cuenta como error y el objeto sigue en la bandeja', () => {
    const p = props(1, 11);
    render(<SortShapeRound {...p} />);
    const plan = planSortShape(1, 11);
    const o = plan.objects[0];
    const wrong = plan.boxes.find((b) => b !== o.shape)!;
    dropOn(screen.getByTestId(`ssh-obj-${o.id}`), zoneOf(wrong));
    expect(p.reportMistake).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId(`ssh-obj-${o.id}`)).toBeTruthy();
  });

  it('soltar fuera de las cajas no cuenta como error', () => {
    const p = props(1, 11);
    render(<SortShapeRound {...p} />);
    const o = planSortShape(1, 11).objects[0];
    dropOn(screen.getByTestId(`ssh-obj-${o.id}`), null);
    expect(p.reportMistake).not.toHaveBeenCalled();
  });
});
