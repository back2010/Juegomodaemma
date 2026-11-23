import type { ActivityDef, LearningCategory } from '@/types';
import { SchedulerEngine, setEngine, type SchedulerDeps } from '@/scheduler/engine';
import { initialSchedulerState, useScheduler } from '@/store/schedulerStore';
import { useSettings } from '@/store/settingsStore';
import { useGame, DEFAULT_SCENE } from '@/store/gameStore';
import { useDolls } from '@/store/dollStore';
import { useLearning } from '@/store/learningStore';

interface Timer { id: number; at: number; fn: () => void; every?: number }

/** Reloj falso inyectable: tiempo + timers deterministas. */
export class FakeClock {
  t = 1_700_000_000_000;
  private timers: Timer[] = [];
  private seq = 0;
  now = () => this.t;
  setTimeout = (fn: () => void, ms: number) => { const id = ++this.seq; this.timers.push({ id, at: this.t + ms, fn }); return id; };
  setInterval = (fn: () => void, ms: number) => { const id = ++this.seq; this.timers.push({ id, at: this.t + ms, fn, every: ms }); return id; };
  clearTimeout = (id: unknown) => { this.timers = this.timers.filter((x) => x.id !== id); };
  clearInterval = (id: unknown) => this.clearTimeout(id);
  /** Avanza el tiempo disparando timers (ticks incluidos). */
  advance(ms: number) {
    const end = this.t + ms;
    for (;;) {
      const next = this.timers.filter((x) => x.at <= end).sort((a, b) => a.at - b.at || a.id - b.id)[0];
      if (!next) break;
      this.t = next.at;
      if (next.every) next.at += next.every; else this.timers = this.timers.filter((x) => x !== next);
      next.fn();
    }
    this.t = end;
  }
  /** Salta el reloj sin disparar timers (dispositivo suspendido). Reajusta los timers como haría el navegador. */
  jump(ms: number) {
    this.t += ms;
    for (const x of this.timers) if (x.at < this.t) x.at = this.t + (x.every ?? 0);
  }
}

const Dummy = () => null;
export function act(id: string, category: LearningCategory): ActivityDef {
  return { id, category, spokenTitleKey: `${id}.title`, inviteKey: `${id}.invite`, Icon: Dummy, estRoundSec: 20, maxLevel: 3, Round: Dummy };
}
export const ALL_ACTS: ActivityDef[] = [
  act('color-find', 'colores'), act('color-bucket', 'colores'), act('shape-find', 'figuras'), act('shape-shadow', 'figuras'),
  act('count-objects', 'numeros'), act('number-tap', 'numeros'), act('memory-pairs', 'memoria'), act('pattern-next', 'patrones'),
  act('sort-color', 'clasificacion'), act('sort-shape', 'clasificacion'),
];

export function resetStores() {
  localStorage.clear();
  useScheduler.setState(initialSchedulerState(), true);
  useSettings.getState().resetSettings();
  // Sin pausa por inactividad salvo en la prueba específica.
  useSettings.getState().updateGame({ idlePauseSec: 0 });
  useGame.setState({ screen: { name: 'salon' }, overlay: 'none', photo: { scene: { ...DEFAULT_SCENE } } });
  useDolls.setState({ selectedDollId: useDolls.getState().selectedDollId, looks: {}, editorTab: 'clothes', subTab: 'dress' });
  useLearning.getState().resetProgress();
}

export interface Harness { clock: FakeClock; engine: SchedulerEngine; said: [string, Record<string, string | number> | undefined][]; acts: ActivityDef[] }

export function setup(o: { acts?: ActivityDef[]; dom?: boolean; start?: boolean; reset?: boolean } = {}): Harness {
  if (o.reset !== false) resetStores();
  const clock = new FakeClock();
  const said: Harness['said'] = [];
  const h: Harness = { clock, engine: null as unknown as SchedulerEngine, said, acts: o.acts ?? ALL_ACTS };
  const deps: SchedulerDeps = {
    now: clock.now, setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout,
    setInterval: clock.setInterval, clearInterval: clock.clearInterval,
    getActivities: () => h.acts,
    say: (k, p) => { said.push([k, p]); return Promise.resolve(); },
    seed: () => 42,
    win: o.dom ? window : undefined,
    doc: o.dom ? document : undefined,
  };
  h.engine = new SchedulerEngine(deps);
  setEngine(h.engine);
  if (o.start !== false) h.engine.start();
  return h;
}

export const MIN = 60_000;
export const sched = () => useScheduler.getState();
