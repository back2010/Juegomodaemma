import { fireEvent, render, screen } from '@testing-library/react';
import { ParentSettings } from '@/settings/ParentSettings';
import { useSettings } from '@/store/settingsStore';
import { schedulerApi } from '@/scheduler/api';
import { DEFAULT_SETTINGS } from '@/types';

describe('ParentSettings', () => {
  beforeEach(() => useSettings.setState(structuredClone(DEFAULT_SETTINGS)));

  it('cambia ajustes del scheduler, audio y juego', () => {
    render(<ParentSettings />);
    fireEvent.click(screen.getByTestId('interval-30'));
    fireEvent.click(screen.getByTestId('duration-5'));
    fireEvent.click(screen.getByTestId('mode-mandatory'));
    fireEvent.click(screen.getByTestId('cat-colores'));
    fireEvent.click(screen.getByTestId('voice-on'));
    fireEvent.change(screen.getByTestId('child-name'), { target: { value: 'Ema' } });
    const s = useSettings.getState();
    expect(s.scheduler.intervalMin).toBe(30);
    expect(s.scheduler.durationMin).toBe(5);
    expect(s.scheduler.mode).toBe('mandatory');
    expect(s.scheduler.categories.colores).toBe(false);
    expect(s.audio.voiceOn).toBe(false);
    expect(s.game.childName).toBe('Ema');
  });
  it('"todas" activa/desactiva las categorías', () => {
    render(<ParentSettings />);
    fireEvent.click(screen.getByTestId('cat-all'));
    expect(Object.values(useSettings.getState().scheduler.categories).every((v) => !v)).toBe(true);
    fireEvent.click(screen.getByTestId('cat-all'));
    expect(Object.values(useSettings.getState().scheduler.categories).every(Boolean)).toBe(true);
  });
  it('pausa el scheduler mientras está abierta y reanuda al salir', () => {
    const pause = vi.spyOn(schedulerApi, 'pause'); const resume = vi.spyOn(schedulerApi, 'resume');
    const { unmount } = render(<ParentSettings />);
    expect(pause).toHaveBeenCalledWith('parent');
    unmount();
    expect(resume).toHaveBeenCalledWith('parent');
  });
  it('borrar galería pide confirmación', () => {
    render(<ParentSettings />);
    fireEvent.click(screen.getByTestId('clear-gallery'));
    expect(screen.getByTestId('clear-gallery-confirm')).toBeTruthy();
  });
});
