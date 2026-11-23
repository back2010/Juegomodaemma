import { sceneMarkup } from '@/utils/ImageComposer';
import { BACKGROUNDS, FRAMES } from '@/assets/scenes';
import { defaultLookFor } from '@/store/dollStore';

describe('composeScene markup', () => {
  const look = defaultLookFor('sofi');
  const html = sceneMarkup(look, { backgroundId: 'bg-beach', frameId: 'fr-gold' }, { width: 1600, height: 1200 });

  it('es un svg 1600x1200 con fondo, muñeca anidada y marco', () => {
    expect(html).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(html).toContain('viewBox="0 0 1600 1200"');
    expect(html).toContain('data-scene="background"');
    expect(html).toContain('data-scene="doll"');
    expect(html).toContain('data-scene="frame"');
    expect(html).toMatch(/<svg x="500" y="100" width="600" height="1000"/);
    expect(html).toContain('data-layer="body"');
    expect(html.indexOf('data-scene="background"')).toBeLessThan(html.indexOf('data-scene="doll"'));
    expect(html.indexOf('data-scene="doll"')).toBeLessThan(html.indexOf('data-scene="frame"'));
  });
  it('no lleva foreignObject, texto, fuentes ni recursos externos', () => {
    for (const bad of ['foreignObject', '<text', '<image', 'font-family', 'http://', 'https://', '<style']) {
      expect(html.replace('http://www.w3.org/2000/svg', '')).not.toContain(bad);
    }
  });
  it('registra ≥8 fondos (con bg-default) y ≥6 marcos', () => {
    expect(BACKGROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(FRAMES.length).toBeGreaterThanOrEqual(6);
    expect(BACKGROUNDS.some((b) => b.id === 'bg-default')).toBe(true);
  });
  it('todas las escenas se renderizan sin marcas prohibidas', () => {
    for (const b of BACKGROUNDS) for (const f of [null, ...FRAMES.map((x) => x.id)]) {
      const h = sceneMarkup(look, { backgroundId: b.id, frameId: f });
      expect(h).not.toMatch(/foreignObject|<text|<image/);
    }
  });
  it('sin marco omite su contenido', () => {
    const h = sceneMarkup(look, { backgroundId: 'bg-default', frameId: null });
    expect(h).toContain('data-scene="frame"></g>');
  });
});
