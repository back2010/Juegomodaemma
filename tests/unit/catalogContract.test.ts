/** Contrato del catálogo: todo paquete de arte debe pasar estas pruebas. */
import { catalog } from '@/catalog/registry';
import { COLOR_NAMES, SHAPE_NAMES } from '@/types';
import { LAYER_Z } from '@/art/layers';

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe('contrato del catálogo', () => {
  it('ids únicos en cada colección', () => {
    expect(unique(catalog.dolls.map((d) => d.id))).toBe(true);
    expect(unique(catalog.items.map((d) => d.id))).toBe(true);
    expect(unique(catalog.hairStyles.map((d) => d.id))).toBe(true);
    expect(unique(catalog.makeupStyles.map((d) => d.id))).toBe(true);
    expect(unique(catalog.stickers.map((d) => d.id))).toBe(true);
  });

  it.each(catalog.items.map((i) => [i.id, i] as const))('ítem %s es válido', (_id, it) => {
    expect(it.variants.length).toBeGreaterThanOrEqual(3);
    expect(unique(it.variants.map((v) => v.id))).toBe(true);
    for (const v of it.variants) for (const t of v.colorTags) expect(COLOR_NAMES).toContain(t);
    if (it.shapeTag) expect(SHAPE_NAMES).toContain(it.shapeTag);
    expect(Object.keys(it.parts).length).toBeGreaterThan(0);
    for (const l of Object.keys(it.parts)) expect(LAYER_Z).toHaveProperty(l);
    expect(it.spokenName.length).toBeGreaterThan(0);
  });

  it('las muñecas referencian ítems, peinados y maquillaje existentes', () => {
    for (const d of catalog.dolls) {
      expect(catalog.hair(d.defaultLook.hair.styleId)).toBeTruthy();
      for (const eq of Object.values(d.defaultLook.outfit)) {
        const it = catalog.item(eq!.itemId);
        expect(it).toBeTruthy();
        expect(it!.variants.some((v) => v.id === eq!.variantId)).toBe(true);
      }
      for (const m of Object.values(d.defaultLook.makeup)) expect(catalog.makeup(m!.styleId)).toBeTruthy();
    }
  });

  it('los stickers tienen figura y color válidos', () => {
    for (const s of catalog.stickers) { expect(SHAPE_NAMES).toContain(s.shapeTag); expect(COLOR_NAMES).toContain(s.colorTag); }
  });
});
