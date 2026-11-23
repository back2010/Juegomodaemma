import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { SpeechEngine } from '@/types';
import { PhraseStore } from '@/audio/phrasebook';
import { createVoiceManager } from '@/audio/voiceManager';
import { pickVoice, WebSpeechEngine } from '@/audio/engines';
import { SoundEffects } from '@/audio/sfx';
import { BASE_PHRASES } from '@/audio/phrases';

class FakeEngine implements SpeechEngine {
  spoken: string[] = [];
  cancels = 0;
  private resolvers: Array<() => void> = [];
  manual = true;
  ready() { return Promise.resolve(); }
  speak(text: string) {
    this.spoken.push(text);
    return new Promise<void>((r) => { this.resolvers.push(r); if (!this.manual) r(); });
  }
  cancel() { this.cancels++; const rs = this.resolvers; this.resolvers = []; rs.forEach((r) => r()); }
  endCurrent() { this.resolvers.shift()?.(); }
}
const flush = () => new Promise((r) => setTimeout(r, 0));

function setup(book: Record<string, string[]>) {
  const engine = new FakeEngine();
  const phrases = new PhraseStore();
  phrases.define(book);
  const vm = createVoiceManager({ engine, phrases, defaultName: () => 'Emma' });
  return { engine, vm, phrases };
}

describe('VoiceManager prioridades', () => {
  it('instruction cancela lo que suena', async () => {
    const { engine, vm } = setup({ a: ['A'], b: ['B'] });
    void vm.say('a');
    await flush();
    void vm.say('b');
    await flush();
    expect(engine.cancels).toBeGreaterThan(0);
    expect(engine.spoken).toEqual(['A', 'B']);
  });
  it('feedback se encola con máx. 1 en espera', async () => {
    const { engine, vm } = setup({ a: ['A'], f1: ['F1'], f2: ['F2'] });
    void vm.say('a');
    void vm.say('f1', {}, { priority: 'feedback' });
    const p2 = vm.say('f2', {}, { priority: 'feedback' });
    await flush();
    expect(engine.spoken).toEqual(['A']);
    engine.endCurrent();
    await flush();
    expect(engine.spoken).toEqual(['A', 'F2']);
    engine.endCurrent();
    await p2;
  });
  it('ambient se descarta si algo suena', async () => {
    const { engine, vm } = setup({ a: ['A'], x: ['X'] });
    void vm.say('a');
    await vm.say('x', {}, { priority: 'ambient' });
    expect(engine.spoken).toEqual(['A']);
    engine.endCurrent(); await flush();
    void vm.say('x', {}, { priority: 'ambient' });
    expect(engine.spoken).toEqual(['A', 'X']);
  });
  it('repeatLast repite la última instruction, no feedback', async () => {
    const { engine, vm } = setup({ a: ['A'], f: ['F'] });
    void vm.say('a'); engine.endCurrent(); await flush();
    void vm.say('f', {}, { priority: 'feedback' }); engine.endCurrent(); await flush();
    vm.repeatLast(); await flush();
    expect(engine.spoken).toEqual(['A', 'F', 'A']);
  });
  it('mute no habla y setMuted corta', async () => {
    const { engine, vm } = setup({ a: ['A'] });
    void vm.say('a'); await flush();
    vm.setMuted(true);
    expect(vm.speaking).toBe(false);
    await vm.say('a');
    expect(engine.spoken).toEqual(['A']);
  });
  it('sustituye parámetros y nombre por defecto', async () => {
    const { engine, vm } = setup({ a: ['Hola {name}, busca {color} {n}'] });
    void vm.say('a', { color: 'rosa', n: 3 });
    expect(engine.spoken[0]).toBe('Hola Emma, busca rosa 3');
  });
  it('clave desconocida no falla', async () => {
    const { vm } = setup({});
    await expect(vm.say('nada')).resolves.toBeUndefined();
  });
});

describe('variación', () => {
  it('no repite las 2 últimas variantes', () => {
    const ps = new PhraseStore();
    ps.define({ k: ['a', 'b', 'c', 'd'] });
    let prev: string[] = [];
    for (let i = 0; i < 200; i++) {
      const t = ps.text('k');
      expect(prev).not.toContain(t);
      prev = [...prev, t].slice(-2);
    }
  });
  it('con una sola variante funciona', () => {
    const ps = new PhraseStore();
    ps.define({ k: ['a'] });
    expect(ps.text('k')).toBe('a');
    expect(ps.text('k')).toBe('a');
  });
});

describe('watchdog', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });
  it('cancela y resuelve si el motor se cuelga', async () => {
    const { engine, vm } = setup({ a: ['Hola'] });
    let done = false;
    void vm.say('a').then(() => { done = true; });
    await vi.advanceTimersByTimeAsync(2900);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(200);
    expect(done).toBe(true);
    expect(engine.cancels).toBeGreaterThan(0);
    expect(vm.speaking).toBe(false);
  });
  it('escala con frases largas (chars*120ms)', async () => {
    const { vm } = setup({ a: ['x'.repeat(50)] }); // 6 s
    let done = false;
    void vm.say('a').then(() => { done = true; });
    await vi.advanceTimersByTimeAsync(5900);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(200);
    expect(done).toBe(true);
  });
});

const V = (lang: string, local: boolean, uri = `${lang}-${local}`) =>
  ({ lang, localService: local, voiceURI: uri, name: uri, default: false }) as SpeechSynthesisVoice;

describe('selección de voz', () => {
  it('prioriza voiceURI', () => {
    const vs = [V('es-MX', true), V('es-ES', false, 'x')];
    expect(pickVoice(vs, 'x')?.voiceURI).toBe('x');
  });
  it('orden es-MX > es-US > es-419 > es-*', () => {
    expect(pickVoice([V('es-ES', true), V('es-US', true), V('es-MX', false)])?.lang).toBe('es-MX');
    expect(pickVoice([V('es-ES', true), V('es-419', true), V('es-US', false)])?.lang).toBe('es-US');
    expect(pickVoice([V('es-ES', true), V('es-419', false)])?.lang).toBe('es-419');
    expect(pickVoice([V('en-US', true), V('es-AR', false)])?.lang).toBe('es-AR');
  });
  it('prefiere localService', () => {
    expect(pickVoice([V('es-MX', false, 'remote'), V('es-MX', true, 'local')])?.voiceURI).toBe('local');
  });
  it('sin voz en español devuelve null', () => {
    expect(pickVoice([V('en-US', true)])).toBeNull();
  });
  it('WebSpeechEngine espera voiceschanged y calla sin voz', async () => {
    vi.useFakeTimers();
    const listeners: Array<() => void> = [];
    const synth = {
      getVoices: () => [] as SpeechSynthesisVoice[],
      addEventListener: (_: string, f: () => void) => listeners.push(f),
      removeEventListener: () => {},
      speak: vi.fn(), cancel: vi.fn(),
    } as unknown as SpeechSynthesis;
    const e = new WebSpeechEngine(() => undefined, synth);
    const p = e.speak('hola', { volume: 1, rate: 1 });
    await vi.advanceTimersByTimeAsync(1600);
    await expect(p).resolves.toBeUndefined();
    expect((synth.speak as ReturnType<typeof vi.fn>)).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});

describe('SoundEffects', () => {
  it('sin AudioContext no falla', () => {
    const s = new SoundEffects(() => ({ sfxOn: true, volume: 1 }), () => undefined);
    for (const n of ['tap', 'pop', 'sparkle', 'soft', 'chime', 'whoosh'] as const) expect(() => s.play(n)).not.toThrow();
    expect(() => s.resume()).not.toThrow();
  });
  it('sfxOn=false no crea contexto', () => {
    const ctor = vi.fn();
    const s = new SoundEffects(() => ({ sfxOn: false, volume: 1 }), () => ctor as never);
    s.play('pop');
    expect(ctor).not.toHaveBeenCalled();
  });
});

describe('frases base', () => {
  it('incluye claves requeridas', () => {
    for (const k of ['color.rojo', 'shape.circulo', 'num.1', 'num.10', 'common.dress', 'common.where-circle']) {
      expect(BASE_PHRASES[k]?.length).toBeGreaterThan(0);
    }
  });
});
