/** Motores de voz intercambiables: Web Speech API y clips pregrabados. */
import type { SpeechEngine } from '@/types';

/** Elige voz: voiceURI explícito; si no, es-MX → es-US → es-419 → es-*, preferiendo locales. */
export function pickVoice(voices: SpeechSynthesisVoice[], voiceURI?: string): SpeechSynthesisVoice | null {
  if (voiceURI) {
    const v = voices.find((x) => x.voiceURI === voiceURI);
    if (v) return v;
  }
  const norm = (l: string) => l.toLowerCase().replace('_', '-');
  for (const lang of ['es-mx', 'es-us', 'es-419']) {
    const m = voices.filter((v) => norm(v.lang) === lang);
    if (m.length) return m.find((v) => v.localService) ?? m[0];
  }
  const any = voices.filter((v) => norm(v.lang).startsWith('es'));
  return any.find((v) => v.localService) ?? any[0] ?? null;
}

export const VOICES_TIMEOUT_MS = 1500;

export class WebSpeechEngine implements SpeechEngine {
  private readyP: Promise<void> | null = null;
  constructor(
    private getVoiceURI: () => string | undefined = () => undefined,
    private synthOverride?: SpeechSynthesis,
  ) {}

  private get synth(): SpeechSynthesis | undefined {
    return this.synthOverride ?? (typeof speechSynthesis !== 'undefined' ? speechSynthesis : undefined);
  }

  ready(): Promise<void> {
    const s = this.synth;
    if (!s) return Promise.resolve();
    if (this.readyP) return this.readyP;
    this.readyP = new Promise<void>((resolve) => {
      let done = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const finish = () => {
        if (done) return;
        done = true;
        if (timer) clearTimeout(timer);
        try { s.removeEventListener?.('voiceschanged', onChange); } catch { /* noop */ }
        resolve();
      };
      const onChange = () => { if (s.getVoices().length) finish(); };
      try {
        if (s.getVoices().length) return finish();
        s.addEventListener?.('voiceschanged', onChange);
      } catch { return finish(); }
      timer = setTimeout(finish, VOICES_TIMEOUT_MS);
    });
    return this.readyP;
  }

  voice(): SpeechSynthesisVoice | null {
    try { return this.synth ? pickVoice(this.synth.getVoices(), this.getVoiceURI()) : null; } catch { return null; }
  }

  async speak(text: string, o: { volume: number; rate: number }): Promise<void> {
    const s = this.synth;
    if (!s || !text) return;
    await this.ready();
    const voice = this.voice();
    if (!voice) return; // sin voz en español: silencio
    return new Promise<void>((resolve) => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.voice = voice; u.lang = voice.lang; u.volume = o.volume; u.rate = o.rate;
        u.onend = () => resolve();
        u.onerror = () => resolve();
        s.speak(u);
      } catch { resolve(); }
    });
  }

  cancel() { try { this.synth?.cancel(); } catch { /* noop */ } }

  /** Desbloqueo iOS: utterance vacía a volumen 0 (dentro de un gesto). */
  unlock() {
    const s = this.synth;
    if (!s || typeof SpeechSynthesisUtterance === 'undefined') return;
    try {
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      s.speak(u);
    } catch { /* noop */ }
  }
}

export interface ClipOptions { volume: number; rate: number; key?: string }

/**
 * Audios pregrabados por clave. `urlFor(key, text)` devuelve la URL del clip o undefined.
 * Si no hay clip, delega en `fallback` (p. ej. WebSpeechEngine) o calla.
 */
export class ClipEngine implements SpeechEngine {
  private el: HTMLAudioElement | null = null;
  private stopCurrent: (() => void) | null = null;
  constructor(
    private urlFor: (key: string, text: string) => string | undefined = () => undefined,
    private fallback?: SpeechEngine,
    private createAudio: () => HTMLAudioElement = () => new Audio(),
  ) {}

  ready() { return this.fallback?.ready() ?? Promise.resolve(); }

  speak(text: string, o: ClipOptions): Promise<void> {
    const url = o.key ? this.urlFor(o.key, text) : undefined;
    if (!url) return this.fallback ? this.fallback.speak(text, o) : Promise.resolve();
    return new Promise<void>((resolve) => {
      try {
        this.cancel();
        const a = this.el ?? (this.el = this.createAudio());
        a.src = url; a.volume = o.volume; a.playbackRate = o.rate;
        const done = () => { a.onended = null; a.onerror = null; this.stopCurrent = null; resolve(); };
        this.stopCurrent = done;
        a.onended = done; a.onerror = done;
        void a.play()?.catch(done);
      } catch { resolve(); }
    });
  }

  cancel() {
    this.fallback?.cancel();
    const a = this.el;
    const stop = this.stopCurrent;
    try { a?.pause(); } catch { /* noop */ }
    stop?.();
  }
}
