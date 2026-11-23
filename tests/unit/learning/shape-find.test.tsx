import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { ActivityRoundProps, RoundResult } from '@/types';
import { ShapeFindRound, planShapeFind, shapeThing } from '@/learning/activities/shape-find/ShapeFindRound';
import { shapeFind } from '@/learning/activities/shape-find';

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

describe('definición', () => {
  it('shape-find es de figuras con 4 niveles y frases propias', () => {
    expect(shapeFind.id).toBe('shape-find');
    expect(shapeFind.category).toBe('figuras');
    expect(shapeFind.maxLevel).toBe(4);
    expect(shapeFind.spokenTitleKey.startsWith('sf.')).toBe(true);
    expect(shapeFind.inviteKey.startsWith('sf.')).toBe(true);
  });
});

describe('plan shape-find', () => {
  it.each([[1, 2], [2, 3], [3, 5]])('nivel %i → %i figuras distintas, una sola respuesta, colores distintos', (level, n) => {
    for (let s = 1; s < 40; s++) {
      const p = planShapeFind(level, s);
      expect(p.scene).toBe(false);
      expect(p.options).toHaveLength(n);
      expect(p.options.filter((o) => o.answer)).toHaveLength(1);
      expect(p.options.find((o) => o.answer)!.shape).toBe(p.target);
      expect(new Set(p.options.map((o) => o.shape)).size).toBe(n);
      expect(new Set(p.options.map((o) => o.color)).size).toBe(n);
      expect(p.options.some((o) => o.color === 'blanco')).toBe(false);
    }
  });

  it('nivel 4 es una escena: 2-3 objetos de la figura pedida y el resto de otras figuras', () => {
    for (let s = 1; s < 40; s++) {
      const p = planShapeFind(4, s);
      expect(p.scene).toBe(true);
      const targets = p.options.filter((o) => o.answer);
      expect(targets.length).toBeGreaterThanOrEqual(2);
      expect(targets.length).toBeLessThanOrEqual(3);
      expect(p.options.length).toBeGreaterThanOrEqual(5);
      expect(p.options.length).toBeLessThanOrEqual(6);
      expect(targets.every((o) => o.shape === p.target)).toBe(true);
      expect(p.options.filter((o) => !o.answer).every((o) => o.shape !== p.target)).toBe(true);
      for (const o of p.options) {
        expect(o.x).toBeGreaterThan(0);
        expect(o.x).toBeLessThan(100);
        expect(o.y).toBeGreaterThan(0);
        expect(o.y).toBeLessThan(100);
      }
    }
  });

  it('shapeThing concuerda artículo y número', () => {
    expect(shapeThing('circulo', false)).toBe('el círculo');
    expect(shapeThing('estrella', false)).toBe('la estrella');
    expect(shapeThing('estrella', true)).toBe('las estrellas');
    expect(shapeThing('corazon', true)).toBe('los corazones');
  });
});

describe('ronda shape-find', () => {
  it('dice la instrucción, reporta errores y completa la ronda', () => {
    const p = props(2, 42);
    render(<ShapeFindRound {...p} />);
    const target = planShapeFind(2, 42).target;
    expect(p.voice.say).toHaveBeenCalledWith('sf.find', { thing: shapeThing(target, false) });
    const opts = screen.getAllByRole('button');
    expect(opts).toHaveLength(3);
    fireEvent.click(opts.find((b) => b.dataset.answer !== 'yes')!);
    expect(p.reportMistake).toHaveBeenCalledTimes(1);
    fireEvent.click(opts.find((b) => b.dataset.answer === 'yes')!);
    expect(p.sfx.play).toHaveBeenCalledWith('pop');
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).toHaveBeenCalledTimes(1);
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 1 }));
  });

  it('escena (nivel 4): hay que tocar todas las figuras pedidas', () => {
    const p = props(4, 9);
    render(<ShapeFindRound {...p} />);
    const plan = planShapeFind(4, 9);
    expect(p.voice.say).toHaveBeenCalledWith('sf.all', { thing: shapeThing(plan.target, true) });
    const targets = plan.options.flatMap((o, i) => (o.answer ? [i] : []));
    const others = plan.options.flatMap((o, i) => (o.answer ? [] : [i]));
    fireEvent.click(screen.getByTestId(`sf-option-${others[0]}`));
    expect(p.reportMistake).toHaveBeenCalledTimes(1);
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).not.toHaveBeenCalled();
    targets.slice(0, -1).forEach((i) => fireEvent.click(screen.getByTestId(`sf-option-${i}`)));
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId(`sf-option-${targets[targets.length - 1]}`));
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).toHaveBeenCalledTimes(1);
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 1 }));
  });
});
