/**
 * ActivityRunner: ejecuta una actividad registrada como una sesión de varias rondas.
 * Firma estable: `ActivitySession: FC<ActivitySessionProps>` (la usan el scheduler y el hub).
 */
import { useCallback, useEffect, useMemo, useRef, useState, type FC } from 'react';
import type { ActivityDef, ActivitySessionProps, RoundResult, VoiceApi } from '@/types';
import { voice, sfx } from '@/audio';
import { BigButton } from '@/components/Shell/BigButton';
import { IconSpeaker } from '@/components/Shell/icons';
import { IconBack } from './icons';
import { useLearning } from '@/store/learningStore';
import { getActivity } from '../registry';
import { applyRound, clamp, roundsFor } from './progression';
import { HintContext } from './hint';
import { Celebration } from './Celebration';
import { makeRng, freshSeed } from './rng';
import { PRAISE_KEYS } from './phrases';
import { MiniStar } from './MiniStar';
import './kit.css';

/** Duración de la celebración entre rondas y de la animación final (ms). */
export const CELEBRATE_MS = 1700;
export const FINALE_MS = 3200;

type Phase = 'play' | 'celebrate' | 'done';

export const ActivitySession: FC<ActivitySessionProps> = (props) => {
  const def = getActivity(props.activityId);
  if (!def) return <MissingActivity onComplete={props.onComplete} />;
  return <Runner def={def} {...props} />;
};

/** Actividad desconocida: no bloquea a la niña, termina de inmediato. */
function MissingActivity({ onComplete }: { onComplete(): void }) {
  useEffect(() => { onComplete(); }, [onComplete]);
  return null;
}

function Runner({ def, durationMin, onComplete, onExit }: ActivitySessionProps & { def: ActivityDef }) {
  const totalRounds = useMemo(() => roundsFor(durationMin, def.estRoundSec), [durationMin, def.estRoundSec]);
  const startAt = useRef(Date.now());
  const baseSeed = useRef(freshSeed());
  const praise = useRef({ order: makeRng(baseSeed.current).shuffle(PRAISE_KEYS), i: 0 });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mistakes = useRef(0);
  const roundStart = useRef(Date.now());
  const roundClosed = useRef(false);
  const completed = useRef(false);
  const lastInstruction = useRef<{ key: string; params?: Record<string, string | number> } | null>(null);

  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('play');
  const [hintToken, setHintToken] = useState(0);
  const [level, setLevel] = useState(() => clamp(useLearning.getState().getProgress(def.id).level, 1, def.maxLevel));

  useEffect(() => () => { timers.current.forEach(clearTimeout); voice.stop(); }, []);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const repeatInstruction = useCallback(() => {
    const l = lastInstruction.current;
    if (l) void voice.say(l.key, l.params);
    else voice.repeatLast();
  }, []);

  /** Voz que recuerda la última instrucción de la ronda para el botón de altavoz y las pistas. */
  const roundVoice = useMemo<VoiceApi>(() => ({
    say(key, params, opts) {
      if ((opts?.priority ?? 'instruction') === 'instruction') lastInstruction.current = { key, params };
      return voice.say(key, params, opts);
    },
    repeatLast: repeatInstruction,
    stop: () => voice.stop(),
  }), [repeatInstruction]);

  const reportMistake = useCallback(() => {
    if (roundClosed.current) return;
    mistakes.current += 1;
    sfx.play('soft');
    setHintToken((t) => t + 1);
    repeatInstruction();
  }, [repeatInstruction]);

  const finish = useCallback(() => {
    setPhase('done');
    sfx.play('chime');
    void voice.say('learn.finish', undefined, { priority: 'feedback' });
    const st = useLearning.getState();
    st.setProgress(def.id, { ...st.getProgress(def.id), plays: st.getProgress(def.id).plays + 1, lastPlayed: Date.now() });
    later(() => { if (!completed.current) { completed.current = true; onComplete(); } }, FINALE_MS);
  }, [def.id, onComplete]);

  const onRoundDone = useCallback((r: RoundResult) => {
    if (roundClosed.current) return;
    roundClosed.current = true;
    const m = Math.max(r.mistakes, mistakes.current);
    const st = useLearning.getState();
    const next = applyRound(st.getProgress(def.id), m, def.maxLevel);
    st.setProgress(def.id, next);
    const done = round + 1;
    setPhase('celebrate');
    sfx.play('sparkle');
    if (done % 3 === 0) {
      const p = praise.current;
      void voice.say(p.order[p.i % p.order.length], undefined, { priority: 'feedback' });
      p.i += 1;
    }
    later(() => {
      const outOfTime = Date.now() - startAt.current >= durationMin * 60_000;
      if (done >= totalRounds || outOfTime) { finish(); return; }
      mistakes.current = 0;
      roundClosed.current = false;
      roundStart.current = Date.now();
      lastInstruction.current = null;
      setHintToken(0);
      setLevel(next.level);
      setRound(done);
      setPhase('play');
    }, CELEBRATE_MS);
  }, [def.id, def.maxLevel, round, totalRounds, durationMin, finish]);

  const Round = def.Round;
  return (
    <div className="lk-session" data-testid="activity-session" data-activity={def.id} data-round={round}
      data-level={level} data-phase={phase} data-total={totalRounds}>
      <div className="lk-session-bar">
        {onExit
          ? <BigButton icon={<IconBack />} label="Salir" testId="activity-exit" onPress={() => { voice.stop(); onExit(); }} />
          : <span className="lk-bar-spacer" />}
        <div className="lk-trail" aria-hidden="true">
          {Array.from({ length: round + (phase === 'play' ? 0 : 1) }, (_, i) => <MiniStar key={i} />)}
        </div>
        <BigButton size="lg" tone="yellow" icon={<IconSpeaker />} label="Repetir" testId="activity-repeat" onPress={repeatInstruction} />
      </div>
      <HintContext.Provider value={{ token: hintToken }}>
        <div className={`lk-stage ${phase !== 'play' ? 'locked' : ''}`}>
          {phase !== 'done' && (
            <Round key={round} level={level} seed={(baseSeed.current + round * 7919) >>> 0} voice={roundVoice} sfx={sfx}
              onRoundDone={onRoundDone} reportMistake={reportMistake} />
          )}
        </div>
      </HintContext.Provider>
      {phase === 'celebrate' && <Celebration seed={round + 1} />}
      {phase === 'done' && <Celebration big seed={99} />}
    </div>
  );
}
