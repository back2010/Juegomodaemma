import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import type { ActivityRoundProps, RoundResult } from '@/types';
import { ColorFindRound, planColorFind } from '@/learning/activities/color-find/ColorFindRound';
import { MemoryRound, planMemory } from '@/learning/activities/memory-pairs/MemoryRound';
import { activities, getActivity } from '@/learning/registry';

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

describe('registro', () => {
  it('contiene color-find y memory-pairs completos', () => {
    for (const id of ['color-find', 'memory-pairs']) {
      const a = getActivity(id)!;
      expect(a).toBeTruthy();
      expect(a.inviteKey).toBeTruthy();
      expect(a.maxLevel).toBeGreaterThanOrEqual(4);
    }
    expect(new Set(activities.map((a) => a.id)).size).toBe(activities.length);
  });
});

describe('color-find', () => {
  it.each([[1, 2], [2, 3], [3, 5], [4, 5]])('nivel %i → %i opciones con una sola respuesta', (level, n) => {
    for (let s = 1; s < 30; s++) {
      const p = planColorFind(level, s);
      expect(p.options).toHaveLength(n);
      expect(p.options.filter((o) => o.answer)).toHaveLength(1);
      if (level === 4) {
        // combinar: solo una opción coincide en color Y figura
        expect(p.options.filter((o) => o.color === p.target.color && o.shape === p.target.shape)).toHaveLength(1);
      } else {
        expect(new Set(p.options.map((o) => o.color)).size).toBe(n);
      }
    }
  });

  it('dice la instrucción, reporta errores y completa la ronda', () => {
    const p = props(2);
    render(<ColorFindRound {...p} />);
    expect(p.voice.say).toHaveBeenCalledWith('cf.find', expect.objectContaining({ color: expect.any(String) }));
    const opts = screen.getAllByRole('button');
    expect(opts).toHaveLength(3);
    const wrong = opts.find((b) => b.dataset.answer !== 'yes')!;
    fireEvent.click(wrong);
    expect(p.reportMistake).toHaveBeenCalledTimes(1);
    fireEvent.click(opts.find((b) => b.dataset.answer === 'yes')!);
    expect(p.sfx.play).toHaveBeenCalledWith('pop');
    act(() => { vi.advanceTimersByTime(700); });
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 1 }));
  });

  it('nivel 4 pide combinación con concordancia', () => {
    const p = props(4, 9);
    render(<ColorFindRound {...p} />);
    const [key, params] = p.voice.say.mock.calls[0] as unknown as [string, { thing: string }];
    expect(key).toBe('cf.combo');
    expect(params.thing).toMatch(/^(el|la) /);
  });
});

describe('memory-pairs', () => {
  it.each([[1, 4], [2, 6], [3, 8], [4, 12]])('nivel %i → %i cartas en parejas', (level, n) => {
    const p = planMemory(level, 5);
    expect(p.cards).toHaveLength(n);
    for (const k of new Set(p.cards)) expect(p.cards.filter((c) => c === k)).toHaveLength(2);
  });

  it('se juega hasta encontrar todas las parejas', () => {
    const p = props(1, 77);
    render(<MemoryRound {...p} />);
    expect(p.voice.say).toHaveBeenCalledWith('mp.find');
    const cards = () => screen.getAllByTestId(/^mp-card-/);
    expect(cards()).toHaveLength(4);
    const keys = planMemory(1, 77).cards;
    const pairs = [...new Set(keys)].map((k) => keys.flatMap((x, i) => (x === k ? [i] : [])));
    for (const [a, b] of pairs) {
      fireEvent.click(screen.getByTestId(`mp-card-${a}`));
      fireEvent.click(screen.getByTestId(`mp-card-${b}`));
      act(() => { vi.advanceTimersByTime(500); });
    }
    act(() => { vi.advanceTimersByTime(800); });
    expect(p.onRoundDone).toHaveBeenCalledWith(expect.objectContaining({ mistakes: 0 }));
  });

  it('solo cuenta error al fallar una pareja ya vista, y marca la carta correcta', () => {
    const p = props(2, 3);
    render(<MemoryRound {...p} />);
    const keys = planMemory(2, 3).cards;
    const a = 0;
    const partner = keys.findIndex((k, i) => i !== a && k === keys[a]);
    const other = keys.findIndex((k, i) => i !== a && k !== keys[a]);
    // Exploración: ver partner (y otra) sin culpa.
    fireEvent.click(screen.getByTestId(`mp-card-${partner}`));
    fireEvent.click(screen.getByTestId(`mp-card-${other}`));
    act(() => { vi.advanceTimersByTime(1100); });
    expect(p.reportMistake).not.toHaveBeenCalled();
    // Ahora abre 'a' y falla aunque ya vio su pareja → error con pista en la pareja.
    fireEvent.click(screen.getByTestId(`mp-card-${a}`));
    fireEvent.click(screen.getByTestId(`mp-card-${other}`));
    expect(p.reportMistake).toHaveBeenCalledTimes(1);
  });
});
