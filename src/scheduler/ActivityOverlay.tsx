/** Actividad programada a pantalla completa. En modo obligatorio no hay salida (onExit undefined). */
import { ActivitySession } from '@/learning/kit/ActivitySession';
import { useScheduler } from '@/store/schedulerStore';
import { useSettings } from '@/store/settingsStore';
import { voice } from '@/audio';
import { getEngine } from './engine';
import { PH } from './phrases';

export function ActivityOverlay() {
  const current = useScheduler((s) => s.current);
  const mode = useSettings((s) => s.scheduler.mode);
  const durationMin = useSettings((s) => s.scheduler.durationMin);
  if (!current) return null;
  const e = getEngine();
  return (
    <div className="sched-overlay sched-activity" data-testid="scheduler-activity" data-mode={mode} role="dialog" aria-modal="true" aria-label="Actividad">
      <ActivitySession
        key={current.startedAt}
        activityId={current.activityId}
        durationMin={durationMin}
        mode="scheduler"
        onComplete={() => { e.complete(); void voice.say(PH.back); }}
        onExit={mode === 'optional' ? () => e.exitActivity() : undefined}
      />
    </div>
  );
}
