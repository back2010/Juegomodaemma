import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { ActivityRoundProps, RoundResult } from '@/types';
import { PatternNextRound, planPattern, SHOWN } from '@/learning/activities/pattern-next/PatternNextRound';

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

describe('pattern-next: plan', () => {
  it.each([[1, 2], [2, 3], [3, 3], [4, 2]])('nivel %i → %i opciones, una sola respuesta', (level, n) => {
    for (let s = 1; s < 40; s++) {
      const p = planPattern(level, s);
      expect(p.options).toHaveLength(n);
      expect(new Set(p.options.map((o) => o.id)).size).toBe(n);
      expect(p.options.filter((o) => o.id === p.answer.id)).toHaveLength(1);
      expect(p.visible).toHaveLength(SHOWN);
    }
  });

  it('la respuesta continúa el patrón de la fila', () => {
    for (const level of [1, 2, 3, 4]) {
      for (let s = 1; s < 40; s++) {
        const p = planPattern(level, s);
        const period = p.unit.length;
        // Con SHOWN >= periodo, el hueco debe repetir el elemento de un periodo antes.
        expect(p.answer.id).toBe(p.visible[SHOWN - period].id);
        // Cuatro posiciones consecutivas cubren todas las letras de la unidad.
        expect(new Set([...p.visible, p.answer].map((x) => x.id)).size).toBe(new Set(p.unit).size);
      }
    }
  });

  it('nivel 4 usa tamaños grande/pequeño', () => {
    for (let s = 1; s < 20; s++) {
      const p = planPattern(4, s);
      const all = [...p.visible, p.answer];
      expect(all.every((x) => typeof x.big === 'boolean')).toBe(true);
    }
  });
});

describe('pattern-next: ronda', () => {
  it('dice la instrucción, reporta errores y completa la ronda', () => {
    const p = props(1, 42);
    render(<PatternNextRound {...p} />);
    expect(p.voice.say).toHaveBeenCalledWith('pn.instr');
    const opts = screen.getAllByRole('button');
    expect(opts).toHaveLength(2);
    fireEvent.click(opts.find((b) => b.dataset.answer !== 'yes')!);
    expect(p.reportMistake).toHaveBeenCalledTimes(1);
    expect(p.onRoundDone).not.toHaveBeenCalled();
    fireEvent.click(opts.find((b) => b.dataset.answer === 'yes')!);
    expect(p.sfx.play).toHaveBeenCalledWith('pop');
    expect(screen.getByTestId('pn-hole').className).toContain('filled');
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).toHaveBeenCalledTimes(1);
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 1 }));
  });

  it('nivel 3 muestra tres opciones', () => {
    render(<PatternNextRound {...props(3, 7)} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });
});
