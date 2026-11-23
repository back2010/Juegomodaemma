import { renderToStaticMarkup } from 'react-dom/server';
import { catalog } from '@/catalog/registry';
import { DollRenderer } from '@/art/DollRenderer';
import { defaultLookFor } from '@/store/dollStore';
import { COLOR_NAMES, SHAPE_NAMES } from '@/types';
import type { DollLook, MakeupKind } from '@/types';
import { MAKEUP_COLORS } from '@/assets/makeup/colors';
import { zoneAt } from '@/components/StickerLayer/StickerLayer';

const KINDS: MakeupKind[] = ['brows', 'eyeshadow', 'liner', 'lashes', 'blush', 'lips', 'gloss', 'freckles', 'sparkle'];

describe('maquillaje', () => {
  it.each(KINDS)('al menos 3 estilos de %s y colores válidos', (k) => {
    expect(catalog.makeupOfKind(k).length).toBeGreaterThanOrEqual(3);
    expect(MAKEUP_COLORS[k].length).toBeGreaterThanOrEqual(4);
    for (const c of MAKEUP_COLORS[k]) expect(COLOR_NAMES).toContain(c.tag);
  });
  it('ids únicos, >= 27 y formas válidas', () => {
    const ids = catalog.makeupStyles.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(27);
    for (const m of catalog.makeupStyles) if (m.shapeTag) expect(SHAPE_NAMES).toContain(m.shapeTag);
    expect(catalog.makeup('blush-corazon')?.shapeTag).toBe('corazon');
    expect(catalog.makeup('blush-estrellas')?.shapeTag).toBe('estrella');
  });
  it('cada estilo se dibuja sin errores', () => {
    for (const m of catalog.makeupStyles) {
      const look: DollLook = {
        ...defaultLookFor('sofi'),
        makeup: { [m.kind]: { styleId: m.id, color: '#ff5fb0', colorTag: 'rosa', intensity: 1 } },
      };
      expect(renderToStaticMarkup(<DollRenderer look={look} idPrefix="t" />)).toContain(`data-makeup="${m.kind}"`);
    }
  });
  it('un look con todos los tipos se dibuja', () => {
    const makeup: DollLook['makeup'] = {};
    for (const k of KINDS) makeup[k] = { styleId: catalog.makeupOfKind(k)[1].id, color: '#ff5fb0', colorTag: 'rosa', intensity: 0.65 };
    const html = renderToStaticMarkup(<DollRenderer look={{ ...defaultLookFor('sofi'), makeup }} idPrefix="t" />);
    for (const k of KINDS) expect(html).toContain(`data-makeup="${k}"`);
    expect(html).not.toContain('undefined');
  });
});

describe('stickers', () => {
  it('>= 24, ids únicos, figura y color válidos', () => {
    const ids = catalog.stickers.map((s) => s.id);
    expect(ids.length).toBeGreaterThanOrEqual(24);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of catalog.stickers) { expect(SHAPE_NAMES).toContain(s.shapeTag); expect(COLOR_NAMES).toContain(s.colorTag); }
  });
  it('están las 7 figuras', () => {
    for (const sh of SHAPE_NAMES) expect(catalog.stickers.filter((s) => s.shapeTag === sh).length).toBeGreaterThanOrEqual(3);
  });
  it('se dibujan en una muñeca', () => {
    const look: DollLook = {
      ...defaultLookFor('sofi'),
      stickers: catalog.stickers.map((s, i) => ({ uid: `u${i}`, stickerId: s.id, x: 100 + i * 10, y: 100, scale: 1, rot: 0, zone: 'free' as const })),
    };
    const html = renderToStaticMarkup(<DollRenderer look={look} idPrefix="t" />);
    expect((html.match(/data-sticker=/g) ?? []).length).toBe(catalog.stickers.length);
  });
});

describe('zoneAt', () => {
  it('clasifica zonas', () => {
    expect(zoneAt(300, 100)).toBe('hair');
    expect(zoneAt(300, 300)).toBe('face');
    expect(zoneAt(150, 300)).toBe('hair');
    expect(zoneAt(300, 700)).toBe('body');
    expect(zoneAt(20, 900)).toBe('free');
  });
});
