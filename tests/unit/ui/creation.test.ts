import { vi } from 'vitest';
import 'fake-indexeddb/auto';

vi.mock('@/utils/ImageComposer', () => ({
  composeScene: vi.fn(async (_l: unknown, _s: unknown, size: { width: number }) => new Blob([`png${size.width}`], { type: 'image/png' })),
}));

import { saveCreation } from '@/utils/SaveCreation';
import { loadCreation } from '@/utils/LoadCreation';
import { useGallery } from '@/store/galleryStore';
import { useGame } from '@/store/gameStore';
import { useDolls, defaultLookFor } from '@/store/dollStore';
import { getImage } from '@/db/db';

describe('SaveCreation / LoadCreation', () => {
  beforeEach(async () => { await useGallery.getState().clear(); });

  it('guarda imagen y miniatura; con editingId actualiza', async () => {
    const look = defaultLookFor('sofi');
    const a = await saveCreation(look, { backgroundId: 'bg-beach', frameId: null });
    expect(useGallery.getState().items).toHaveLength(1);
    expect(await getImage(a.imageKey)).toBeTruthy();
    expect(await getImage(a.thumbKey)).toBeTruthy();
    const { composeScene } = await import('@/utils/ImageComposer');
    const sizes = vi.mocked(composeScene).mock.calls.map((c) => c[2].width);
    expect(sizes).toEqual(expect.arrayContaining([1600, 320]));
    const b = await saveCreation(look, { backgroundId: 'bg-stars', frameId: 'fr-gold' }, a.id);
    expect(b.id).toBe(a.id);
    expect(useGallery.getState().items).toHaveLength(1);
    expect(useGallery.getState().items[0].scene.backgroundId).toBe('bg-stars');
  });
  it('loadCreation carga look, escena y va al salón', async () => {
    const look = { ...defaultLookFor('sofi'), hair: { styleId: 'x-test', color: { mode: 'rainbow' as const } } };
    const c = await saveCreation(look, { backgroundId: 'bg-castle', frameId: 'fr-hearts' });
    loadCreation(c);
    expect(useDolls.getState().looks[look.dollId].hair.styleId).toBe('x-test');
    expect(useGame.getState().photo).toEqual({ scene: { backgroundId: 'bg-castle', frameId: 'fr-hearts' }, editingCreationId: c.id });
    expect(useGame.getState().screen.name).toBe('salon');
  });
});
