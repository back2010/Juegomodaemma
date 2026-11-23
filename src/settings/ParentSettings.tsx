/** Zona de adultos: aquí sí hay texto. */
import { useEffect, useState, type ReactNode } from 'react';
import { useSettings } from '@/store/settingsStore';
import { useGallery } from '@/store/galleryStore';
import { useLearning } from '@/store/learningStore';
import { useGame } from '@/store/gameStore';
import { requestPersistentStorage } from '@/db/db';
import { schedulerApi } from '@/scheduler/api';
import { listVoices, testVoice } from '@/audio';
import { getActivity } from '@/learning/registry';
import { LEARNING_CATEGORIES, type DurationMin, type IntervalMin, type LearningCategory } from '@/types';
import './ParentSettings.css';

const CATEGORY_LABEL: Record<LearningCategory, string> = {
  colores: 'Colores', figuras: 'Figuras', numeros: 'Números', memoria: 'Memoria', patrones: 'Patrones', clasificacion: 'Clasificación',
};

function Section({ title, children, id }: { title: string; children: ReactNode; id: string }) {
  return <section className="ps-section" data-testid={`sec-${id}`}><h2>{title}</h2>{children}</section>;
}
function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="ps-row"><div className="ps-label">{label}{hint && <small>{hint}</small>}</div><div className="ps-control">{children}</div></div>
  );
}
function Seg<T extends string | number>({ value, options, onChange, id }: {
  value: T; options: [T, string][]; onChange(v: T): void; id: string;
}) {
  return (
    <div className="ps-seg" role="radiogroup">
      {options.map(([v, l]) => (
        <button key={String(v)} type="button" role="radio" aria-checked={value === v} className={value === v ? 'on' : ''}
          data-testid={`${id}-${v}`} onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  );
}
function Switch({ on, onChange, id, label }: { on: boolean; onChange(v: boolean): void; id: string; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={`ps-switch ${on ? 'on' : ''}`} data-testid={id} onClick={() => onChange(!on)}>
      <span />
    </button>
  );
}
function Confirm({ label, question, onYes, id, danger = true }: { label: string; question: string; onYes(): void; id: string; danger?: boolean }) {
  const [ask, setAsk] = useState(false);
  if (!ask) return <button type="button" className={`ps-btn ${danger ? 'danger' : ''}`} data-testid={id} onClick={() => setAsk(true)}>{label}</button>;
  return (
    <span className="ps-confirm" data-testid={`${id}-confirm`}>
      <b>{question}</b>
      <button type="button" className="ps-btn danger" data-testid={`${id}-yes`} onClick={() => { setAsk(false); onYes(); }}>Sí, continuar</button>
      <button type="button" className="ps-btn" data-testid={`${id}-no`} onClick={() => setAsk(false)}>Cancelar</button>
    </span>
  );
}

export function ParentSettings() {
  const s = useSettings();
  const go = useGame((g) => g.go);
  const clearGallery = useGallery((g) => g.clear);
  const perActivity = useLearning((l) => l.perActivity);
  const history = useLearning((l) => l.history);
  const resetProgress = useLearning((l) => l.resetProgress);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => listVoices());
  const [persist, setPersist] = useState<string>('');
  const [note, setNote] = useState('');

  useEffect(() => { schedulerApi.pause('parent'); return () => schedulerApi.resume('parent'); }, []);
  useEffect(() => {
    if (typeof speechSynthesis === 'undefined') return;
    const upd = () => setVoices(listVoices());
    speechSynthesis.addEventListener?.('voiceschanged', upd);
    return () => speechSynthesis.removeEventListener?.('voiceschanged', upd);
  }, []);

  const sc = s.scheduler, au = s.audio, gm = s.game;
  const allOn = LEARNING_CATEGORIES.every((c) => sc.categories[c]);

  const counts: Record<LearningCategory, number> = { colores: 0, figuras: 0, numeros: 0, memoria: 0, patrones: 0, clasificacion: 0 };
  let known = 0;
  for (const [id, p] of Object.entries(perActivity)) {
    const cat = getActivity(id)?.category;
    if (cat) { counts[cat] += p.plays; known += p.plays; }
  }
  if (!known) for (const h of history) counts[h.category] += 1;

  return (
    <div className="ps" data-testid="parent-settings">
      <div className="ps-head">
        <h1>Zona de adultos</h1>
        <button type="button" className="ps-btn primary" data-testid="ps-exit" onClick={() => go('home')}>Salir</button>
      </div>

      <Section id="scheduler" title="Actividades de aprendizaje">
        <Row label="Cada cuánto aparece una actividad">
          <Seg id="interval" value={sc.intervalMin} onChange={(v) => s.updateScheduler({ intervalMin: v as IntervalMin })}
            options={[[0, 'Desactivado'], [10, '10 min'], [15, '15 min'], [20, '20 min'], [30, '30 min']]} />
        </Row>
        <Row label="Duración">
          <Seg id="duration" value={sc.durationMin} onChange={(v) => s.updateScheduler({ durationMin: v as DurationMin })}
            options={[[2, '2 min'], [3, '3 min'], [5, '5 min']]} />
        </Row>
        <Row label="Modo" hint="Obligatorio: la actividad no se puede omitir.">
          <Seg id="mode" value={sc.mode} onChange={(v) => s.updateScheduler({ mode: v })}
            options={[['optional', 'Opcional'], ['mandatory', 'Obligatorio']]} />
        </Row>
        <Row label="Volver a invitar tras “seguir jugando”">
          <Seg id="reinvite" value={sc.reinviteMin} onChange={(v) => s.updateScheduler({ reinviteMin: v })}
            options={[[3, '3 min'], [5, '5 min'], [10, '10 min']]} />
        </Row>
        <Row label="Categorías">
          <div className="ps-chips">
            <button type="button" className={`ps-chip ${allOn ? 'on' : ''}`} data-testid="cat-all"
              onClick={() => s.updateScheduler({ categories: Object.fromEntries(LEARNING_CATEGORIES.map((c) => [c, !allOn])) as Record<LearningCategory, boolean> })}>Todas</button>
            {LEARNING_CATEGORIES.map((c) => (
              <button key={c} type="button" className={`ps-chip ${sc.categories[c] ? 'on' : ''}`} aria-pressed={sc.categories[c]} data-testid={`cat-${c}`}
                onClick={() => s.updateScheduler({ categories: { ...sc.categories, [c]: !sc.categories[c] } })}>{CATEGORY_LABEL[c]}</button>
            ))}
          </div>
        </Row>
        <Row label="Actividad en curso">
          <button type="button" className="ps-btn" data-testid="cancel-activity" onClick={() => { schedulerApi.cancelActivity(); setNote('Actividad cancelada'); }}>Cancelar actividad en curso</button>
        </Row>
      </Section>

      <Section id="audio" title="Audio">
        <Row label="Voz"><Switch id="voice-on" label="Voz" on={au.voiceOn} onChange={(v) => s.updateAudio({ voiceOn: v })} /></Row>
        <Row label="Efectos de sonido"><Switch id="sfx-on" label="Efectos" on={au.sfxOn} onChange={(v) => s.updateAudio({ sfxOn: v })} /></Row>
        <Row label="Volumen">
          <input type="range" className="ps-range" data-testid="volume" min={0} max={1} step={0.05} value={au.volume}
            onChange={(e) => s.updateAudio({ volume: Number(e.target.value) })} />
        </Row>
        <Row label="Velocidad de la voz">
          <input type="range" className="ps-range" data-testid="rate" min={0.6} max={1.3} step={0.05} value={au.rate}
            onChange={(e) => s.updateAudio({ rate: Number(e.target.value) })} />
        </Row>
        <Row label="Voz del dispositivo" hint={voices.length ? undefined : 'No hay voces en español disponibles.'}>
          <select className="ps-select" data-testid="voice-select" value={au.voiceURI ?? ''}
            onChange={(e) => s.updateAudio({ voiceURI: e.target.value || undefined })}>
            <option value="">Automática</option>
            {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
          </select>
          <button type="button" className="ps-btn" data-testid="voice-test" onClick={() => testVoice()}>Probar voz</button>
        </Row>
      </Section>

      <Section id="game" title="Juego">
        <Row label="Nombre de la niña">
          <input type="text" className="ps-input" data-testid="child-name" value={gm.childName} maxLength={20}
            onChange={(e) => s.updateGame({ childName: e.target.value })} />
        </Row>
        <Row label="Retos en el salón"><Switch id="salon-challenges" label="Retos en el salón" on={gm.salonChallenges} onChange={(v) => s.updateGame({ salonChallenges: v })} /></Row>
        <Row label="Segundos de inactividad antes de pausar">
          <Seg id="idle" value={gm.idlePauseSec} onChange={(v) => s.updateGame({ idlePauseSec: v })}
            options={[[30, '30'], [60, '60'], [90, '90'], [120, '120'], [180, '180']]} />
        </Row>
      </Section>

      <Section id="data" title="Datos y progreso">
        <Row label="Almacenamiento persistente" hint="Evita que el navegador borre las creaciones.">
          <button type="button" className="ps-btn" data-testid="persist" onClick={async () => setPersist((await requestPersistentStorage()) ? 'Activado' : 'No concedido')}>Solicitar</button>
          {persist && <b data-testid="persist-result">{persist}</b>}
        </Row>
        <Row label="Galería"><Confirm id="clear-gallery" label="Borrar galería" question="¿Borrar todas las creaciones?" onYes={() => { void clearGallery(); setNote('Galería borrada'); }} /></Row>
        <Row label="Progreso"><Confirm id="reset-progress" label="Reiniciar progreso" question="¿Reiniciar el progreso?" onYes={() => { resetProgress(); setNote('Progreso reiniciado'); }} /></Row>
        <Row label="Actividades jugadas por categoría">
          <ul className="ps-summary" data-testid="summary">
            {LEARNING_CATEGORIES.map((c) => <li key={c}><span>{CATEGORY_LABEL[c]}</span><b data-testid={`played-${c}`}>{counts[c]}</b></li>)}
          </ul>
        </Row>
      </Section>
      {note && <div className="ps-note" role="status">{note}</div>}
    </div>
  );
}
