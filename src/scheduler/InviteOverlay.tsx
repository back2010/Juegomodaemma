/** Invitación animada. Opcional: JUGAR / SEGUIR JUGANDO. Obligatorio: solo JUGAR. */
import { BigButton } from '@/components/Shell/BigButton';
import { IconDoll, IconSpeaker, IconStar } from '@/components/Shell/icons';
import { getActivity } from '@/learning/registry';
import { useScheduler } from '@/store/schedulerStore';
import { useSettings } from '@/store/settingsStore';
import { voice } from '@/audio';
import { getEngine } from './engine';
import { PH } from './phrases';

export function InviteOverlay() {
  const invite = useScheduler((s) => s.invite);
  const mode = useSettings((s) => s.scheduler.mode);
  if (!invite) return null;
  const Icon = getActivity(invite.activityId)?.Icon ?? IconStar;
  const e = getEngine();
  return (
    <div className="sched-overlay sched-invite" data-testid="scheduler-invite" data-mode={mode} role="dialog" aria-modal="true" aria-label="Invitación">
      <BigButton className="sched-repeat" tone="turq" label="Repetir" testId="invite-repeat" icon={<IconSpeaker />}
        onPress={() => e.repeatInvite()} />
      <div className="sched-card pop-in">
        <div className="sched-hero" aria-hidden="true"><Icon /></div>
        <div className="sched-actions">
          <BigButton className="sched-play" size="lg" tone="green" label="Jugar actividad" testId="invite-play" icon={<IconStar />}
            onPress={() => { void voice.say(PH.play); e.accept(); }} />
          {mode === 'optional' && (
            <BigButton size="lg" tone="primary" label="Seguir jugando" testId="invite-keep" icon={<IconDoll />}
              onPress={() => { void voice.say(PH.keepPlaying); e.decline(); }} />
          )}
        </div>
      </div>
    </div>
  );
}
