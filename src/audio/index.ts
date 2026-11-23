/**
 * Fachada de audio (P6). Contrato estable: `voice` (VoiceApi + unlock), `sfx`, `definePhrases`,
 * `phraseText`, `listVoices`, `testVoice`.
 */
import type { PhraseBook, SfxApi } from '@/types';
import { getSettings, useSettings } from '@/store/settingsStore';
import { PhraseStore, type PhraseParams } from './phrasebook';
import { WebSpeechEngine, ClipEngine, pickVoice } from './engines';
import { createVoiceManager, type VoiceManager } from './voiceManager';
import { SoundEffects } from './sfx';
import { BASE_PHRASES } from './phrases';

const phrases = new PhraseStore();
phrases.define(BASE_PHRASES);

/** Registra frases por clave (variantes). Usar {name},{color},{n}... como parámetros. */
export function definePhrases(p: PhraseBook) { phrases.define(p); }
export function phraseText(key: string, params: PhraseParams = {}) {
  return phrases.text(key, params, getSettings().game.childName);
}

const webEngine = new WebSpeechEngine(() => getSettings().audio.voiceURI);
/** Clips pregrabados (aún sin archivos): si no hay clip, usa la voz del sistema. */
export const clipEngine = new ClipEngine(() => undefined, webEngine);

const effects = new SoundEffects(() => getSettings().audio);

let hooked = false;
const a0 = getSettings().audio;
const manager: VoiceManager = createVoiceManager({
  engine: clipEngine, phrases,
  defaultName: () => getSettings().game.childName,
  volume: a0.volume, rate: a0.rate, muted: !a0.voiceOn,
  onUnlock: () => {
    effects.resume();
    if (hooked || typeof document === 'undefined') return;
    hooked = true;
    // Respaldo: primer pointerdown en captura.
    const once = () => { voice.unlock(); document.removeEventListener('pointerdown', once, true); };
    document.addEventListener('pointerdown', once, true);
  },
});
useSettings.subscribe((s) => {
  manager.setMuted(!s.audio.voiceOn);
  manager.setVolume(s.audio.volume);
  manager.setRate(s.audio.rate);
});

export const voice: VoiceManager = manager;
export const sfx: SfxApi = effects;

/** Voces en español disponibles (para la zona de adultos). */
export function listVoices(): SpeechSynthesisVoice[] {
  if (typeof speechSynthesis === 'undefined') return [];
  return speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('es'));
}
/** Reproduce una frase de prueba con la configuración actual. */
export function testVoice() { void voice.say('audio.test'); }

export { pickVoice, WebSpeechEngine, ClipEngine, createVoiceManager, SoundEffects, PhraseStore };
export type { VoiceManager };
