/** Estudio de fotografía: vista previa con fondo y marco, cámara y descarga. Sin texto. */
import { useEffect, useRef, useState } from 'react';
import { BACKGROUNDS, FRAMES, Background, Frame } from '@/assets/scenes';
import { useCurrentLook } from '@/store/dollStore';
import { useGame } from '@/store/gameStore';
import { useGallery } from '@/store/galleryStore';
import { BigButton } from '@/components/Shell/BigButton';
import { IconCamera, IconDress, IconGallery, IconNone } from '@/components/Shell/icons';
import { definePhrases, sfx, voice } from '@/audio';
import { PhotoScene } from '@/utils/PhotoScene';
import { composeScene } from '@/utils/ImageComposer';
import { saveCreation, FULL_SIZE } from '@/utils/SaveCreation';
import { downloadBlob } from '@/utils/download';
import { IconDownload } from '@/components/Gallery/galleryIcons';
import './PhotoStudio.css';

definePhrases({
  'photo.welcome': ['¡Qué bonita! Elige un fondo', '¡Vamos a tomar una foto!'],
  'photo.saved': ['¡Foto guardada!', '¡Qué linda foto!', '¡Listo! Ya está en tu galería'],
  'photo.download': ['¡Lista para llevar!'],
});

const Thumb = ({ children, bg }: { children: React.ReactNode; bg?: string }) => (
  <svg viewBox="0 0 1600 1200" aria-hidden="true" style={bg ? { background: bg } : undefined}>{children}</svg>
);

export function PhotoStudio() {
  const look = useCurrentLook();
  const photo = useGame((s) => s.photo);
  const setScene = useGame((s) => s.setScene);
  const setPhoto = useGame((s) => s.setPhoto);
  const go = useGame((s) => s.go);
  const loadGallery = useGallery((s) => s.load);
  const [flash, setFlash] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const alive = useRef(true);

  useEffect(() => { alive.current = true; void voice.say('photo.welcome'); void loadGallery(); return () => { alive.current = false; }; }, [loadGallery]);

  const snap = async () => {
    if (busy) return;
    setBusy(true); setFlash(true); sfx.play('sparkle');
    setTimeout(() => alive.current && setFlash(false), 450);
    try {
      const rec = await saveCreation(look, photo.scene, photo.editingCreationId);
      setPhoto({ scene: photo.scene, editingCreationId: rec.id });
      sfx.play('chime'); void voice.say('photo.saved');
      if (alive.current) { setSaved(true); setTimeout(() => alive.current && setSaved(false), 1600); }
    } catch (e) { console.error(e); } finally { if (alive.current) setBusy(false); }
  };

  const download = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await downloadBlob(await composeScene(look, photo.scene, FULL_SIZE));
      void voice.say('photo.download');
    } catch (e) { console.error(e); } finally { if (alive.current) setBusy(false); }
  };

  return (
    <div className="photo-studio" data-testid="photo-studio">
      <div className="photo-stage">
        <div className="photo-frame-card">
          <PhotoScene look={look} scene={photo.scene} className="photo-preview" />
          {flash && <div className="photo-flash" data-testid="photo-flash" />}
          {saved && <div className="photo-saved pop-in" aria-hidden="true"><IconGallery /></div>}
        </div>
        <div className="photo-actions">
          <BigButton icon={<IconDress />} label="Volver al salón" testId="photo-back" tone="purple" onPress={() => go('salon')} />
          <BigButton icon={<IconCamera />} label="Tomar foto" testId="photo-snap" size="lg" tone="primary" className="photo-snap" onPress={snap} />
          <BigButton icon={<IconDownload />} label="Descargar" testId="photo-download" tone="turq" onPress={download} />
          <BigButton icon={<IconGallery />} label="Galería" testId="photo-gallery" tone="yellow" onPress={() => go('gallery')} />
        </div>
      </div>
      <aside className="photo-panel">
        <div className="photo-row" role="group" aria-label="Fondos" data-testid="bg-row">
          {BACKGROUNDS.map((b) => (
            <button key={b.id} type="button" className={`photo-thumb ${photo.scene.backgroundId === b.id ? 'selected' : ''}`}
              aria-label={b.id} data-testid={`pick-${b.id}`} onClick={() => { sfx.play('pop'); setScene({ backgroundId: b.id }); }}>
              <Thumb><Background id={b.id} /></Thumb>
            </button>
          ))}
        </div>
        <div className="photo-row" role="group" aria-label="Marcos" data-testid="frame-row">
          <button type="button" className={`photo-thumb none ${photo.scene.frameId === null ? 'selected' : ''}`}
            aria-label="Sin marco" data-testid="pick-frame-none" onClick={() => { sfx.play('pop'); setScene({ frameId: null }); }}>
            <IconNone />
          </button>
          {FRAMES.map((f) => (
            <button key={f.id} type="button" className={`photo-thumb ${photo.scene.frameId === f.id ? 'selected' : ''}`}
              aria-label={f.id} data-testid={`pick-${f.id}`} onClick={() => { sfx.play('pop'); setScene({ frameId: f.id }); }}>
              <Thumb bg="#fff6fb"><Frame id={f.id} /></Thumb>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
