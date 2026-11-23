import { renderToStaticMarkup } from 'react-dom/server';
import accessories from '@/assets/accessories';
import { catalog } from '@/catalog/registry';
import { ACCESSORY_SLOTS } from '@/art/layers';
import { COLOR_NAMES, SHAPE_NAMES } from '@/types';
import { DollRenderer } from '@/art/DollRenderer';
import { ItemPreview } from '@/components/DollEditor/Preview';

describe('accesorios', () => {
  it('hay al menos 26 accesorios nuevos además de la referencia', () => {
    expect(accessories.length).toBeGreaterThanOrEqual(8 + 26);
  });

  it('cubre todas las categorías de accesorios', () => {
    const slots = new Set(accessories.map((a) => a.slot));
    for (const s of ACCESSORY_SLOTS) expect(slots.has(s)).toBe(true);
  });

  it('hay figuras principales para los retos', () => {
    const tags = new Set(accessories.map((a) => a.shapeTag));
    for (const s of ['circulo', 'estrella', 'corazon', 'triangulo', 'cuadrado'] as const) expect(tags.has(s)).toBe(true);
  });

  it('reparte todos los colores educativos principales', () => {
    const colors = new Set(accessories.flatMap((a) => a.variants.flatMap((v) => v.colorTags)));
    for (const c of ['rojo', 'azul', 'amarillo', 'verde', 'naranja', 'morado', 'rosa'] as const) expect(colors.has(c)).toBe(true);
  });

  it.each(accessories.map((a) => [a.id, a] as const))('%s: metadatos válidos', (_id, a) => {
    expect(ACCESSORY_SLOTS).toContain(a.slot);
    expect(a.variants.length).toBeGreaterThanOrEqual(3);
    for (const v of a.variants) for (const t of v.colorTags) expect(COLOR_NAMES).toContain(t);
    if (a.shapeTag) expect(SHAPE_NAMES).toContain(a.shapeTag);
    if (a.count !== undefined) { expect(Number.isInteger(a.count)).toBe(true); expect(a.count).toBeGreaterThanOrEqual(1); expect(a.count).toBeLessThanOrEqual(10); }
    expect(a.kind).toBe(a.kind.toLowerCase());
    if (a.slot === 'hat') expect(['over', 'compress']).toContain(a.hairFit);
  });

  it.each(accessories.map((a) => [a.id, a] as const))('%s: se dibuja sin errores en cada variante', (_id, a) => {
    for (const v of a.variants) {
      const look = { ...catalog.dolls[0].defaultLook, dollId: catalog.dolls[0].id, outfit: { [a.slot]: { itemId: a.id, variantId: v.id } } };
      const html = renderToStaticMarkup(<DollRenderer look={look} idPrefix="t" />);
      expect(html).toContain(`data-item="${a.id}"`);
      expect(html).not.toMatch(/<text|<image|foreignObject/);
    }
    const thumb = renderToStaticMarkup(<ItemPreview item={a} dollId={catalog.dolls[0].id} />);
    expect(thumb).toContain('<svg');
  });
});
