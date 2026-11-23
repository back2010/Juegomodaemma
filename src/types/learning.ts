/** Contrato de actividades educativas. CONGELADO tras la etapa 0. */
import type { FC } from 'react';
import type { LearningCategory, DurationMin } from './settings';
import type { SfxApi, VoiceApi } from './audio';

export interface RoundResult { mistakes: number; ms: number }

/** Una actividad implementa SOLO una ronda. La ronda siempre termina con éxito. */
export interface ActivityRoundProps {
  level: number;             // 1..maxLevel
  seed: number;
  voice: VoiceApi;
  sfx: SfxApi;
  onRoundDone(r: RoundResult): void;
  /** Avisar de un intento fallido: el runner da pista visual + repite instrucción. */
  reportMistake(): void;
}

export interface ActivityDef {
  id: string;
  category: LearningCategory;
  spokenTitleKey: string;
  inviteKey: string;
  Icon: FC;
  estRoundSec: number;
  maxLevel: number;
  Round: FC<ActivityRoundProps>;
}

export interface ActivitySessionProps {
  activityId: string;
  durationMin: DurationMin;
  mode: 'scheduler' | 'free';
  onComplete(): void;
  /** undefined en modo obligatorio: no se muestra botón de salida. */
  onExit?(): void;
}

export interface ActivityProgress { level: number; streak: number; struggle: number; plays: number; lastPlayed: number }
export interface HistoryEntry { activityId: string; category: LearningCategory; at: number }
export interface LearningProgress {
  v: 1;
  perActivity: Record<string, ActivityProgress>;
  /** Últimas 20 sesiones. */
  history: HistoryEntry[];
}
