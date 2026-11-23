/**
 * Fachada de audio. STUB de la etapa 0 (P6 la reemplaza por VoiceManager + SoundEffects reales).
 * Contrato estable: `voice` (VoiceApi + unlock), `sfx` (SfxApi), `definePhrases`.
 */
import type { PhraseBook, Priority, SfxApi, SfxName, VoiceApi } from '@/types';
import { getSettings } from '@/store/settingsStore';

const book: PhraseBook = {};
/** Registra frases por clave (variantes). Usar {name},{color},{n}... como parámetros. */
export function definePhrases(p: PhraseBook) { Object.assign(book, p); }
export function phraseText(key: string, params: Record<string, string | number> = {}) {
  const vs = book[key];
  if (!vs?.length) return '';
  const t = vs[Math.floor(Math.random() * vs.length)];
  return t.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? (k === 'name' ? getSettings().game.childName : '')));
}

let last: { key: string; params?: Record<string, string | number> } | null = null;
export const voice: VoiceApi & { unlock(): void } = {
  async say(key, params, opts?: { priority?: Priority }) {
    if ((opts?.priority ?? 'instruction') === 'instruction') last = { key, params };
    const s = getSettings().audio;
    const text = phraseText(key, params);
    if (!text || !s.voiceOn || typeof speechSynthesis === 'undefined') return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-MX'; u.volume = s.volume; u.rate = s.rate;
    speechSynthesis.speak(u);
  },
  repeatLast() { if (last) void voice.say(last.key, last.params); },
  stop() { if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel(); },
  unlock() {},
};

export const sfx: SfxApi = { play(_n: SfxName) {} };

/** Voces en español disponibles (para la zona de adultos). */
export function listVoices(): SpeechSynthesisVoice[] {
  if (typeof speechSynthesis === 'undefined') return [];
  return speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('es'));
}
/** Reproduce una frase de prueba con la configuración actual. */
export function testVoice() { definePhrases({ 'audio.test': ['¡Hola! Así sueno yo'] }); void voice.say('audio.test'); }
