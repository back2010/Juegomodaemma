import { useGallery } from '@/store/galleryStore';
import { defaultLookFor } from '@/store/dollStore';

describe('galería en IndexedDB', () => {
  it('guarda, duplica, recarga y borra', async () => {
    const g = useGallery.getState();
    const png = new Blob(['png'], { type: 'image/png' });
    const c = await g.save({ id: 'c1', look: defaultLookFor('sofi'), scene: { backgroundId: 'bg', frameId: null } }, png, png);
    const d = await useGallery.getState().duplicate(c.id);
    expect(d?.parentId).toBe('c1');
    useGallery.setState({ items: [], loaded: false });
    await useGallery.getState().load();
    expect(useGallery.getState().items).toHaveLength(2);
    await useGallery.getState().remove('c1');
    expect(useGallery.getState().items.map((x) => x.id)).toEqual([d!.id]);
  });
});
