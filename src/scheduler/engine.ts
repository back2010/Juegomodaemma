/**
 * Motor del scheduler (ARQUITECTURA §G). Cuenta solo tiempo de juego activo mediante timestamps con un reloj
 * inyectado: `elapsed = activeMs + (segmentStart ? now - segmentStart : 0)`. El tick de 1 s solo comprueba.
 */
import type { ActivityDef, GameSnapshot, HistoryEntry, PauseReason, SchedulerStatus, Settings } from '@/types';
import { useScheduler, type SchedulerStore } from '@/store/schedulerStore';
import { getSettings, useSettings } from '@/store/settingsStore';
import { useGame } from '@/store/gameStore';
import { useLearning } from '@/store/learningStore';
import { activeLocks, onLocksChange } from './locks';
import { pickActivity } from './selector';
import { restoreSnapshot, takeSnapshot } from './snapshot';
import { PH } from './phrases';
import { activities } from '@/learning/registry';
import { voice } from '@/audio';

export const TICK_MS = 1000;
/** Hueco entre ticks a partir del cual se considera que el dispositivo estuvo suspendido. */
export const SUSPEND_GAP_MS = 5000;
/** Espera tras liberarse un lock / cerrarse un overlay antes de invitar. */
export const EVAL_DELAY_MS = 1500;
const MIN = 60_000;

type TimerId = unknown;
export interface SchedulerDeps {
  now(): number;
  setTimeout(fn: () => void, ms: number): TimerId;
  clearTimeout(id: TimerId): void;
  setInterval(fn: () => void, ms: number): TimerId;
  clearInterval(id: TimerId): void;
  getActivities(): ActivityDef[];
  say(key: string, params?: Record<string, string | number>): Promise<void> | void;
  /** Semilla del sorteo. */
  seed(): number;
  /** Destinos de eventos del navegador (omitir en pruebas sin DOM). */
  win?: Window;
  doc?: Document;
}

const without = (xs: PauseReason[], r: PauseReason) => xs.filter((x) => x !== r);
const withR = (xs: PauseReason[], r: PauseReason) => (xs.includes(r) ? xs : [...xs, r]);

export function computeStatus(s: SchedulerStore, st: Settings['scheduler']): SchedulerStatus {
  if (s.current) return 'inActivity';
  if (s.invite) return 'invitePending';
  if (st.intervalMin === 0) return 'disabled';
  if (s.pauseReasons.length) return 'paused';
  return s.phase === 'cooldown' ? 'cooldown' : 'counting';
}

export class SchedulerEngine {
  private lastTick: number | null = null;
  private lastInteraction: number;
  private evalTimer: TimerId | null = null;
  private tickTimer: TimerId | null = null;
  private unsubs: (() => void)[] = [];
  private initialized = false;
  private offset = 0;

  constructor(private d: SchedulerDeps) {
    this.lastInteraction = d.now();
  }

  // ---------- utilidades ----------
  now() { return this.d.now() + this.offset; }
  private get s() { return useScheduler.getState(); }
  private get cfg() { return getSettings().scheduler; }
  private intervalMs() { return this.cfg.intervalMin * MIN; }

  elapsed(now = this.now()) {
    const s = this.s;
    return s.activeMs + (s.segmentStart != null ? Math.max(0, now - s.segmentStart) : 0);
  }

  private isRunning(s: SchedulerStore) {
    return this.cfg.intervalMin > 0 && !s.current && !s.invite && s.pauseReasons.length === 0;
  }

  /** Aplica un cambio y abre/cierra el segmento activo según corresponda. */
  private apply(patch: Partial<SchedulerStore> = {}) {
    const now = this.now();
    const s: SchedulerStore = { ...useScheduler.getState(), ...patch };
    const run = this.isRunning(s);
    if (run && s.segmentStart == null) s.segmentStart = now;
    if (!run && s.segmentStart != null) {
      s.activeMs += Math.max(0, now - s.segmentStart);
      s.segmentStart = null;
    }
    s.status = computeStatus(s, this.cfg);
    useScheduler.setState(s, true);
  }

  private resetCounter(phase: 'normal' | 'cooldown'): Partial<SchedulerStore> {
    const targetMs = phase === 'cooldown' ? Math.max(1, this.cfg.reinviteMin) * MIN : this.intervalMs();
    return { activeMs: 0, segmentStart: null, due: false, phase, targetMs };
  }

  /** Si pasaron más de 5 s desde el último tick, el dispositivo estuvo suspendido: se descarta el hueco. */
  private checkGap(now: number) {
    if (this.lastTick != null && now - this.lastTick > SUSPEND_GAP_MS) {
      const s = this.s;
      if (s.segmentStart != null) {
        const counted = Math.max(0, this.lastTick - s.segmentStart);
        useScheduler.setState({ activeMs: s.activeMs + counted, segmentStart: now });
      }
      this.lastInteraction = Math.max(this.lastInteraction, now);
    }
    this.lastTick = now;
  }

  private canInviteNow() {
    const s = this.s;
    return this.cfg.intervalMin > 0 && !s.current && !s.invite && s.locks.length === 0
      && s.pauseReasons.length === 0 && useGame.getState().overlay === 'none';
  }

  private clearEval() {
    if (this.evalTimer != null) { this.d.clearTimeout(this.evalTimer); this.evalTimer = null; }
  }

  private maybeScheduleEvaluate() {
    if (!this.s.due || this.evalTimer != null || !this.canInviteNow()) return;
    this.evalTimer = this.d.setTimeout(() => { this.evalTimer = null; this.evaluate(); }, EVAL_DELAY_MS);
  }

  /** Vuelve a mostrar nuestro overlay si un overlay ajeno (zona de adultos) lo reemplazó y ya se cerró. */
  private reshowOverlay() {
    const g = useGame.getState();
    if (g.overlay !== 'none' || g.screen.name === 'parent') return false;
    const s = this.s;
    if (s.current) { g.setOverlay('activity'); return true; }
    if (s.invite) { g.setOverlay('invite'); return true; }
    return false;
  }

  // ---------- ciclo ----------
  start() {
    if (!this.initialized) { this.initialized = true; this.init(); }
    if (this.tickTimer != null) return;
    const now = this.now();
    this.lastTick = now;
    this.lastInteraction = now;
    this.apply({ locks: activeLocks() });
    this.syncParent();
    this.tickTimer = this.d.setInterval(() => this.tick(), TICK_MS);

    this.unsubs.push(onLocksChange((ls) => this.onLocks(ls)));
    this.unsubs.push(useSettings.subscribe((st, prev) => { if (st.scheduler !== prev.scheduler) this.onSettings(prev.scheduler); }));
    this.unsubs.push(useGame.subscribe((g, pg) => {
      if (g.overlay === pg.overlay && g.screen === pg.screen) return;
      this.syncParent();
      if (!this.reshowOverlay() && g.overlay === 'none') this.maybeScheduleEvaluate();
    }));

    const { win, doc } = this.d;
    if (doc) {
      const vis = () => (doc.visibilityState === 'hidden' ? this.pause('hidden') : this.resume('hidden'));
      const freeze = () => this.pause('hidden');
      const unfreeze = () => { if (doc.visibilityState !== 'hidden') this.resume('hidden'); };
      doc.addEventListener('visibilitychange', vis);
      doc.addEventListener('freeze', freeze);
      doc.addEventListener('resume', unfreeze);
      this.unsubs.push(() => {
        doc.removeEventListener('visibilitychange', vis);
        doc.removeEventListener('freeze', freeze);
        doc.removeEventListener('resume', unfreeze);
      });
      if (doc.visibilityState === 'hidden') this.pause('hidden');
      if (win) {
        const hide = () => this.pause('hidden');
        const show = () => unfreeze();
        const touch = () => this.interaction();
        win.addEventListener('pagehide', hide);
        win.addEventListener('pageshow', show);
        win.addEventListener('pointerdown', touch, true);
        win.addEventListener('keydown', touch, true);
        this.unsubs.push(() => {
          win.removeEventListener('pagehide', hide);
          win.removeEventListener('pageshow', show);
          win.removeEventListener('pointerdown', touch, true);
          win.removeEventListener('keydown', touch, true);
        });
      }
    }
  }

  stop() {
    this.unsubs.splice(0).forEach((u) => u());
    if (this.tickTimer != null) { this.d.clearInterval(this.tickTimer); this.tickTimer = null; }
    this.clearEval();
    this.lastTick = null;
  }

  /** Estado al arrancar (incluida la recarga en mitad de una actividad). */
  private init() {
    const s = this.s;
    const cfg = this.cfg;
    const patch: Partial<SchedulerStore> = {
      segmentStart: null, due: false, invite: undefined, locks: activeLocks(),
      pauseReasons: without(s.pauseReasons, 'activity'),
    };
    if (s.phase !== 'cooldown') patch.targetMs = this.intervalMs();
    if (s.current) {
      if (cfg.mode === 'mandatory') {
        patch.pauseReasons = withR(patch.pauseReasons!, 'activity');
        this.apply(patch);
        this.reshowOverlay();
        return;
      }
      if (s.snapshot) restoreSnapshot(s.snapshot);
      Object.assign(patch, { current: undefined, snapshot: undefined }, this.resetCounter('cooldown'));
    } else if (s.snapshot) {
      // Invitación interrumpida por la recarga: el juego quedó intacto; se volverá a invitar.
      patch.snapshot = undefined;
    }
    this.apply(patch);
  }

  tick() {
    const now = this.now();
    this.checkGap(now);
    const idleMs = getSettings().game.idlePauseSec * 1000;
    if (idleMs > 0 && now - this.lastInteraction >= idleMs && !this.s.pauseReasons.includes('idle')) {
      this.apply({ pauseReasons: withR(this.s.pauseReasons, 'idle') });
    }
    const s = this.s;
    if (this.isRunning(s) && !s.due && this.elapsed(now) >= s.targetMs) this.evaluate();
    this.maybeScheduleEvaluate();
  }

  interaction() {
    const now = this.now();
    this.checkGap(now);
    this.lastInteraction = now;
    if (this.s.pauseReasons.includes('idle')) this.resume('idle');
  }

  /** Decide si invitar ahora o marcar `due` (hay locks u overlays). */
  evaluate() {
    this.clearEval();
    const s = this.s;
    const cfg = this.cfg;
    if (cfg.intervalMin === 0 || s.current || s.invite) return;
    if (!this.canInviteNow()) { this.apply({ due: true }); return; }
    const act = pickActivity({
      activities: this.d.getActivities(), categories: cfg.categories, history: s.history,
      perActivity: useLearning.getState().perActivity, now: this.now(), seed: this.d.seed(),
    });
    if (!act) { this.apply(this.resetCounter('normal')); return; }
    this.apply({ due: false, invite: { activityId: act.id, inviteKey: act.inviteKey }, snapshot: takeSnapshot() });
    useGame.getState().setOverlay('invite');
    this.announce(act.inviteKey);
  }

  private announce(inviteKey: string) {
    const name = getSettings().game.childName;
    void Promise.resolve(this.d.say(inviteKey, { name }))
      .then(() => {
        if (!this.s.invite) return;
        return this.d.say(this.cfg.mode === 'optional' ? PH.options : PH.optionsMandatory);
      })
      .catch(() => {});
  }

  /** Repite la invitación por voz (botón de altavoz). */
  repeatInvite() { const i = this.s.invite; if (i) this.announce(i.inviteKey); }

  // ---------- acciones de la niña ----------
  accept() {
    const s = this.s;
    if (!s.invite) return;
    this.apply({
      invite: undefined, current: { activityId: s.invite.activityId, startedAt: this.now() },
      pauseReasons: withR(s.pauseReasons, 'activity'),
    });
    useGame.getState().setOverlay('activity');
  }

  /** "Seguir jugando" (solo modo opcional): no bloquea y re-invita tras reinviteMin. */
  decline() {
    if (!this.s.invite || this.cfg.mode !== 'optional') return;
    this.apply({ invite: undefined, snapshot: undefined, ...this.resetCounter('cooldown') });
    if (useGame.getState().overlay === 'invite') useGame.getState().setOverlay('none');
  }

  complete() {
    const s = this.s;
    if (!s.current) return;
    const def = this.d.getActivities().find((a) => a.id === s.current!.activityId);
    const entry: HistoryEntry = { activityId: s.current.activityId, category: def?.category ?? 'colores', at: this.now() };
    useLearning.getState().recordSession(entry);
    this.finish(s.snapshot, { history: [...s.history, entry].slice(-20), ...this.resetCounter('normal') });
  }

  /** Salida de la actividad en modo opcional: vuelve al juego, re-invita más tarde. */
  exitActivity() {
    if (!this.s.current || this.cfg.mode !== 'optional') return;
    this.finish(this.s.snapshot, this.resetCounter('cooldown'));
  }

  private finish(snap: GameSnapshot | undefined, patch: Partial<SchedulerStore>, keepParentScreen = false) {
    this.clearEval();
    const s = this.s;
    this.apply({ current: undefined, invite: undefined, snapshot: undefined, pauseReasons: without(s.pauseReasons, 'activity'), ...patch });
    if (snap) restoreSnapshot(snap, { keepParentScreen });
    const g = useGame.getState();
    if (g.overlay === 'activity' || g.overlay === 'invite') g.setOverlay('none');
  }

  // ---------- API pública ----------
  pause(reason: PauseReason) {
    this.checkGap(this.now());
    if (this.s.pauseReasons.includes(reason)) return;
    this.apply({ pauseReasons: withR(this.s.pauseReasons, reason) });
  }

  resume(reason: PauseReason) {
    this.checkGap(this.now());
    if (!this.s.pauseReasons.includes(reason)) return;
    if (reason === 'idle') this.lastInteraction = this.now();
    this.apply({ pauseReasons: without(this.s.pauseReasons, reason) });
    this.maybeScheduleEvaluate();
  }

  /** Actividad completada en el hub (modo libre): reinicia el contador. */
  activityCompleted(e: HistoryEntry) {
    this.apply({ history: [...this.s.history, e].slice(-20), ...this.resetCounter('normal') });
  }

  /** Cancela la actividad (o invitación) programada. Solo desde la zona de adultos. */
  cancelActivity() {
    const s = this.s;
    if (!s.current && !s.invite) return;
    this.finish(s.snapshot, this.resetCounter('normal'), true);
  }

  status(): SchedulerStatus { return this.s.status; }

  private syncParent() {
    const g = useGame.getState();
    const parent = g.overlay === 'parent' || g.screen.name === 'parent';
    const has = this.s.pauseReasons.includes('parent');
    if (parent && !has) this.pause('parent');
    else if (!parent && has) this.resume('parent');
  }

  private onLocks(ls: string[]) {
    this.apply({ locks: ls });
    if (ls.length === 0) this.maybeScheduleEvaluate();
    else this.clearEval();
  }

  private onSettings(prev: Settings['scheduler']) {
    const cur = this.cfg;
    const s = this.s;
    if (cur.intervalMin === 0) {
      if (s.invite) {
        this.apply({ invite: undefined, snapshot: undefined });
        if (useGame.getState().overlay === 'invite') useGame.getState().setOverlay('none');
      }
      this.clearEval();
      this.apply(this.resetCounter('normal'));
      return;
    }
    if (prev.intervalMin === 0) { this.apply(this.resetCounter('normal')); return; }
    if (s.phase === 'normal' && cur.intervalMin !== prev.intervalMin) this.apply({ targetMs: this.intervalMs() });
    else if (s.phase === 'cooldown' && cur.reinviteMin !== prev.reinviteMin) this.apply({ targetMs: Math.max(1, cur.reinviteMin) * MIN });
    else this.apply();
  }

  // ---------- e2e ----------
  /** Avanza el reloj `ms` como tiempo de juego continuo (sin disparar la detección de suspensión). */
  advance(ms: number) {
    this.offset += ms;
    if (this.lastTick != null) this.lastTick += ms;
    this.lastInteraction += ms;
    this.tick();
  }

  forceInvite() {
    const s = this.s;
    if (s.current || s.invite) return;
    this.clearEval();
    this.evaluate();
  }
}

// ---------- instancia por defecto ----------
let engine: SchedulerEngine | null = null;

export function defaultDeps(): SchedulerDeps {
  return {
    now: () => Date.now(),
    setTimeout: (fn, ms) => globalThis.setTimeout(fn, ms),
    clearTimeout: (id) => globalThis.clearTimeout(id as ReturnType<typeof setTimeout>),
    setInterval: (fn, ms) => globalThis.setInterval(fn, ms),
    clearInterval: (id) => globalThis.clearInterval(id as ReturnType<typeof setInterval>),
    getActivities: () => activities,
    say: (key, params) => voice.say(key, params),
    seed: () => Math.floor(Math.random() * 2 ** 31),
    win: typeof window !== 'undefined' ? window : undefined,
    doc: typeof document !== 'undefined' ? document : undefined,
  };
}

export function getEngine(): SchedulerEngine {
  if (!engine) engine = new SchedulerEngine(defaultDeps());
  return engine;
}

/** Sustituye la instancia (pruebas). Devuelve la anterior. */
export function setEngine(e: SchedulerEngine | null): SchedulerEngine | null {
  const prev = engine;
  if (prev && prev !== e) prev.stop();
  engine = e;
  return prev;
}
