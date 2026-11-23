import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { catalog } from '@/catalog/registry';
import { DollRenderer } from '@/art/DollRenderer';
import { defaultLookFor } from '@/store/dollStore';
import type { DollLook, HairColor, HairKind } from '@/types';
import { HAIR_COLORS, HAIR_GROUPS, HairStudio, hairGroupOf } from '@/components/HairStudio/HairStudio';

const KINDS: HairKind[] = ['corto', 'largo', 'lacio', 'ondulado', 'rizado', 'trenzas', 'coletas', 'chongo', 'recogido', 'fiesta'];
const MODES: HairColor[] = [
  { mode: 'solid', a: '#6b3f22' },
  { mode: 'gradient', a: '#f2c45a', b: '#ff6fb8' },
  { mode: 'two', a: '#ff6fb8', b: '#9b5de5' },
  { mode: 'rainbow' },
];

describe('peinados', () => {
  const styles = catalog.hairStyles;

  it('hay al menos 12 estilos con ids únicos y ondas largas primero', () => {
    expect(styles.length).toBeGreaterThanOrEqual(12);
    expect(new Set(styles.map((h) => h.id)).size).toBe(styles.length);
    expect(styles[0].id).toBe('hair-ondas-largas');
  });

  it('cubre todos los tipos de cabello', () => {
    const got = new Set(styles.flatMap((h) => h.kinds));
    for (const k of KINDS) expect(got.has(k), k).toBe(true);
  });

  it('datos válidos: nombre hablado, volumen y desplazamiento de sombrero', () => {
    for (const h of styles) {
      expect(h.spokenName.trim().length, h.id).toBeGreaterThan(2);
      expect([1, 2, 3]).toContain(h.volume);
      expect(h.hatOffsetY, h.id).toBeLessThanOrEqual(0);
      expect(h.kinds.length, h.id).toBeGreaterThan(0);
    }
    const avg = (v: number) => {
      const xs = styles.filter((h) => h.volume === v).map((h) => h.hatOffsetY);
      return xs.reduce((a, b) => a + b, 0) / xs.length;
    };
    expect(avg(3)).toBeLessThan(avg(1));
  });

  it.each(styles.map((h) => h.id))('%s se dibuja con cada modo de color', (id) => {
    for (const color of MODES) {
      const look: DollLook = { ...defaultLookFor('sofi'), hair: { styleId: id, color } };
      const html = renderToStaticMarkup(createElement(DollRenderer, { look, idPrefix: 't' }));
      expect(html).toContain('data-layer="hairBack"');
      expect(html).toContain('data-layer="hairFront"');
      expect(html).not.toMatch(/NaN|undefined/);
      expect(html).not.toMatch(/<text|<image|foreignObject/);
    }
  });

  it('cada estilo pertenece a un grupo y todos los grupos tienen estilos', () => {
    const groups = new Set(styles.map(hairGroupOf));
    for (const g of HAIR_GROUPS) expect(groups.has(g), g).toBe(true);
  });
});

describe('colores de cabello', () => {
  it('claves únicas e incluye sólidos, degradados, dos colores y arcoíris', () => {
    expect(new Set(HAIR_COLORS.map((c) => c.key)).size).toBe(HAIR_COLORS.length);
    const modes = new Set(HAIR_COLORS.map((c) => c.color.mode));
    for (const m of ['solid', 'gradient', 'two', 'rainbow']) expect(modes.has(m as HairColor['mode'])).toBe(true);
    expect(HAIR_COLORS.filter((c) => c.color.mode === 'solid').length).toBeGreaterThanOrEqual(14);
  });

  it('el estudio muestra cuadrícula, grupos y colores', () => {
    const html = renderToStaticMarkup(createElement(HairStudio));
    expect(html).toContain('data-testid="item-grid"');
    expect(html).toContain('data-testid="hair-colors"');
    expect(html).toContain('data-testid="swatch-arcoiris"');
    for (const g of HAIR_GROUPS) expect(html).toContain(`data-testid="subtab-${g}"`);
  });
});
