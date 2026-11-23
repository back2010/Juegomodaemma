/** Contratos del scheduler. CONGELADO tras la etapa 0. */
import type { HistoryEntry } from './learning';
import type { DollLook } from './look';
import type { Scene } from './look';
import type { MakeupKind } from './catalog';

export type Screen =
  | { name: 'home' } | { name: 'salon' } | { name: 'photo' } | { name: 'gallery' }
  | { name: 'learning' } | { name: 'parent' };

export type EditorTab = 'makeup' | 'hair' | 'clothes' | 'accessories' | 'stickers';
export type Overlay = 'none' | 'invite' | 'activity' | 'parent';

export interface PhotoState { scene: Scene; editingCreationId?: string }

export type SchedulerStatus = 'disabled' | 'counting' | 'paused' | 'invitePending' | 'inActivity' | 'cooldown';
export type PauseReason = 'hidden' | 'idle' | 'parent' | 'learningFree' | 'activity' | 'lock';

export interface GameSnapshot {
  screen: Screen;
  selectedDollId: string;
  looks: Record<string, DollLook>;
  editorTab: EditorTab;
  subTab: string | MakeupKind;
  photo: PhotoState;
}

export interface SchedulerState {
  status: SchedulerStatus;
  activeMs: number;
  segmentStart: number | null;
  targetMs: number;
  due: boolean;
  locks: string[];
  pauseReasons: PauseReason[];
  current?: { activityId: string; startedAt: number };
  history: HistoryEntry[];
  snapshot?: GameSnapshot;
}
