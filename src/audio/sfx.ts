/** Efectos sintetizados con WebAudio. Tolerante a entornos sin AudioContext. */
import type { SfxApi, SfxName } from '@/types';

export const SFX_MASTER = 0.4;

type Ctor = typeof AudioContext;
export interface SfxSettings { sfxOn: boolean; volume: number }

export class SoundEffects implements SfxApi {
  private ctx: AudioContext | null | undefined;
  private noise: AudioBuffer | null = null;
  constructor(
    private getAudio: () => SfxSettings,
    private ctor?: () => Ctor | undefined,
  ) {}

  private context(): AudioContext | null {
    if (this.ctx !== undefined) return this.ctx;
    try {
      const C = this.ctor ? this.ctor()
        : typeof window !== 'undefined'
          ? ((window as unknown as { AudioContext?: Ctor; webkitAudioContext?: Ctor }).AudioContext
            ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext)
          : undefined;
      this.ctx = C ? new C() : null;
    } catch { this.ctx = null; }
    return this.ctx;
  }

  /** Llamar dentro de un gesto (iOS). */
  resume() {
    try { const c = this.context(); if (c && c.state === 'suspended') void c.resume(); } catch { /* noop */ }
  }

  play(name: SfxName): void {
    try {
      const s = this.getAudio();
      if (!s.sfxOn) return;
      const ctx = this.context();
      if (!ctx) return;
      if (ctx.state === 'suspended') void ctx.resume();
      const out = ctx.createGain();
      out.gain.value = SFX_MASTER * Math.min(1, Math.max(0, s.volume));
      out.connect(ctx.destination);
      const t0 = ctx.currentTime;
      switch (name) {
        case 'tap': this.tone(ctx, out, t0, 520, 480, 0.05, 'sine', 0.5); break;
        case 'pop': this.tone(ctx, out, t0, 600, 900, 0.08, 'sine', 0.7); break;
        case 'soft': this.tone(ctx, out, t0, 300, 300, 0.12, 'sine', 0.35); break;
        case 'sparkle':
          [1319, 1760, 2093, 2637].forEach((f, i) => this.tone(ctx, out, t0 + i * 0.05, f, f, 0.14, 'triangle', 0.3));
          break;
        case 'chime': // arpegio pentatónico C5 D5 E5 G5 A5
          [523.25, 587.33, 659.25, 783.99, 880].forEach((f, i) => this.tone(ctx, out, t0 + i * 0.09, f, f, 0.35, 'sine', 0.45));
          break;
        case 'whoosh': this.whoosh(ctx, out, t0); break;
      }
    } catch { /* el audio nunca debe romper la UI */ }
  }

  private tone(ctx: AudioContext, out: AudioNode, t: number, f0: number, f1: number, dur: number, type: OscillatorType, vol: number) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.linearRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + Math.min(0.01, dur / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + dur + 0.02);
  }

  private whoosh(ctx: AudioContext, out: AudioNode, t: number) {
    if (!this.noise) {
      const len = Math.floor(ctx.sampleRate * 0.4);
      const b = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noise = b;
    }
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(400, t);
    bp.frequency.exponentialRampToValueAtTime(1800, t + 0.3);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.5, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    src.connect(bp); bp.connect(g); g.connect(out);
    src.start(t); src.stop(t + 0.4);
  }
}
