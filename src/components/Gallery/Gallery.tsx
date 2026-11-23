/** Galería de creaciones: cuadrícula, ver en grande, duplicar, editar, borrar y descargar. */
import { useEffect, useState } from 'react';
import { useGallery } from '@/store/galleryStore';
import { useGame } from '@/store/gameStore';
import { getImage } from '@/db/db';
import { BigButton } from '@/components/Shell/BigButton';
import { IconCamera, IconCheck, IconDress, IconTrash } from '@/components/Shell/icons';
import { IconClose, IconCopy, IconDownload, IconEdit, IconEmptyFrames } from './galleryIcons';
import { definePhrases, sfx, voice } from '@/audio';
import { loadCreation } from '@/utils/LoadCreation';
import { downloadBlob } from '@/utils/download';
import type { Creation } from '@/types';
import './Gallery.css';

definePhrases({
  'gallery.welcome': ['¡Mira tus fotos!', 'Aquí están tus creaciones'],
  'gallery.empty': ['Todavía no hay fotos. ¡Vamos a crear una!'],
});

/** Convierte claves de imagen en object URLs y los libera al cambiar/desmontar. */
function useImageUrls(keys: string[]) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const sig = keys.join('|');
  useEffect(() => {
    let dead = false;
    const made: string[] = [];
    (async () => {
      const out: Record<string, string> = {};
      for (const k of keys) {
        const b = await getImage(k);
        if (b && !dead) { const u = URL.createObjectURL(b); made.push(u); out[k] = u; }
      }
      if (!dead) setUrls(out);
    })();
    return () => { dead = true; made.forEach((u) => URL.revokeObjectURL(u)); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
  return urls;
}

export function Gallery() {
  const items = useGallery((s) => s.items);
  const loaded = useGallery((s) => s.loaded);
  const load = useGallery((s) => s.load);
  const duplicate = useGallery((s) => s.duplicate);
  const remove = useGallery((s) => s.remove);
  const go = useGame((s) => s.go);
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (loaded) void voice.say(useGallery.getState().items.length ? 'gallery.welcome' : 'gallery.empty'); }, [loaded]);

  const thumbs = useImageUrls(items.map((c) => c.thumbKey));
  const open: Creation | undefined = items.find((c) => c.id === openId);
  const big = useImageUrls(open ? [open.imageKey] : []);

  const close = () => { setOpenId(null); setConfirm(false); };

  if (loaded && items.length === 0) {
    return (
      <div className="gallery-empty" data-testid="gallery-empty">
        <IconEmptyFrames className="float" />
        <BigButton icon={<IconDress />} label="Ir al salón" size="lg" tone="primary" testId="gallery-to-salon" onPress={() => go('salon')} />
      </div>
    );
  }

  return (
    <div className="gallery" data-testid="gallery">
      <div className="gallery-grid">
        {items.map((c) => (
          <button key={c.id} type="button" className="gallery-card pop-in" aria-label="Ver foto" data-testid={`creation-${c.id}`}
            onClick={() => { sfx.play('pop'); setOpenId(c.id); }}>
            {thumbs[c.thumbKey] && <img src={thumbs[c.thumbKey]} alt="" draggable={false} />}
          </button>
        ))}
      </div>
      {open && (
        <div className="gallery-modal" data-testid="gallery-viewer">
          <div className="gallery-big">
            {big[open.imageKey] && <img src={big[open.imageKey]} alt="" draggable={false} />}
          </div>
          {!confirm ? (
            <div className="gallery-actions">
              <BigButton icon={<IconEdit />} label="Volver a editar" tone="purple" testId="creation-edit" onPress={() => { const c = open; close(); loadCreation(c); }} />
              <BigButton icon={<IconCopy />} label="Duplicar" tone="turq" testId="creation-duplicate" onPress={async () => { await duplicate(open.id); sfx.play('sparkle'); }} />
              <BigButton icon={<IconDownload />} label="Descargar" tone="yellow" testId="creation-download" onPress={async () => { const b = await getImage(open.imageKey); if (b) await downloadBlob(b); }} />
              <BigButton icon={<IconTrash />} label="Borrar" testId="creation-delete" onPress={() => setConfirm(true)} />
              <BigButton icon={<IconClose />} label="Cerrar" tone="primary" testId="creation-close" onPress={close} />
            </div>
          ) : (
            <div className="gallery-actions confirm" data-testid="delete-confirm">
              <IconTrash className="confirm-icon float" />
              <BigButton icon={<IconCheck />} label="Sí, borrar" size="lg" tone="green" testId="delete-yes"
                onPress={async () => { await remove(open.id); close(); }} />
              <BigButton icon={<IconClose />} label="No, cancelar" size="lg" tone="primary" testId="delete-no" onPress={() => setConfirm(false)} />
            </div>
          )}
        </div>
      )}
      {!open && (
        <div className="gallery-fab"><BigButton icon={<IconCamera />} label="Nueva foto" tone="turq" size="lg" testId="gallery-new" onPress={() => go('photo')} /></div>
      )}
    </div>
  );
}
