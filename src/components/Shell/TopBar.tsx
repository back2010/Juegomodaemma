import { useGame } from '@/store/gameStore';
import { voice } from '@/audio';
import { BigButton } from './BigButton';
import { IconHome, IconLock, IconSpeaker } from './icons';

export function TopBar() {
  const screen = useGame((s) => s.screen.name);
  const go = useGame((s) => s.go);
  const setOverlay = useGame((s) => s.setOverlay);
  const overlay = useGame((s) => s.overlay);
  // Durante una invitación/actividad programada solo queda el candado (para que un adulto pueda cancelar).
  const busy = overlay === 'invite' || overlay === 'activity';
  return (
    <header className="topbar">
      {screen !== 'home' && !busy && <BigButton icon={<IconHome />} label="Inicio" testId="nav-home" onPress={() => go('home')} />}
      <div className="spacer" />
      {!busy && <BigButton icon={<IconSpeaker />} label="Repetir instrucción" testId="repeat-voice" tone="yellow" onPress={() => voice.repeatLast()} />}
      <div className="spacer" />
      <button type="button" className="lock-btn" aria-label="Zona de adultos" data-testid="parent-lock"
        onClick={() => setOverlay('parent')}>
        <IconLock />
      </button>
    </header>
  );
}
