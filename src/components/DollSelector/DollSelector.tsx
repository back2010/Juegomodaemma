/** Pantalla de inicio: elegir muñeca. Tarjetas grandes, animación al tocar, la voz dice el nombre y entra al salón. */
import { useEffect, useRef, useState } from 'react';
import { catalog } from '@/catalog/registry';
import { useDolls, defaultLookFor } from '@/store/dollStore';
import { useGame } from '@/store/gameStore';
import { DollRenderer } from '@/art/DollRenderer';
import { BigButton } from '@/components/Shell/BigButton';
import { IconGallery, IconStar } from '@/components/Shell/icons';
import { voice, definePhrases, sfx } from '@/audio';
import './DollSelector.css';

definePhrases({
  'home.welcome': ['¡Hola, {name}! Elige una muñeca', '¡Hola, {name}! ¿Con quién jugamos hoy?'],
  'home.pick': ['¡Hola, {doll}!', '¡Vamos con {doll}!', '¡{doll} quiere jugar!', '¡A jugar con {doll}!'],
});

/** Fondos de tarjeta (uno por muñeca, en ciclo). */
const CARD_TONES = [
  ['#fff6c9', '#ffd6ec'], ['#d9fff4', '#ffd9cc'], ['#ffe0f2', '#e6d6ff'],
  ['#ffe9cc', '#d6ecff'], ['#efe0ff', '#ffe0ec'], ['#d6f5ff', '#fff0c2'],
] as const;

/** Recorte del viewBox para que la muñeca se vea más grande en la tarjeta. */
const CARD_CROP: [number, number, number, number] = [115, 48, 370, 930];
/** Tiempo mínimo de la animación y máximo de espera de la voz antes de entrar al salón. */
const MIN_MS = 700;
const MAX_MS = 1800;

const wait = (ms: number) => new Promise<void>((r) => { setTimeout(r, ms); });

export function DollSelector() {
  const looks = useDolls((s) => s.looks);
  const selectDoll = useDolls((s) => s.selectDoll);
  const go = useGame((s) => s.go);
  const [chosen, setChosen] = useState<string | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    void voice.say('home.welcome');
    return () => { alive.current = false; };
  }, []);

  const pick = (id: string, name: string) => {
    if (chosen) return;
    sfx.play('sparkle');
    setChosen(id);
    selectDoll(id);
    const spoken = voice.say('home.pick', { doll: name }, { priority: 'feedback' }).catch(() => undefined);
    void Promise.all([wait(MIN_MS), Promise.race([spoken, wait(MAX_MS)])]).then(() => {
      if (alive.current) go('salon');
    });
  };

  return (
    <div className="doll-selector">
      <div className={`doll-row${chosen ? ' has-chosen' : ''}`} data-testid="doll-row">
        {catalog.dolls.map((d, i) => {
          const [a, b] = CARD_TONES[i % CARD_TONES.length];
          const isChosen = chosen === d.id;
          return (
            <button key={d.id} type="button"
              className={`doll-card pop-in${isChosen ? ' chosen' : ''}`}
              style={{ animationDelay: `${i * 0.07}s`, ['--card-a' as string]: a, ['--card-b' as string]: b, ['--float-delay' as string]: `${(i % 3) * 0.6}s` }}
              aria-label={d.spokenName} aria-pressed={isChosen} data-testid={`doll-${d.id}`}
              onClick={() => pick(d.id, d.spokenName)}>
              <span className="doll-card-glow" aria-hidden="true" />
              <span className="doll-card-floor" aria-hidden="true" />
              <span className="doll-card-doll">
                <DollRenderer look={looks[d.id] ?? defaultLookFor(d.id)} crop={CARD_CROP} idPrefix={`sel-${d.id}`} />
              </span>
              <span className="doll-card-spark s1" aria-hidden="true" />
              <span className="doll-card-spark s2" aria-hidden="true" />
              <span className="doll-card-spark s3" aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <div className="home-actions">
        <BigButton size="lg" tone="turq" label="Galería" testId="go-gallery" icon={<IconGallery />} onPress={() => go('gallery')} />
        <BigButton size="lg" tone="yellow" label="Aprender jugando" testId="go-learning" icon={<IconStar />} onPress={() => go('learning')} />
      </div>
    </div>
  );
}
