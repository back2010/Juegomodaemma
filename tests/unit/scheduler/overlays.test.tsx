import { render, screen, fireEvent, cleanup, act as rtlAct } from '@testing-library/react';
import type { ActivitySessionProps } from '@/types';
import { SchedulerHost } from '@/scheduler/SchedulerHost';
import { setEngine } from '@/scheduler/engine';
import { useSettings } from '@/store/settingsStore';
import { useDolls } from '@/store/dollStore';
import { useGame } from '@/store/gameStore';
import { MIN, sched, setup } from './helpers';

const sessionProps: ActivitySessionProps[] = [];
vi.mock('@/learning/kit/ActivitySession', () => ({
  ActivitySession: (p: ActivitySessionProps) => {
    sessionProps.push(p);
    return <button data-testid="activity-complete" onClick={p.onComplete} />;
  },
}));

afterEach(() => { cleanup(); setEngine(null); sessionProps.length = 0; });

function invite(mode: 'optional' | 'mandatory') {
  const h = setup();
  useSettings.getState().updateScheduler({ intervalMin: 10, mode, durationMin: 5 });
  render(<SchedulerHost />);
  rtlAct(() => h.clock.advance(10 * MIN));
  return h;
}

describe('overlays', () => {
  it('opcional: dos botones grandes; seguir jugando cierra sin bloquear', () => {
    invite('optional');
    expect(screen.getByTestId('invite-play')).toBeTruthy();
    expect(screen.getByTestId('invite-play').className).toContain('lg');
    fireEvent.click(screen.getByTestId('invite-keep'));
    expect(screen.queryByTestId('scheduler-invite')).toBeNull();
    expect(sched().status).toBe('cooldown');
  });

  it('obligatorio: solo JUGAR y la actividad no tiene salida', () => {
    invite('mandatory');
    expect(screen.queryByTestId('invite-keep')).toBeNull();
    fireEvent.click(screen.getByTestId('invite-play'));
    expect(screen.getByTestId('scheduler-activity')).toBeTruthy();
    const p = sessionProps.at(-1)!;
    expect(p.onExit).toBeUndefined();
    expect(p.mode).toBe('scheduler');
    expect(p.durationMin).toBe(5);
  });

  it('opcional: la actividad ofrece salida', () => {
    invite('optional');
    fireEvent.click(screen.getByTestId('invite-play'));
    expect(typeof sessionProps.at(-1)!.onExit).toBe('function');
  });

  it('al completar se cierra y el look no cambia', () => {
    const h = setup();
    useDolls.getState().setHairColor({ mode: 'solid', a: '#010203' });
    const look = structuredClone(useDolls.getState().looks);
    useSettings.getState().updateScheduler({ intervalMin: 10 });
    render(<SchedulerHost />);
    rtlAct(() => h.clock.advance(10 * MIN));
    fireEvent.click(screen.getByTestId('invite-play'));
    fireEvent.click(screen.getByTestId('activity-complete'));
    expect(screen.queryByTestId('scheduler-activity')).toBeNull();
    expect(useGame.getState().overlay).toBe('none');
    expect(useDolls.getState().looks).toEqual(look);
  });
});
