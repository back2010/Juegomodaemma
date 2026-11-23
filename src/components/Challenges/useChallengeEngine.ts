/**
 * Motor temporal de retos del salón. Independiente del scheduler.
 * Cuenta tiempo de salón ACTIVO (ajuste activado, sin overlay, pestaña visible y con interacción
 * reciente) y lanza un reto cada `everyMs`. El reto caduca a los `expireMs` y se verifica contra el
 * look actual (suscripción a useDolls).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { voice, sfx } from '@/audio';
import { catalog } from '@/catalog/registry';
import { useDolls, selectCurrentLook } from '@/store/dollStore';
import { useGame } from '@/store/gameStore';
import { useSettings } from '@/store/settingsStore';
import { makeRng, freshSeed } from '@/learning/kit/rng';
import { type Challenge, type ChallengeCatalog, challengeSpeech, generateChallenge, isChallengeMet } from './engine';
import './phrases';

export const CHALLENGE_EVERY_MS = 4 * 60_000;
export const CHALLENGE_EXPIRE_MS = 2 * 60_000;
export const CHALLENGE_DONE_MS = 2800;
const TICK_MS = 1000;

export interface EngineOptions { everyMs?: number; expireMs?: number; cat?: ChallengeCatalog }
export type ChallengeState = { challenge: Challenge; met: boolean } | null;

export function useChallengeEngine({ everyMs = CHALLENGE_EVERY_MS, expireMs = CHALLENGE_EXPIRE_MS, cat = catalog }: EngineOptions = {}) {
  const [state, setState] = useState<ChallengeState>(null);
  const stateRef = useRef<ChallengeState>(null);
  stateRef.current = state;
  const rng = useRef(makeRng(freshSeed()));
  const activeMs = useRef(0);
  const lastTick = useRef(Date.now());
  const shownAt = useRef(0);
  const lastInput = useRef(Date.now());
  const prev = useRef<Challenge | null>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const say = useCallback((c: Challenge) => {
    const s = challengeSpeech(c);
    void voice.say(s.key, s.params);
  }, []);

  // Interacción reciente (para no contar tiempo con el iPad olvidado).
  useEffect(() => {
    const mark = () => { lastInput.current = Date.now(); };
    window.addEventListener('pointerdown', mark, true);
    return () => window.removeEventListener('pointerdown', mark, true);
  }, []);

  useEffect(() => {
    lastTick.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dt = Math.min(now - lastTick.current, TICK_MS * 3);
      lastTick.current = now;
      const cur = stateRef.current;
      if (cur) {
        if (!cur.met && now - shownAt.current >= expireMs) setState(null);
        return;
      }
      const { salonChallenges, idlePauseSec } = useSettings.getState().game;
      const visible = typeof document === 'undefined' || document.visibilityState !== 'hidden';
      const active = salonChallenges && useGame.getState().overlay === 'none' && visible
        && now - lastInput.current < idlePauseSec * 1000;
      if (!active) return;
      activeMs.current += dt;
      if (activeMs.current < everyMs) return;
      activeMs.current = 0;
      const c = generateChallenge(selectCurrentLook(useDolls.getState()), cat, rng.current, prev.current);
      if (!c) return;
      prev.current = c;
      shownAt.current = now;
      setState({ challenge: c, met: false });
      say(c);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [everyMs, expireMs, cat, say]);

  // Verificación: cada cambio del look actual.
  useEffect(() => {
    const check = () => {
      const cur = stateRef.current;
      if (!cur || cur.met) return;
      if (!isChallengeMet(cur.challenge, selectCurrentLook(useDolls.getState()), cat)) return;
      setState({ challenge: cur.challenge, met: true });
      sfx.play('sparkle');
      void voice.say('ch.done', undefined, { priority: 'feedback' });
      doneTimer.current = setTimeout(() => { setState(null); activeMs.current = 0; }, CHALLENGE_DONE_MS);
    };
    const unsub = useDolls.subscribe(check);
    return () => { unsub(); if (doneTimer.current) clearTimeout(doneTimer.current); };
  }, [cat]);

  return { state, repeat: () => { if (stateRef.current) say(stateRef.current.challenge); } };
}
