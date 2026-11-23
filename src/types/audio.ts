/** Contratos de audio. CONGELADO tras la etapa 0. */
export type Priority = 'instruction' | 'feedback' | 'ambient';
export type SfxName = 'tap' | 'pop' | 'sparkle' | 'soft' | 'chime' | 'whoosh';

export interface VoiceApi {
  /** Dice una frase registrada con definePhrases (elige una variante). Params: {name},{color},{n}... */
  say(key: string, params?: Record<string, string | number>, opts?: { priority?: Priority }): Promise<void>;
  repeatLast(): void;
  stop(): void;
}
export interface SfxApi { play(name: SfxName): void }

export interface SpeechEngine {
  ready(): Promise<void>;
  speak(text: string, o: { volume: number; rate: number }): Promise<void>;
  cancel(): void;
}
export type PhraseBook = Record<string, string[]>;
