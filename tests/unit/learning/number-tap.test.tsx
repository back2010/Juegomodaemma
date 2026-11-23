import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { ActivityRoundProps, RoundResult } from '@/types';
import { NumberTapRound, planNumberTap } from '@/learning/activities/number-tap/NumberTapRound';

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

describe('number-tap · plan', () => {
  it.each([[1, 2, 3], [2, 3, 5], [3, 3, 10]])('nivel %i → %i grupos, cantidades distintas entre 1 y %i', (level, options, max) => {
    for (let s = 1; s < 80; s++) {
      const p = planNumberTap(level, s);
      if (p.mode !== 'choice') throw new Error('se esperaba elección');
      expect(p.options).toHaveLength(options);
      expect(p.options.filter((o) => o.answer)).toHaveLength(1);
      expect(p.options.find((o) => o.answer)!.n).toBe(p.target);
      expect(new Set(p.options.map((o) => o.n)).size).toBe(options);
      for (const o of p.options) {
        expect(o.n).toBeGreaterThanOrEqual(1);
        expect(o.n).toBeLessThanOrEqual(max);
      }
    }
  });

  it('nivel 4 es arrastrar hasta N, con objetos de sobra en la bandeja', () => {
    for (let s = 1; s < 40; s++) {
      const p = planNumberTap(4, s);
      if (p.mode !== 'drag') throw new Error('se esperaba arrastre');
      expect(p.target).toBeGreaterThanOrEqual(2);
      expect(p.total).toBe(p.target + 2);
    }
  });
});

describe('number-tap · elegir grupo', () => {
  it('dice la cantidad, muestra grupos del tamaño pedido, reporta errores y completa', () => {
    const p = props(2, 5);
    const plan = planNumberTap(2, 5);
    if (plan.mode !== 'choice') throw new Error('se esperaba elección');
    render(<NumberTapRound {...p} />);

    const [key, params] = p.voice.say.mock.calls[0] as unknown as [string, { n: string; thing: string }];
    expect(key).toBe('nt.pick');
    expect(params.n).not.toMatch(/\d/);
    expect(params.thing).toMatch(/^(estrella|estrellas|corazón|corazones|flor|flores)$/);

    const opts = screen.getAllByRole('button');
    expect(opts).toHaveLength(3);
    opts.forEach((b, i) => {
      expect(b.querySelector('.nt-group')!.children).toHaveLength(plan.options[i].n);
    });

    const wrong = opts.find((b) => b.dataset.answer !== 'yes')!;
    fireEvent.click(wrong);
    expect(p.reportMistake).toHaveBeenCalledTimes(1);

    fireEvent.click(opts.find((b) => b.dataset.answer === 'yes')!);
    expect(p.sfx.play).toHaveBeenCalledWith('pop');
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).toHaveBeenCalledTimes(1);
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 1 }));
  });
});

describe('number-tap · arrastrar al vestido (nivel 4)', () => {
  it('no es error pasarse: se quita tocando y termina solo en exacto N', () => {
    const p = props(4, 11);
    const plan = planNumberTap(4, 11);
    if (plan.mode !== 'drag') throw new Error('se esperaba arrastre');
    const { container } = render(<NumberTapRound {...p} />);
    expect(p.voice.say).toHaveBeenCalledWith('nt.put', expect.objectContaining({ n: expect.any(String) }));

    const dress = container.querySelector('[data-drop-id="dress"]') as HTMLElement;
    const original = Object.getOwnPropertyDescriptor(document, 'elementsFromPoint');
    Object.defineProperty(document, 'elementsFromPoint', { value: () => [dress], configurable: true });

    const dropOne = () => {
      const tray = screen.getAllByTestId(/^nt-tray-/)[0];
      fireEvent.pointerDown(tray);
      fireEvent.pointerUp(tray);
    };

    try {
      for (let i = 0; i < plan.target; i++) dropOne();
      expect(screen.getAllByTestId(/^nt-in-/)).toHaveLength(plan.target);

      // Se pasa de N antes de que termine el instante: no termina.
      dropOne();
      expect(screen.getAllByTestId(/^nt-in-/)).toHaveLength(plan.target + 1);
      act(() => { vi.advanceTimersByTime(1000); });
      expect(p.onRoundDone).not.toHaveBeenCalled();

      // Quita uno tocándolo: vuelve a N y termina.
      fireEvent.click(screen.getByTestId('nt-in-0'));
      expect(screen.getAllByTestId(/^nt-in-/)).toHaveLength(plan.target);
      act(() => { vi.advanceTimersByTime(1000); });
      expect(p.onRoundDone).toHaveBeenCalledTimes(1);
      expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 0 }));
      expect(p.reportMistake).not.toHaveBeenCalled();
    } finally {
      if (original) Object.defineProperty(document, 'elementsFromPoint', original);
      else delete (document as unknown as { elementsFromPoint?: unknown }).elementsFromPoint;
    }
  });
});
