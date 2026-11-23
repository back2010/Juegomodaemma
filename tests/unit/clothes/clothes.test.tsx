import { renderToStaticMarkup } from 'react-dom/server';
import clothes from '@/assets/clothes';
import { COLOR_NAMES } from '@/types';
import type { CatalogItem } from '@/types';
import { makeIdp } from '@/art/kit';
import { catalog } from '@/catalog/registry';
import { DollRenderer } from '@/art/DollRenderer';

const by = (slot: string) => clothes.filter((c) => c.slot === slot);

describe('ropa', () => {
  it('hay al menos 24 prendas nuevas además de las de referencia', () => {
    expect(clothes.length).toBeGreaterThanOrEqual(5 + 24);
  });

  it('conteo mínimo por categoría', () => {
    expect(by('dress').length).toBeGreaterThanOrEqual(8);
    expect(by('top').length).toBeGreaterThanOrEqual(4);
    expect(by('bottom').length).toBeGreaterThanOrEqual(5);
    expect(by('outer').length).toBeGreaterThanOrEqual(2);
    expect(by('shoes').length).toBeGreaterThanOrEqual(5);
  });

  it('cubre todos los tipos pedidos', () => {
    const kinds = new Set(clothes.map((c) => c.kind));
    for (const k of ['vestido', 'blusa', 'falda', 'pantalón', 'leggings', 'shorts', 'conjunto', 'chamarra', 'traje de baño',
      'zapatos', 'botas', 'tenis', 'sandalias']) expect(kinds).toContain(k);
    expect(clothes.some((c) => c.theme === 'disfraz')).toBe(true);
    expect(clothes.some((c) => c.theme === 'fantasia')).toBe(true);
    expect(clothes.some((c) => c.theme === 'deporte')).toBe(true);
    expect(clothes.some((c) => c.theme === 'playa')).toBe(true);
  });

  it('cada color educativo aparece en al menos 2 prendas', () => {
    for (const c of COLOR_NAMES) {
      const n = clothes.filter((it) => it.variants.some((v) => v.colorTags.includes(c))).length;
      expect(n, c).toBeGreaterThanOrEqual(2);
    }
  });

  it('ids únicos, nombres y kinds en español', () => {
    expect(new Set(clothes.map((c) => c.id)).size).toBe(clothes.length);
    for (const c of clothes) { expect(c.spokenName.length).toBeGreaterThan(2); expect(c.kind.length).toBeGreaterThan(2); }
  });

  it('vestidos y conjuntos de cuerpo entero ocultan blusa y pantalón', () => {
    for (const d of by('dress')) {
      expect(d.suppresses, d.id).toEqual(expect.arrayContaining(['top', 'bottom']));
      expect(d.parts.dress).toBeTruthy();
    }
    expect(clothes.filter((c) => c.kind === 'conjunto').length).toBeGreaterThanOrEqual(3);
  });

  it('alas y capas van en itemBack', () => {
    for (const id of ['costume-hada', 'costume-superheroina']) expect(clothes.find((c) => c.id === id)!.parts.itemBack).toBeTruthy();
  });

  it.each(clothes.map((c) => [c.id, c] as const))('%s se dibuja sin errores en cada variante', (_id, it: CatalogItem) => {
    const doll = catalog.dolls[0];
    for (const v of it.variants) {
      for (const Part of Object.values(it.parts)) {
        const html = renderToStaticMarkup(<svg><Part doll={doll} palette={v.palette} idp={makeIdp('t')} /></svg>);
        expect(html.length).toBeGreaterThan(100);
        expect(html).not.toMatch(/<text|<image|foreignObject/);
        expect(html).not.toContain('NaN');
        for (const m of html.matchAll(/\bid="([^"]+)"/g)) expect(m[1]).toMatch(/^t-/);
      }
    }
  });

  it('un look con pantalón, chamarra y tenis se renderiza completo', () => {
    const look = { ...catalog.dolls[0].defaultLook, dollId: catalog.dolls[0].id, outfit: {
      top: { itemId: 'top-blusa-lunares', variantId: 'rosa' }, bottom: { itemId: 'pants-mezclilla', variantId: 'mezclilla' },
      outer: { itemId: 'outer-sudadera', variantId: 'morado' }, shoes: { itemId: 'shoes-tenis', variantId: 'blanco' } } };
    const html = renderToStaticMarkup(<DollRenderer look={look} idPrefix="t" />);
    for (const id of ['top-blusa-lunares', 'pants-mezclilla', 'outer-sudadera', 'shoes-tenis']) expect(html).toContain(`data-item="${id}"`);
  });
});
