/** Salón: escenario con la muñeca + panel de estudios por pestañas. */
import { useEffect } from 'react';
import type { EditorTab } from '@/types';
import { DollRenderer } from '@/art/DollRenderer';
import { useDolls, useCurrentLook } from '@/store/dollStore';
import { useGame } from '@/store/gameStore';
import { voice, definePhrases } from '@/audio';
import { BigButton } from '@/components/Shell/BigButton';
import { IconCamera, IconComb, IconCrown, IconDress, IconLipstick, IconReset, IconStickers } from '@/components/Shell/icons';
import { MakeupStudio } from '@/components/MakeupStudio/MakeupStudio';
import { HairStudio } from '@/components/HairStudio/HairStudio';
import { Wardrobe } from '@/components/Wardrobe/Wardrobe';
import { Accessories } from '@/components/Accessories/Accessories';
import { StickerLayer, StickerStudio } from '@/components/StickerLayer/StickerLayer';
import { ChallengeBubble } from '@/components/Challenges/ChallengeBubble';
import './editor.css';

definePhrases({
  'editor.makeup': ['Vamos a maquillar a nuestra muñeca', '¿Qué colores le ponemos?'],
  'editor.hair': ['Elige tu peinado favorito', '¿Cómo la peinamos hoy?'],
  'editor.clothes': ['Vamos a vestir a nuestra muñeca', '¿Qué ropa le ponemos?'],
  'editor.accessories': ['¿Qué accesorio le ponemos?', 'Elige aretes, collares y más'],
  'editor.stickers': ['Decora con estrellas y corazones'],
});

const TABS: { key: EditorTab; label: string; Icon: typeof IconDress; tone: 'primary' | 'purple' | 'turq' | 'yellow' | 'green' }[] = [
  { key: 'clothes', label: 'Ropa', Icon: IconDress, tone: 'primary' },
  { key: 'makeup', label: 'Maquillaje', Icon: IconLipstick, tone: 'purple' },
  { key: 'hair', label: 'Peinados', Icon: IconComb, tone: 'turq' },
  { key: 'accessories', label: 'Accesorios', Icon: IconCrown, tone: 'yellow' },
  { key: 'stickers', label: 'Stickers', Icon: IconStickers, tone: 'green' },
];

const STUDIOS: Record<EditorTab, () => React.ReactNode> = {
  makeup: MakeupStudio, hair: HairStudio, clothes: Wardrobe, accessories: Accessories, stickers: StickerStudio,
};

export function DollEditor() {
  const look = useCurrentLook();
  const tab = useDolls((s) => s.editorTab);
  const setTab = useDolls((s) => s.setTab);
  const resetDoll = useDolls((s) => s.resetDoll);
  const go = useGame((s) => s.go);
  useEffect(() => { void voice.say(`editor.${useDolls.getState().editorTab}`); }, []);
  const Studio = STUDIOS[tab];
  return (
    <div className="editor">
      <section className="stage" data-testid="stage">
        <StickerLayer>
          <DollRenderer look={look} className="stage-doll" />
        </StickerLayer>
        <div className="stage-actions">
          <BigButton icon={<IconReset />} label="Empezar de nuevo" testId="reset-doll" onPress={() => resetDoll()} />
          <BigButton size="lg" tone="turq" icon={<IconCamera />} label="Tomar foto" testId="go-photo" onPress={() => go('photo')} />
        </div>
        <ChallengeBubble />
      </section>
      <section className="panel">
        <nav className="main-tabs" role="tablist">
          {TABS.map(({ key, label, Icon, tone }) => (
            <BigButton key={key} icon={<Icon />} label={label} tone={tone} selected={tab === key} testId={`tab-${key}`}
              onPress={() => { if (tab !== key) { setTab(key, ''); void voice.say(`editor.${key}`); } }} />
          ))}
        </nav>
        <div className="studio" key={tab}><Studio /></div>
      </section>
    </div>
  );
}
