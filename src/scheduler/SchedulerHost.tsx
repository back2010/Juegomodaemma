/** Host del scheduler: arranca el motor y muestra los overlays de invitación/actividad. */
import { useEffect } from 'react';
import { useGame } from '@/store/gameStore';
import { useScheduler } from '@/store/schedulerStore';
import { getEngine } from './engine';
import { registerSchedulerPhrases } from './phrases';
import { InviteOverlay } from './InviteOverlay';
import { ActivityOverlay } from './ActivityOverlay';
import { installE2EHooks } from './e2e';
import './scheduler.css';

export function SchedulerHost() {
  useEffect(() => {
    registerSchedulerPhrases();
    const e = getEngine();
    e.start();
    if (import.meta.env.VITE_E2E) installE2EHooks();
    return () => e.stop();
  }, []);
  const overlay = useGame((s) => s.overlay);
  const hasInvite = useScheduler((s) => !!s.invite);
  const hasCurrent = useScheduler((s) => !!s.current);
  return (
    <>
      {overlay === 'invite' && hasInvite && <InviteOverlay />}
      {overlay === 'activity' && hasCurrent && <ActivityOverlay />}
    </>
  );
}
