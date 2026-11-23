import { schedulerApi } from '@/scheduler/api';
import { lock } from '@/scheduler/locks';
import { useSettings } from '@/store/settingsStore';
import { useGame } from '@/store/gameStore';
import { useDolls } from '@/store/dollStore';
import { useLearning } from '@/store/learningStore';
import { SCHEDULER_STORAGE_KEY, useScheduler, initialSchedulerState } from '@/store/schedulerStore';
import { setEngine } from '@/scheduler/engine';
import { MIN, sched, setup, act } from './helpers';

afterEach(() => { setEngine(null); });

const cfg = (p: Parameters<ReturnType<typeof useSettings.getState>['updateScheduler']>[0]) => useSettings.getState().updateScheduler(p);

describe('temporizador de tiempo activo', () => {
  it('acumula solo con la app visible (visibilitychange / pagehide / freeze)', () => {
    const { clock, engine } = setup({ dom: true });
    const setVis = (v: 'visible' | 'hidden') => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => v });
      document.dispatchEvent(new Event('visibilitychange'));
    };
    clock.advance(5 * MIN);
    expect(engine.elapsed()).toBe(5 * MIN);
    setVis('hidden');
    expect(sched().status).toBe('paused');
    expect(sched().pauseReasons).toContain('hidden');
    clock.advance(10 * MIN);
    expect(engine.elapsed()).toBe(5 * MIN);
    setVis('visible');
    clock.advance(MIN);
    expect(engine.elapsed()).toBe(6 * MIN);

    window.dispatchEvent(new Event('pagehide'));
    clock.advance(MIN);
    expect(engine.elapsed()).toBe(6 * MIN);
    window.dispatchEvent(new Event('pageshow'));
    document.dispatchEvent(new Event('freeze'));
    clock.advance(MIN);
    expect(engine.elapsed()).toBe(6 * MIN);
    document.dispatchEvent(new Event('resume'));
    clock.advance(MIN);
    expect(engine.elapsed()).toBe(7 * MIN);
    expect(sched().status).toBe('counting');
  });

  it.each(['hidden', 'learningFree', 'parent'] as const)('pausa y reanuda por %s (api)', (reason) => {
    const { clock, engine } = setup();
    clock.advance(MIN);
    schedulerApi.pause(reason);
    expect(schedulerApi.status()).toBe('paused');
    clock.advance(3 * MIN);
    expect(engine.elapsed()).toBe(MIN);
    schedulerApi.resume(reason);
    expect(schedulerApi.status()).toBe('counting');
    clock.advance(MIN);
    expect(engine.elapsed()).toBe(2 * MIN);
  });

  it('varias causas: solo reanuda cuando se van todas', () => {
    const { clock, engine } = setup();
    schedulerApi.pause('hidden');
    schedulerApi.pause('learningFree');
    schedulerApi.resume('hidden');
    clock.advance(MIN);
    expect(engine.elapsed()).toBe(0);
    schedulerApi.resume('learningFree');
    clock.advance(MIN);
    expect(engine.elapsed()).toBe(MIN);
  });

  it('pausa por inactividad (sin pointerdown) y reanuda con un toque', () => {
    const { clock, engine } = setup({ dom: true });
    useSettings.getState().updateGame({ idlePauseSec: 90 });
    clock.advance(60_000);
    window.dispatchEvent(new Event('pointerdown'));
    clock.advance(89_000);
    expect(sched().pauseReasons).not.toContain('idle');
    clock.advance(2_000);
    expect(sched().pauseReasons).toContain('idle');
    const frozen = engine.elapsed();
    clock.advance(10 * MIN);
    expect(engine.elapsed()).toBe(frozen);
    window.dispatchEvent(new Event('pointerdown'));
    expect(sched().status).toBe('counting');
    clock.advance(MIN);
    expect(engine.elapsed()).toBe(frozen + MIN);
  });

  it('pausa en la zona de adultos (overlay o pantalla parent)', () => {
    const { clock, engine } = setup();
    useGame.getState().setOverlay('parent');
    expect(sched().pauseReasons).toContain('parent');
    clock.advance(MIN);
    useGame.getState().go('parent');
    useGame.getState().setOverlay('none');
    clock.advance(MIN);
    expect(engine.elapsed()).toBe(0);
    useGame.getState().go('salon');
    expect(sched().pauseReasons).not.toContain('parent');
    clock.advance(MIN);
    expect(engine.elapsed()).toBe(MIN);
  });

  it('pausa durante la actividad', () => {
    const { clock, engine } = setup();
    cfg({ intervalMin: 10 });
    clock.advance(10 * MIN);
    engine.accept();
    expect(sched().status).toBe('inActivity');
    expect(sched().pauseReasons).toContain('activity');
    const e = engine.elapsed();
    clock.advance(5 * MIN);
    expect(engine.elapsed()).toBe(e);
  });

  it('descarta el hueco de suspensión (> 5 s entre ticks)', () => {
    const { clock, engine } = setup();
    clock.advance(MIN);
    clock.jump(10 * MIN);
    clock.advance(1000);
    expect(engine.elapsed()).toBeLessThanOrEqual(MIN + 1000);
    expect(engine.elapsed()).toBeGreaterThanOrEqual(MIN);
    clock.advance(MIN);
    expect(engine.elapsed()).toBeLessThanOrEqual(2 * MIN + 1000);
    // Un hueco pequeño (≤ 5 s) sí cuenta.
    const before = engine.elapsed();
    clock.jump(3000);
    clock.advance(1000);
    expect(engine.elapsed()).toBe(before + 4000);
  });
});

describe('invitación', () => {
  it('invita al cumplirse el intervalo con voz, nombre y snapshot persistido', () => {
    const h = setup();
    useSettings.getState().updateGame({ childName: 'Emma' });
    h.clock.advance(15 * MIN - 1000);
    expect(sched().invite).toBeUndefined();
    h.clock.advance(1000);
    expect(sched().status).toBe('invitePending');
    expect(useGame.getState().overlay).toBe('invite');
    const inv = sched().invite!;
    expect(h.said[0]).toEqual([inv.inviteKey, { name: 'Emma' }]);
    const stored = JSON.parse(localStorage.getItem(SCHEDULER_STORAGE_KEY)!);
    expect(stored.state.snapshot.screen).toEqual({ name: 'salon' });
  });

  it('un lock retrasa la invitación y evalúa 1.5 s después de liberarse', () => {
    const { clock } = setup();
    cfg({ intervalMin: 10 });
    clock.advance(10 * MIN - 2000);
    const release = lock('photo-capture');
    clock.advance(2 * MIN);
    expect(sched().due).toBe(true);
    expect(sched().invite).toBeUndefined();
    release();
    clock.advance(1000);
    expect(sched().invite).toBeUndefined();
    clock.advance(600);
    expect(sched().invite).toBeDefined();
    expect(sched().due).toBe(false);
  });

  it('un lock nuevo durante la espera vuelve a retrasar', () => {
    const { clock } = setup();
    cfg({ intervalMin: 10 });
    const r1 = lock('drag');
    clock.advance(11 * MIN);
    r1();
    clock.advance(1000);
    const r2 = lock('save');
    clock.advance(5000);
    expect(sched().invite).toBeUndefined();
    r2();
    clock.advance(1500);
    expect(sched().invite).toBeDefined();
  });

  it('un overlay abierto retrasa la invitación', () => {
    const { clock, engine } = setup();
    useGame.getState().setOverlay('parent');
    engine.forceInvite();
    expect(sched().due).toBe(true);
    expect(sched().invite).toBeUndefined();
    clock.advance(10_000);
    expect(sched().invite).toBeUndefined();
    useGame.getState().setOverlay('none');
    clock.advance(1400);
    expect(sched().invite).toBeUndefined();
    clock.advance(200);
    expect(sched().invite).toBeDefined();
    expect(useGame.getState().overlay).toBe('invite');
  });

  it('opcional: seguir jugando → cooldown → re-invita tras reinviteMin', () => {
    const { clock, engine } = setup();
    cfg({ intervalMin: 10, reinviteMin: 5, mode: 'optional' });
    clock.advance(10 * MIN);
    expect(sched().status).toBe('invitePending');
    engine.decline();
    expect(useGame.getState().overlay).toBe('none');
    expect(sched().status).toBe('cooldown');
    expect(sched().snapshot).toBeUndefined();
    clock.advance(5 * MIN - 1000);
    expect(sched().invite).toBeUndefined();
    clock.advance(1000);
    expect(sched().status).toBe('invitePending');
  });

  it('obligatorio: "seguir jugando" no hace nada', () => {
    const { clock, engine } = setup();
    cfg({ intervalMin: 10, mode: 'mandatory' });
    clock.advance(10 * MIN);
    engine.decline();
    expect(sched().status).toBe('invitePending');
    engine.accept();
    engine.exitActivity();
    expect(sched().status).toBe('inActivity');
    schedulerApi.cancelActivity();
    expect(sched().status).toBe('counting');
    expect(useGame.getState().overlay).toBe('none');
  });

  it('sin actividades habilitadas no invita y reprograma', () => {
    const h = setup({ acts: [] });
    cfg({ intervalMin: 10 });
    h.clock.advance(10 * MIN);
    expect(sched().invite).toBeUndefined();
    expect(useGame.getState().overlay).toBe('none');
    expect(sched().activeMs + 0).toBeLessThan(MIN);
    h.acts = [act('color-find', 'colores')];
    cfg({ categories: { ...useSettings.getState().scheduler.categories, colores: false } });
    h.clock.advance(10 * MIN);
    expect(sched().invite).toBeUndefined();
    cfg({ categories: { ...useSettings.getState().scheduler.categories, colores: true } });
    h.clock.advance(10 * MIN);
    expect(sched().invite?.activityId).toBe('color-find');
  });
});

describe('actividad y snapshot', () => {
  it('completar registra, reinicia el contador y restaura el snapshot exacto', () => {
    const { clock, engine } = setup();
    cfg({ intervalMin: 10 });
    useDolls.getState().setHairColor({ mode: 'solid', a: '#123456' });
    useDolls.getState().setTab('makeup', 'lips');
    useGame.getState().setScene({ backgroundId: 'bg-x' });
    const before = structuredClone({ d: useDolls.getState().looks, sel: useDolls.getState().selectedDollId, game: useGame.getState().screen, photo: useGame.getState().photo });
    clock.advance(10 * MIN);
    engine.accept();
    // Algo cambia el estado mientras tanto: la restauración debe devolverlo exacto.
    useDolls.getState().setHairColor({ mode: 'rainbow' });
    useDolls.getState().setTab('clothes', 'dress');
    useGame.getState().setScene({ backgroundId: 'otra' });
    clock.advance(3 * MIN);
    const id = sched().current!.activityId;
    engine.complete();
    expect(useDolls.getState().looks).toEqual(before.d);
    expect(useDolls.getState().selectedDollId).toBe(before.sel);
    expect(useDolls.getState().editorTab).toBe('makeup');
    expect(useDolls.getState().subTab).toBe('lips');
    expect(useGame.getState().screen).toEqual(before.game);
    expect(useGame.getState().photo).toEqual(before.photo);
    expect(useGame.getState().overlay).toBe('none');
    expect(sched()).toMatchObject({ status: 'counting', activeMs: 0, due: false, targetMs: 10 * MIN, snapshot: undefined, current: undefined });
    expect(sched().history.at(-1)?.activityId).toBe(id);
    expect(useLearning.getState().history.at(-1)?.activityId).toBe(id);
    clock.advance(MIN);
    expect(engine.elapsed()).toBe(MIN);
  });

  it('activityCompleted (modo libre) reinicia el contador', () => {
    const { clock, engine } = setup();
    clock.advance(7 * MIN);
    schedulerApi.activityCompleted({ activityId: 'color-find', category: 'colores', at: clock.t });
    expect(engine.elapsed()).toBe(0);
    expect(sched().history).toHaveLength(1);
  });

  it('recarga en mitad de actividad: obligatorio reabre la actividad', () => {
    const h = setup();
    cfg({ intervalMin: 10, mode: 'mandatory' });
    h.clock.advance(10 * MIN);
    h.engine.accept();
    const id = sched().current!.activityId;
    h.engine.stop();
    // "Recarga": overlay no persistido.
    useGame.setState({ overlay: 'none' });
    useSchedulerRehydrate();
    const h2 = setup({ reset: false });
    expect(sched().status).toBe('inActivity');
    expect(sched().current?.activityId).toBe(id);
    expect(useGame.getState().overlay).toBe('activity');
    h2.engine.complete();
    expect(sched().status).toBe('counting');
  });

  it('recarga en mitad de actividad: opcional vuelve al juego con el snapshot', () => {
    const h = setup();
    cfg({ intervalMin: 10, mode: 'optional' });
    useDolls.getState().setHairColor({ mode: 'solid', a: '#abcdef' });
    const looks = structuredClone(useDolls.getState().looks);
    h.clock.advance(10 * MIN);
    h.engine.accept();
    h.engine.stop();
    useDolls.getState().setHairColor({ mode: 'rainbow' });
    useGame.setState({ overlay: 'none', screen: { name: 'home' } });
    useSchedulerRehydrate();
    setup({ reset: false });
    expect(sched().current).toBeUndefined();
    expect(sched().snapshot).toBeUndefined();
    expect(useGame.getState().overlay).toBe('none');
    expect(useGame.getState().screen).toEqual({ name: 'salon' });
    expect(useDolls.getState().looks).toEqual(looks);
    expect(['cooldown', 'counting']).toContain(sched().status);
  });
});

describe('configuración en vivo', () => {
  it('intervalMin 0 deshabilita y volver a 15 rearma', () => {
    const { clock, engine } = setup();
    clock.advance(5 * MIN);
    cfg({ intervalMin: 0 });
    expect(schedulerApi.status()).toBe('disabled');
    clock.advance(60 * MIN);
    expect(sched().invite).toBeUndefined();
    expect(engine.elapsed()).toBe(0);
    cfg({ intervalMin: 15 });
    expect(schedulerApi.status()).toBe('counting');
    expect(sched().targetMs).toBe(15 * MIN);
    clock.advance(15 * MIN);
    expect(sched().status).toBe('invitePending');
  });

  it('desactivar con una invitación abierta la retira', () => {
    const { clock } = setup();
    clock.advance(15 * MIN);
    expect(useGame.getState().overlay).toBe('invite');
    cfg({ intervalMin: 0 });
    expect(useGame.getState().overlay).toBe('none');
    expect(sched().status).toBe('disabled');
  });

  it('cambio de intervalo en vivo (sin recargar)', () => {
    const { clock } = setup();
    clock.advance(12 * MIN);
    cfg({ intervalMin: 10 });
    expect(sched().targetMs).toBe(10 * MIN);
    clock.advance(1000);
    expect(sched().status).toBe('invitePending');

    setEngine(null);
    const h = setup();
    h.clock.advance(12 * MIN);
    cfg({ intervalMin: 30 });
    h.clock.advance(17 * MIN);
    expect(sched().invite).toBeUndefined();
    h.clock.advance(MIN);
    expect(sched().status).toBe('invitePending');
  });
});

/** Simula una recarga: vuelve a hidratar el store desde localStorage (estado en memoria descartado). */
function useSchedulerRehydrate() {
  const raw = JSON.parse(localStorage.getItem(SCHEDULER_STORAGE_KEY)!).state;
  useScheduler.setState({ ...initialSchedulerState(), ...raw }, true);
}
