/** Pantalla de inicio: elegir muñeca. Versión base de P0; P1 la mejora (carrusel, animaciones). */
import { useEffect } from 'react';
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
});

export function DollSelector() {
  const looks = useDolls((s) => s.looks);
  const selectDoll = useDolls((s) => s.selectDoll);
  const go = useGame((s) => s.go);
  useEffect(() => { void voice.say('home.welcome'); }, []);
  return (
    <div className="doll-selector">
      <div className="doll-row" data-testid="doll-row">
        {catalog.dolls.map((d, i) => (
          <button key={d.id} type="button" className="doll-card pop-in" style={{ animationDelay: `${i * 0.06}s` }}
            aria-label={d.spokenName} data-testid={`doll-${d.id}`}
            onClick={() => { sfx.play('pop'); selectDoll(d.id); go('salon'); }}>
            <DollRenderer look={looks[d.id] ?? defaultLookFor(d.id)} />
          </button>
        ))}
      </div>
      <div className="home-actions">
        <BigButton size="lg" tone="turq" label="Galería" testId="go-gallery" icon={<IconGallery />} onPress={() => go('gallery')} />
        <BigButton size="lg" tone="yellow" label="Aprender jugando" testId="go-learning" icon={<IconStar />} onPress={() => go('learning')} />
      </div>
    </div>
  );
}
