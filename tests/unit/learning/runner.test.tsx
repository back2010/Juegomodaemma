import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useEffect } from 'react';
import type { ActivityDef, ActivityRoundProps } from '@/types';
import { voice, sfx } from '@/audio';
import { activities } from '@/learning/registry';
import { ActivitySession, CELEBRATE_MS, FINALE_MS } from '@/learning/kit/ActivitySession';
import { ChoiceButton } from '@/learning/kit/ChoiceButton';
import { useLearning } from '@/store/learningStore';

vi.mock('@/audio', async () => (await import('./audioMock')).audioMock());

function FakeRound({ voice: v, onRoundDone, reportMistake, level }: ActivityRoundProps) {
  useEffect(() => { void v.say('test.instr', { lvl: level }); }, [v, level]);
  return (
    <div>
      <ChoiceButton testId="answer" label="bien" isAnswer onPress={() => onRoundDone({ mistakes: 0, ms: 10 })}><span /></ChoiceButton>
      <ChoiceButton testId="wrong" label="mal" onPress={reportMistake}><span /></ChoiceButton>
    </div>
  );
}
const def = (estRoundSec: number): ActivityDef => ({
  id: 'fake', category: 'colores', spokenTitleKey: 'x', inviteKey: 'y', Icon: () => null, estRoundSec, maxLevel: 3, Round: FakeRound,
});

function mount(estRoundSec: number, extra: { onExit?: () => void; durationMin?: 2 | 3 | 5 } = {}) {
  activities.push(def(estRoundSec));
  const onComplete = vi.fn();
  render(<ActivitySession activityId="fake" durationMin={extra.durationMin ?? 2} mode="free" onComplete={onComplete} onExit={extra.onExit} />);
  return onComplete;
}
const session = () => screen.getByTestId('activity-session');
const winRound = () => { fireEvent.click(screen.getByTestId('answer')); act(() => { vi.advanceTimersByTime(CELEBRATE_MS); }); };

beforeEach(() => {
  vi.useFakeTimers();
  vi.mocked(voice.say).mockClear(); vi.mocked(sfx.play).mockClear();
  useLearning.getState().resetProgress();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  const i = activities.findIndex((a) => a.id === 'fake');
  if (i >= 0) activities.splice(i, 1);
});

describe('ActivitySession (runner)', () => {
  it('calcula el número de rondas y llama onComplete al final', () => {
    const onComplete = mount(60); // 2*60/60 = 2 rondas
    expect(session().dataset.total).toBe('2');
    winRound();
    expect(session().dataset.round).toBe('1');
    expect(onComplete).not.toHaveBeenCalled();
    winRound();
    expect(screen.getByTestId('session-finale')).toBeTruthy();
    expect(sfx.play).toHaveBeenCalledWith('chime');
    act(() => { vi.advanceTimersByTime(FINALE_MS); });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(useLearning.getState().getProgress('fake').plays).toBe(1);
  });

  it('se corta por tiempo al terminar la ronda en curso', () => {
    const onComplete = mount(10); // 12 rondas previstas
    expect(session().dataset.total).toBe('12');
    act(() => { vi.advanceTimersByTime(2 * 60_000 + 1000); });
    expect(session().dataset.phase).toBe('play'); // no interrumpe la ronda
    winRound();
    expect(session().dataset.phase).toBe('done');
    act(() => { vi.advanceTimersByTime(FINALE_MS); });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('dice la instrucción al empezar cada ronda y el altavoz la repite', () => {
    mount(60);
    expect(voice.say).toHaveBeenCalledWith('test.instr', { lvl: 1 }, undefined);
    vi.mocked(voice.say).mockClear();
    fireEvent.click(screen.getByTestId('activity-repeat'));
    expect(voice.say).toHaveBeenCalledWith('test.instr', { lvl: 1 });
  });

  it('ante un error: pista visual en la respuesta, repite instrucción y sonido suave', () => {
    mount(60);
    expect(screen.getByTestId('answer').dataset.hint).toBe('off');
    vi.mocked(voice.say).mockClear();
    fireEvent.click(screen.getByTestId('wrong'));
    expect(screen.getByTestId('answer').dataset.hint).toBe('on');
    expect(screen.getByTestId('wrong').dataset.hint).toBe('off');
    expect(sfx.play).toHaveBeenCalledWith('soft');
    expect(voice.say).toHaveBeenCalledWith('test.instr', { lvl: 1 });
    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.getByTestId('answer').dataset.hint).toBe('off');
  });

  it('elogio por voz solo 1 de cada 3 rondas', () => {
    mount(10);
    const praises = () => vi.mocked(voice.say).mock.calls.filter(([k]) => String(k).startsWith('learn.praise')).length;
    winRound(); winRound();
    expect(praises()).toBe(0);
    winRound();
    expect(praises()).toBe(1);
  });

  it('sube de nivel tras 3 rondas limpias y lo guarda', () => {
    mount(10);
    winRound(); winRound(); winRound();
    expect(useLearning.getState().getProgress('fake').level).toBe(2);
    expect(session().dataset.level).toBe('2');
  });

  it('botón de salida solo si hay onExit', () => {
    mount(60);
    expect(screen.queryByTestId('activity-exit')).toBeNull();
    cleanup();
    const onExit = vi.fn();
    mount(60, { onExit });
    fireEvent.click(screen.getByTestId('activity-exit'));
    expect(onExit).toHaveBeenCalled();
  });
});
