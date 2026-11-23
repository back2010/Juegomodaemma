/**
 * Pantalla 'learning': 6 categorías grandes. Al tocar una, se juega una actividad de esa categoría
 * en modo libre. Mientras está montada, el scheduler queda en pausa ('learningFree').
 */
import { useEffect, useState } from 'react';
import { LEARNING_CATEGORIES, type ActivityDef, type ActivityProgress, type LearningCategory } from '@/types';
import { schedulerApi } from '@/scheduler/api';
import { sfx, voice } from '@/audio';
import { useSettings } from '@/store/settingsStore';
import { useLearning } from '@/store/learningStore';
import { activitiesOf } from './registry';
import { ActivitySession } from './kit/ActivitySession';
import { CATEGORY_UI } from './categories';
import { shift } from '@/art/kit';
import './kit/phrases';
import './learning.css';

/** Elige la actividad menos reciente de la lista (empates al azar). */
export function pickActivity(list: ActivityDef[], progress: Record<string, ActivityProgress>, rnd = Math.random): ActivityDef | undefined {
  if (!list.length) return undefined;
  const last = (a: ActivityDef) => progress[a.id]?.lastPlayed ?? 0;
  const min = Math.min(...list.map(last));
  const oldest = list.filter((a) => last(a) === min);
  return oldest[Math.floor(rnd() * oldest.length)];
}

export function LearningHub() {
  const durationMin = useSettings((s) => s.scheduler.durationMin);
  const [playing, setPlaying] = useState<ActivityDef | null>(null);

  useEffect(() => {
    schedulerApi.pause('learningFree');
    void voice.say('learn.hub');
    return () => schedulerApi.resume('learningFree');
  }, []);

  const choose = (c: LearningCategory) => {
    const a = pickActivity(activitiesOf(c), useLearning.getState().perActivity);
    if (!a) return;
    sfx.play('tap');
    setPlaying(a);
  };

  if (playing) {
    return (
      <div className="lh-play">
        <ActivitySession key={playing.id} activityId={playing.id} durationMin={durationMin} mode="free"
          onExit={() => { setPlaying(null); void voice.say('learn.hub'); }}
          onComplete={() => {
            const e = { activityId: playing.id, category: playing.category, at: Date.now() };
            useLearning.getState().recordSession(e);
            schedulerApi.activityCompleted(e);
            setPlaying(null);
          }} />
      </div>
    );
  }

  return (
    <div className="lh-hub" data-testid="learning-hub">
      {LEARNING_CATEGORIES.map((c) => {
        const { Icon, color } = CATEGORY_UI[c];
        const enabled = activitiesOf(c).length > 0;
        return (
          <button key={c} type="button" aria-label={c} data-testid={`learn-cat-${c}`} data-enabled={enabled ? 'yes' : 'no'}
            disabled={!enabled} aria-disabled={!enabled}
            className={`lh-cat ${enabled ? 'pop-in' : 'off'}`}
            style={{ background: `radial-gradient(circle at 35% 30%, ${shift(color, 0.25)}, ${color} 60%, ${shift(color, -0.15)})` }}
            onClick={() => enabled && choose(c)}>
            <span className="lh-cat-icon"><Icon /></span>
          </button>
        );
      })}
    </div>
  );
}
