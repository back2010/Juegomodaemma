import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useLearning } from '@/store/learningStore';
import { CELEBRATE_MS, FINALE_MS } from '@/learning/kit/ActivitySession';
import { vi } from 'vitest';
import { schedulerApi } from '@/scheduler/api';
import { LearningHub, pickActivity } from '@/learning/LearningHub';
import { activities } from '@/learning/registry';

vi.mock('@/audio', async () => (await import('./audioMock')).audioMock());

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

/** Con varias actividades por categoría, fuerza que 'color-find' sea la menos reciente. */
function preferColorFind() {
  for (const a of activities) if (a.category === 'colores' && a.id !== 'color-find')
    useLearning.getState().setProgress(a.id, { level: 1, streak: 0, struggle: 0, plays: 1, lastPlayed: Date.now() });
}

describe('LearningHub', () => {
  it('pausa el scheduler mientras está abierto y reanuda al salir', () => {
    const pause = vi.spyOn(schedulerApi, 'pause');
    const resume = vi.spyOn(schedulerApi, 'resume');
    const { unmount } = render(<LearningHub />);
    expect(pause).toHaveBeenCalledWith('learningFree');
    unmount();
    expect(resume).toHaveBeenCalledWith('learningFree');
  });

  it('categorías sin actividades atenuadas e inactivas; las demás abren una sesión', () => {
    render(<LearningHub />);
    expect(screen.getAllByTestId(/^learn-cat-/)).toHaveLength(6);
    const numeros = screen.getByTestId('learn-cat-numeros');
    if (!activities.some((a) => a.category === 'numeros')) {
      expect((numeros as HTMLButtonElement).disabled).toBe(true);
      fireEvent.click(numeros);
      expect(screen.queryByTestId('activity-session')).toBeNull();
    }
    preferColorFind();
    fireEvent.click(screen.getByTestId('learn-cat-colores'));
    expect(screen.getByTestId('activity-session').dataset.activity).toBe('color-find');
    expect(screen.getByTestId('activity-exit')).toBeTruthy();
    fireEvent.click(screen.getByTestId('activity-exit'));
    expect(screen.getByTestId('learning-hub')).toBeTruthy();
  });

  it('al completar: activityCompleted + recordSession y vuelve al hub', () => {
    vi.useFakeTimers();
    useLearning.getState().resetProgress();
    const done = vi.spyOn(schedulerApi, 'activityCompleted');
    preferColorFind();
    render(<LearningHub />);
    fireEvent.click(screen.getByTestId('learn-cat-colores'));
    act(() => { vi.advanceTimersByTime(5 * 60_000); }); // se acabó el tiempo: termina con esta ronda
    const answer = screen.getAllByRole('button').find((b) => b.dataset.answer === 'yes')!;
    fireEvent.click(answer);
    act(() => { vi.advanceTimersByTime(700); });
    act(() => { vi.advanceTimersByTime(CELEBRATE_MS); });
    act(() => { vi.advanceTimersByTime(FINALE_MS); });
    expect(done).toHaveBeenCalledWith(expect.objectContaining({ activityId: 'color-find', category: 'colores' }));
    expect(useLearning.getState().history.at(-1)?.activityId).toBe('color-find');
    expect(screen.getByTestId('learning-hub')).toBeTruthy();
    vi.useRealTimers();
  });

  it('pickActivity elige la menos reciente', () => {
    const list = activities.slice(0, 2);
    if (list.length < 2) return;
    const prog = { [list[0].id]: { level: 1, streak: 0, struggle: 0, plays: 1, lastPlayed: 100 } };
    expect(pickActivity(list, prog)?.id).toBe(list[1].id);
  });
});
