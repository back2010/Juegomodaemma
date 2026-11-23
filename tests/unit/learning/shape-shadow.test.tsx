import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { ActivityRoundProps, RoundResult, ShapeName } from '@/types';
import { SHAPE_NAMES } from '@/types';
import { ShapeShadowRound, LOOK_ALIKE, planShapeShadow } from '@/learning/activities/shape-shadow/ShapeShadowRound';
import { shapeShadow } from '@/learning/activities/shape-shadow';

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
  it('shape-shadow es de figuras con 3 niveles y frases propias', () => {
    expect(shapeShadow.id).toBe('shape-shadow');
    expect(shapeShadow.category).toBe('figuras');
    expect(shapeShadow.maxLevel).toBe(3);
    expect(shapeShadow.spokenTitleKey.startsWith('ss.')).toBe(true);
    expect(shapeShadow.inviteKey.startsWith('ss.')).toBe(true);
  });
});

describe('plan shape-shadow', () => {
  it.each([[1, 2], [2, 3], [3, 4]])('nivel %i → %i opciones con una sola respuesta', (level, n) => {
    for (let s = 1; s < 40; s++) {
      const p = planShapeShadow(level, s);
      expect(p.options).toHaveLength(n);
      expect(p.options.filter((o) => o.answer)).toHaveLength(1);
      expect(p.options.find((o) => o.answer)!.shape).toBe(p.target);
      expect(new Set(p.options.map((o) => o.shape)).size).toBe(n);
      expect(new Set(p.options.map((o) => o.color)).size).toBe(n);
      expect(p.options.some((o) => o.color === 'blanco')).toBe(false);
    }
  });

  it('nivel 3 incluye siempre la figura parecida de la pareja', () => {
    for (let s = 1; s < 60; s++) {
      const p = planShapeShadow(3, s);
      const twin = LOOK_ALIKE[p.target];
      expect(twin).toBeTruthy();
      expect(p.options.some((o) => o.shape === twin)).toBe(true);
    }
  });

  it('los pares parecidos cubren círculo/óvalo y cuadrado/rectángulo', () => {
    expect(LOOK_ALIKE.circulo).toBe('ovalo');
    expect(LOOK_ALIKE.cuadrado).toBe('rectangulo');
    for (const s of Object.keys(LOOK_ALIKE) as ShapeName[]) expect(SHAPE_NAMES).toContain(s);
  });
});

describe('ronda shape-shadow', () => {
  it('muestra la silueta, dice la instrucción, reporta errores y completa', () => {
    const p = props(1, 8);
    render(<ShapeShadowRound {...p} />);
    expect(p.voice.say).toHaveBeenCalledWith('ss.match');
    expect(screen.getByTestId('shape-shadow-silhouette').querySelector('path')).toBeTruthy();
    const opts = screen.getAllByRole('button');
    expect(opts).toHaveLength(2);
    fireEvent.click(opts.find((b) => b.dataset.answer !== 'yes')!);
    expect(p.reportMistake).toHaveBeenCalledTimes(1);
    fireEvent.click(opts.find((b) => b.dataset.answer === 'yes')!);
    expect(p.sfx.play).toHaveBeenCalledWith('pop');
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).toHaveBeenCalledTimes(1);
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 1 }));
  });

  it('nivel 3: la respuesta correcta es la que coincide con la silueta', () => {
    const p = props(3, 21);
    render(<ShapeShadowRound {...p} />);
    const plan = planShapeShadow(3, 21);
    expect(screen.getAllByRole('button')).toHaveLength(4);
    fireEvent.click(screen.getByTestId(`ss-option-${plan.options.findIndex((o) => o.answer)}`));
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 0 }));
  });
});
