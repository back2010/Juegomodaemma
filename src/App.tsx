import type { JSX } from 'react';
import type { Screen } from '@/types';
import { useGame } from '@/store/gameStore';
import { AppShell } from '@/components/Shell/AppShell';
import { DollSelector } from '@/components/DollSelector/DollSelector';
import { DollEditor } from '@/components/DollEditor/DollEditor';
import { PhotoStudio } from '@/components/PhotoStudio/PhotoStudio';
import { Gallery } from '@/components/Gallery/Gallery';
import { ParentGate } from '@/components/ParentGate/ParentGate';
import { ParentSettings } from '@/settings/ParentSettings';
import { LearningHub } from '@/learning/LearningHub';
import { SchedulerHost } from '@/scheduler/SchedulerHost';

const SCREENS: Record<Screen['name'], () => JSX.Element | null> = {
  home: DollSelector, salon: DollEditor, photo: PhotoStudio, gallery: Gallery, learning: LearningHub, parent: ParentSettings,
};

export default function App() {
  const screen = useGame((s) => s.screen.name);
  const overlay = useGame((s) => s.overlay);
  const Current = SCREENS[screen] ?? DollSelector;
  return (
    <AppShell overlays={<>{overlay === 'parent' && <ParentGate />}<SchedulerHost /></>}>
      {/* La pantalla sigue montada (inerte) bajo los overlays: el estado de juego no se pierde. */}
      <div style={{ height: '100%' }} inert={overlay !== 'none'} aria-hidden={overlay !== 'none'}>
        <Current key={screen} />
      </div>
    </AppShell>
  );
}
