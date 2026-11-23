import { useGame } from '@/store/gameStore';
import { voice } from '@/audio';
import { BigButton } from './BigButton';
import { IconHome, IconLock, IconSpeaker } from './icons';

export function TopBar() {
  const screen = useGame((s) => s.screen.name);
  const go = useGame((s) => s.go);
  const setOverlay = useGame((s) => s.setOverlay);
  return (
    <header className="topbar">
      {screen !== 'home' && <BigButton icon={<IconHome />} label="Inicio" testId="nav-home" onPress={() => go('home')} />}
      <div className="spacer" />
      <BigButton icon={<IconSpeaker />} label="Repetir instrucción" testId="repeat-voice" tone="yellow" onPress={() => voice.repeatLast()} />
      <div className="spacer" />
      <button type="button" className="lock-btn" aria-label="Zona de adultos" data-testid="parent-lock"
        onClick={() => setOverlay('parent')}>
        <IconLock />
      </button>
    </header>
  );
}
