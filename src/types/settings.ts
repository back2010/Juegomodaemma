/** Configuración de adultos. CONGELADO tras la etapa 0. */
export type LearningCategory = 'colores' | 'figuras' | 'numeros' | 'memoria' | 'patrones' | 'clasificacion';
export const LEARNING_CATEGORIES: LearningCategory[] = [
  'colores', 'figuras', 'numeros', 'memoria', 'patrones', 'clasificacion',
];

export type IntervalMin = 0 | 10 | 15 | 20 | 30;
export type DurationMin = 2 | 3 | 5;
export type ParticipationMode = 'optional' | 'mandatory';

export interface Settings {
  v: 1;
  scheduler: {
    intervalMin: IntervalMin;
    durationMin: DurationMin;
    mode: ParticipationMode;
    categories: Record<LearningCategory, boolean>;
    /** Minutos para volver a invitar tras "seguir jugando". */
    reinviteMin: number;
  };
  audio: { voiceOn: boolean; sfxOn: boolean; volume: number; voiceURI?: string; rate: number };
  game: { childName: string; salonChallenges: boolean; idlePauseSec: number };
}

export const DEFAULT_SETTINGS: Settings = {
  v: 1,
  scheduler: {
    intervalMin: 15,
    durationMin: 3,
    mode: 'optional',
    categories: { colores: true, figuras: true, numeros: true, memoria: true, patrones: true, clasificacion: true },
    reinviteMin: 5,
  },
  audio: { voiceOn: true, sfxOn: true, volume: 0.8, rate: 0.95 },
  game: { childName: 'Emma', salonChallenges: true, idlePauseSec: 90 },
};
