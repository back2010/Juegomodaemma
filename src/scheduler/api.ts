/**
 * Puente estable entre el scheduler (P8) y el resto (P5, P7). STUB de P0: P8 lo implementa
 * conservando estas firmas.
 */
import type { HistoryEntry, PauseReason, SchedulerStatus } from '@/types';

export const schedulerApi = {
  /** Pausa el conteo por una razón (p.ej. 'learningFree' en el hub, 'parent' en ajustes). */
  pause(_reason: PauseReason): void {},
  resume(_reason: PauseReason): void {},
  /** Una actividad educativa se completó fuera del scheduler (modo libre): reinicia el contador. */
  activityCompleted(_e: HistoryEntry): void {},
  /** Cancela una actividad programada en curso (solo desde la zona de adultos). */
  cancelActivity(): void {},
  status(): SchedulerStatus { return 'disabled'; },
};
