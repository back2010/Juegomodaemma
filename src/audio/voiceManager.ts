import type { Priority, SpeechEngine, VoiceApi } from '@/types';
import type { PhraseParams, PhraseStore } from './phrasebook';

export interface VoiceManager extends VoiceApi {
  unlock(): void;
  setMuted(b: boolean): void;
  setVolume(v: number): void;
  setRate(r: number): void;
  readonly speaking: boolean;
}

interface Item { text: string; key: string; resolve: () => void }

export const watchdogMs = (text: string) => Math.max(3000, text.length * 120);

export interface VoiceManagerOptions {
  engine: SpeechEngine;
  phrases: PhraseStore;
  defaultName?: () => string;
  volume?: number;
  rate?: number;
  muted?: boolean;
  /** Extra al desbloquear (p. ej. AudioContext.resume). */
  onUnlock?: () => void;
}

export function createVoiceManager(opt: VoiceManagerOptions): VoiceManager {
  const { engine, phrases } = opt;
  let muted = opt.muted ?? false;
  let volume = opt.volume ?? 0.8;
  let rate = opt.rate ?? 0.95;
  let current: { finish: () => void } | null = null;
  let pending: Item | null = null;
  let last: { key: string; params?: PhraseParams } | null = null;

  const dropPending = () => { const p = pending; pending = null; p?.resolve(); };

  function play(item: Item): void {
    let finished = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (timer) clearTimeout(timer);
      if (current === handle) current = null;
      item.resolve();
      if (!current && pending) { const n = pending; pending = null; play(n); }
    };
    const handle = { finish };
    current = handle;
    timer = setTimeout(() => { if (!finished) { try { engine.cancel(); } catch { /* noop */ } finish(); } }, watchdogMs(item.text));
    let p: Promise<void>;
    try { p = engine.speak(item.text, { volume, rate, key: item.key } as { volume: number; rate: number }); }
    catch { p = Promise.resolve(); }
    p.then(finish, finish);
  }

  function cancelAll() {
    dropPending();
    const c = current;
    try { engine.cancel(); } catch { /* noop */ }
    c?.finish();
  }

  return {
    get speaking() { return current !== null; },
    say(key, params, o?: { priority?: Priority }) {
      const priority = o?.priority ?? 'instruction';
      if (priority === 'instruction') last = { key, params };
      if (muted) return Promise.resolve();
      if (priority === 'ambient' && (current || pending)) return Promise.resolve();
      const text = phrases.text(key, params, opt.defaultName?.() ?? '');
      if (!text) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const item: Item = { text, key, resolve };
        if (priority === 'instruction') { cancelAll(); play(item); }
        else if (!current) play(item);
        else { dropPending(); pending = item; } // feedback: máx. 1 en espera
      });
    },
    repeatLast() { if (last) void this.say(last.key, last.params, { priority: 'instruction' }); },
    stop() { cancelAll(); },
    unlock() { (engine as { unlock?: () => void }).unlock?.(); opt.onUnlock?.(); },
    setMuted(b) { muted = b; if (b) cancelAll(); },
    setVolume(v) { volume = Math.min(1, Math.max(0, v)); },
    setRate(r) { rate = r; },
  };
}
