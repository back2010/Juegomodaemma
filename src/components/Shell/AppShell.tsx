import { useState, type ReactNode } from 'react';
import { voice, sfx } from '@/audio';
import { BigButton } from './BigButton';
import { IconPlay, IconRotate } from './icons';
import { TopBar } from './TopBar';

const DECO = ['★', '♥', '✦', '✿', '★', '♥', '✦', '✿', '★', '♥', '✦', '✿'];
const DECO_COLORS = ['#ff2d95', '#9b4dff', '#22d3c5', '#ffd23f', '#ff6f61', '#3a8bff', '#3ddc84'];

function Decorations() {
  return (
    <div className="deco" aria-hidden="true">
      {DECO.map((c, i) => (
        <span key={i} style={{
          left: `${(i * 83) % 100}%`, top: `${(i * 37 + 11) % 100}%`, color: DECO_COLORS[i % DECO_COLORS.length],
          fontSize: 22 + ((i * 13) % 26), animationDelay: `${(i * 0.4) % 3}s`,
        }}>{c}</span>
      ))}
    </div>
  );
}

/** Botón ▶ inicial: el gesto desbloquea la voz y el audio en iPad. */
function StartGate({ onStart }: { onStart(): void }) {
  return (
    <div className="start-gate" data-testid="start-gate">
      <BigButton className="float" size="lg" tone="primary" label="Empezar" testId="start" icon={<IconPlay />}
        onPress={() => { voice.unlock(); sfx.play('chime'); onStart(); }} />
    </div>
  );
}

export function AppShell({ children, overlays }: { children: ReactNode; overlays?: ReactNode }) {
  const [started, setStarted] = useState(false);
  return (
    <div className="app">
      <Decorations />
      <TopBar />
      <main className="screen">{children}</main>
      {overlays}
      {!started && <StartGate onStart={() => setStarted(true)} />}
      <div className="rotate-notice" aria-hidden="true"><IconRotate /></div>
    </div>
  );
}
