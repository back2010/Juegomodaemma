/** Puerta parental: mantener pulsado 3 s y luego resolver una suma de dos números de 2 dígitos. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '@/store/gameStore';
import { IconLock, IconCheck } from '@/components/Shell/icons';
import { IconClose } from '@/components/Gallery/galleryIcons';
import './ParentGate.css';

export const HOLD_MS = 3000;
export const MAX_FAILS = 2;
const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const newQuestion = () => ({ a: rnd(11, 89), b: rnd(11, 89) });

const R = 70, C = 2 * Math.PI * R;

function HoldStep({ onDone }: { onDone(): void }) {
  const [progress, setProgress] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stop = useCallback(() => { if (timer.current) clearInterval(timer.current); timer.current = null; setProgress(0); }, []);
  const start = () => {
    if (timer.current) return;
    const t0 = Date.now();
    timer.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / HOLD_MS);
      setProgress(p);
      if (p >= 1) { clearInterval(timer.current!); timer.current = null; onDone(); }
    }, 50);
  };
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  return (
    <button type="button" className="gate-hold" data-testid="gate-hold" aria-label="Mantén pulsado el candado"
      onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onContextMenu={(e) => e.preventDefault()}>
      <svg className="gate-ring" viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r={R} fill="none" stroke="#fff" strokeWidth="12" opacity="0.6" />
        <circle cx="80" cy="80" r={R} fill="none" stroke="#ff2d95" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - progress)} transform="rotate(-90 80 80)" data-testid="gate-progress" data-progress={progress.toFixed(2)} />
      </svg>
      <IconLock className="gate-lock" />
    </button>
  );
}

function SumStep({ onPass, onFail }: { onPass(): void; onFail(): void }) {
  const [q, setQ] = useState(newQuestion);
  const [typed, setTyped] = useState('');
  const [shake, setShake] = useState(false);
  const submit = () => {
    if (typed === '') return;
    if (Number(typed) === q.a + q.b) { onPass(); return; }
    setShake(true); setTimeout(() => setShake(false), 400);
    setTyped(''); setQ(newQuestion()); onFail();
  };
  const press = (d: string) => setTyped((t) => (t.length < 3 ? t + d : t));
  return (
    <div className={`gate-sum ${shake ? 'shake' : ''}`}>
      <div className="gate-question" data-testid="gate-question">{q.a} + {q.b}</div>
      <div className="gate-answer" data-testid="gate-answer">{typed || ' '}</div>
      <div className="gate-pad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} type="button" className="gate-key" data-testid={`key-${d}`} onClick={() => press(d)}>{d}</button>
        ))}
        <button type="button" className="gate-key alt" data-testid="key-back" aria-label="Borrar" onClick={() => setTyped((t) => t.slice(0, -1))}>⌫</button>
        <button type="button" className="gate-key" data-testid="key-0" onClick={() => press('0')}>0</button>
        <button type="button" className="gate-key ok" data-testid="key-ok" aria-label="Aceptar" onClick={submit}><IconCheck /></button>
      </div>
    </div>
  );
}

export function ParentGate() {
  const setOverlay = useGame((s) => s.setOverlay);
  const go = useGame((s) => s.go);
  const [step, setStep] = useState<'hold' | 'sum'>('hold');
  const fails = useRef(0);
  const close = () => setOverlay('none');
  return (
    <div className="gate" role="dialog" aria-modal="true" data-testid="parent-gate">
      <button type="button" className="gate-close btn" aria-label="Cerrar" data-testid="gate-close" onClick={close}><IconClose /></button>
      {step === 'hold'
        ? <HoldStep onDone={() => setStep('sum')} />
        : <SumStep onPass={() => { go('parent'); setOverlay('none'); }} onFail={() => { fails.current += 1; if (fails.current >= MAX_FAILS) close(); }} />}
    </div>
  );
}
