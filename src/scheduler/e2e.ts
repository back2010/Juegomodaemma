/** Ganchos para e2e (solo con VITE_E2E): window.__emma.{advanceScheduler, getSchedulerState, forceInvite}. */
import { useScheduler } from '@/store/schedulerStore';
import { getEngine } from './engine';

export function installE2EHooks() {
  const w = window as unknown as { __emma?: Record<string, unknown> };
  w.__emma = {
    ...(w.__emma ?? {}),
    advanceScheduler: (ms: number) => getEngine().advance(ms),
    getSchedulerState: () => ({ ...structuredClone(useScheduler.getState()), elapsedMs: getEngine().elapsed() }),
    forceInvite: () => getEngine().forceInvite(),
  };
}
