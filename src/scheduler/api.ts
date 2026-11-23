/**
 * Puente estable entre el scheduler (P8) y el resto (P5, P7). Firmas estables: delega en el motor.
 */
import type { HistoryEntry, PauseReason, SchedulerStatus } from '@/types';
import { getEngine } from './engine';

export const schedulerApi = {
  /** Pausa el conteo por una razón (p.ej. 'learningFree' en el hub, 'parent' en ajustes). */
  pause(reason: PauseReason): void { getEngine().pause(reason); },
  resume(reason: PauseReason): void { getEngine().resume(reason); },
  /** Una actividad educativa se completó fuera del scheduler (modo libre): reinicia el contador. */
  activityCompleted(e: HistoryEntry): void { getEngine().activityCompleted(e); },
  /** Cancela una actividad programada en curso (solo desde la zona de adultos). */
  cancelActivity(): void { getEngine().cancelActivity(); },
  status(): SchedulerStatus { return getEngine().status(); },
};
