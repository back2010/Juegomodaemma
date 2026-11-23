import { useSettings, getSettings } from '@/store/settingsStore';
import { DEFAULT_SETTINGS } from '@/types';

describe('settings', () => {
  it('valores predeterminados de la especificación', () => {
    const s = getSettings();
    expect(s.scheduler.intervalMin).toBe(15);
    expect(s.scheduler.durationMin).toBe(3);
    expect(s.scheduler.mode).toBe('optional');
    expect(Object.values(s.scheduler.categories).every(Boolean)).toBe(true);
  });
  it('actualizaciones parciales conservan el resto', () => {
    useSettings.getState().updateScheduler({ intervalMin: 30 });
    expect(getSettings().scheduler.durationMin).toBe(3);
    useSettings.getState().resetSettings();
    expect(getSettings()).toEqual(DEFAULT_SETTINGS);
  });
});
