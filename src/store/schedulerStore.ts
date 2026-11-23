import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SchedulerState } from '@/types';

/**
 * Estado del scheduler (P8). La lógica vive en `src/scheduler/engine.ts`; este store solo guarda datos.
 * Persistencia: `activeMs`, `targetMs`, `history`, `snapshot`, `current`, `phase` (para sobrevivir a una recarga).
 */
export interface SchedulerStore extends SchedulerState {
  /** 'cooldown' tras "seguir jugando" (targetMs = reinviteMin). */
  phase: 'normal' | 'cooldown';
  /** Actividad elegida para la invitación en curso. */
  invite?: { activityId: string; inviteKey: string };
}

export const initialSchedulerState = (): SchedulerStore => ({
  status: 'counting',
  activeMs: 0,
  segmentStart: null,
  targetMs: 15 * 60_000,
  due: false,
  locks: [],
  pauseReasons: [],
  current: undefined,
  history: [],
  snapshot: undefined,
  phase: 'normal',
  invite: undefined,
});

export const SCHEDULER_STORAGE_KEY = 'emma.scheduler';

export const useScheduler = create<SchedulerStore>()(
  persist(() => initialSchedulerState(), {
    name: SCHEDULER_STORAGE_KEY,
    version: 1,
    partialize: (s) => ({
      activeMs: s.activeMs, targetMs: s.targetMs, history: s.history, snapshot: s.snapshot,
      current: s.current, phase: s.phase,
    }),
  }),
);
